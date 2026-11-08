import { createHash } from 'node:crypto'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { codecLabel, containerLabel, extOf, formatBitrate, formatBytes, formatDuration, formatFps } from './format.mjs'
import { run, spawnFfmpeg, tools } from './tools.mjs'

const THUMB_VERSION = 'v3'
const MIME_TYPES = {
  mp4: 'video/mp4',
  m4v: 'video/mp4',
  f4v: 'video/mp4',
  mov: 'video/quicktime',
  mkv: 'video/x-matroska',
  webm: 'video/webm',
  avi: 'video/x-msvideo',
  '3gp': 'video/3gpp',
  ts: 'video/mp2t',
  m2ts: 'video/mp2t',
  mts: 'video/mp2t',
  flv: 'video/x-flv',
  mpg: 'video/mpeg',
  mpeg: 'video/mpeg',
  gif: 'image/gif'
}

export function mimeFor(filePath) {
  return MIME_TYPES[extOf(filePath)] || 'application/octet-stream'
}

function parseRate(rate) {
  if (!rate || typeof rate !== 'string') return 0
  const [a, b] = rate.split('/').map(Number)
  if (!Number.isFinite(a)) return 0
  return b && Number.isFinite(b) ? a / b : a
}

function rotationOf(video) {
  if (Number.isFinite(video?.tags?.rotate)) return Number(video.tags.rotate)
  const sideData = Array.isArray(video?.side_data_list) ? video.side_data_list : []
  const rotated = sideData.find((item) => Number.isFinite(item?.rotation))
  return rotated ? Math.abs(Number(rotated.rotation)) : 0
}

async function captureFrame(args) {
  const child = spawnFfmpeg(args)
  let stderr = ''
  child.stderr.on('data', (chunk) => {
    stderr += chunk.toString()
    if (stderr.length > 12_000) stderr = stderr.slice(-12_000)
  })
  const code = await new Promise((resolve) => child.on('close', resolve))
  if (code !== 0) throw new Error(stderr.split(/\r?\n/).filter(Boolean).slice(-3).join(' ') || `ffmpeg exited ${code}`)
}

async function imageData(filePath) {
  const data = await readFile(filePath)
  return `data:image/jpeg;base64,${data.toString('base64')}`
}

async function generateThumbnails(filePath, duration, cacheDir) {
  const info = await stat(filePath)
  const key = createHash('sha1')
    .update(`${THUMB_VERSION}|${filePath}|${info.size}|${info.mtimeMs}`)
    .digest('hex')
    .slice(0, 20)
  const posterPath = path.join(cacheDir, `${key}-poster.jpg`)
  const stripPath = path.join(cacheDir, `${key}-strip.jpg`)
  await mkdir(cacheDir, { recursive: true })

  const seek = duration > 1.5 ? Math.min(duration * 0.18, duration - 0.4) : 0
  const stripFps = Math.max(0.06, Math.min(2, 6 / Math.max(duration, 1.2)))

  const tasks = [
    captureFrame([
      '-hide_banner', '-loglevel', 'error',
      '-ss', String(seek),
      '-i', filePath,
      '-frames:v', '1',
      '-vf', 'scale=1280:-2:flags=lanczos',
      '-q:v', '3',
      '-y', posterPath
    ]),
    captureFrame([
      '-hide_banner', '-loglevel', 'error',
      '-i', filePath,
      '-vf', `fps=${stripFps},scale=320:180:force_original_aspect_ratio=increase,crop=320:180,tile=6x1`,
      '-frames:v', '1',
      '-q:v', '4',
      '-y', stripPath
    ])
  ]

  const results = await Promise.allSettled(tasks)
  const poster = results[0].status === 'fulfilled' ? await imageData(posterPath) : null
  const strip = results[1].status === 'fulfilled' ? await imageData(stripPath) : null
  return { thumbnail: poster, filmstrip: strip, cacheKey: key }
}

export async function probeMedia(filePath, { cacheDir } = {}) {
  const info = await stat(filePath)
  if (!info.isFile()) throw new Error('目标不是一个文件')

  let payload
  try {
    const { stdout } = await run(
      tools.ffprobe,
      [
        '-v', 'error',
        '-print_format', 'json',
        '-show_format',
        '-show_streams',
        filePath
      ],
      { timeout: 30_000 }
    )
    payload = JSON.parse(stdout)
  } catch (error) {
    throw new Error(`无法读取媒体信息：${String(error?.stderr || error?.message || error).split(/\r?\n/)[0]}`)
  }

  const streams = Array.isArray(payload.streams) ? payload.streams : []
  const video = streams.find((item) => item.codec_type === 'video' && item.disposition?.attached_pic !== 1)
  if (!video) throw new Error('文件中没有找到视频轨道')

  const audio = streams.find((item) => item.codec_type === 'audio') || null
  const format = payload.format || {}
  const duration = Number(format.duration || video.duration) || 0
  const rotation = rotationOf(video)
  let width = Number(video.width) || 0
  let height = Number(video.height) || 0
  if (rotation === 90 || rotation === 270) [width, height] = [height, width]
  const fps = parseRate(video.avg_frame_rate) || parseRate(video.r_frame_rate)
  const bitrate = Number(video.bit_rate || format.bit_rate) || 0
  const ext = extOf(filePath)

  let thumbs = { thumbnail: null, filmstrip: null }
  if (cacheDir) {
    try {
      thumbs = await generateThumbnails(filePath, duration, cacheDir)
    } catch (error) {
      thumbs.thumbnailError = String(error?.message || error)
    }
  }

  return {
    path: filePath,
    name: path.basename(filePath),
    ext,
    container: containerLabel(format.format_name || '', ext),
    formatLongName: format.format_long_name || format.format_name || '未知容器',
    size: info.size,
    sizeLabel: formatBytes(info.size),
    duration,
    durationLabel: formatDuration(duration),
    bitrate,
    bitrateLabel: formatBitrate(bitrate),
    video: {
      codec: video.codec_name || '',
      codecLabel: codecLabel(video.codec_name),
      profile: video.profile || '',
      width,
      height,
      resolution: width && height ? `${width} × ${height}` : '—',
      fps,
      fpsLabel: formatFps(fps),
      pixFmt: video.pix_fmt || '',
      bitrate,
      bitrateLabel: formatBitrate(bitrate),
      rotation
    },
    audio: audio
      ? {
          codec: audio.codec_name || '',
          codecLabel: codecLabel(audio.codec_name),
          channels: Number(audio.channels) || 0,
          channelLayout: audio.channel_layout || (audio.channels === 2 ? 'stereo' : `${audio.channels || 1} ch`),
          sampleRate: Number(audio.sample_rate) || 0,
          bitrate: Number(audio.bit_rate) || 0,
          bitrateLabel: formatBitrate(Number(audio.bit_rate) || 0)
        }
      : null,
    hasAudio: Boolean(audio),
    subtitleCount: streams.filter((item) => item.codec_type === 'subtitle').length,
    ...thumbs
  }
}
