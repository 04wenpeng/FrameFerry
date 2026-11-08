import {
  app, BrowserWindow, dialog, ipcMain, Menu, protocol, shell
} from 'electron'
import { createReadStream } from 'node:fs'
import { access, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { Readable } from 'node:stream'
import { fileURLToPath } from 'node:url'
import { ConversionQueue, buildArguments } from './converter.mjs'
import { extOf, fileStem } from './format.mjs'
import { mimeFor, probeMedia } from './probe.mjs'
import { readToolsInfo, spawnFfmpeg } from './tools.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VIDEO_EXTENSIONS = new Set(['mp4', 'mov', 'mkv', 'webm', 'avi', 'm4v', 'mpg', 'mpeg', 'ts', 'mts', 'gif'])

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'frameflow',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true,
      bypassCSP: false
    }
  }
])

app.setName('FrameFerry')
app.setAppUserModelId('com.frameferry.desktop')

let mainWindow = null
let rendererReady = false
let pendingOpenFiles = []
let bootstrapCache = null
let history = []
let historyPath = ''
let settingsPath = ''
let preferences = { defaultOutputDir: '' }
let thumbnailCacheDir = ''
let qualityPreviewDir = ''
let qualityPreviewProcess = null
const probeCache = new Map()
let conversionQueue = null
let jobsBroadcastTimer = null
let pendingJobsSnapshot = null

const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
}

function isVideoFile(filePath) {
  return VIDEO_EXTENSIONS.has(extOf(filePath))
}

function collectFileArguments(argv) {
  const result = []
  for (const raw of argv.slice(1)) {
    if (!raw || raw.startsWith('-')) {
      if (raw?.startsWith('--open-file=')) {
        const value = raw.slice('--open-file='.length).replace(/^"|"$/g, '')
        if (isVideoFile(value)) result.push(value)
      }
      continue
    }
    const cleaned = raw.replace(/^"|"$/g, '')
    if (isVideoFile(cleaned)) result.push(cleaned)
  }
  return [...new Set(result)]
}

function sendJobsSnapshot(jobs) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('jobs:update', jobs)
  }
}

function broadcastJobs(jobs) {
  pendingJobsSnapshot = jobs
  if (jobsBroadcastTimer) return
  // 先发送最新快照，再给高频进度事件留一个尾帧，避免旧计时器把进度“回退”。
  sendJobsSnapshot(pendingJobsSnapshot)
  pendingJobsSnapshot = null
  jobsBroadcastTimer = setTimeout(() => {
    jobsBroadcastTimer = null
    if (pendingJobsSnapshot) {
      const latest = pendingJobsSnapshot
      pendingJobsSnapshot = null
      sendJobsSnapshot(latest)
    }
  }, 100)
}

function queueOpenFiles(files) {
  const valid = (files || []).filter(Boolean)
  if (!valid.length) return
  if (rendererReady && mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('app:open-files', valid)
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.show()
    mainWindow.focus()
  } else {
    pendingOpenFiles.push(...valid)
  }
}

async function loadHistory() {
  try {
    const raw = await readFile(historyPath, 'utf8')
    const parsed = JSON.parse(raw.replace(/^\uFEFF/, ''))
    if (Array.isArray(parsed)) history = parsed.slice(0, 40)
  } catch {
    history = []
  }
}

async function saveHistory() {
  try {
    await writeFile(historyPath, JSON.stringify(history.slice(0, 40), null, 2), 'utf8')
  } catch {
    /* local history is non-critical */
  }
}

async function loadPreferences() {
  try {
    const raw = await readFile(settingsPath, 'utf8')
    const parsed = JSON.parse(raw.replace(/^\uFEFF/, ''))
    preferences = {
      defaultOutputDir: typeof parsed?.defaultOutputDir === 'string' ? parsed.defaultOutputDir : ''
    }
  } catch {
    preferences = { defaultOutputDir: '' }
  }
}

async function savePreferences() {
  try {
    await writeFile(settingsPath, JSON.stringify(preferences, null, 2), 'utf8')
  } catch {
    /* preferences are best-effort */
  }
}

async function initializeServices() {
  await app.whenReady()
  Menu.setApplicationMenu(null)
  historyPath = path.join(app.getPath('userData'), 'history.json')
  settingsPath = path.join(app.getPath('userData'), 'settings.json')
  thumbnailCacheDir = path.join(app.getPath('userData'), 'thumb-cache')
  qualityPreviewDir = path.join(app.getPath('userData'), 'quality-preview')
  await mkdir(thumbnailCacheDir, { recursive: true })
  await rm(qualityPreviewDir, { recursive: true, force: true })
  await mkdir(qualityPreviewDir, { recursive: true })
  await Promise.all([loadHistory(), loadPreferences()])
  bootstrapCache = await readToolsInfo()
  conversionQueue = new ConversionQueue({
    hardware: bootstrapCache.hardware,
    onChange: (jobs) => broadcastJobs(jobs),
    onComplete: async (job, failed) => {
      if (failed) return
      history.unshift({
        id: job.id,
        sourceName: job.sourceName,
        outputName: job.outputName,
        outputPath: job.outputPath,
        format: job.format,
        videoCodec: job.videoCodec,
        sizeLabel: job.sizeLabel,
        duration: job.duration,
        hardware: job.usedHardware ? job.hardwareLabel : '',
        finishedAt: job.finishedAt
      })
      history = history.slice(0, 40)
      await saveHistory()
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('history:update', history)
      }
    }
  })
  pendingOpenFiles.push(...collectFileArguments(process.argv))
  registerProtocol()
  createWindow()
}

function registerProtocol() {
  protocol.handle('frameflow', async (request) => {
    try {
      if (!['GET', 'HEAD'].includes(request.method)) {
        return new Response('Method not allowed', { status: 405 })
      }
      const url = new URL(request.url)
      if (url.hostname !== 'media') return new Response('Not found', { status: 404 })
      const filePath = url.searchParams.get('path') || ''
      if (!filePath || !isVideoFile(filePath)) return new Response('Forbidden', { status: 403 })
      const info = await stat(filePath)
      if (!info.isFile()) return new Response('Not found', { status: 404 })

      const rangeHeader = request.headers.get('range')
      const type = mimeFor(filePath)
      const baseHeaders = {
        'Content-Type': type,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-store'
      }
      if (request.method === 'HEAD') {
        return new Response(null, {
          status: 200,
          headers: { ...baseHeaders, 'Content-Length': String(info.size) }
        })
      }

      if (rangeHeader) {
        const match = /bytes=(\d*)-(\d*)/.exec(rangeHeader)
        if (!match) return new Response('Range not satisfiable', { status: 416 })
        const start = match[1] ? Number(match[1]) : 0
        const end = match[2] ? Math.min(Number(match[2]), info.size - 1) : info.size - 1
        if (!Number.isFinite(start) || start > end || start >= info.size) {
          return new Response('Range not satisfiable', {
            status: 416,
            headers: { 'Content-Range': `bytes */${info.size}` }
          })
        }
        const nodeStream = createReadStream(filePath, { start, end })
        return new Response(Readable.toWeb(nodeStream), {
          status: 206,
          headers: {
            ...baseHeaders,
            'Content-Range': `bytes ${start}-${end}/${info.size}`,
            'Content-Length': String(end - start + 1)
          }
        })
      }

      const nodeStream = createReadStream(filePath)
      return new Response(Readable.toWeb(nodeStream), {
        status: 200,
        headers: { ...baseHeaders, 'Content-Length': String(info.size) }
      })
    } catch {
      return new Response('Not found', { status: 404 })
    }
  })
}

async function cleanupQualityPreviewFiles(keepPath) {
  try {
    const names = await readdir(qualityPreviewDir)
    const cutoff = Date.now() - 2 * 60 * 1000
    for (const name of names) {
      const target = path.join(qualityPreviewDir, name)
      if (target === keepPath) continue
      const info = await stat(target).catch(() => null)
      if (info?.isFile() && info.mtimeMs < cutoff) {
        await rm(target, { force: true }).catch(() => {})
      }
    }
  } catch {
    /* cache cleanup is best-effort */
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1120,
    minHeight: 720,
    show: false,
    frame: false,
    backgroundColor: '#0d0f12',
    autoHideMenuBar: true,
    title: '帧渡 FrameFerry',
    icon: path.join(__dirname, '..', 'renderer', 'app-icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      spellcheck: false
    }
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    if (process.env.FRAMEFERRY_OPEN_DEVTOOLS === '1') mainWindow.webContents.openDevTools({ mode: 'detach' })
  })

  mainWindow.on('maximize', () => mainWindow.webContents.send('window:state', { maximized: true }))
  mainWindow.on('unmaximize', () => mainWindow.webContents.send('window:state', { maximized: false }))
  mainWindow.on('closed', () => {
    mainWindow = null
    rendererReady = false
  })

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const devURL = process.env.VITE_DEV_SERVER_URL
    if (!devURL || !url.startsWith(devURL)) event.preventDefault()
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'))
  }
}

app.on('second-instance', (_event, argv) => {
  queueOpenFiles(collectFileArguments(argv))
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.show()
    mainWindow.focus()
  }
})

app.on('before-quit', () => {
  conversionQueue?.shutdown()
  qualityPreviewProcess?.kill()
  qualityPreviewProcess = null
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (!mainWindow) createWindow()
})

ipcMain.handle('app:bootstrap', async () => {
  rendererReady = true
  const files = [...new Set(pendingOpenFiles)]
  pendingOpenFiles = []
  return {
    version: app.getVersion(),
    platform: process.platform,
    ffmpeg: bootstrapCache,
    history,
    settings: preferences,
    openFiles: files,
    maximized: mainWindow?.isMaximized() || false,
    paths: {
      videos: app.getPath('videos'),
      desktop: app.getPath('desktop'),
      downloads: app.getPath('downloads')
    },
    userData: app.getPath('userData')
  }
})

ipcMain.handle('dialog:open-media', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: '添加视频',
    buttonLabel: '添加',
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: '视频文件', extensions: ['mp4', 'mov', 'mkv', 'webm', 'avi', 'm4v', 'mpg', 'mpeg', 'ts', 'mts', 'gif'] },
      { name: '所有文件', extensions: ['*'] }
    ]
  })
  return result.canceled ? [] : result.filePaths
})

ipcMain.handle('dialog:choose-output', async (_event, options = {}) => {
  const format = String(options.format || 'mp4')
  const result = await dialog.showSaveDialog(mainWindow, {
    title: '选择输出位置',
    defaultPath: options.defaultPath || undefined,
    buttonLabel: '保存到此处',
    filters: [
      { name: `${format.toUpperCase()} 视频`, extensions: [format] }
    ]
  })
  return result.canceled ? '' : result.filePath
})

ipcMain.handle('dialog:choose-directory', async (_event, defaultPath) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: '选择输出文件夹',
    defaultPath: defaultPath || app.getPath('videos'),
    properties: ['openDirectory', 'createDirectory']
  })
  return result.canceled ? '' : result.filePaths[0]
})

ipcMain.handle('settings:choose-default-output', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: '设置默认保存文件夹',
    buttonLabel: '设为默认',
    defaultPath: preferences.defaultOutputDir || app.getPath('videos'),
    properties: ['openDirectory', 'createDirectory']
  })
  if (result.canceled || !result.filePaths[0]) return ''
  const chosen = result.filePaths[0]
  const info = await stat(chosen).catch(() => null)
  if (!info?.isDirectory()) throw new Error('所选位置不是有效文件夹')
  preferences.defaultOutputDir = chosen
  await savePreferences()
  return chosen
})

ipcMain.handle('settings:clear-default-output', async () => {
  preferences.defaultOutputDir = ''
  await savePreferences()
  return true
})

ipcMain.handle('media:probe', async (_event, filePath) => {
  const cleaned = String(filePath || '')
  if (!cleaned || !isVideoFile(cleaned)) throw new Error('请选择受支持的视频文件')
  const fileInfo = await stat(cleaned)
  if (!fileInfo.isFile()) throw new Error('请选择有效的视频文件')
  const key = `${cleaned.toLowerCase()}|${fileInfo.size}|${fileInfo.mtimeMs}`
  if (probeCache.has(key)) return probeCache.get(key)
  const result = await probeMedia(cleaned, { cacheDir: thumbnailCacheDir })
  probeCache.set(key, result)
  if (probeCache.size > 30) {
    const oldest = probeCache.keys().next().value
    probeCache.delete(oldest)
  }
  return result
})

ipcMain.handle('media:url', (_event, filePath) => {
  if (!filePath) return ''
  return `frameflow://media/?path=${encodeURIComponent(String(filePath))}`
})

ipcMain.handle('preview:quality', async (_event, payload = {}) => {
  const sourcePath = String(payload.sourcePath || '')
  if (!sourcePath) throw new Error('缺少源文件')
  const sourceInfo = await stat(sourcePath).catch(() => null)
  if (!sourceInfo?.isFile()) throw new Error('源文件不可用')
  const sourceDuration = Math.max(0, Number(payload.duration) || 0)
  if (!sourceDuration) throw new Error('无法确定视频时长')
  const sampleDuration = Math.min(20, Math.max(1, Number(payload.length) || 10), sourceDuration)
  const start = Math.min(
    Math.max(0, Number(payload.start) || 0),
    Math.max(0, sourceDuration - sampleDuration)
  )
  const quality = Math.min(30, Math.max(16, Number(payload.quality) || 21))
  const useHardware = payload.hardware !== false && Boolean(bootstrapCache?.hardware?.encoder)
  const outputPath = path.join(
    qualityPreviewDir,
    `preview-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.mp4`
  )
  const settings = {
    format: 'mp4',
    videoCodec: 'h264',
    quality,
    resolution: payload.resolution || 'source',
    fps: payload.fps || 'source',
    audio: false,
    faststart: true,
    hardware: useHardware,
    clips: [{ start, end: start + sampleDuration }]
  }
  const meta = {
    duration: sourceDuration,
    hasAudio: false,
    hardware: bootstrapCache?.hardware || null
  }
  const args = buildArguments({
    sourcePath,
    outputPath,
    settings,
    meta,
    useHardware
  })

  qualityPreviewProcess?.kill()
  const child = spawnFfmpeg(args)
  qualityPreviewProcess = child
  let stderr = ''
  child.stderr?.on('data', (chunk) => {
    stderr = `${stderr}${chunk.toString()}`.slice(-5000)
  })
  try {
    await new Promise((resolve, reject) => {
      child.once('error', reject)
      child.once('close', (code, signal) => {
        if (qualityPreviewProcess === child) qualityPreviewProcess = null
        if (code === 0) {
          resolve()
        } else {
          const detail = stderr.trim().split(/\r?\n/).slice(-3).join(' ')
          reject(new Error(detail || `预览编码失败（${signal || code}）`))
        }
      })
    })
    void cleanupQualityPreviewFiles(outputPath)
    return { path: outputPath, duration: sampleDuration, start }
  } catch (error) {
    await rm(outputPath, { force: true }).catch(() => {})
    throw error
  }
})

ipcMain.handle('preview:quality-cancel', () => {
  qualityPreviewProcess?.kill()
  qualityPreviewProcess = null
  return true
})

ipcMain.handle('media:default-output', (_event, payload = {}) => {
  const sourcePath = String(payload.sourcePath || '')
  const format = String(payload.format || 'mp4')
  if (!sourcePath) return ''
  return path.join(
    preferences.defaultOutputDir || path.dirname(sourcePath),
    `${fileStem(sourcePath)}_converted.${format}`
  )
})

ipcMain.handle('jobs:start', async (_event, payload) => {
  if (!conversionQueue) throw new Error('转换引擎尚未就绪')
  return conversionQueue.enqueue(payload)
})

ipcMain.handle('jobs:list', () => conversionQueue?.snapshot() || [])

ipcMain.handle('jobs:cancel', (_event, jobId) => conversionQueue?.cancel(jobId) || false)

ipcMain.handle('jobs:clear', () => {
  conversionQueue?.clearFinished()
  return true
})

ipcMain.handle('history:list', () => history)

ipcMain.handle('history:clear', async () => {
  history = []
  await saveHistory()
  if (mainWindow) mainWindow.webContents.send('history:update', history)
  return true
})

ipcMain.handle('shell:show-item', async (_event, filePath) => {
  if (!filePath) return
  try {
    const info = await stat(filePath)
    if (info.isDirectory()) {
      await shell.openPath(filePath)
      return
    }
    shell.showItemInFolder(filePath)
    return
  } catch {}
  // The output file may not exist yet (planned path); open its folder instead.
  const directory = path.dirname(filePath)
  try {
    await mkdir(directory, { recursive: true })
    await shell.openPath(directory)
  } catch {}
})

ipcMain.handle('shell:open', async (_event, target) => {
  if (!target) return
  await shell.openPath(target)
})

ipcMain.handle('window:minimize', () => mainWindow?.minimize())

ipcMain.handle('window:toggle-maximize', () => {
  if (!mainWindow) return false
  if (mainWindow.isMaximized()) mainWindow.unmaximize()
  else mainWindow.maximize()
  return mainWindow.isMaximized()
})

ipcMain.handle('window:close', () => mainWindow?.close())

ipcMain.handle('app:ready', () => {
  rendererReady = true
  return true
})

initializeServices().catch((error) => {
  dialog.showErrorBox('帧渡启动失败', String(error?.stack || error))
  app.quit()
})
