/* FrameFerry renderer — zero-dependency desktop UI */
const api = window.frameferry

const ICONS = {
  plus: '<path d="M5 12h14M12 5v14"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  film: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  play: '<polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/>',
  volume: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
  volumeX: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6M16 9l6 6"/>',
  maximize: '<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  alert: '<path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  loader: '<path d="M21 12a9 9 0 1 1-6.2-8.5"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="1"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/>',
  zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  hardDrive: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 16h.01M10 16h.01M2 12h20"/>',
  rotate: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  undo: '<path d="m9 7-5 5 5 5"/><path d="M4 12h9a6 6 0 0 1 6 6v1"/>',
  redo: '<path d="m15 7 5 5-5 5"/><path d="M20 12h-9a6 6 0 0 0-6 6v1"/>',
  sparkles: '<path d="m12 3-1.5 4.5L6 9l4.5 1.5L12 15l1.5-4.5L18 9l-4.5-1.5z"/><path d="m19 14-.8 2.2L16 17l2.2.8L19 20l.8-2.2L22 17l-2.2-.8z"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/>',
  power: '<path d="M12 2v10M18.4 6.6a9 9 0 1 1-12.8 0"/>',
  keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  minus: '<path d="M5 12h14"/>',
  square: '<rect x="5" y="5" width="14" height="14" rx="1"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  folderSearch: '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="2.5"/><path d="m14 15 2 2"/>',
  clapperboard: '<path d="M4 11v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9M4 11h16M4 11l2-7 4 2-2 5M12 6l2-5 4 2-2 5M18 6l2-5"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  audio: '<path d="M4 10v4M8 6v12M12 9v6M16 4v16M20 8v8"/>',
  feather: '<path d="M20.2 3.8a5.5 5.5 0 0 0-7.8 0L4 12.2V20h7.8l8.4-8.4a5.5 5.5 0 0 0 0-7.8zM16 8 6.5 17.5M15 9l-4 4"/>',
  scale: '<path d="M12 3v18M5 7h14M7 7l-4 8h8zM17 7l-4 8h8z"/>',
  gem: '<path d="m6 3-4 6 10 12L22 9l-4-6z"/><path d="M2 9h20M8 3l4 18M16 3l-4 18"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'
}

function icon(name, size = 15, className = '') {
  const paths = ICONS[name] || ICONS.info
  return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`
}

function logoHtml(size = 30) {
  return `<svg class="logo-mark" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">
    <rect width="32" height="32" rx="8" fill="currentColor"></rect>
    <path d="M8 9.5h16M8 22.5h16" stroke="#16120f" stroke-width="1.8" stroke-linecap="round" opacity=".9"></path>
    <rect x="8" y="12.5" width="7.5" height="7" rx="1" fill="#16120f"></rect>
    <rect x="18.5" y="12.5" width="5.5" height="3" rx=".8" fill="#16120f" opacity=".72"></rect>
    <rect x="18.5" y="17" width="5.5" height="2.5" rx=".8" fill="#16120f" opacity=".4"></rect>
  </svg>`
}

function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((node) => {
    const name = node.dataset.icon
    if (!name) return
    node.innerHTML = icon(name)
  })
}

const $ = (selector, root = document) => root.querySelector(selector)
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector))

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character])
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** index
  return `${value >= 100 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`
}

function formatClock(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00'
  const total = Math.floor(seconds)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const rest = total % 60
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

function fileNameOf(filePath) {
  return String(filePath || '').split(/[\\/]/).pop() || String(filePath || '')
}

function directoryOf(filePath) {
  const slash = Math.max(String(filePath || '').lastIndexOf('/'), String(filePath || '').lastIndexOf('\\'))
  return slash >= 0 ? String(filePath).slice(0, slash) : ''
}

function outputPathFor(sourcePath, format, preferredDirectory = '') {
  const directory = preferredDirectory || directoryOf(sourcePath) || '.'
  const separator = directory.includes('\\') ? '\\' : '/'
  const normalizedDirectory = directory.replace(/[\\/]+$/, '')
  const stem = fileNameOf(sourcePath).replace(/\.[^.]+$/, '')
  return `${normalizedDirectory}${separator}${stem}_converted.${format}`
}

function preferredOutputPath(sourcePath, format) {
  return outputPathFor(sourcePath, format, state.defaultOutputDir)
}

function outputPathWithFormat(filePath, format) {
  const value = String(filePath || '')
  if (!value) return ''
  return value.replace(/\.[a-z0-9]{2,5}$/i, '') + `.${format}`
}

function makeClipId() {
  return globalThis.crypto?.randomUUID?.() || `clip-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function ensureClips(file) {
  const duration = Number(file?.info?.duration) || 0
  if (!file || !duration) return []
  if (!Array.isArray(file.clips) || !file.clips.length) {
    // 兼容旧版的 trim / cut 数据结构。
    const trim = file.trim
    if (trim && Number.isFinite(trim.start) && Number.isFinite(trim.end)) {
      if (trim.cutEnabled && Number.isFinite(trim.cutStart) && Number.isFinite(trim.cutEnd)) {
        file.clips = [
          { id: makeClipId(), start: trim.start, end: trim.cutStart },
          { id: makeClipId(), start: trim.cutEnd, end: trim.end }
        ]
      } else {
        file.clips = [{ id: makeClipId(), start: trim.start, end: trim.end }]
      }
    } else {
      file.clips = [{ id: makeClipId(), start: 0, end: duration }]
    }
  }

  const normalized = []
  let previousEnd = 0
  for (const raw of [...file.clips].sort((a, b) => Number(a.start) - Number(b.start))) {
    let start = Number(raw.start)
    let end = Number(raw.end)
    if (!Number.isFinite(start) || !Number.isFinite(end)) continue
    start = Math.max(start, previousEnd, 0)
    end = Math.min(end, duration)
    if (end - start < 0.1) continue
    normalized.push({ id: raw.id || makeClipId(), start, end })
    previousEnd = end
  }

  if (!normalized.length) {
    normalized.push({ id: makeClipId(), start: 0, end: duration })
  }
  file.clips = normalized
  if (!normalized.some((clip) => clip.id === file.selectedClipId)) {
    file.selectedClipId = normalized[0].id
  }
  return file.clips
}

function editPlan(file) {
  const clips = Array.isArray(file?.clips) && file.clips.length ? file.clips : ensureClips(file)
  if (!clips.length) return { clips: [], duration: 0, start: 0, end: 0 }
  return {
    clips,
    duration: clips.reduce((sum, clip) => sum + (clip.end - clip.start), 0),
    start: clips[0].start,
    end: clips[clips.length - 1].end
  }
}

function outputTimeAtSource(file, sourceTime) {
  const plan = editPlan(file)
  if (!plan.clips.length) return 0
  const target = nearestClipTime(file, sourceTime)
  let elapsed = 0
  for (const clip of plan.clips) {
    if (target <= clip.start + 0.0001) return elapsed
    if (target < clip.end - 0.0001) return elapsed + (target - clip.start)
    elapsed += clip.end - clip.start
  }
  return elapsed
}

function sourceTimeAtOutput(file, outputTime) {
  const plan = editPlan(file)
  if (!plan.clips.length) return 0
  let remaining = Math.min(Math.max(0, Number(outputTime) || 0), plan.duration)
  for (let index = 0; index < plan.clips.length; index += 1) {
    const clip = plan.clips[index]
    const length = clip.end - clip.start
    if (remaining <= length || index === plan.clips.length - 1) {
      return clip.start + Math.min(remaining, length)
    }
    remaining -= length
  }
  return plan.clips[plan.clips.length - 1].end
}

function paintOutputTimeline(file) {
  const timeline = $('#timeline')
  if (!timeline || !file?.info) return
  const plan = editPlan(file)
  const total = plan.duration
  const current = outputTimeAtSource(file, ui.currentTime)
  timeline.max = String(Math.max(total, 0.1))
  timeline.value = String(Math.min(total, current))
  const ratio = total > 0 ? Math.min(1, current / total) : 0
  timeline.style.background = `linear-gradient(90deg, var(--accent) ${ratio * 100}%, rgba(255,255,255,.2) ${ratio * 100}%)`
  const currentLabel = $('#time-current')
  const totalLabel = $('#time-total')
  if (currentLabel) currentLabel.textContent = formatClock(current)
  if (totalLabel) totalLabel.textContent = formatClock(total + 0.000001)
}

function isFileTrimmed(file) {
  const info = file?.info
  if (!info) return false
  const clips = ensureClips(file)
  if (clips.length > 1) return true
  return clips[0].start > 0.05 || clips[0].end < info.duration - 0.05
}

function formatTrimTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00.0'
  const tenths = Math.round(seconds * 10)
  const whole = Math.floor(tenths / 10)
  const hour = Math.floor(whole / 3600)
  const minute = Math.floor((whole % 3600) / 60)
  const second = whole % 60
  const fraction = tenths % 10
  return hour > 0
    ? `${hour}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}.${fraction}`
    : `${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}.${fraction}`
}

const FORMAT_META = {
  mp4: { label: 'MP4', note: '通用分享' },
  mov: { label: 'MOV', note: '剪辑交付' },
  webm: { label: 'WebM', note: '网页播放' },
  mkv: { label: 'MKV', note: '多轨归档' },
  gif: { label: 'GIF', note: '无声动图' }
}
const FORMAT_CODECS = {
  mp4: ['h264', 'h265'],
  mov: ['h264', 'prores'],
  webm: ['vp9'],
  mkv: ['h264', 'h265', 'vp9'],
  gif: ['gif']
}
const CODEC_LABEL = {
  h264: 'H.264 / AVC', h265: 'H.265 / HEVC', vp9: 'VP9', prores: 'ProRes 422 HQ', gif: 'GIF · 调色板优化'
}
const PRESETS = {
  compact: { format: 'mp4', videoCodec: 'h264', quality: 26, resolution: 720, audioBitrate: 128 },
  balanced: { format: 'mp4', videoCodec: 'h264', quality: 21, resolution: 1080, audioBitrate: 192 },
  quality: { format: 'mp4', videoCodec: 'h264', quality: 17, resolution: 'source', audioBitrate: 256 }
}
const DEFAULT_SETTINGS = {
  format: 'mp4', videoCodec: 'h264', quality: 21, resolution: 1080, fps: 'source',
  audio: true, audioCodec: 'aac', audioBitrate: 192, faststart: true, hardware: true
}

const state = {
  bootstrap: null,
  files: [],
  activeId: null,
  settings: { ...DEFAULT_SETTINGS },
  preset: 'balanced',
  defaultOutputDir: '',
  outputPath: '',
  outputEdited: false,
  jobs: [],
  history: [],
  starting: false,
  maxed: false,
  advancedOpen: false,
  modal: null,
  dragDepth: 0
}

const ui = {
  playing: false,
  currentTime: 0,
  duration: 0,
  muted: false,
  videoUrl: '',
  previewToken: 0,
  addCounter: 0,
  qualityPreview: {
    open: false,
    loading: false,
    token: 0,
    timer: null,
    length: 10
  },
  clipView: {
    start: 0,
    end: 0,
    duration: 0
  }
}

function makeId() {
  return globalThis.crypto?.randomUUID?.() || `f-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function errorMessage(error) {
  return String(error?.message || error || '未知错误')
    .replace(/^Error invoking remote method '[^']+': (Error: )?/, '')
    .replace(/^Error: /, '')
}

function activeFile() {
  return state.files.find((file) => file.id === state.activeId) || null
}

function activeInfo() {
  return activeFile()?.info || null
}

function estimateSize(info, settings, durationOverride) {
  if (!info) return 0
  const duration = Number(durationOverride) > 0 ? Number(durationOverride) : info.duration
  if (settings.format === 'gif') {
    // 640px 宽、12.5fps、256 色的 GIF 体积与画面复杂度强相关，取实际样本的经验均值。
    return Math.max(0.8, duration * 1.1) * 1024 * 1024
  }
  if (settings.videoCodec === 'prores') return duration * 62 * 1024 * 1024 / 8
  const sourceShort = Math.min(info.video.width, info.video.height) || 1080
  const target = settings.resolution === 'source' ? sourceShort : Math.min(Number(settings.resolution), sourceShort)
  const baseByHeight = { 2160: 26, 1440: 14, 1080: 8, 720: 4, 480: 1.8 }
  const nearest = Object.keys(baseByHeight).map(Number).sort((a, b) => Math.abs(a - target) - Math.abs(b - target))[0] || 1080
  let mbps = baseByHeight[nearest] || 8
  mbps *= Math.min(1.5, Math.max(0.65, (29 - settings.quality) / 9))
  if (settings.videoCodec === 'h265') mbps *= 0.62
  if (settings.videoCodec === 'vp9') mbps *= 0.72
  if (settings.fps !== 'source') mbps *= Math.min(1.5, Number(settings.fps) / (info.video.fps || 30))
  const audioMbps = settings.audio ? settings.audioBitrate / 1000 : 0
  return Math.max(0.2 * 1024 * 1024, (mbps + audioMbps) * 1e6 / 8 * duration)
}

/* ---------- rendering: shell pieces ---------- */

function renderSourceRail() {
  $('#file-count').textContent = String(state.files.length)
  const ready = state.files.filter((file) => file.status === 'ready')
  $('#rail-count').textContent = ready.length ? `${ready.length} 项` : ''
  const total = ready.reduce((sum, file) => sum + (file.info?.size || 0), 0)
  $('#rail-summary').textContent = ready.length ? `共 ${(total / 1024 / 1024).toFixed(1)} MB 素材` : '支持的视频格式'

  const list = $('#file-list')
  if (!state.files.length) {
    list.innerHTML = `<div class="rail-empty">${icon('film', 20, 'rail-empty-icon')}<p>这里还很安静</p><span>拖入一段视频开始</span></div>`
    return
  }

  list.innerHTML = state.files.map((file) => {
    const info = file.info
    const active = file.id === state.activeId
    const thumb = info?.thumbnail
      ? `<img src="${info.thumbnail}" alt="">`
      : file.status === 'error'
        ? icon('alert', 16)
        : file.status === 'loading'
          ? '<span class="thumb-skeleton"></span>'
          : icon('film', 16)
    return `<div class="source-card ${active ? 'is-active' : ''}" role="button" tabindex="0" data-file-id="${file.id}">
      <span class="source-thumb">${thumb}${info ? `<span class="thumb-duration">${escapeHtml(info.durationLabel)}</span>` : ''}</span>
      <span class="source-copy">
        <span class="source-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</span>
        ${file.status === 'loading' ? '<span class="source-meta is-loading">正在解析媒体…</span>' : ''}
        ${file.status === 'ready' && info ? `<span class="source-meta">${escapeHtml(info.video.resolution.replace(/ /g, ''))} · ${escapeHtml(info.container)}</span>` : ''}
        ${file.status === 'ready' && info && isFileTrimmed(file) ? `<span class="source-meta is-trim">${icon('scissors', 9)} 片段 ${formatTrimTime(editPlan(file).duration)}</span>` : ''}
        ${file.status === 'error' ? '<span class="source-meta is-error">读取失败 · 点击移除</span>' : ''}
      </span>
      <span class="source-remove" role="button" tabindex="0" title="移除素材" data-remove-id="${file.id}">${icon('x', 13)}</span>
    </div>`
  }).join('')
}

function emptyPreviewHtml() {
  return `<div class="empty-stage" id="empty-stage">
    <div class="empty-stage-rings" aria-hidden="true"><span></span><span></span><span></span></div>
    <div class="empty-stage-content">
      <div class="empty-stage-icon">${icon('clapperboard', 25)}</div>
      <span class="eyebrow">NO SOURCE SELECTED</span>
      <h3>把视频拖进帧渡</h3>
      <p>载入素材后，这里会显示画面、媒体信息与逐帧缩略图。</p>
      <button class="light-button" data-action="add-files">选择视频文件</button>
      <span class="empty-hint">也可以使用 Ctrl + O</span>
    </div>
  </div>`
}

function outputAudioAvailable() {
  return state.settings.audio !== false && state.settings.format !== 'gif'
}

function syncPreviewAudio() {
  const video = $('#preview-video')
  const mute = $('#control-mute')
  if (!video || !mute) return
  const available = outputAudioAvailable()
  video.muted = !available || ui.muted
  mute.disabled = !available
  mute.innerHTML = icon(video.muted ? 'volumeX' : 'volume', 15)
  mute.title = available
    ? (ui.muted ? '取消静音' : '静音预览')
    : (state.settings.format === 'gif' ? 'GIF 输出不含音轨' : '输出已移除音轨')
  mute.setAttribute('aria-label', mute.title)
  mute.setAttribute('aria-pressed', String(video.muted))
}

function qualityPreviewLabel() {
  const resolution = state.settings.resolution === 'source'
    ? '原始分辨率'
    : `${state.settings.resolution}p`
  const fps = state.settings.fps === 'source' ? '' : ` · ${state.settings.fps}fps`
  return `H.264 · CRF ${state.settings.quality} · ${resolution}${fps}`
}

function closeQualityPreview() {
  const preview = ui.qualityPreview
  preview.open = false
  preview.loading = false
  preview.token += 1
  if (preview.timer) {
    clearTimeout(preview.timer)
    preview.timer = null
  }
  const overlay = $('#quality-preview')
  if (overlay) overlay.hidden = true
  const video = $('#quality-preview-video')
  if (video) {
    video.pause()
    video.removeAttribute('src')
    video.load()
  }
  void api.cancelQualityPreview?.().catch(() => {})
}

function scheduleQualityPreview(delay = 650) {
  const preview = ui.qualityPreview
  if (!preview.open) return
  if (preview.timer) clearTimeout(preview.timer)
  preview.timer = setTimeout(() => {
    preview.timer = null
    if (preview.open) void generateQualityPreview()
  }, delay)
}

async function generateQualityPreview() {
  const preview = ui.qualityPreview
  const file = activeFile()
  const info = file?.info
  const overlay = $('#quality-preview')
  const video = $('#quality-preview-video')
  const loading = $('#quality-preview-loading')
  const errorBox = $('#quality-preview-error')
  if (!preview.open || !file || !info || !overlay || !video) return

  const token = ++preview.token
  const duration = Number(info.duration) || 0
  if (duration <= 0) return
  const length = Math.min(preview.length || 10, duration)
  const start = Math.min(Math.max(0, ui.currentTime || 0), Math.max(0, duration - length))
  const meta = qualityPreviewLabel()
  preview.loading = true
  video.pause()
  if (loading) loading.hidden = false
  if (errorBox) errorBox.hidden = true
  const metaLabel = $('#quality-preview-meta')
  if (metaLabel) metaLabel.textContent = `${meta} · 无声`
  const loadingText = $('#quality-preview-loading-text')
  if (loadingText) loadingText.textContent = `正在按 CRF ${state.settings.quality} 编码 ${length.toFixed(1)} 秒…`

  try {
    const result = await api.renderQualityPreview({
      sourcePath: file.path,
      start,
      length,
      duration,
      quality: state.settings.quality,
      resolution: state.settings.resolution,
      fps: state.settings.fps,
      hardware: state.settings.hardware
    })
    if (!preview.open || token !== preview.token) return
    const url = await api.getMediaUrl(result.path)
    if (!preview.open || token !== preview.token) return
    video.src = url
    video.load()
    if (loading) loading.hidden = true
    preview.loading = false
    video.play().catch(() => {})
  } catch (error) {
    if (!preview.open || token !== preview.token) return
    preview.loading = false
    if (loading) loading.hidden = true
    if (errorBox) {
      errorBox.hidden = false
      errorBox.textContent = `预览生成失败：${errorMessage(error)}`
    }
  }
}

function openQualityPreview() {
  const file = activeFile()
  if (!file?.info) {
    showToast('info', '先添加一个视频', '载入素材后才能生成压缩预览')
    return
  }
  if (state.settings.format === 'gif' || state.settings.videoCodec === 'prores') {
    showToast('info', '当前格式没有 CRF 预览', 'GIF 和 ProRes 不使用这个质量参数')
    return
  }
  const overlay = $('#quality-preview')
  if (!overlay) return
  $('#preview-video')?.pause()
  ui.qualityPreview.open = true
  overlay.hidden = false
  const lengthSelect = $('#quality-preview-length')
  if (lengthSelect) lengthSelect.value = String(ui.qualityPreview.length)
  void generateQualityPreview()
}

function previewSkeletonHtml() {
  return `<div class="video-stage"><div class="stage-loading"><span></span></div></div>
    <div class="asset-sheet"><div class="asset-sheet-skeleton"><span></span><span></span><span></span><span></span><span></span><span></span></div></div>`
}

function renderPreview() {
  const body = $('#preview-body')
  if (ui.qualityPreview.open) closeQualityPreview()
  const file = activeFile()
  ui.previewToken += 1
  const token = ui.previewToken
  ui.playing = false
  ui.currentTime = 0
  ui.videoUrl = ''
  $('#preview-engine-text').textContent = '预览就绪'
  $('#preview-engine-chip').classList.remove('is-live')
  $('#system-player').disabled = !file

  if (!file) {
    body.innerHTML = emptyPreviewHtml()
    renderTrimUI()
    return
  }
  if (file.status === 'loading') {
    body.innerHTML = previewSkeletonHtml()
    renderTrimUI()
    return
  }
  if (file.status === 'error') {
    body.innerHTML = `<div class="video-stage"><div class="stage-error">${icon('clapperboard', 24)}<p>无法读取这个文件</p><span>${escapeHtml(file.error)}</span></div></div>`
    renderTrimUI()
    return
  }

  const info = file.info
  if (!info) return
  const audioText = info.audio ? `${info.audio.channelLayout === 'mono' ? '单声道' : '立体声'} · ${info.audio.bitrateLabel}` : '无音轨'
  body.innerHTML = `
    <div class="video-stage" id="video-stage">
      <video id="preview-video" class="preview-video" poster="${info.thumbnail || ''}" preload="metadata" playsinline></video>
      <div class="stage-topline">
        <div class="stage-badges">
          <span>${escapeHtml(info.container)}</span><span>${escapeHtml(info.video.codecLabel)}</span>
          <span>${escapeHtml(info.video.resolution)}</span><span class="stage-fps">${escapeHtml(info.video.fpsLabel)}</span>
        </div>
        <span class="stage-filename" title="${escapeHtml(info.name)}">${escapeHtml(info.name)}</span>
      </div>
      <button class="stage-play" id="stage-play" aria-label="播放预览">${icon('play', 24)}</button>
      <div class="stage-controls">
        <div class="timeline-wrap"><input class="timeline" id="timeline" type="range" min="0" max="${Math.max(info.duration, 0.1)}" step="0.01" value="0"></div>
        <div class="stage-control-row">
          <button class="stage-control" id="control-play" aria-label="播放">${icon('play', 15)}</button>
          <span class="stage-time"><span id="time-current">00:00</span> <i>/</i> <span id="time-total">${formatClock(info.duration)}</span></span>
          <span class="stage-control-spacer"></span>
          <button class="stage-control" id="control-mute" aria-label="静音">${icon('volume', 15)}</button>
          <button class="stage-control" id="control-fullscreen" aria-label="全屏">${icon('maximize', 14)}</button>
        </div>
      </div>
      <div class="quality-preview" id="quality-preview" hidden>
        <div class="quality-preview-bar">
          <div class="quality-preview-title">
            <span class="eyebrow">ENCODE PREVIEW</span>
            <strong>真实压缩预览</strong>
          </div>
          <span class="quality-preview-meta" id="quality-preview-meta"></span>
          <select class="qp-length" id="quality-preview-length" aria-label="预览时长">
            <option value="3">3 秒</option>
            <option value="5">5 秒</option>
            <option value="10" selected>10 秒</option>
            <option value="20">20 秒</option>
          </select>
          <div class="quality-preview-actions">
            <button class="qp-button" data-quality-preview-action="refresh">${icon('rotate', 12)} 重新生成</button>
            <button class="qp-button is-close" data-quality-preview-action="close">${icon('x', 12)} 返回原片</button>
          </div>
        </div>
        <div class="quality-preview-body">
          <video id="quality-preview-video" playsinline controls loop></video>
          <div class="quality-preview-loading" id="quality-preview-loading">
            <span class="qp-spinner"></span>
            <strong id="quality-preview-loading-text">正在按当前设置编码 3 秒…</strong>
            <span>预览无声，只看画质</span>
          </div>
          <div class="quality-preview-error" id="quality-preview-error" hidden></div>
        </div>
      </div>
    </div>

    <div id="trim-slot"></div>

    <div class="asset-sheet">
      <div class="asset-sheet-head">
        <div><span class="eyebrow">MEDIA INSPECTOR</span><h3>媒体信息</h3></div>
        <div class="asset-sheet-actions">
          <span class="format-pill">${escapeHtml(info.formatLongName)}</span>
          <button class="text-button" data-action="show-source">${icon('folderSearch', 13)} 定位源文件</button>
        </div>
      </div>
      <div class="fact-grid">
        <div class="fact"><span class="fact-label">画面</span><span class="fact-value">${escapeHtml(info.video.resolution)}</span><span class="fact-meta">${escapeHtml(info.video.codecLabel)} · ${escapeHtml(info.video.profile || '—')}</span></div>
        <div class="fact"><span class="fact-label">帧率</span><span class="fact-value">${escapeHtml(info.video.fpsLabel)}</span><span class="fact-meta">${escapeHtml(info.video.pixFmt || '—')}</span></div>
        <div class="fact"><span class="fact-label">时长</span><span class="fact-value">${escapeHtml(info.durationLabel)}</span><span class="fact-meta">${info.video.rotation ? `${info.video.rotation}° · ` : ''}${escapeHtml(info.container)}</span></div>
        <div class="fact"><span class="fact-label">视频码率</span><span class="fact-value">${escapeHtml(info.video.bitrateLabel)}</span><span class="fact-meta">总码率 ${escapeHtml(info.bitrateLabel)}</span></div>
        <div class="fact"><span class="fact-label">文件大小</span><span class="fact-value">${escapeHtml(info.sizeLabel)}</span><span class="fact-meta">${escapeHtml(info.ext.toUpperCase())}</span></div>
        <div class="fact"><span class="fact-label">音轨</span><span class="fact-value">${info.audio ? escapeHtml(info.audio.codecLabel) : '无'}</span><span class="fact-meta">${info.audio ? `${escapeHtml(info.audio.channelLayout)} · ${(info.audio.sampleRate / 1000).toFixed(1)} kHz` : '静音视频'}</span></div>
      </div>
      <div class="asset-path-row">
        <div class="track-state ${info.audio ? 'has-audio' : ''}">${icon(info.audio ? 'audio' : 'volumeX', 13)} ${escapeHtml(audioText)}</div>
        ${info.subtitleCount ? `<span class="track-state">${info.subtitleCount} 条字幕轨</span>` : ''}
        <span class="asset-path" title="${escapeHtml(file.path)}">${escapeHtml(file.path)}</span>
        <button class="asset-reset" id="asset-reset" title="回到开头">${icon('rotate', 12)}</button>
      </div>
    </div>`

  hydrateIcons(body)
  const video = $('#preview-video')
  const stage = $('#video-stage')
  const central = $('#stage-play')
  const controlPlay = $('#control-play')
  const timeline = $('#timeline')
  const mute = $('#control-mute')

  api.getMediaUrl(file.path).then((url) => {
    if (token !== ui.previewToken || !video) return
    ui.videoUrl = url
    video.src = url
    video.load()
  }).catch(() => {})

  const paintTimeline = () => paintOutputTimeline(file)
  const paintPlay = () => {
    central.hidden = ui.playing
    controlPlay.innerHTML = ui.playing ? icon('pause', 15) : icon('play', 15)
    $('#preview-engine-text').textContent = ui.playing ? '正在播放' : '预览就绪'
    $('#preview-engine-chip').classList.toggle('is-live', ui.playing)
  }
  const togglePlay = async () => {
    try {
      if (video.paused) {
        const clips = ensureClips(file)
        if (!clips.length) return
        let target = video.currentTime
        const inside = clips.find((clip) => target >= clip.start - 0.01 && target < clip.end - 0.03)
        if (!inside) {
          const next = clips.find((clip) => clip.start > target - 0.01)
          target = next ? next.start : clips[0].start
        }
        if (Math.abs(target - video.currentTime) > 0.01) {
          video.currentTime = target
          ui.currentTime = target
          paintTimeline()
        }
        await video.play()
      } else {
        video.pause()
      }
    } catch {
      showToast('error', '当前视频无法内嵌预览', '仍可正常转换，或使用系统播放器打开。')
    }
  }
  const seek = (value) => {
    const target = Math.min(Number(value), video.duration || info.duration)
    ui.currentTime = nearestClipTime(file, target)
    try { video.currentTime = ui.currentTime } catch {}
    paintTimeline()
    paintTrimPlayhead()
  }

  let frameId = 0
  const keepPlaybackInClips = () => {
    if (!video || video.paused || video.seeking) return null
    const clips = Array.isArray(file.clips) && file.clips.length ? file.clips : ensureClips(file)
    if (!clips.length) return null
    const time = video.currentTime
    const index = clips.findIndex((clip) => time >= clip.start - 0.02 && time <= clip.end + 0.02)
    if (index >= 0) {
      const clip = clips[index]
      if (time < clip.end - 0.02) return null
      const next = clips[index + 1]
      if (next) {
        try { video.currentTime = next.start } catch {}
        ui.currentTime = next.start
        return next.start
      }
      video.pause()
      try { video.currentTime = clip.end } catch {}
      ui.currentTime = clip.end
      return clip.end
    }
    const next = clips.find((clip) => clip.start > time - 0.01)
    if (next) {
      try { video.currentTime = next.start } catch {}
      ui.currentTime = next.start
      return next.start
    }
    const last = clips[clips.length - 1]
    video.pause()
    try { video.currentTime = last.end } catch {}
    ui.currentTime = last.end
    return last.end
  }
  const stopFrameLoop = () => {
    if (frameId) cancelAnimationFrame(frameId)
    frameId = 0
  }
  const frameLoop = () => {
    if (!video || !video.isConnected || video.paused || video.ended) {
      frameId = 0
      return
    }
    const cutTime = keepPlaybackInClips()
    ui.currentTime = cutTime ?? video.currentTime
    paintTimeline()
    paintTrimPlayhead()
    frameId = requestAnimationFrame(frameLoop)
  }
  const startFrameLoop = () => {
    stopFrameLoop()
    frameId = requestAnimationFrame(frameLoop)
  }
  video.addEventListener('play', () => { ui.playing = true; paintPlay(); startFrameLoop() })
  video.addEventListener('pause', () => { ui.playing = false; stopFrameLoop(); paintPlay() })
  video.addEventListener('timeupdate', () => {
    ui.currentTime = video.currentTime
    const clips = ensureClips(file)
    if (ui.playing && clips.length) {
      const index = clips.findIndex((clip) => video.currentTime >= clip.start - 0.02 && video.currentTime < clip.end - 0.02)
      if (index >= 0) {
        const clip = clips[index]
        if (video.currentTime >= clip.end - 0.03) {
          const next = clips[index + 1]
          if (next) {
            video.currentTime = next.start
            ui.currentTime = next.start
          } else {
            video.pause()
            video.currentTime = clip.end
            ui.currentTime = clip.end
          }
        }
      } else {
        const next = clips.find((clip) => clip.start > video.currentTime - 0.01)
        if (next) {
          video.currentTime = next.start
          ui.currentTime = next.start
        } else {
          const last = clips[clips.length - 1]
          video.pause()
          video.currentTime = last.end
          ui.currentTime = last.end
        }
      }
    }
    paintTimeline()
    paintTrimPlayhead()
  })
  video.addEventListener('loadedmetadata', () => {
    ui.duration = video.duration || info.duration
    timeline.max = String(Math.max(ui.duration, 0.1))
    const safeStart = nearestClipTime(file, ui.currentTime)
    if (Math.abs(safeStart - ui.currentTime) > 0.01) {
      ui.currentTime = safeStart
      try { video.currentTime = safeStart } catch {}
    }
    paintTimeline()
    paintTrimPlayhead()
  })
  video.addEventListener('ended', () => { ui.playing = false; stopFrameLoop(); paintPlay() })
  central.addEventListener('click', togglePlay)
  controlPlay.addEventListener('click', togglePlay)
  timeline.addEventListener('input', (event) => {
    seek(sourceTimeAtOutput(file, event.target.value))
  })
  mute.addEventListener('click', () => {
    if (!outputAudioAvailable()) return
    ui.muted = !ui.muted
    syncPreviewAudio()
  })
  $('#control-fullscreen').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await stage.requestFullscreen()
    } catch {}
  })
  $('#asset-reset').addEventListener('click', () => seek(ensureClips(file)[0]?.start || 0))
  timeline.addEventListener('mousedown', () => {})
  renderTrimUI()
  syncPreviewAudio()
  paintTrimPlayhead()
}

function paintTrimPlayhead() {
  const view = ui.clipView
  if (!view?.duration) return
  const trimPlayhead = $('#trim-playhead')
  if (!trimPlayhead) return
  const file = activeFile()
  const displayTime = file ? nearestClipTime(file, ui.currentTime) : ui.currentTime
  const outside = displayTime < view.start - 0.001 || displayTime > view.end + 0.001
  trimPlayhead.style.display = outside ? 'none' : ''
  if (outside) return
  const ratio = Math.min(1, Math.max(0, (displayTime - view.start) / view.duration))
  trimPlayhead.style.left = `${ratio * 100}%`
}

function timelineExtent(file) {
  const sourceDuration = Number(file?.info?.duration) || 0
  const clips = Array.isArray(file?.clips) && file.clips.length ? file.clips : []
  return {
    sourceDuration,
    baseDuration: Math.max(0.001, sourceDuration),
    clipStart: clips.length ? clips[0].start : 0
  }
}

function clipView(file) {
  const extent = timelineExtent(file)
  if (!file) return { ...extent, start: 0, end: extent.baseDuration, duration: extent.baseDuration, zoom: 1 }
  if (!file.timelineView || !Number.isFinite(file.timelineView.zoom)) {
    file.timelineView = { zoom: 1, start: 0 }
  }
  const zoom = Math.min(20, Math.max(1, Number(file.timelineView.zoom) || 1))
  const duration = extent.baseDuration / zoom
  const start = Math.min(
    Math.max(0, Number(file.timelineView.start) || 0),
    Math.max(0, extent.baseDuration - duration)
  )
  file.timelineView = { zoom, start }
  return {
    ...extent,
    zoom,
    start,
    end: start + duration,
    duration
  }
}

function nearestClipTime(file, time) {
  const clips = Array.isArray(file?.clips) && file.clips.length ? file.clips : ensureClips(file)
  if (!clips.length) return 0
  const target = Number(time) || 0
  const inside = clips.find((clip) => target >= clip.start - 0.001 && target <= clip.end + 0.001)
  if (inside) return Math.min(inside.end, Math.max(inside.start, target))
  const before = clips.filter((clip) => clip.end <= target).pop()
  const after = clips.find((clip) => clip.start >= target)
  if (!before) return after ? after.start : 0
  if (!after) return before.end
  return target - before.end <= after.start - target ? before.end : after.start
}

function clampPreviewToClips(file) {
  if (!file) return
  const video = $('#preview-video')
  const next = nearestClipTime(file, ui.currentTime)
  if (Math.abs(next - ui.currentTime) < 0.01) return
  if (video) {
    video.pause()
    try { video.currentTime = next } catch {}
  }
  ui.currentTime = next
  paintTrimPlayhead()
}

function ensureClipHistory(file) {
  if (!file) return { undo: [], redo: [] }
  if (!file.clipHistory || !Array.isArray(file.clipHistory.undo) || !Array.isArray(file.clipHistory.redo)) {
    file.clipHistory = { undo: [], redo: [] }
  }
  return file.clipHistory
}

function clipStateSnapshot(file) {
  const clips = Array.isArray(file.clips) && file.clips.length ? file.clips : ensureClips(file)
  return {
    clips: clips.map((clip) => ({ id: clip.id, start: clip.start, end: clip.end })),
    selectedClipId: file.selectedClipId
  }
}

function pushClipHistory(file) {
  const history = ensureClipHistory(file)
  history.undo.push(clipStateSnapshot(file))
  if (history.undo.length > 60) history.undo.shift()
  history.redo = []
}

function restoreClipState(file, state) {
  file.clips = state.clips.map((clip) => ({ ...clip }))
  file.selectedClipId = state.selectedClipId
  const selected = ensureClips(file).find((clip) => clip.id === file.selectedClipId)
  const video = $('#preview-video')
  if (selected && video) {
    video.pause()
    try { video.currentTime = selected.start } catch {}
    ui.currentTime = selected.start
  }
  renderTrimUI()
  renderDock()
  renderSourceRail()
  paintTrimPlayhead()
}

function undoClip() {
  const file = activeFile()
  if (!file) return
  const history = ensureClipHistory(file)
  if (!history.undo.length) return
  const current = clipStateSnapshot(file)
  const state = history.undo.pop()
  history.redo.push(current)
  restoreClipState(file, state)
}

function redoClip() {
  const file = activeFile()
  if (!file) return
  const history = ensureClipHistory(file)
  if (!history.redo.length) return
  const current = clipStateSnapshot(file)
  const state = history.redo.pop()
  history.undo.push(current)
  restoreClipState(file, state)
}

function timelineRulerParts(view, offset = 0) {
  if (!(view.duration > 0)) return ''
  const target = view.duration / 6
  const steps = [1, 2, 5, 10, 15, 30, 60, 120, 300, 600]
  const major = steps.find((step) => step >= target) || Math.ceil(target / 600) * 600
  const minor = major / 4
  const ticks = []
  const labels = []
  const firstIndex = Math.ceil((view.start - offset) / minor - 0.0001)
  for (let index = Math.max(0, firstIndex); index < 100000; index += 1) {
    const time = offset + index * minor
    if (time > view.end + 0.001) break
    const left = ((time - view.start) / view.duration) * 100
    if (left < -0.01 || left > 100.01) continue
    const isMajor = index % 4 === 0
    ticks.push(`<span class="clip-ruler-tick ${isMajor ? 'is-major' : ''}" style="left:${left}%"></span>`)
    if (isMajor) {
      labels.push(`<span class="clip-ruler-label ${index === 0 ? 'is-first' : ''}" style="left:${left}%">${formatClock(Math.round(time - offset))}</span>`)
    }
  }
  return `${labels.join('')}${ticks.join('')}`
}

function timelineRulerHtml(view, offset = 0) {
  return `<div class="clip-ruler" aria-hidden="true">${timelineRulerParts(view, offset)}</div>`
}

function refreshTimelineView(file) {
  const view = clipView(file)
  ui.clipView = view
  const content = $('.clip-content')
  if (!content || !file?.info) return
  const sourceDuration = Number(file.info.duration) || 0
  const pct = (value) => view.duration ? ((value - view.start) / view.duration) * 100 : 0
  const film = content.querySelector('.trim-film')
  if (film) {
    const left = view.duration ? -(view.start / view.duration) * 100 : 0
    const width = view.duration ? (sourceDuration / view.duration) * 100 : 100
    film.style.left = `${left}%`
    film.style.width = `${width}%`
    film.style.right = 'auto'
  }
  for (const block of content.querySelectorAll('.clip-block')) {
    const clip = (file.clips || []).find((item) => item.id === block.dataset.clipId)
    if (!clip) continue
    const left = pct(clip.start)
    block.style.left = `${left}%`
    block.style.width = `${Math.max(0, pct(clip.end) - left)}%`
  }
  for (const gap of content.querySelectorAll('.clip-gap')) {
    const start = Number(gap.dataset.gapStart)
    const end = Number(gap.dataset.gapEnd)
    const left = pct(start)
    gap.style.left = `${left}%`
    gap.style.width = `${Math.max(0, pct(end) - left)}%`
  }
  for (const line of content.querySelectorAll('.clip-cut-line')) {
    line.style.left = `${pct(Number(line.dataset.cutTime))}%`
  }
  const ruler = $('.clip-ruler')
  if (ruler) ruler.innerHTML = timelineRulerParts(view, file.clips?.[0]?.start || 0)
  const thumb = $('#timeline-scroll-thumb')
  if (thumb && view.baseDuration > 0) {
    thumb.style.left = `${(view.start / view.baseDuration) * 100}%`
    thumb.style.width = `${Math.max(2, (view.duration / view.baseDuration) * 100)}%`
  }
  paintTrimPlayhead()
}

function renderTrimUI() {
  const slot = $('#trim-slot')
  if (!slot) return
  const file = activeFile()
  const info = file?.info
  if (!file || !info) {
    slot.innerHTML = ''
    ui.clipView = { start: 0, end: 0, duration: 0 }
    return
  }
  const clips = ensureClips(file)
  const history = ensureClipHistory(file)
  const duration = Number(info.duration) || 0
  const view = clipView(file)
  ui.clipView = view
  const selectedIndex = Math.max(0, clips.findIndex((clip) => clip.id === file.selectedClipId))
  const selected = clips[selectedIndex] || clips[0]
  file.selectedClipId = selected.id
  const total = clips.reduce((sum, clip) => sum + (clip.end - clip.start), 0)
  const pct = (value) => view.duration ? ((value - view.start) / view.duration) * 100 : 0

  const blocks = clips.map((clip, index) => {
    const left = pct(clip.start)
    const width = Math.max(0, pct(clip.end) - left)
    const isSelected = clip.id === selected.id
    return `<div class="clip-block ${isSelected ? 'is-selected' : ''}" data-clip-id="${clip.id}" style="left:${left}%;width:${width}%">
      <span class="clip-block-index">${String(index + 1).padStart(2, '0')}</span>
      <span class="clip-block-duration">${formatTrimTime(clip.end - clip.start)}</span>
      ${isSelected ? `<button class="clip-handle clip-handle-start" data-clip-handle="start" aria-label="调整片段入点"><span></span></button>` : ''}
      ${isSelected ? `<button class="clip-handle clip-handle-end" data-clip-handle="end" aria-label="调整片段出点"><span></span></button>` : ''}
    </div>`
  }).join('')
  const cutLines = clips
    .map((clip, index) => {
      if (index === 0) return ''
      const previous = clips[index - 1]
      if (Math.abs(previous.end - clip.start) > 0.01) return ''
      return `<span class="clip-cut-line" data-cut-time="${clip.start}" style="left:${pct(clip.start)}%"></span>`
    })
    .join('')
  const gaps = []
  let gapCursor = 0
  for (const clip of clips) {
    if (clip.start > gapCursor + 0.01) gaps.push({ start: gapCursor, end: clip.start })
    gapCursor = Math.max(gapCursor, clip.end)
  }
  if (gapCursor < view.baseDuration - 0.01) gaps.push({ start: gapCursor, end: view.baseDuration })
  const gapBlocks = gaps
    .map((gap) => {
      const left = pct(gap.start)
      return `<span class="clip-gap" data-gap-start="${gap.start}" data-gap-end="${gap.end}" style="left:${left}%;width:${Math.max(0, pct(gap.end) - left)}%"></span>`
    })
    .join('')
  const rulerHtml = timelineRulerHtml(view, clips[0]?.start || 0)
  const filmLeft = view.duration ? -(view.start / view.duration) * 100 : 0
  const filmWidth = view.duration ? (duration / view.duration) * 100 : 100
  const scrollRatio = view.baseDuration ? view.duration / view.baseDuration : 1
  const scrollLeft = view.baseDuration ? (view.start / view.baseDuration) * 100 : 0
  const scrollbarHtml = view.zoom > 1.01
    ? `<div class="timeline-scroll" id="timeline-scrollbar" title="拖动查看时间轴其他位置">
        <div class="timeline-scroll-thumb" id="timeline-scroll-thumb" style="left:${scrollLeft}%;width:${Math.max(2, scrollRatio * 100)}%"></div>
      </div>`
    : ''

  slot.innerHTML = `<div class="trim-panel clip-editor">
    <div class="trim-head">
      <div class="trim-head-copy">
        <span class="eyebrow">SPLIT & TRIM</span>
        <span class="trim-head-title">分割与剪辑</span>
        <span class="trim-head-hint">Ctrl+滚轮缩放 · Shift+滚轮平移；拖动白线定位，Ctrl+B 分割</span>
      </div>
      <div class="trim-toolbar">
        <button class="trim-history" data-clip-action="undo" title="撤销 (Ctrl+Z)" aria-label="撤销" ${history.undo.length ? '' : 'disabled'}>${icon('undo', 15)}</button>
        <button class="trim-history" data-clip-action="redo" title="重做 (Ctrl+Shift+Z)" aria-label="重做" ${history.redo.length ? '' : 'disabled'}>${icon('redo', 15)}</button>
        <span class="trim-toolbar-sep" aria-hidden="true"></span>
        <button class="text-button" data-clip-action="preview">${icon('play', 11)} 预览成片</button>
        <button class="text-button clip-split" data-clip-action="split">${icon('scissors', 11)} 分割</button>
        <button class="text-button clip-delete" data-clip-action="delete" ${clips.length <= 1 ? 'disabled' : ''}>${icon('trash', 11)} 删除片段</button>
        <button class="text-button" data-clip-action="reset">${icon('rotate', 11)} 重置</button>
      </div>
    </div>
    ${rulerHtml}
    <div class="clip-timeline" id="clip-timeline">
      <div class="clip-stage" id="clip-stage">
        <div class="clip-content">
          ${info.filmstrip
            ? `<img class="trim-film" src="${info.filmstrip}" style="left:${filmLeft}%;width:${filmWidth}%;right:auto" alt="">`
            : `<div class="trim-film trim-film-empty" style="left:${filmLeft}%;width:${filmWidth}%;right:auto"></div>`}
          ${gapBlocks}
          ${blocks}
          ${cutLines}
        </div>
        <div class="trim-playhead" id="trim-playhead">
          <button class="playhead-grip" id="playhead-grip" title="拖动白线定位；双击白线或 Ctrl+B 分割"></button>
        </div>
        <span class="clip-trim-tip" id="clip-trim-tip" hidden></span>
      </div>
    </div>
    ${scrollbarHtml}
    <div class="clip-readout">
      <div class="clip-selected-line">
        <span class="clip-badge">片段 ${String(selectedIndex + 1).padStart(2, '0')}</span>
        <strong id="clip-selected-range">${formatTrimTime(selected.start)} → ${formatTrimTime(selected.end)}</strong>
        <span class="clip-selected-duration" id="clip-selected-duration">${formatTrimTime(selected.end - selected.start)}</span>
      </div>
      <div class="clip-total">共 <b id="clip-total-count">${clips.length}</b> 段 · 成片 <strong id="clip-total-duration">${formatTrimTime(total)}</strong></div>
    </div>
  </div>`

  hydrateIcons(slot)
  paintTrimPlayhead()
  paintOutputTimeline(file)

  const timeline = $('#clip-timeline')
  const stage = $('#clip-stage')
  const video = $('#preview-video')
  const commit = () => {
    renderDock()
    renderSourceRail()
  }
  const seek = (time) => {
    if (!video) return
    video.pause()
    const next = Math.min(duration, Math.max(0, time))
    video.currentTime = next
    ui.currentTime = next
    paintTrimPlayhead()
  }
  const timeAt = (event) => {
    const rect = stage.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    return nearestClipTime(file, view.start + ratio * view.duration)
  }
  $('.clip-ruler')?.addEventListener('pointerdown', (event) => {
    if (!video) return
    video.pause()
    const time = timeAt(event)
    video.currentTime = time
    ui.currentTime = time
    paintTrimPlayhead()
  })
  const updateLive = (clip) => {
    const block = slot.querySelector(`[data-clip-id="${clip.id}"]`)
    if (block) {
      const left = pct(clip.start)
      block.style.left = `${left}%`
      block.style.width = `${Math.max(0, pct(clip.end) - left)}%`
      const durationLabel = $('.clip-block-duration', block)
      if (durationLabel) durationLabel.textContent = formatTrimTime(clip.end - clip.start)
    }
    const range = $('#clip-selected-range')
    const selectedDuration = $('#clip-selected-duration')
    const totalLabel = $('#clip-total-duration')
    if (range) range.textContent = `${formatTrimTime(clip.start)} → ${formatTrimTime(clip.end)}`
    if (selectedDuration) selectedDuration.textContent = formatTrimTime(clip.end - clip.start)
    if (totalLabel) totalLabel.textContent = formatTrimTime(clips.reduce((sum, item) => sum + (item.end - item.start), 0))
    paintTrimPlayhead()
  }

  $$('.clip-block', slot).forEach((block) => {
    block.addEventListener('click', (event) => {
      if (event.target.closest('.clip-handle')) return
      const clip = clips.find((item) => item.id === block.dataset.clipId)
      if (!clip) return
      file.selectedClipId = clip.id
      seek(Math.min(clip.end, Math.max(clip.start, timeAt(event))))
      renderTrimUI()
    })
  })

  timeline.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.clip-block')) return
    if (event.target.closest('.clip-handle')) return
    if (!video) return
    video.pause()
    const time = Math.min(duration, Math.max(0, timeAt(event)))
    video.currentTime = time
    ui.currentTime = time
    paintTrimPlayhead()
  })

}

function handleClipAction(action) {
  const file = activeFile()
  if (!file?.info) return
  const clips = ensureClips(file)
  const video = $('#preview-video')
  const selected = clips.find((clip) => clip.id === file.selectedClipId) || clips[0]
  if (!selected) return
  const commit = () => {
    renderDock()
    renderSourceRail()
  }

  if (action === 'undo') { undoClip(); return }
  if (action === 'redo') { redoClip(); return }

  if (action === 'preview') {
    if (!video) return
    video.pause()
    video.currentTime = selected.start
    ui.currentTime = selected.start
    paintTrimPlayhead()
    video.play().catch(() => {})
    return
  }

  if (action === 'split') {
    const time = video?.currentTime ?? selected.start
    const index = clips.findIndex((clip) => time > clip.start + 0.2 && time < clip.end - 0.2)
    if (index < 0) {
      showToast('info', '无法在这里分割', '播放头需要位于某个片段内部，且距离两端至少 0.2 秒')
      return
    }
    const source = clips[index]
    const right = { id: makeClipId(), start: time, end: source.end }
    pushClipHistory(file)
    source.end = time
    clips.splice(index + 1, 0, right)
    file.selectedClipId = right.id
    if (video) { video.pause(); video.currentTime = time }
    ui.currentTime = time
    renderTrimUI()
    commit()
    return
  }

  if (action === 'delete') {
    if (clips.length <= 1) {
      showToast('info', '至少保留一个片段')
      return
    }
    const index = clips.findIndex((clip) => clip.id === file.selectedClipId)
    if (index < 0) return
    pushClipHistory(file)
    clips.splice(index, 1)
    const next = clips[Math.min(index, clips.length - 1)]
    file.selectedClipId = next.id
    if (video) { video.pause(); video.currentTime = next.start }
    ui.currentTime = next.start
    renderTrimUI()
    commit()
    return
  }

  if (action === 'reset') {
    pushClipHistory(file)
    file.clips = [{ id: makeClipId(), start: 0, end: Number(file.info.duration) || 0 }]
    file.selectedClipId = file.clips[0].id
    if (video) { video.pause(); video.currentTime = 0 }
    ui.currentTime = 0
    renderTrimUI()
    commit()
    return
  }

}

/* ---------- inspector ---------- */

function codecOptions(format) {
  return FORMAT_CODECS[format].map((codec) => `<option value="${codec}" ${state.settings.videoCodec === codec ? 'selected' : ''}>${CODEC_LABEL[codec]}</option>`).join('')
}

function renderSettings() {
  const root = $('#settings-root')
  const file = activeFile()
  const info = file?.info || null
  const ready = file?.status === 'ready' && Boolean(info)
  const settings = state.settings
  const isGif = settings.format === 'gif'
  const isProres = settings.videoCodec === 'prores'
  const engine = state.bootstrap?.ffmpeg
  const hardware = engine?.hardware
  const qualitySliderValue = Math.min(30, Math.max(16, 46 - settings.quality))
  const qualityPercent = Math.min(100, Math.max(0, ((qualitySliderValue - 16) / 14) * 100))
  const resolutionLabel = settings.resolution === 'source'
    ? (info ? `${Math.min(info.video.width, info.video.height)}p 原始` : '原始')
    : `${settings.resolution}p`
  const outputPath = state.outputPath
  const codecShort = (CODEC_LABEL[settings.videoCodec] || '').split(' ')[0]
  const hardwareText = settings.videoCodec === 'h264'
    ? (hardware && settings.hardware ? hardware.label : 'CPU · x264')
    : isGif
      ? 'CPU · 调色板'
      : `CPU · ${isProres ? 'ProRes' : codecShort}`

  const presetCard = (id, label, sub, iconName) => `
    <button class="preset-card ${state.preset === id ? 'is-active' : ''}" data-preset="${id}">
      <span class="preset-icon">${icon(iconName, 15)}</span>
      <span class="preset-name">${label}</span>
      <span class="preset-sub">${sub}</span>
      ${state.preset === id ? `<span class="preset-check">${icon('check', 10)}</span>` : ''}
    </button>`

  const formatChip = (format) => `
    <button class="format-chip ${settings.format === format ? 'is-active' : ''}" data-format="${format}">
      <span>${FORMAT_META[format].label}</span><small>.${format}</small>
    </button>`

  root.innerHTML = `
    <div class="settings-group">
      <div class="group-head"><span class="group-index">01</span><span>输出预设</span><span class="group-hint">按场景一键配置</span></div>
      <div class="preset-grid">
        ${presetCard('compact', '轻量', '720p · 小体积', 'feather')}
        ${presetCard('balanced', '均衡', '1080p · 日常分享', 'scale')}
        ${presetCard('quality', '高画质', '原始尺寸 · 保留细节', 'gem')}
      </div>
    </div>

    <div class="settings-group">
      <div class="group-head"><span class="group-index">02</span><span>容器格式</span><span class="group-hint">${FORMAT_META[settings.format].note}</span></div>
      <div class="format-row">${['mp4', 'mov', 'webm', 'mkv', 'gif'].map(formatChip).join('')}</div>
    </div>

    <div class="settings-row">
      <div class="mini-field">
        <div class="field-label"><span>视频编码</span></div>
        <div class="select-shell"><select data-select="codec">${codecOptions(settings.format)}</select>${icon('chevronDown', 13)}</div>
      </div>
      <div class="mini-field">
        <div class="field-label"><span>加速</span></div>
        <div class="static-field">${icon('cpu', 13)}<span>${hardwareText}</span></div>
      </div>
    </div>

    ${isGif ? `
    <div class="settings-group quality-group gif-quality">
      <div class="quality-head">
        <div class="field-label"><span>GIF 调色板</span><span class="field-hint">固定 12.5 fps</span></div>
        <span class="quality-value">256 色</span>
      </div>
      <div class="gif-tone" aria-hidden="true"><span></span></div>
      <div class="quality-scale"><span>稳定帧间隔</span><span>控制体积</span></div>
      <div class="quality-note">${icon('sparkles', 12)}统一使用 80ms 帧间隔与稳定抖动，避免 GIF 播放时的节奏跳变。</div>
    </div>` : !isProres ? `
    <div class="settings-group quality-group">
      <div class="quality-head">
        <div class="field-label"><span>恒定质量</span><span class="field-hint">数值越低越清晰 · 仅影响导出</span></div>
        <span class="quality-value" id="quality-value">CRF ${settings.quality}</span>
      </div>
      <input class="quality-slider" id="quality-slider" type="range" min="16" max="30" step="1" value="${qualitySliderValue}"
        title="CRF 只影响导出文件，预览保持原始画面"
        aria-label="视频质量：向右更好画质，向左更小体积；仅影响导出文件"
        style="background:linear-gradient(90deg,var(--accent) 0%,var(--accent) ${qualityPercent}%,rgba(255,255,255,.16) ${qualityPercent}%)">
      <div class="quality-scale"><span>更小体积</span><span>更佳画质</span></div>
      <div class="quality-note" id="quality-note">${icon('sparkles', 12)}${settings.quality <= 18 ? '接近视觉无损，适合归档与二次剪辑' : settings.quality <= 22 ? '画质与体积的平衡点，日常分享推荐' : '优先压缩体积，适合即时通讯与网页'}</div>
      <button class="quality-preview-trigger" data-action="quality-preview">${icon('play', 11)} 预览真实压缩效果</button>
    </div>` : `<div class="quality-note prores-note">${icon('sparkles', 12)}ProRes 422 HQ 固定高质量中间编码，面向剪辑软件</div>`}

    <div class="settings-row compact">
      <div class="mini-field">
        <div class="field-label"><span>分辨率</span></div>
        <div class="select-shell"><select data-select="resolution" ${isGif ? 'disabled' : ''}>
          ${isGif ? '<option value="gif" selected>640px 宽 · 等比</option>' : `
          <option value="source" ${settings.resolution === 'source' ? 'selected' : ''}>保持原始</option>
          <option value="2160" ${settings.resolution === 2160 ? 'selected' : ''}>2160p · 4K</option>
          <option value="1440" ${settings.resolution === 1440 ? 'selected' : ''}>1440p · 2K</option>
          <option value="1080" ${settings.resolution === 1080 ? 'selected' : ''}>1080p · FHD</option>
          <option value="720" ${settings.resolution === 720 ? 'selected' : ''}>720p · HD</option>
          <option value="480" ${settings.resolution === 480 ? 'selected' : ''}>480p · SD</option>`}
        </select>${icon('chevronDown', 13)}</div>
      </div>
      <div class="mini-field">
        <div class="field-label"><span>帧率</span></div>
        <div class="select-shell"><select data-select="fps" ${isGif || isProres ? 'disabled' : ''}>
          ${isGif ? '<option value="12.5" selected>12.5 fps · 固定</option>' : `
          <option value="source" ${settings.fps === 'source' ? 'selected' : ''}>保持原始</option>
          <option value="60" ${settings.fps === 60 ? 'selected' : ''}>60 fps</option>
          <option value="30" ${settings.fps === 30 ? 'selected' : ''}>30 fps</option>
          <option value="24" ${settings.fps === 24 ? 'selected' : ''}>24 fps</option>`}
        </select>${icon('chevronDown', 13)}</div>
      </div>
    </div>

    <div class="audio-block ${!settings.audio ? 'is-muted' : ''}">
      <div class="audio-head">
        <div><div class="field-label"><span>音轨</span></div><span class="audio-sub">${isGif ? 'GIF 格式不支持音轨' : !settings.audio ? '已移除音轨' : isProres ? 'PCM · 无损' : settings.audioCodec === 'opus' && settings.format === 'mkv' ? 'Opus · 可封装' : settings.audioCodec === 'opus' ? 'Opus · 网页优化' : 'AAC · 广泛兼容'}</span></div>
        <button class="switch ${settings.audio ? 'is-on' : ''}" role="switch" aria-checked="${settings.audio}" data-toggle="audio" ${isGif ? 'disabled' : ''}><span class="switch-thumb"></span></button>
      </div>
      ${isGif ? `<div class="audio-disabled-row">${icon('volumeX', 12)} 转换为 GIF 时将自动移除音频</div>` : settings.audio ? `<div class="audio-options">
        <div class="select-shell slim"><select data-select="audioCodec" ${settings.format === 'mkv' ? '' : 'disabled'}>
          ${isProres ? '<option selected>PCM · 无损</option>' : settings.format === 'webm' ? '<option selected>Opus</option>' : settings.format === 'mkv' ? `<option value="aac" ${settings.audioCodec === 'aac' ? 'selected' : ''}>AAC</option><option value="opus" ${settings.audioCodec === 'opus' ? 'selected' : ''}>Opus</option>` : '<option selected>AAC</option>'}
        </select>${icon('chevronDown', 12)}</div>
        <div class="select-shell slim">${isProres ? '<select disabled><option selected>PCM 48 kHz</option></select>' : `<select data-select="audioBitrate">
          <option value="128" ${settings.audioBitrate === 128 ? 'selected' : ''}>128 kbps</option>
          <option value="192" ${settings.audioBitrate === 192 ? 'selected' : ''}>192 kbps</option>
          <option value="256" ${settings.audioBitrate === 256 ? 'selected' : ''}>256 kbps</option>
          <option value="320" ${settings.audioBitrate === 320 ? 'selected' : ''}>320 kbps</option>
        </select>`}${icon('chevronDown', 12)}</div>
      </div>` : `<div class="audio-disabled-row">${icon('volumeX', 12)} 输出将不包含音频轨道 · 预览已静音</div>`}
    </div>

    <div class="advanced-block">
      <button class="advanced-toggle" data-action="toggle-advanced"><span>${icon('settings', 13)} 高级选项</span>${icon('chevronDown', 14, state.advancedOpen ? 'is-rotated' : '')}</button>
      <div class="advanced-body ${state.advancedOpen ? 'is-open' : ''}"><div class="advanced-inner">
        <label class="toggle-row"><span><strong>硬件加速</strong><small>${hardware ? `检测到 ${escapeHtml(hardware.label)}` : '未检测到可用硬件编码器'}</small></span>
          <button class="switch ${settings.hardware ? 'is-on' : ''}" role="switch" aria-checked="${settings.hardware}" data-toggle="hardware" ${!hardware || settings.videoCodec !== 'h264' ? 'disabled' : ''}><span class="switch-thumb"></span></button></label>
        <label class="toggle-row"><span><strong>流式优化</strong><small>MP4 / MOV 将 moov 前置，便于边下边播</small></span>
          <button class="switch ${settings.faststart ? 'is-on' : ''}" role="switch" aria-checked="${settings.faststart}" data-toggle="faststart" ${!['mp4', 'mov'].includes(settings.format) ? 'disabled' : ''}><span class="switch-thumb"></span></button></label>
        <div class="advanced-meta">${icon('zap', 12)}${hardware && settings.hardware && settings.videoCodec === 'h264' ? '硬件编码失败时自动回退 CPU，不中断任务' : '使用多线程 CPU 编码，稳定且兼容性最佳'}</div>
      </div></div>
    </div>

    <div class="output-block">
      <div class="quality-head"><div class="field-label"><span>输出位置</span></div><button class="text-button" data-action="choose-output" ${!file ? 'disabled' : ''}>更改</button></div>
      <div class="output-path">
        <div class="output-icon">${icon('hardDrive', 15)}</div>
        <div class="output-copy"><span class="output-name" title="${escapeHtml(outputPath)}">${outputPath ? escapeHtml(fileNameOf(outputPath)) : '选择素材后自动生成'}</span><span class="output-dir" title="${escapeHtml(outputPath)}">${outputPath ? escapeHtml(directoryOf(outputPath)) : '与源文件相同的目录'}</span></div>
        <button class="output-folder" data-action="show-output" title="打开输出位置">${icon('folder', 14)}</button>
      </div>
      <div class="default-folder">
        <div class="default-folder-copy">
          <span class="default-folder-label">${icon('folderSearch', 11)} 默认保存文件夹</span>
          <span class="default-folder-path" title="${escapeHtml(state.defaultOutputDir || '跟随源文件所在目录')}">${state.defaultOutputDir ? escapeHtml(state.defaultOutputDir) : '跟随源文件所在目录'}</span>
        </div>
        <div class="default-folder-actions">
          ${state.defaultOutputDir ? `<button class="default-folder-clear" data-action="clear-default-output" title="恢复跟随源文件">${icon('x', 11)}</button>` : ''}
          <button class="text-button default-folder-set" data-action="choose-default-output">${state.defaultOutputDir ? '更改默认' : '设为默认'}</button>
        </div>
      </div>
    </div>`

  hydrateIcons(root)
  renderDock()
}

function renderDock() {
  const dock = $('#inspector-dock')
  if (!dock) return
  const file = activeFile()
  const info = file?.info || null
  const ready = file?.status === 'ready' && Boolean(info)
  const settings = state.settings
  const isGif = settings.format === 'gif'
  const resolutionLabel = isGif
    ? '640px 宽 · 12.5 fps'
    : settings.resolution === 'source'
      ? (info ? `${Math.min(info.video.width, info.video.height)}p 原始` : '原始')
      : `${settings.resolution}p`
  const clip = editPlan(file)
  const trimmed = isFileTrimmed(file)
  const estimate = estimateSize(info, settings, ready ? clip.duration : undefined)
  dock.innerHTML = `
    <div id="dock-queue"></div>
    <div class="estimate-row dock-estimate">
      <div><span class="estimate-label">预计输出</span><strong id="estimate-value">${ready ? `约 ${formatBytes(estimate)}` : '—'}</strong></div>
      <div class="estimate-spec">${settings.format.toUpperCase()} · ${resolutionLabel}${isGif ? '' : ` · ${settings.audio ? `${settings.audioBitrate}k` : '无音轨'}`}${trimmed ? ` · 片段 ${formatTrimTime(clip.duration)}` : ''}</div>
    </div>
    <button class="convert-button" id="convert-button" data-action="start" ${!ready || state.starting ? 'disabled' : ''}>
      ${state.starting ? icon('loader', 17, 'spin') : '<span class="convert-dot"></span>'}
      <span>${state.starting ? '正在排队…' : trimmed ? '转换片段' : '开始转换'}</span>
      <span class="convert-right"><kbd>Ctrl ↵</kbd>${icon('arrowRight', 16)}</span>
    </button>
    <div class="convert-note">文件只在本机处理 · 原文件不会被修改</div>`
  hydrateIcons(dock)
  renderQueue()
}

function renderQueue() {
  const slot = $('#dock-queue')
  if (!slot) return
  if (!state.jobs.length) { slot.innerHTML = ''; return }
  const finishedCount = state.jobs.filter((job) => ['done', 'failed', 'cancelled'].includes(job.status)).length
  const activeJobs = state.jobs
    .filter((job) => ['running', 'queued'].includes(job.status))
    .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)))
  const finishedJobs = state.jobs
    .filter((job) => !['running', 'queued'].includes(job.status))
    .sort((a, b) => String(b.finishedAt || b.createdAt).localeCompare(String(a.finishedAt || a.createdAt)))
  const jobs = [...activeJobs, ...finishedJobs].slice(0, 2)
  slot.innerHTML = `<div class="queue-block dock-queue-block">
    <div class="queue-head"><span><span class="queue-live-dot"></span>转换队列 <b>${state.jobs.length}</b></span>${finishedCount ? '<button class="text-button" data-action="clear-finished">清除已完成</button>' : ''}</div>
    <div class="queue-list">${jobs.map((job) => {
      const stateIcon = job.status === 'running' ? icon('loader', 11, 'spin') : job.status === 'queued' ? '排队' : job.status === 'done' ? icon('check', 11) : job.status === 'failed' ? icon('alert', 11) : icon('x', 11)
      const meta = job.status === 'running'
        ? `${Math.round(job.progress)}% · ${job.speed ? `${job.speed.toFixed(2)}×` : '连接中'}${job.eta ? ` · 剩余 ${escapeHtml(job.eta)}` : ''}`
        : job.status === 'done'
          ? `${escapeHtml(job.sizeLabel)} · ${job.usedHardware ? escapeHtml(job.hardwareLabel) : 'CPU 编码'}`
          : job.status === 'failed'
            ? escapeHtml(job.error.slice(0, 74))
            : job.status === 'cancelled' ? '已取消' : '等待开始'
      const action = job.status === 'running' || job.status === 'queued'
        ? `<button class="queue-action" data-job-cancel="${job.id}" title="取消任务">${icon('x', 12)}</button>`
        : job.status === 'done'
          ? `<button class="queue-action is-open" data-job-open="${job.id}" title="打开输出位置">${icon('folder', 12)}</button>`
          : ''
      return `<div class="queue-item is-${job.status}">
        <div class="queue-item-head"><span class="job-state job-${job.status}">${stateIcon}</span>
          <div class="queue-copy"><span class="queue-name" title="${escapeHtml(job.outputName)}">${escapeHtml(job.outputName)}</span><span class="queue-meta">${meta}</span></div>${action}</div>
        <div class="job-progress"><span style="width:${job.status === 'done' ? 100 : job.progress}%"></span></div>
      </div>`
    }).join('')}</div>
  </div>`
  hydrateIcons(slot)
}

function renderTitleMeta() {
  $('#menu-job-count').hidden = !state.jobs.length
  $('#menu-job-count').textContent = String(state.jobs.length)
  const running = state.jobs.find((job) => job.status === 'running')
  $('#menu-job-status').textContent = running ? `正在处理 ${running.sourceName}` : '当前没有进行中的任务'
  $('#menu-job-dot').classList.toggle('is-busy', Boolean(running))
  $('#menu-history-count').textContent = String(state.history.length)
  $('#history-badge').hidden = !state.history.length
  $('#history-badge').textContent = String(Math.min(state.history.length, 9))
  $('#menu-engine').textContent = state.bootstrap?.ffmpeg.ready ? '已就绪' : '异常'
  const showOutput = $('[data-action="show-output"]')
  if (showOutput) showOutput.disabled = !state.outputPath
  const clearFinished = $('[data-action="clear-finished"]')
  if (clearFinished) clearFinished.disabled = !state.jobs.some((job) => ['done', 'failed', 'cancelled'].includes(job.status))
}

function renderStatus() {
  const engine = state.bootstrap?.ffmpeg
  const running = state.jobs.find((job) => job.status === 'running')
  $('#status-dot').className = `status-dot ${engine ? (engine.ready ? 'is-ready' : 'is-error') : ''}`
  $('#status-engine').textContent = engine ? (engine.ready ? '引擎就绪' : '引擎异常') : '引擎检测中'
  $('#status-version').textContent = `FFmpeg ${engine?.ffmpegVersion?.split('-')[0] || '—'}`
  $('#status-hw').innerHTML = `${icon('cpu', 11)}${escapeHtml(engine?.hardware?.label || 'CPU 编码')}`
  $('#status-job').innerHTML = running
    ? `<span class="status-job">${icon('zap', 11)}正在转换 ${Math.round(running.progress)}%</span>`
    : `<span class="status-idle">${state.jobs.length ? `${state.jobs.length} 个任务` : '空闲'}</span>`
  $('#status-app-version').textContent = `v${state.bootstrap?.version || '1.0.0'}`
  $('#history-badge').hidden = !state.history.length
}

function renderInspector() {
  renderSettings()
  renderQueue()
}

function renderAll() {
  renderSourceRail()
  renderPreview()
  renderInspector()
  renderTitleMeta()
  renderStatus()
}

/* ---------- file actions ---------- */

async function addFiles(paths) {
  const known = new Set(state.files.map((file) => file.path.toLowerCase()))
  const unique = [...new Set(paths)].filter((filePath) => filePath && !known.has(filePath.toLowerCase()))
  if (!unique.length) return
  const items = unique.map((filePath) => ({
    id: makeId(), path: filePath, name: fileNameOf(filePath), status: 'loading', info: null, error: ''
  }))
  const firstNew = !state.activeId
  state.files.push(...items)
  if (firstNew) {
    state.activeId = items[0].id
    state.outputEdited = false
    state.outputPath = preferredOutputPath(items[0].path, state.settings.format)
  }
  renderSourceRail()
  if (firstNew) { renderPreview(); renderSettings() }
  renderTitleMeta()

  await Promise.all(items.map(async (item) => {
    try {
      const info = await api.probeMedia(item.path)
      const file = state.files.find((entry) => entry.id === item.id)
      if (!file) return
      file.status = 'ready'
      file.info = info
      file.clips = [{ id: makeClipId(), start: 0, end: Number(info.duration) || 0 }]
      file.selectedClipId = file.clips[0].id
      renderSourceRail()
      if (item.id === state.activeId) {
        renderPreview()
        renderSettings()
        renderTitleMeta()
      }
    } catch (error) {
      const file = state.files.find((entry) => entry.id === item.id)
      if (!file) return
      file.status = 'error'
      file.error = errorMessage(error)
      renderSourceRail()
      if (item.id === state.activeId) { renderPreview(); renderSettings() }
      showToast('error', `无法读取 ${item.name}`, errorMessage(error))
    }
  }))
}

async function openFilesDialog() {
  try {
    const paths = await api.openMediaDialog()
    if (paths.length) await addFiles(paths)
  } catch (error) {
    showToast('error', '打开文件失败', errorMessage(error))
  }
}

function selectFile(id) {
  const file = state.files.find((entry) => entry.id === id)
  if (!file) return
  state.activeId = id
  state.outputEdited = false
  state.outputPath = preferredOutputPath(file.path, state.settings.format)
  renderSourceRail()
  renderPreview()
  renderSettings()
  renderTitleMeta()
}

function removeFile(id) {
  const wasActive = state.activeId === id
  state.files = state.files.filter((file) => file.id !== id)
  if (wasActive) {
    const next = state.files[0] || null
    state.activeId = next?.id || null
    state.outputPath = next && !state.outputEdited ? preferredOutputPath(next.path, state.settings.format) : ''
    renderPreview()
    renderSettings()
  }
  renderSourceRail()
  renderTitleMeta()
}

/* ---------- settings actions ---------- */

function updateSettings(patch, options = {}) {
  const previousFormat = state.settings.format
  const next = { ...state.settings, ...patch }
  if (patch.format) {
    if (!FORMAT_CODECS[patch.format].includes(next.videoCodec)) next.videoCodec = FORMAT_CODECS[patch.format][0]
  }
  if (patch.format === 'webm') { next.audioCodec = 'opus'; next.faststart = false }
  if (patch.format === 'mp4' || patch.format === 'mov') {
    next.faststart = true
    next.audioCodec = 'aac'
  }
  if (patch.videoCodec === 'prores') {
    next.format = 'mov'; next.audioCodec = 'aac'; next.faststart = true; next.audio = true
  }
  if (patch.format === 'gif') { next.videoCodec = 'gif'; next.audio = false }
  if (patch.format && patch.format !== 'gif' && previousFormat === 'gif') {
    next.audio = true
  }
  if (next.format === 'mp4' || next.format === 'mov') next.audioCodec = 'aac'
  if (next.format === 'webm') next.audioCodec = 'opus'
  const file = activeFile()
  if (file && next.format !== previousFormat) {
    state.outputPath = state.outputEdited && state.outputPath
      ? outputPathWithFormat(state.outputPath, next.format)
      : preferredOutputPath(file.path, next.format)
  }
  state.settings = next
  if (!options.keepPreset) state.preset = 'custom'
  if (!options.skipRender) renderSettings()
  renderTitleMeta()
  syncPreviewAudio()
  if (ui.qualityPreview.open) {
    if (next.format === 'gif' || next.videoCodec === 'prores') {
      closeQualityPreview()
    } else if (Object.keys(patch).some((key) => ['format', 'videoCodec', 'resolution', 'fps', 'hardware'].includes(key))) {
      scheduleQualityPreview(350)
    }
  }
}

function applyPreset(id) {
  const preset = PRESETS[id]
  const file = activeFile()
  state.preset = id
  state.settings = {
    ...state.settings,
    ...preset,
    fps: state.settings.fps,
    audio: true,
    audioCodec: 'aac',
    faststart: true
  }
  if (file) {
    state.outputPath = state.outputEdited && state.outputPath
      ? outputPathWithFormat(state.outputPath, state.settings.format)
      : preferredOutputPath(file.path, state.settings.format)
  }
  renderSettings()
  if (ui.qualityPreview.open) {
    if (state.settings.format === 'gif' || state.settings.videoCodec === 'prores') closeQualityPreview()
    else scheduleQualityPreview(200)
  }
}

async function chooseOutput() {
  try {
    const chosen = await api.chooseOutput({ format: state.settings.format, defaultPath: state.outputPath })
    if (chosen) {
      state.outputPath = outputPathWithFormat(chosen, state.settings.format)
      state.outputEdited = true
      renderSettings()
      renderTitleMeta()
    }
  } catch (error) {
    showToast('error', '无法选择输出路径', errorMessage(error))
  }
}

async function chooseDefaultOutput() {
  try {
    const directory = await api.chooseDefaultOutput()
    if (!directory) return
    state.defaultOutputDir = directory
    if (activeFile() && !state.outputEdited) {
      state.outputPath = preferredOutputPath(activeFile().path, state.settings.format)
    }
    renderSettings()
    showToast('success', '默认保存文件夹已更新', directory)
  } catch (error) {
    showToast('error', '无法设置默认文件夹', errorMessage(error))
  }
}

async function clearDefaultOutput() {
  try {
    await api.clearDefaultOutput()
    state.defaultOutputDir = ''
    if (activeFile() && !state.outputEdited) {
      state.outputPath = preferredOutputPath(activeFile().path, state.settings.format)
    }
    renderSettings()
    showToast('info', '已恢复为跟随源文件目录')
  } catch (error) {
    showToast('error', '无法恢复默认位置', errorMessage(error))
  }
}

async function startConversion() {
  if (state.starting) return
  const file = activeFile()
  if (!file || file.status !== 'ready' || !file.info) {
    showToast('info', '请先选择一个可用视频')
    return
  }
  if (!state.outputPath) {
    showToast('error', '请先设置输出位置')
    return
  }
  const clip = editPlan(file)
  if (file.info.duration && clip.duration < 0.2) {
    showToast('error', '剪辑片段太短', '至少需要保留 0.2 秒')
    return
  }
  state.starting = true
  renderSettings()
  try {
    await api.startConversion({
      sourcePath: file.path,
      outputPath: state.outputPath,
      meta: file.info,
      clips: clip.clips.map((item) => ({ start: item.start, end: item.end })),
      settings: state.settings
    })
    const trimmed = isFileTrimmed(file)
    showToast('info', '已加入转换队列', `${file.name} → ${state.settings.format.toUpperCase()}${trimmed ? ` · 片段 ${formatTrimTime(clip.duration)}` : ''}`)
  } catch (error) {
    showToast('error', '无法开始转换', errorMessage(error))
  } finally {
    state.starting = false
    renderSettings()
  }
}

/* ---------- jobs ---------- */

function handleJobs(jobs) {
  const previous = new Map(state.jobs.map((job) => [job.id, job.status]))
  state.jobs = jobs
  const finished = jobs.filter((job) => previous.get(job.id) && previous.get(job.id) !== job.status && job.status === 'done')
  const failed = jobs.filter((job) => previous.get(job.id) && previous.get(job.id) !== job.status && job.status === 'failed')
  for (const job of finished) showToast('success', '转换完成', `${job.outputName} · ${job.sizeLabel}`)
  for (const job of failed) showToast('error', '转换失败', job.error || job.outputName)
  renderQueue()
  renderTitleMeta()
  renderStatus()
}

async function cancelJob(id) {
  try { await api.cancelConversion(id) } catch (error) { showToast('error', '取消失败', errorMessage(error)) }
}

async function clearFinished() {
  try { await api.clearFinishedJobs(); renderTitleMeta() } catch (error) { showToast('error', '操作失败', errorMessage(error)) }
  closeMenus()
}

/* ---------- toasts ---------- */

function showToast(tone, title, detail = '') {
  const stack = $('#toast-stack')
  const node = document.createElement('div')
  node.className = `toast tone-${tone}`
  const iconName = tone === 'success' ? 'check' : tone === 'error' ? 'alert' : 'info'
  node.innerHTML = `<span class="toast-icon">${icon(iconName, 13)}</span>
    <div class="toast-copy"><strong>${escapeHtml(title)}</strong>${detail ? `<span>${escapeHtml(detail)}</span>` : ''}</div>
    <button class="toast-close" aria-label="关闭提示">${icon('x', 12)}</button>`
  stack.appendChild(node)
  const remove = () => { node.remove() }
  node.querySelector('.toast-close').addEventListener('click', remove)
  setTimeout(remove, tone === 'error' ? 6500 : 4200)
  while (stack.children.length > 4) stack.firstElementChild.remove()
}

/* ---------- menus & modals ---------- */

function closeMenus() {
  $$('.menu-popover').forEach((menu) => { menu.hidden = true })
  $$('.menu-trigger').forEach((button) => button.classList.remove('is-open'))
}

function toggleMenu(name) {
  const menu = $(`#menu-${name}`)
  const button = $(`.menu-trigger[data-menu="${name}"]`)
  const willOpen = menu.hidden
  closeMenus()
  if (willOpen) {
    menu.hidden = false
    button.classList.add('is-open')
    renderTitleMeta()
  }
}

function openModal(kind) {
  closeMenus()
  state.modal = kind
  const root = $('#modal-root')
  if (kind === 'history') root.innerHTML = historyModalHtml()
  if (kind === 'shortcuts') root.innerHTML = shortcutsModalHtml()
  if (kind === 'about') root.innerHTML = aboutModalHtml()
  hydrateIcons(root)
  root.querySelector('.modal-backdrop')?.addEventListener('mousedown', (event) => {
    if (event.target === event.currentTarget) closeModal()
  })
  root.querySelector('.modal-close')?.addEventListener('click', closeModal)
}

function closeModal() {
  state.modal = null
  $('#modal-root').innerHTML = ''
}

function historyModalHtml() {
  const rows = state.history.map((entry) => `<div class="history-row">
    <div class="history-format">${escapeHtml(entry.format.toUpperCase())}</div>
    <div class="history-main"><strong>${escapeHtml(entry.outputName)}</strong><span>来自 ${escapeHtml(entry.sourceName)} · ${escapeHtml(CODEC_LABEL[entry.videoCodec] || entry.videoCodec)}${entry.hardware ? ` · ${escapeHtml(entry.hardware)}` : ''}</span></div>
    <div class="history-meta"><strong>${escapeHtml(entry.sizeLabel)}</strong><span>${entry.finishedAt ? new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(entry.finishedAt)) : '—'}</span></div>
    <button class="icon-button" data-history-open="${escapeHtml(entry.outputPath)}" title="打开输出位置">${icon('folder', 14)}</button>
  </div>`).join('')
  return `<div class="modal-backdrop"><div class="modal" style="width:760px" role="dialog" aria-modal="true">
    <button class="modal-close" aria-label="关闭">${icon('x', 15)}</button>
    <div class="modal-head"><span class="modal-icon">${icon('history', 18)}</span><div><span class="eyebrow">CONVERSION LOG</span><h2>转换记录</h2></div><span class="modal-head-meta">${state.history.length} 条</span></div>
    <div class="history-list">${rows || `<div class="history-empty">${icon('history', 24)}<strong>还没有转换记录</strong><span>完成的输出会保留在这里，方便再次找到文件。</span></div>`}</div>
    <div class="modal-footer"><span class="modal-footnote">${icon('folder', 12)}记录仅保存在本机 · ${escapeHtml(state.bootstrap?.userData || '')}</span>${state.history.length ? `<button class="danger-button" id="clear-history">${icon('trash', 13)}清空记录</button>` : ''}</div>
  </div></div>`
}

function shortcutsModalHtml() {
  const rows = [
    ['添加视频', ['Ctrl', 'O']], ['开始转换', ['Ctrl', 'Enter']], ['播放 / 暂停预览', ['Space']],
    ['在播放头处分割片段', ['Ctrl', 'B']], ['撤销剪辑操作', ['Ctrl', 'Z']], ['重做剪辑操作', ['Ctrl', 'Shift', 'Z']],
    ['拖动白线定位', ['鼠标拖动']], ['双击白线分割', ['双击']],
    ['关闭菜单或弹窗', ['Esc']], ['最小化窗口', ['Alt', 'Space']]
  ]
  return `<div class="modal-backdrop"><div class="modal" style="width:520px" role="dialog" aria-modal="true">
    <button class="modal-close" aria-label="关闭">${icon('x', 15)}</button>
    <div class="modal-head"><span class="modal-icon">${icon('keyboard', 18)}</span><div><span class="eyebrow">KEYBOARD</span><h2>快捷键</h2></div></div>
    <div class="shortcut-list">${rows.map(([label, keys]) => `<div class="shortcut-row"><span>${label}</span><div>${keys.map((key) => `<kbd class="kbd">${key}</kbd>`).join('')}</div></div>`).join('')}</div>
    <p class="modal-note">在预览区域按空格可暂停或继续播放，输入框聚焦时不会触发。</p>
  </div></div>`
}

function aboutModalHtml() {
  const engine = state.bootstrap?.ffmpeg
  return `<div class="modal-backdrop"><div class="modal" style="width:560px" role="dialog" aria-modal="true">
    <button class="modal-close" aria-label="关闭">${icon('x', 15)}</button>
    <div class="about-hero">${logoHtml(48)}<span class="eyebrow">LOCAL-FIRST VIDEO TOOL</span><h2>帧渡 <em>FRAMEFERRY</em></h2><p>把视频安全地摆渡到另一种格式。没有上传，没有账号，也没有等待。</p></div>
    <div class="about-grid">
      <div><span>版本</span><strong>v${escapeHtml(state.bootstrap?.version || '1.0.0')}</strong></div>
      <div><span>渲染引擎</span><strong>FFmpeg ${escapeHtml(engine?.ffmpegVersion?.split('-')[0] || '—')}</strong></div>
      <div><span>编码路径</span><strong>${escapeHtml(engine?.hardware?.label || 'CPU x264')}</strong></div>
      <div><span>运行平台</span><strong>${state.bootstrap?.platform === 'win32' ? 'Windows' : escapeHtml(state.bootstrap?.platform || '—')}</strong></div>
    </div>
    <div class="about-note">${icon('info', 13)}所有素材、缩略图、转换记录都保存在本机。应用不会请求网络接口。</div>
    <div class="about-stack"><span>Electron</span><span>Vanilla JS</span><span>FFmpeg</span><span>Local-first</span></div>
  </div></div>`
}

/* ---------- window / events ---------- */

function bindEvents() {
  $('#brand-logo').innerHTML = logoHtml(30)
  hydrateIcons(document)

  $('#add-files').addEventListener('click', () => void openFilesDialog())
  $('#import-card').addEventListener('click', () => void openFilesDialog())
  $('#system-player').addEventListener('click', () => {
    const file = activeFile()
    if (file) void api.openPath(file.path)
  })

  $('#preview-body').addEventListener('wheel', (event) => {
    const file = activeFile()
    if (!file?.info) return
    if (!event.target.closest('#clip-timeline, .clip-ruler')) return
    if (!(event.ctrlKey || event.metaKey || event.shiftKey)) return
    const stage = $('#clip-stage')
    if (!stage) return
    event.preventDefault()
    const view = clipView(file)
    const hadScrollbar = view.zoom > 1.01
    const rect = stage.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    const direction = event.deltaY || event.deltaX || 0
    if (event.ctrlKey || event.metaKey) {
      const anchor = view.start + ratio * view.duration
      const factor = direction < 0 ? 1.25 : 0.8
      const zoom = Math.min(20, Math.max(1, view.zoom * factor))
      const duration = view.baseDuration / zoom
      const start = Math.min(
        Math.max(0, anchor - ratio * duration),
        Math.max(0, view.baseDuration - duration)
      )
      if (zoom === view.zoom && Math.abs(start - view.start) < 0.001) return
      file.timelineView = { zoom, start }
    } else {
      const delta = (direction / 600) * view.duration
      const start = Math.min(
        Math.max(0, view.start + delta),
        Math.max(0, view.baseDuration - view.duration)
      )
      if (Math.abs(start - view.start) < 0.001) return
      file.timelineView = { zoom: view.zoom, start }
    }
    if (hadScrollbar && file.timelineView.zoom > 1.01) refreshTimelineView(file)
    else renderTrimUI()
  }, { passive: false })

  $('#history-button').addEventListener('click', () => openModal('history'))
  $('#reset-settings').addEventListener('click', () => {
    state.settings = { ...DEFAULT_SETTINGS }
    state.preset = 'balanced'
    state.outputEdited = false
    if (activeFile()) state.outputPath = preferredOutputPath(activeFile().path, state.settings.format)
    renderSettings()
  })

  $$('.menu-trigger').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation()
      toggleMenu(button.dataset.menu)
    })
  })
  document.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('#app-menu')) closeMenus()
  })
  $$('.menu-item').forEach((item) => {
    item.addEventListener('click', () => handleAction(item.dataset.action))
  })
  $$('[data-window]').forEach((button) => {
    button.addEventListener('click', async () => {
      if (button.dataset.window === 'minimize') await api.minimizeWindow()
      if (button.dataset.window === 'maximize') {
        state.maxed = await api.toggleMaximizeWindow()
        $('#maximize-icon').innerHTML = icon(state.maxed ? 'copy' : 'square', 12)
      }
      if (button.dataset.window === 'close') await api.closeWindow()
    })
  })
  api.onWindowState((payload) => {
    state.maxed = Boolean(payload.maximized)
    $('#maximize-icon').innerHTML = icon(state.maxed ? 'copy' : 'square', 12)
  })

  $('#file-list').addEventListener('click', (event) => {
    const remove = event.target.closest('[data-remove-id]')
    if (remove) { event.stopPropagation(); removeFile(remove.dataset.removeId); return }
    const card = event.target.closest('[data-file-id]')
    if (card) selectFile(card.dataset.fileId)
  })
  $('#file-list').addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    const remove = event.target.closest('[data-remove-id]')
    if (remove) { event.preventDefault(); removeFile(remove.dataset.removeId); return }
    const card = event.target.closest('[data-file-id]')
    if (card) { event.preventDefault(); selectFile(card.dataset.fileId) }
  })

  $('#preview-body').addEventListener('click', (event) => {
    if (event.target.closest('#empty-stage')) void openFilesDialog()
    if (event.target.closest('[data-action="add-files"]')) { event.stopPropagation(); void openFilesDialog() }
    if (event.target.closest('[data-action="show-source"]')) {
      const file = activeFile()
      if (file) void api.showItemInFolder(file.path)
    }
  })

  $('#preview-body').addEventListener('change', (event) => {
    if (event.target.id !== 'quality-preview-length' || !ui.qualityPreview.open) return
    const length = Number(event.target.value)
    if (!Number.isFinite(length)) return
    ui.qualityPreview.length = Math.max(3, Math.min(20, length))
    void generateQualityPreview()
  })

  $('#preview-body').addEventListener('click', (event) => {
    const qualityAction = event.target.closest('[data-quality-preview-action]')?.dataset.qualityPreviewAction
    if (qualityAction === 'close') { closeQualityPreview(); return }
    if (qualityAction === 'refresh') {
      if (ui.qualityPreview.open) void generateQualityPreview()
      return
    }
    const button = event.target.closest('[data-clip-action]')
    if (!button || button.disabled) return
    handleClipAction(button.dataset.clipAction)
  })

  let lastTimelineClick = { at: 0, x: 0, y: 0 }
  $('#preview-body').addEventListener('pointerdown', (event) => {
    const timelineElement = event.target.closest('#clip-timeline')
    if (timelineElement && !event.target.closest('.clip-handle, .playhead-grip')) {
      const now = performance.now()
      if (
        now - lastTimelineClick.at < 360 &&
        Math.hypot(event.clientX - lastTimelineClick.x, event.clientY - lastTimelineClick.y) < 8
      ) {
        lastTimelineClick = { at: 0, x: 0, y: 0 }
        const file = activeFile()
        const video = $('#preview-video')
        if (file?.info && video) {
          const rect = ($('#clip-stage') || timelineElement).getBoundingClientRect()
          const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
          const view = clipView(file)
          const time = nearestClipTime(file, view.start + ratio * view.duration)
          video.pause()
          video.currentTime = time
          ui.currentTime = time
          paintTrimPlayhead()
          handleClipAction('split')
        }
        return
      }
      lastTimelineClick = { at: now, x: event.clientX, y: event.clientY }
    }

    const scrollbar = event.target.closest('#timeline-scrollbar')
    if (scrollbar && event.button === 0) {
      const file = activeFile()
      if (!file?.info) return
      const view = clipView(file)
      const thumb = $('#timeline-scroll-thumb')
      if (!thumb || view.baseDuration <= view.duration) return
      const trackRect = scrollbar.getBoundingClientRect()
      const thumbRect = thumb.getBoundingClientRect()
      const maxStart = view.baseDuration - view.duration
      const travel = Math.max(1, trackRect.width - thumbRect.width)
      const onThumb = Boolean(event.target.closest('#timeline-scroll-thumb'))
      const grab = onThumb ? event.clientX - thumbRect.left : thumbRect.width / 2
      event.preventDefault()
      const apply = (clientX) => {
        const left = Math.min(travel, Math.max(0, clientX - trackRect.left - grab))
        const start = (left / travel) * maxStart
        file.timelineView = { zoom: view.zoom, start }
        refreshTimelineView(file)
      }
      if (!onThumb) apply(event.clientX)
      const move = (pointerEvent) => apply(pointerEvent.clientX)
      const up = () => {
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
      return
    }

    const grip = event.target.closest('.playhead-grip')
    if (grip) {
      const file = activeFile()
      const timeline = $('#clip-stage')
      const video = $('#preview-video')
      if (!file?.info || !timeline) return
      const view = clipView(file)
      event.preventDefault()
      video?.pause()
      const timeAt = (pointerEvent) => {
        const rect = timeline.getBoundingClientRect()
        const ratio = Math.min(1, Math.max(0, (pointerEvent.clientX - rect.left) / rect.width))
        return nearestClipTime(file, view.start + ratio * view.duration)
      }
      const move = (pointerEvent) => {
        const time = timeAt(pointerEvent)
        if (video) video.currentTime = time
        ui.currentTime = time
        paintTrimPlayhead()
      }
      const up = () => {
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
      return
    }
    let handle = event.target.closest('.clip-handle')
    if (!handle) {
      const block = event.target.closest('.clip-block.is-selected')
      if (block) {
        const rect = block.getBoundingClientRect()
        const fromLeft = event.clientX - rect.left
        const fromRight = rect.right - event.clientX
        if (Math.min(fromLeft, fromRight) <= 24) {
          handle = block.querySelector(fromLeft <= fromRight ? '.clip-handle-start' : '.clip-handle-end')
        }
      }
    }
    if (!handle) return
    const file = activeFile()
    const block = handle.closest('.clip-block')
    const timeline = $('#clip-stage')
    const video = $('#preview-video')
    if (!file?.info || !block || !timeline) return
    const clips = ensureClips(file)
    const clip = clips.find((item) => item.id === block.dataset.clipId)
    if (!clip) return
    const index = clips.indexOf(clip)
    const duration = Number(file.info.duration) || 0
    const view = clipView(file)
    const which = handle.dataset.clipHandle
    const prevEnd = index > 0 ? clips[index - 1].end : 0
    const nextStart = index < clips.length - 1 ? clips[index + 1].start : duration
    event.preventDefault()
    event.stopPropagation()
    video?.pause()

    const timeAt = (pointerEvent) => {
      const rect = timeline.getBoundingClientRect()
      const ratio = Math.min(1, Math.max(0, (pointerEvent.clientX - rect.left) / rect.width))
      return view.start + ratio * view.duration
    }
    const tipPosition = () => Math.min(94, Math.max(6, duration ? ((which === 'start' ? clip.start : clip.end) / duration) * 100 : 50))
    const tip = $('#clip-trim-tip')
    if (tip) {
      tip.hidden = false
      tip.textContent = formatTrimTime(clip.end - clip.start)
      tip.style.left = `${tipPosition()}%`
    }
    let historyPushed = false
    const refresh = () => {
      const left = duration ? (clip.start / duration) * 100 : 0
      block.style.left = `${left}%`
      block.style.width = `${Math.max(0, (duration ? (clip.end / duration) * 100 : 0) - left)}%`
      const blockDuration = $('.clip-block-duration', block)
      if (blockDuration) blockDuration.textContent = formatTrimTime(clip.end - clip.start)
      const range = $('#clip-selected-range')
      const selectedDuration = $('#clip-selected-duration')
      const total = $('#clip-total-duration')
      if (range) range.textContent = `${formatTrimTime(clip.start)} → ${formatTrimTime(clip.end)}`
      if (selectedDuration) selectedDuration.textContent = formatTrimTime(clip.end - clip.start)
      if (total) total.textContent = formatTrimTime(clips.reduce((sum, item) => sum + (item.end - item.start), 0))
      if (tip) {
        tip.textContent = formatTrimTime(clip.end - clip.start)
        tip.style.left = `${tipPosition()}%`
      }
      paintTrimPlayhead()
      paintOutputTimeline(file)
    }
    const move = (pointerEvent) => {
      const time = timeAt(pointerEvent)
      if (!historyPushed) {
        pushClipHistory(file)
        historyPushed = true
      }
      if (which === 'start') {
        clip.start = Math.max(prevEnd, Math.min(time, clip.end - 0.2))
      } else {
        clip.end = Math.min(nextStart, Math.max(time, clip.start + 0.2))
      }
      // 裁剪时只移动片段边界，播放头/分割线保持原位，不跟着手柄跑。
      refresh()
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      clampPreviewToClips(file)
      renderTrimUI()
      renderDock()
      renderSourceRail()
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  })

  $('#settings-root').addEventListener('click', (event) => {
    const preset = event.target.closest('[data-preset]')
    if (preset) { applyPreset(preset.dataset.preset); return }
    const format = event.target.closest('[data-format]')
    if (format) { updateSettings({ format: format.dataset.format }); return }
    const toggle = event.target.closest('[data-toggle]')
    if (toggle) {
      const key = toggle.dataset.toggle
      if (key === 'audio') updateSettings({ audio: !state.settings.audio })
      if (key === 'hardware') updateSettings({ hardware: !state.settings.hardware })
      if (key === 'faststart') updateSettings({ faststart: !state.settings.faststart })
      return
    }
    const action = event.target.closest('[data-action]')?.dataset.action
    if (!action) return
    if (action === 'toggle-advanced') { state.advancedOpen = !state.advancedOpen; renderSettings(); return }
    if (action === 'choose-output') { void chooseOutput(); return }
    if (action === 'choose-default-output') { void chooseDefaultOutput(); return }
    if (action === 'clear-default-output') { void clearDefaultOutput(); return }
    if (action === 'quality-preview') { openQualityPreview(); return }
    if (action === 'start') { void startConversion(); return }
    if (action === 'show-output') {
      if (state.outputPath) void api.showItemInFolder(state.outputPath)
      else showToast('info', '还没有输出文件')
    }
  })

  $('#settings-root').addEventListener('change', (event) => {
    const select = event.target.closest('[data-select]')
    if (!select) return
    const key = select.dataset.select
    const value = select.value
    if (key === 'codec') updateSettings({ videoCodec: value })
    if (key === 'resolution') updateSettings({ resolution: value === 'source' ? 'source' : Number(value) })
    if (key === 'fps') updateSettings({ fps: value === 'source' ? 'source' : Number(value) })
    if (key === 'audioCodec') updateSettings({ audioCodec: value })
    if (key === 'audioBitrate') updateSettings({ audioBitrate: Number(value) })
  })

  $('#settings-root').addEventListener('input', (event) => {
    const slider = event.target.closest('#quality-slider')
    if (!slider) return
    const sliderValue = Number(slider.value)
    const quality = 46 - sliderValue
    state.settings.quality = quality
    state.preset = 'custom'
    const percent = Math.min(100, Math.max(0, ((sliderValue - 16) / 14) * 100))
    slider.style.background = `linear-gradient(90deg,var(--accent) 0%,var(--accent) ${percent}%,rgba(255,255,255,.16) ${percent}%)`
    $('#quality-value').textContent = `CRF ${quality}`
    const estimate = estimateSize(activeInfo(), state.settings, editPlan(activeFile()).duration)
    if (activeInfo()) $('#estimate-value').textContent = `约 ${formatBytes(estimate)}`
    const note = quality <= 18 ? '接近视觉无损，适合归档与二次剪辑' : quality <= 22 ? '画质与体积的平衡点，日常分享推荐' : '优先压缩体积，适合即时通讯与网页'
    $('#quality-note').innerHTML = `${icon('sparkles', 12)}${note}`
    if (ui.qualityPreview.open) scheduleQualityPreview(500)
  })
  $('#settings-root').addEventListener('change', (event) => {
    if (event.target.id === 'quality-slider') renderSettings()
  })

  $('#inspector-dock').addEventListener('click', (event) => {
    if (event.target.closest('[data-action="start"]')) { void startConversion(); return }
    const cancel = event.target.closest('[data-job-cancel]')
    if (cancel) { void cancelJob(cancel.dataset.jobCancel); return }
    const open = event.target.closest('[data-job-open]')
    if (open) {
      const job = state.jobs.find((item) => item.id === open.dataset.jobOpen)
      if (job) void api.showItemInFolder(job.outputPath)
      return
    }
    if (event.target.closest('[data-action="clear-finished"]')) void clearFinished()
  })

  $('#modal-root').addEventListener('click', (event) => {
    if (event.target.closest('.modal-close')) { closeModal(); return }
    const open = event.target.closest('[data-history-open]')
    if (open) { void api.showItemInFolder(open.dataset.historyOpen); return }
    if (event.target.closest('#clear-history')) {
      void api.clearHistory().then(() => {
        state.history = []
        renderTitleMeta()
        openModal('history')
      })
    }
  })

  // drag and drop
  const hasFiles = (event) => Array.from(event.dataTransfer?.types || []).includes('Files')
  window.addEventListener('dragenter', (event) => {
    if (!hasFiles(event)) return
    event.preventDefault()
    state.dragDepth += 1
    $('#drop-overlay').hidden = false
  })
  window.addEventListener('dragover', (event) => {
    if (!hasFiles(event)) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  })
  window.addEventListener('dragleave', (event) => {
    if (!hasFiles(event)) return
    event.preventDefault()
    state.dragDepth = Math.max(0, state.dragDepth - 1)
    if (state.dragDepth === 0) $('#drop-overlay').hidden = true
  })
  window.addEventListener('drop', (event) => {
    event.preventDefault()
    state.dragDepth = 0
    $('#drop-overlay').hidden = true
    const paths = Array.from(event.dataTransfer.files || []).map((file) => api.getPathForFile(file)).filter(Boolean)
    if (paths.length) void addFiles(paths)
  })

  // keyboard
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (ui.qualityPreview.open) { closeQualityPreview(); return }
      closeMenus(); closeModal(); return
    }
    if (ui.qualityPreview.open && event.code === 'Space') {
      const target = event.target
      if (target.closest('input, select, textarea, button, [contenteditable="true"]')) return
      event.preventDefault()
      const qualityVideo = $('#quality-preview-video')
      if (!qualityVideo) return
      if (qualityVideo.paused) void qualityVideo.play().catch(() => {})
      else qualityVideo.pause()
      return
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'o') {
      event.preventDefault(); void openFilesDialog(); return
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault(); if (!state.modal) void startConversion(); return
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
      if (state.modal) return
      if (event.target?.closest?.('input, select, textarea, [contenteditable="true"]')) return
      event.preventDefault()
      if (event.shiftKey) redoClip()
      else undoClip()
      return
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
      if (state.modal) return
      if (event.target?.closest?.('input, select, textarea, [contenteditable="true"]')) return
      event.preventDefault()
      redoClip()
      return
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
      if (state.modal) return
      event.preventDefault()
      handleClipAction('split')
      return
    }
    if (event.code === 'Space' && activeFile()?.status === 'ready') {
      const target = event.target
      if (target.closest('input, select, textarea, button, [contenteditable="true"]')) return
      if (state.modal) return
      event.preventDefault()
      const video = $('#preview-video')
      if (!video) return
      if (video.paused) void video.play().catch(() => {})
      else video.pause()
    }
  })
}

function handleAction(action) {
  closeMenus()
  if (action === 'add-files') void openFilesDialog()
  if (action === 'show-output') {
    if (state.outputPath) void api.showItemInFolder(state.outputPath)
    else showToast('info', '还没有输出文件')
  }
  if (action === 'quit') void api.closeWindow()
  if (action === 'history') openModal('history')
  if (action === 'clear-finished') void clearFinished()
  if (action === 'shortcuts') openModal('shortcuts')
  if (action === 'about') openModal('about')
}

/* ---------- bootstrap ---------- */

async function init() {
  bindEvents()
  renderSourceRail()
  renderPreview()
  renderSettings()
  renderQueue()
  renderTitleMeta()
  renderStatus()

  try {
    state.bootstrap = await api.getBootstrap()
    state.history = state.bootstrap.history || []
    state.defaultOutputDir = state.bootstrap.settings?.defaultOutputDir || ''
    state.maxed = Boolean(state.bootstrap.maximized)
    $('#maximize-icon').innerHTML = icon(state.maxed ? 'copy' : 'square', 12)
    state.jobs = await api.listJobs()
    api.onJobsUpdate(handleJobs)
    api.onHistoryUpdate((history) => { state.history = history; renderTitleMeta() })
    api.onOpenFiles((paths) => { void addFiles(paths) })
    renderTitleMeta()
    renderStatus()
    renderSettings()
    renderQueue()
    if (state.bootstrap.openFiles?.length) await addFiles(state.bootstrap.openFiles)
  } catch (error) {
    showToast('error', '应用初始化失败', errorMessage(error))
    renderStatus()
  }
}

init()
