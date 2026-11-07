import { execFile, spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function firstExisting(candidates) {
  return candidates.find((candidate) => candidate && existsSync(candidate))
}

export const tools = {
  ffmpeg:
    firstExisting([
      process.env.FFMPEG_PATH,
      process.resourcesPath && path.join(process.resourcesPath, 'bin', 'ffmpeg.exe'),
      path.join(ROOT, 'vendor', 'bin', 'ffmpeg.exe'),
      path.join(process.cwd(), 'vendor', 'bin', 'ffmpeg.exe')
    ]) || 'ffmpeg',
  ffprobe:
    firstExisting([
      process.env.FFPROBE_PATH,
      process.resourcesPath && path.join(process.resourcesPath, 'bin', 'ffprobe.exe'),
      path.join(ROOT, 'vendor', 'bin', 'ffprobe.exe'),
      path.join(process.cwd(), 'vendor', 'bin', 'ffprobe.exe')
    ]) || 'ffprobe'
}

export function run(bin, args, options = {}) {
  return execFileAsync(bin, args, {
    windowsHide: true,
    maxBuffer: 16 * 1024 * 1024,
    timeout: options.timeout ?? 30_000,
    ...options
  })
}

export async function readToolsInfo() {
  let ffmpegVersion = '未检测到'
  let hardware = null
  try {
    const { stderr, stdout } = await run(tools.ffmpeg, ['-hide_banner', '-version'], { timeout: 8000 })
    const firstLine = `${stdout || ''}${stderr || ''}`.split(/\r?\n/)[0] || ''
    ffmpegVersion = firstLine.replace(/^ffmpeg version\s*/i, '').split(' Copyright')[0].trim()
  } catch {
    return { ready: false, ffmpegVersion, hardware: null, encoders: [] }
  }

  let encoders = []
  try {
    const { stdout } = await run(tools.ffmpeg, ['-hide_banner', '-encoders'], { timeout: 8000 })
    encoders = ['h264_nvenc', 'h264_qsv', 'h264_amf', 'h264_videotoolbox'].filter((name) =>
      stdout.includes(` ${name} `)
    )
  } catch {
    /* encoder probing is best-effort */
  }

  for (const encoder of encoders) {
    try {
      await run(
        tools.ffmpeg,
        [
          '-hide_banner',
          '-loglevel', 'error',
          '-f', 'lavfi',
          '-i', 'color=c=black:s=256x144:d=0.2',
          '-frames:v', '2',
          '-c:v', encoder,
          '-f', 'null',
          '-'
        ],
        { timeout: 5000 }
      )
      hardware = { encoder, label: hardwareLabel(encoder) }
      break
    } catch {
      /* encoder may exist in the build but be unusable on this machine */
    }
  }

  return { ready: true, ffmpegVersion, hardware, encoders }
}

export function hardwareLabel(encoder) {
  return (
    {
      h264_nvenc: 'NVIDIA NVENC',
      h264_qsv: 'Intel Quick Sync',
      h264_amf: 'AMD AMF',
      h264_videotoolbox: 'Apple VideoToolbox'
    }[encoder] || encoder
  )
}

export function spawnFfmpeg(args, options = {}) {
  return spawn(tools.ffmpeg, args, {
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options
  })
}

export function parseTime(value) {
  const match = String(value || '').match(/(\d+):(\d+):(\d+(?:\.\d+)?)/)
  if (!match) return 0
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3])
}
