import { randomUUID } from 'node:crypto'
import { access, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { formatBytes, formatDuration, extOf, fileStem } from './format.mjs'
import { spawnFfmpeg } from './tools.mjs'

const FORMAT_CODECS = {
  mp4: ['h264', 'h265'],
  m4v: ['h264', 'h265'],
  mov: ['h264', 'prores'],
  mkv: ['h264', 'h265', 'vp9'],
  webm: ['vp9'],
  avi: ['h264'],
  ts: ['h264', 'h265'],
  flv: ['h264'],
  gif: ['gif']
}

const SUPPORTED_FORMATS = new Set(Object.keys(FORMAT_CODECS))

function clamp(value, min, max, fallback) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(max, Math.max(min, parsed))
}

async function exists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

async function uniqueOutputPath(target, reserved = new Set()) {
  const available = async (candidate) =>
    !reserved.has(candidate.toLowerCase()) && !(await exists(candidate))
  if (await available(target)) return target
  const directory = path.dirname(target)
  const ext = path.extname(target)
  const stem = path.basename(target, ext)
  for (let index = 2; index < 1000; index += 1) {
    const candidate = path.join(directory, `${stem} (${index})${ext}`)
    if (await available(candidate)) return candidate
  }
  return path.join(directory, `${stem}-${Date.now()}${ext}`)
}

function qualityArgs(codec, quality, useHardware, hardwareEncoder) {
  if (codec === 'h264' && useHardware) {
    if (hardwareEncoder === 'h264_nvenc') {
      return ['-c:v', 'h264_nvenc', '-preset', 'p6', '-rc', 'vbr', '-cq', String(quality), '-b:v', '0']
    }
    if (hardwareEncoder === 'h264_qsv') {
      return ['-c:v', 'h264_qsv', '-preset', 'medium', '-global_quality', String(quality)]
    }
    if (hardwareEncoder === 'h264_amf') {
      return ['-c:v', 'h264_amf', '-quality', 'balanced', '-rc', 'cqp', '-qp_i', String(quality), '-qp_p', String(quality)]
    }
    return ['-c:v', hardwareEncoder, '-global_quality', String(quality)]
  }
  if (codec === 'h264') {
    return ['-c:v', 'libx264', '-preset', 'medium', '-crf', String(quality), '-profile:v', 'high']
  }
  if (codec === 'h265') {
    return ['-c:v', 'libx265', '-preset', 'medium', '-crf', String(Math.min(34, quality + 2)), '-tag:v', 'hvc1']
  }
  if (codec === 'vp9') {
    return ['-c:v', 'libvpx-vp9', '-crf', String(quality), '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2']
  }
  if (codec === 'prores') {
    return ['-c:v', 'prores_ks', '-profile:v', '3', '-vendor', 'apl0']
  }
  return []
}

function buildVideoFilter(settings, meta = {}) {
  if (settings.format === 'gif') {
    // GIF 的帧延迟单位是 10ms。12.5fps → 每帧固定 80ms，避免 15fps 被拆成 70/60ms 造成节奏抖动。
    return 'fps=12.5,scale=640:-2:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=256:stats_mode=full[p];[s1][p]paletteuse=dither=bayer:bayer_scale=4'
  }

  const filters = []
  const width = Number(meta.width) || 0
  const height = Number(meta.height) || 0
  const target = Number(settings.resolution)
  if (Number.isFinite(target) && target > 0 && width > 0 && height > 0) {
    const shortSide = Math.min(width, height)
    if (target < shortSide) {
      filters.push(
        width >= height
          ? `scale=-2:${target}:flags=lanczos`
          : `scale=${target}:-2:flags=lanczos`
      )
    }
  }

  const targetFps = Number(settings.fps)
  if (Number.isFinite(targetFps) && targetFps > 0) {
    const sourceFps = Number(meta.fps) || 0
    if (!sourceFps || targetFps < sourceFps - 0.01) filters.push(`fps=${targetFps}`)
  }
  return filters.join(',')
}

export function buildArguments({ sourcePath, outputPath, settings, meta, useHardware, forceSoftware }) {
  const format = settings.format
  const codec = settings.videoCodec
  const hardwareEncoder = useHardware && !forceSoftware ? meta?.hardware?.encoder : null
  const segments = Array.isArray(settings.clips) && settings.clips.length
    ? settings.clips
    : [{ start: 0, end: Number(meta?.duration) || 0 }]
  const sourceDuration = Number(meta?.duration) || 0
  const first = segments[0]
  const single = segments.length === 1
  const wantsAudio = settings.audio !== false && format !== 'gif'
  const hasAudio = Boolean(meta?.hasAudio)
  const audioInOutput = wantsAudio && hasAudio
  const filter = buildVideoFilter(settings, meta)
  const args = [
    '-hide_banner',
    '-loglevel', 'warning',
    '-progress', 'pipe:1',
    '-nostats',
    '-y'
  ]

  if (single) {
    if (first.start > 0.01) args.push('-ss', first.start.toFixed(3))
  }
  args.push('-i', sourcePath)
  args.push('-map_metadata', '0')

  if (single) {
    if (sourceDuration > 0 && first.end - first.start < sourceDuration - 0.01) {
      args.push('-t', (first.end - first.start).toFixed(3))
    }
    args.push('-map', '0:v:0')
    if (wantsAudio) args.push('-map', '0:a:0?')
    if (filter) args.push('-vf', filter)
  } else {
    const graph = []
    for (let index = 0; index < segments.length; index += 1) {
      const segment = segments[index]
      graph.push(
        `[0:v]trim=start=${segment.start.toFixed(3)}:end=${segment.end.toFixed(3)},setpts=PTS-STARTPTS[v${index}]`
      )
      if (audioInOutput) {
        graph.push(
          `[0:a]atrim=start=${segment.start.toFixed(3)}:end=${segment.end.toFixed(3)},asetpts=PTS-STARTPTS[a${index}]`
        )
      }
    }
    const concatInputs = segments
      .map((_, index) => `[v${index}]${audioInOutput ? `[a${index}]` : ''}`)
      .join('')
    graph.push(
      `${concatInputs}concat=n=${segments.length}:v=1:a=${audioInOutput ? 1 : 0}[vcat]${audioInOutput ? '[acat]' : ''}`
    )
    graph.push(`[vcat]${filter || 'null'}[vout]`)
    args.push('-filter_complex', graph.join(';'))
    args.push('-map', '[vout]')
    if (audioInOutput) args.push('-map', '[acat]')
  }

  if (format === 'gif') {
    args.push('-an')
  } else {
    args.push(...qualityArgs(codec, settings.quality, Boolean(hardwareEncoder), hardwareEncoder))
    args.push('-pix_fmt', codec === 'prores' ? 'yuv422p10le' : 'yuv420p')
    if (settings.fps && Number(settings.fps) > 0 && format !== 'gif') {
      args.push('-r', String(settings.fps))
    }

    if (settings.audio === false || settings.removeAudio) {
      args.push('-an')
    } else {
      const audioCodec =
        format === 'webm'
          ? 'libopus'
          : codec === 'prores'
            ? 'pcm_s16le'
            : format === 'mkv' && settings.audioCodec === 'opus'
              ? 'libopus'
              : 'aac'
      args.push('-c:a', audioCodec)
      if (audioCodec !== 'pcm_s16le') {
        args.push('-b:a', `${clamp(settings.audioBitrate, 64, 512, 192)}k`)
      }
    }
  }

  if ((format === 'mp4' || format === 'mov' || format === 'm4v') && settings.faststart !== false) {
    args.push('-movflags', '+faststart')
  }
  if (codec === 'h265' && (format === 'mp4' || format === 'mov' || format === 'm4v')) args.push('-tag:v', 'hvc1')
  if (format === 'gif') args.push('-loop', '0')

  args.push(outputPath)
  return args
}

function parseProgressLine(line, state) {
  const index = line.indexOf('=')
  if (index < 0) return false
  const key = line.slice(0, index).trim()
  const value = line.slice(index + 1).trim()
  if (!key) return false
  if (key === 'out_time_us' || key === 'out_time_ms') {
    const micros = Number(value)
    if (Number.isFinite(micros) && micros >= 0) state.time = micros / 1_000_000
  } else if (key === 'out_time') {
    const match = value.match(/(\d+):(\d+):(\d+(?:\.\d+)?)/)
    if (match) state.time = Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3])
  } else if (key === 'frame') {
    state.frame = Number(value) || 0
  } else if (key === 'fps') {
    state.fps = Number(value) || 0
  } else if (key === 'speed') {
    state.speed = Number(String(value).replace('x', '')) || 0
  } else if (key === 'total_size') {
    state.totalSize = Number(value) || 0
  }
  return true
}

export class ConversionQueue {
  constructor({ onChange, onComplete, hardware }) {
    this.onChange = onChange || (() => {})
    this.onComplete = onComplete || (() => {})
    this.hardware = hardware || null
    this.jobs = []
    this.running = null
    this.lastEmit = 0
    this.reservedPaths = new Set()
    this.shuttingDown = false
    this.enqueueChain = Promise.resolve()
  }

  setHardware(hardware) {
    this.hardware = hardware
  }

  snapshot() {
    return this.jobs.map((job) => {
      const {
        child, cancelRequested, args, startedAt, finishedAt, ...safe
      } = job
      return { ...safe }
    })
  }

  emit(force = true) {
    const now = Date.now()
    if (!force && now - this.lastEmit < 150) return
    this.lastEmit = now
    this.onChange(this.snapshot())
  }

  enqueue(input) {
    // 串行化入队，避免两个同名任务在文件尚未落盘时抢占同一个输出路径。
    const operation = this.enqueueChain.then(() => this.enqueueJob(input))
    this.enqueueChain = operation.catch(() => {})
    return operation
  }

  async enqueueJob(input) {
    if (this.shuttingDown) throw new Error('应用正在退出，无法开始新任务')
    const sourcePath = String(input?.sourcePath || '')
    if (!sourcePath) throw new Error('缺少源文件路径')
    await access(sourcePath)
    const sourceStat = await stat(sourcePath)
    if (!sourceStat.isFile()) throw new Error('源文件不可用')

    const format = String(input?.settings?.format || 'mp4').toLowerCase()
    if (!SUPPORTED_FORMATS.has(format)) throw new Error('不支持的目标格式')

    const codec = String(input?.settings?.videoCodec || 'h264')
    if (!FORMAT_CODECS[format].includes(codec)) throw new Error('编码器与容器不兼容')

    const meta = input?.meta || {}
    const sourceDuration = Number(meta.duration) || 0
    const segments = []

    if (Array.isArray(input?.clips) && input.clips.length) {
      let cursor = 0
      const sorted = [...input.clips].sort((a, b) => Number(a.start) - Number(b.start))
      for (const raw of sorted) {
        let start = Number(raw.start)
        let end = Number(raw.end)
        if (!Number.isFinite(start) || !Number.isFinite(end)) continue
        start = Math.max(0, start)
        if (sourceDuration > 0) end = Math.min(sourceDuration, end)
        start = Math.max(start, cursor)
        if (end - start < 0.1) continue
        segments.push({ start, end })
        cursor = end
      }
    } else if (input?.trim) {
      // 兼容旧版 trim / 中间删除载荷。
      let trimStart = 0
      let trimEnd = sourceDuration
      if (sourceDuration > 0) {
        const rawStart = Number(input.trim.start)
        const rawEnd = Number(input.trim.end)
        trimStart = Number.isFinite(rawStart) ? Math.max(0, Math.min(rawStart, sourceDuration)) : 0
        trimEnd = Number.isFinite(rawEnd) ? Math.max(trimStart, Math.min(rawEnd, sourceDuration)) : sourceDuration
      }
      if (input.trim.cutEnabled) {
        const cutStart = Number(input.trim.cutStart)
        const cutEnd = Number(input.trim.cutEnd)
        if (Number.isFinite(cutStart) && Number.isFinite(cutEnd) && cutStart > trimStart && cutEnd < trimEnd) {
          segments.push({ start: trimStart, end: cutStart }, { start: cutEnd, end: trimEnd })
        }
      } else {
        segments.push({ start: trimStart, end: trimEnd })
      }
    } else {
      segments.push({ start: 0, end: sourceDuration })
    }

    const validSegments = segments.filter((segment) => segment.end - segment.start >= 0.1)
    if (!validSegments.length) throw new Error('没有可导出的视频片段')
    const clipDuration = validSegments.reduce((sum, segment) => sum + (segment.end - segment.start), 0)
    if (clipDuration < 0.2) throw new Error('成片长度太短，至少保留 0.2 秒')
    const trimStart = validSegments[0].start
    const trimEnd = validSegments[validSegments.length - 1].end
    const requestedOutput = String(input?.outputPath || '')
    const defaultName = `${fileStem(sourcePath)}_converted.${format}`
    let outputPath = path.resolve(requestedOutput || path.join(path.dirname(sourcePath), defaultName))
    if (extOf(outputPath) !== format) outputPath = `${outputPath.replace(/\.[^.\\/]+$/, '')}.${format}`
    const outputDirectory = path.dirname(outputPath)
    const safeName = path.basename(outputPath).replace(/[<>:"|?*\u0000-\u001f]/g, '_').trim()
    outputPath = path.join(outputDirectory, safeName)
    await mkdir(outputDirectory, { recursive: true })
    if (path.resolve(outputPath).toLowerCase() === path.resolve(sourcePath).toLowerCase()) {
      outputPath = path.join(path.dirname(outputPath), `${fileStem(outputPath)}_converted.${format}`)
    }
    outputPath = await uniqueOutputPath(outputPath, this.reservedPaths)
    this.reservedPaths.add(outputPath.toLowerCase())

    const settings = {
      format,
      videoCodec: codec,
      quality: clamp(input?.settings?.quality, 12, 40, codec === 'prores' ? 20 : 22),
      resolution: input?.settings?.resolution || 'source',
      fps: input?.settings?.fps || 'source',
      audio: input?.settings?.audio !== false,
      removeAudio: Boolean(input?.settings?.removeAudio),
      audioCodec: input?.settings?.audioCodec || 'aac',
      audioBitrate: clamp(input?.settings?.audioBitrate, 64, 512, 192),
      faststart: input?.settings?.faststart !== false,
      hardware: input?.settings?.hardware !== false,
      clips: validSegments
    }

    const job = {
      id: randomUUID(),
      status: 'queued',
      sourcePath,
      sourceName: path.basename(sourcePath),
      outputPath,
      outputName: path.basename(outputPath),
      format,
      videoCodec: codec,
      quality: settings.quality,
      settings,
      meta: {
        width: Number(meta.video?.width) || Number(meta.width) || 0,
        height: Number(meta.video?.height) || Number(meta.height) || 0,
        fps: Number(meta.video?.fps) || Number(meta.fps) || 0,
        hasAudio: Boolean(meta.hasAudio),
        duration: sourceDuration
      },
      duration: clipDuration || sourceDuration,
      trimStart,
      trimEnd,
      clipCount: validSegments.length,
      trimmed: !(validSegments.length === 1 && trimStart < 0.02 && trimEnd > sourceDuration - 0.02),
      progress: 0,
      speed: 0,
      fps: 0,
      eta: '',
      sizeLabel: '',
      error: '',
      note: '',
      usedHardware: false,
      hardwareLabel: '',
      createdAt: new Date().toISOString(),
      finishedAt: null
    }

    this.jobs.unshift(job)
    this.emit()
    this.pump()
    return job.id
  }

  pump() {
    if (this.running || this.shuttingDown) return
    const next = [...this.jobs].reverse().find((job) => job.status === 'queued')
    if (!next) return
    this.run(next)
  }

  async run(job) {
    this.running = job.id
    job.status = 'running'
    job.startedAt = new Date().toISOString()
    job.progress = 0
    job.error = ''
    job.note = ''
    this.emit()

    const useHardware = Boolean(
      job.format !== 'gif' &&
      this.hardware?.encoder &&
      job.videoCodec === 'h264' &&
      job.settings?.hardware !== false &&
      job.forceSoftware !== true
    )
    if (useHardware) {
      job.usedHardware = true
      job.hardwareLabel = this.hardware.label
      job.note = `使用 ${this.hardware.label} 硬件编码`
    }
    this.emit()

    const args = buildArguments({
      sourcePath: job.sourcePath,
      outputPath: job.outputPath,
      settings: {
        format: job.format,
        videoCodec: job.videoCodec,
        quality: job.quality,
        resolution: job.settings?.resolution,
        fps: job.settings?.fps,
        audio: job.settings?.audio,
        removeAudio: job.settings?.removeAudio,
        audioCodec: job.settings?.audioCodec,
        audioBitrate: job.settings?.audioBitrate,
        faststart: job.settings?.faststart,
        clips: job.settings?.clips
      },
      meta: {
        ...job.meta,
        hardware: this.hardware
      },
      useHardware,
      forceSoftware: job.forceSoftware
    })

    const child = spawnFfmpeg(args)
    job.child = child
    const progressState = { time: 0, fps: 0, speed: 0, totalSize: 0 }
    let stdoutBuffer = ''
    let stderrTail = ''

    child.stdout.setEncoding('utf8')
    child.stdout.on('data', (chunk) => {
      stdoutBuffer += chunk
      const lines = stdoutBuffer.split(/\r?\n/)
      stdoutBuffer = lines.pop() || ''
      let changed = false
      for (const line of lines) changed = parseProgressLine(line, progressState) || changed
      if (!changed) return
      if (job.duration > 0) {
        job.progress = Math.max(0, Math.min(99.4, (progressState.time / job.duration) * 100))
      }
      job.fps = Math.round(progressState.fps * 10) / 10
      job.speed = Math.round(progressState.speed * 100) / 100
      if (job.duration > 0 && progressState.speed > 0) {
        const remaining = Math.max(0, job.duration - progressState.time) / progressState.speed
        job.eta = remaining > 0 ? formatDuration(remaining) : ''
      }
      if (progressState.totalSize > 0) job.sizeLabel = formatBytes(progressState.totalSize)
      this.emit(false)
    })

    child.stderr.setEncoding('utf8')
    child.stderr.on('data', (chunk) => {
      stderrTail += chunk
      if (stderrTail.length > 16_000) stderrTail = stderrTail.slice(-16_000)
    })

    const outcome = await new Promise((resolve) => {
      child.on('error', (error) => resolve({ code: -1, error: error.message }))
      child.on('close', (code) => resolve({ code, error: '' }))
    })

    job.child = null
    if (job.cancelRequested) {
      job.status = 'cancelled'
      job.finishedAt = new Date().toISOString()
      job.eta = ''
      job.note = '任务已取消'
      this.reservedPaths.delete(job.outputPath.toLowerCase())
      this.running = null
      this.emit()
      this.pump()
      return
    }

    if (outcome.code !== 0) {
      if (job.usedHardware && !job.forceSoftware) {
        job.forceSoftware = true
        job.usedHardware = false
        job.hardwareLabel = ''
        job.status = 'queued'
        job.progress = 0
        job.note = '硬件编码失败，正在自动回退到 CPU（x264）'
        job.error = ''
        this.running = null
        this.emit()
        setTimeout(() => this.pump(), 250)
        return
      }
      job.status = 'failed'
      job.finishedAt = new Date().toISOString()
      job.eta = ''
      job.error =
        stderrTail
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line && !line.startsWith('frame=') && !line.startsWith('size='))
          .slice(-3)
          .join(' ') || outcome.error || `FFmpeg 退出码 ${outcome.code}`
      job.note = '转换失败'
      this.reservedPaths.delete(job.outputPath.toLowerCase())
      this.running = null
      this.emit()
      this.onComplete(job, true)
      this.pump()
      return
    }

    try {
      const outputStat = await stat(job.outputPath)
      job.sizeLabel = formatBytes(outputStat.size)
    } catch {
      job.sizeLabel = ''
    }
    job.status = 'done'
    job.progress = 100
    job.finishedAt = new Date().toISOString()
    job.eta = ''
    job.note = job.usedHardware ? `${job.hardwareLabel} 硬件编码完成` : '转换完成'
    this.reservedPaths.delete(job.outputPath.toLowerCase())
    this.running = null
    this.emit()
    this.onComplete(job, false)
    this.pump()
  }

  cancel(jobId) {
    const job = this.jobs.find((item) => item.id === jobId)
    if (!job) return false
    if (job.status === 'queued') {
      job.status = 'cancelled'
      job.note = '任务已取消'
      job.finishedAt = new Date().toISOString()
      this.reservedPaths.delete(job.outputPath.toLowerCase())
      this.emit()
      return true
    }
    if (job.status === 'running' && job.child) {
      job.cancelRequested = true
      job.note = '正在停止…'
      this.emit()
      job.child.kill('SIGTERM')
      setTimeout(() => {
        if (job.child && !job.child.killed) job.child.kill('SIGKILL')
      }, 1500)
      return true
    }
    return false
  }

  clearFinished() {
    this.jobs = this.jobs.filter((job) => !['done', 'failed', 'cancelled'].includes(job.status))
    this.emit()
  }

  shutdown() {
    this.shuttingDown = true
    for (const job of this.jobs) {
      if (job.status === 'queued') {
        job.status = 'cancelled'
        job.note = '应用退出，任务已取消'
        job.finishedAt = new Date().toISOString()
      }
      if (job.status === 'running' && job.child) {
        job.cancelRequested = true
        job.child.kill('SIGTERM')
      }
    }
    this.emit()
  }
}
