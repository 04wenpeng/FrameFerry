/* FrameFerry renderer — zero-dependency desktop UI */
const api = window.frameferry

const ICONS = {
  plus: '<path d="M5 12h14M12 5v14"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  film: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none"/>',
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

function ensureTrim(file) {
  const duration = Number(file?.info?.duration) || 0
  if (!file) return { start: 0, end: 0 }
  if (!file.trim || !Number.isFinite(file.trim.start) || !Number.isFinite(file.trim.end)) {
    file.trim = { start: 0, end: duration }
  }
  file.trim.start = Math.max(0, Math.min(file.trim.start, duration))
  file.trim.end = Math.max(file.trim.start, Math.min(file.trim.end, duration))
  return file.trim
}

function clipRange(file) {
  const info = file?.info
  if (!info) return { start: 0, end: 0, duration: 0 }
  const trim = ensureTrim(file)
  return { start: trim.start, end: trim.end, duration: Math.max(0.2, trim.end - trim.start) }
}

function isFileTrimmed(file) {
  const info = file?.info
  if (!info) return false
  const trim = ensureTrim(file)
  return trim.start > 0.05 || trim.end < info.duration - 0.05
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
  trimMode: false,
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
  addCounter: 0
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
        ${file.status === 'ready' && info && isFileTrimmed(file) ? `<span class="source-meta is-trim">${icon('scissors', 9)} 片段 ${formatTrimTime(clipRange(file).duration)}</span>` : ''}
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

function previewSkeletonHtml() {
  return `<div class="video-stage"><div class="stage-loading"><span></span></div></div>
    <div class="filmstrip-shell"><div class="filmstrip-label"><span>关键帧</span><span>解析中</span></div><div class="filmstrip"><div class="filmstrip-placeholder"><span></span><span></span><span></span><span></span><span></span><span></span></div></div></div>
    <div class="asset-sheet"><div class="asset-sheet-skeleton"><span></span><span></span><span></span><span></span><span></span><span></span></div></div>`
}

function renderPreview() {
  const body = $('#preview-body')
  const file = activeFile()
  ui.previewToken += 1
  const token = ui.previewToken
  ui.playing = false
  ui.currentTime = 0
  ui.videoUrl = ''
  $('#preview-engine-text').textContent = '预览就绪'
  $('#preview-engine-chip').classList.remove('is-live')
  $('#system-player').disabled = !file
  $('#trim-toggle').disabled = !file?.info
  updateTrimToggle()

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
      <button class="stage-play" id="stage-play" aria-label="播放预览">${icon('play', 24)}<span class="play-ring"></span></button>
      <div class="stage-controls">
        <div class="timeline-wrap"><input class="timeline" id="timeline" type="range" min="0" max="${Math.max(info.duration, 0.1)}" step="0.01" value="0"></div>
        <div class="stage-control-row">
          <button class="stage-control" id="control-play" aria-label="播放">${icon('play', 15)}</button>
          <span class="stage-time"><span id="time-current">00:00</span> <i>/</i> ${escapeHtml(info.durationLabel)}</span>
          <span class="stage-control-spacer"></span>
          <button class="stage-control" id="control-mute" aria-label="静音">${icon('volume', 15)}</button>
          <button class="stage-control" id="control-fullscreen" aria-label="全屏">${icon('maximize', 14)}</button>
        </div>
      </div>
    </div>

    <div id="trim-slot"></div>

    <div class="filmstrip-shell">
      <div class="filmstrip-label"><span>关键帧</span><span>${escapeHtml(info.video.fpsLabel)}</span></div>
      <div class="filmstrip">
        ${info.filmstrip ? `<img src="${info.filmstrip}" alt="${escapeHtml(file.name)} 缩略帧">` : '<div class="filmstrip-placeholder"><span></span><span></span><span></span><span></span><span></span><span></span></div>'}
        <span class="filmstrip-index">00 — ${escapeHtml(info.durationLabel)}</span>
      </div>
    </div>

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

  const paintTimeline = () => {
    const max = Number(timeline.max) || info.duration || 0.1
    const ratio = Math.min(1, Math.max(0, ui.currentTime / max))
    timeline.value = String(ui.currentTime)
    timeline.style.background = `linear-gradient(90deg, var(--accent) ${ratio * 100}%, rgba(255,255,255,.2) ${ratio * 100}%)`
    $('#time-current').textContent = formatClock(ui.currentTime)
  }
  const paintPlay = () => {
    central.hidden = ui.playing
    controlPlay.innerHTML = ui.playing ? icon('pause', 15) : icon('play', 15)
    $('#preview-engine-text').textContent = ui.playing ? '正在播放' : '预览就绪'
    $('#preview-engine-chip').classList.toggle('is-live', ui.playing)
  }
  const togglePlay = async () => {
    try {
      if (video.paused) {
        const trim = ensureTrim(file)
        if (video.currentTime < trim.start - 0.01 || video.currentTime >= trim.end - 0.03) {
          video.currentTime = trim.start
          ui.currentTime = trim.start
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
    ui.currentTime = Math.min(Number(value), video.duration || info.duration)
    try { video.currentTime = ui.currentTime } catch {}
    paintTimeline()
  }

  video.addEventListener('play', () => { ui.playing = true; paintPlay() })
  video.addEventListener('pause', () => { ui.playing = false; paintPlay() })
  video.addEventListener('timeupdate', () => {
    ui.currentTime = video.currentTime
    const trim = ensureTrim(file)
    if (video.currentTime >= trim.end - 0.02 && ui.playing) {
      video.pause()
      video.currentTime = trim.end
      ui.currentTime = trim.end
    }
    paintTimeline()
    paintTrimPlayhead()
  })
  video.addEventListener('loadedmetadata', () => {
    ui.duration = video.duration || info.duration
    timeline.max = String(Math.max(ui.duration, 0.1))
    paintTimeline()
  })
  video.addEventListener('ended', () => { ui.playing = false; paintPlay() })
  central.addEventListener('click', togglePlay)
  controlPlay.addEventListener('click', togglePlay)
  timeline.addEventListener('input', (event) => seek(event.target.value))
  mute.addEventListener('click', () => {
    ui.muted = !ui.muted
    video.muted = ui.muted
    mute.innerHTML = icon(ui.muted ? 'volumeX' : 'volume', 15)
  })
  $('#control-fullscreen').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await stage.requestFullscreen()
    } catch {}
  })
  $('#asset-reset').addEventListener('click', () => seek(ensureTrim(file).start))
  timeline.addEventListener('mousedown', () => {})
  updateTrimToggle()
  renderTrimUI()
}

function updateTrimToggle() {
  const button = $('#trim-toggle')
  if (!button) return
  const ready = Boolean(activeFile()?.info)
  button.disabled = !ready
  button.classList.toggle('is-active', state.trimMode && ready)
  const label = $('#trim-toggle-label')
  if (label) label.textContent = state.trimMode && ready ? '完成剪辑' : '剪辑'
}

function paintTrimPlayhead() {
  const playhead = $('#trim-playhead')
  const info = activeFile()?.info
  if (!playhead || !info?.duration) return
  const ratio = Math.min(1, Math.max(0, ui.currentTime / info.duration))
  playhead.style.left = `${ratio * 100}%`
}

function renderTrimUI() {
  const slot = $('#trim-slot')
  if (!slot) return
  const file = activeFile()
  const info = file?.info
  if (!state.trimMode || !file || !info) {
    slot.innerHTML = ''
    updateTrimToggle()
    return
  }
  const trim = ensureTrim(file)
  const duration = Number(info.duration) || 0
  const startPct = duration ? (trim.start / duration) * 100 : 0
  const endPct = duration ? (trim.end / duration) * 100 : 100
  const clip = clipRange(file)

  slot.innerHTML = `<div class="trim-panel">
    <div class="trim-head">
      <div class="trim-head-copy">
        <span class="eyebrow">CLIP RANGE</span>
        <span class="trim-head-title">剪辑片段</span>
        <span class="trim-head-hint">拖动两端选择保留范围，转换时只导出这一段</span>
      </div>
      <div class="trim-toolbar">
        <button class="text-button" data-trim-action="preview">${icon('play', 11)} 预览片段</button>
        <button class="text-button" data-trim-action="reset">${icon('rotate', 11)} 重置</button>
        <button class="trim-done" data-trim-action="done">完成</button>
      </div>
    </div>
    <div class="trim-track" id="trim-track">
      ${info.filmstrip ? `<img class="trim-film" src="${info.filmstrip}" alt="">` : '<div class="trim-film trim-film-empty"></div>'}
      <div class="trim-mask trim-mask-left" style="width:${startPct}%"></div>
      <div class="trim-mask trim-mask-right" style="left:${endPct}%"></div>
      <div class="trim-selection" style="left:${startPct}%;width:${Math.max(0, endPct - startPct)}%"></div>
      <button class="trim-handle trim-handle-start" data-trim-handle="start" style="left:${startPct}%" aria-label="设置入点"><span></span></button>
      <button class="trim-handle trim-handle-end" data-trim-handle="end" style="left:${endPct}%" aria-label="设置出点"><span></span></button>
      <div class="trim-playhead" id="trim-playhead"></div>
    </div>
    <div class="trim-readout">
      <div class="trim-point">
        <span class="trim-label">入点</span>
        <strong id="trim-start-label">${formatTrimTime(trim.start)}</strong>
        <button class="trim-current" data-trim-action="set-start">用当前帧</button>
      </div>
      <div class="trim-length"><span>片段长度</span><strong id="trim-duration-label">${formatTrimTime(clip.duration)}</strong></div>
      <div class="trim-point is-end">
        <button class="trim-current" data-trim-action="set-end">用当前帧</button>
        <strong id="trim-end-label">${formatTrimTime(trim.end)}</strong>
        <span class="trim-label">出点</span>
      </div>
    </div>
  </div>`

  hydrateIcons(slot)
  paintTrimPlayhead()

  const track = $('#trim-track')
  const video = $('#preview-video')

  const refresh = (commit = false) => {
    const current = ensureTrim(file)
    const start = duration ? (current.start / duration) * 100 : 0
    const end = duration ? (current.end / duration) * 100 : 100
    const selection = $('.trim-selection', slot)
    const leftMask = $('.trim-mask-left', slot)
    const rightMask = $('.trim-mask-right', slot)
    const startHandle = $('.trim-handle-start', slot)
    const endHandle = $('.trim-handle-end', slot)
    if (selection) { selection.style.left = `${start}%`; selection.style.width = `${Math.max(0, end - start)}%` }
    if (leftMask) leftMask.style.width = `${start}%`
    if (rightMask) rightMask.style.left = `${end}%`
    if (startHandle) startHandle.style.left = `${start}%`
    if (endHandle) endHandle.style.left = `${end}%`
    $('#trim-start-label').textContent = formatTrimTime(current.start)
    $('#trim-end-label').textContent = formatTrimTime(current.end)
    $('#trim-duration-label').textContent = formatTrimTime(Math.max(0.2, current.end - current.start))
    paintTrimPlayhead()
    if (commit) {
      renderDock()
      renderSourceRail()
    }
  }

  const seekBoundary = (which, time) => {
    const current = ensureTrim(file)
    const value = Math.min(duration, Math.max(0, time))
    if (which === 'start') current.start = Math.min(value, Math.max(0, current.end - 0.2))
    else current.end = Math.max(value, Math.min(duration, current.start + 0.2))
    if (video) {
      video.pause()
      try { video.currentTime = which === 'start' ? current.start : current.end } catch {}
    }
    refresh()
  }

  const timeAt = (event) => {
    const rect = track.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    return ratio * duration
  }

  slot.querySelector('[data-trim-action="preview"]')?.addEventListener('click', () => {
    const current = ensureTrim(file)
    if (!video) return
    video.pause()
    video.currentTime = current.start
    ui.currentTime = current.start
    paintTrimPlayhead()
    video.play().catch(() => {})
  })

  slot.querySelector('[data-trim-action="reset"]')?.addEventListener('click', () => {
    file.trim = { start: 0, end: duration }
    if (video) { video.pause(); video.currentTime = 0 }
    refresh(true)
  })

  slot.querySelector('[data-trim-action="done"]')?.addEventListener('click', () => {
    state.trimMode = false
    updateTrimToggle()
    renderTrimUI()
  })

  slot.querySelector('[data-trim-action="set-start"]')?.addEventListener('click', () => {
    if (video) seekBoundary('start', video.currentTime)
    refresh(true)
  })

  slot.querySelector('[data-trim-action="set-end"]')?.addEventListener('click', () => {
    if (video) seekBoundary('end', video.currentTime)
    refresh(true)
  })

  for (const handle of $$('.trim-handle', slot)) {
    handle.addEventListener('pointerdown', (event) => {
      event.preventDefault()
      event.stopPropagation()
      if (!video) return
      const which = handle.dataset.trimHandle
      video.pause()
      const move = (moveEvent) => seekBoundary(which, timeAt(moveEvent))
      const up = () => {
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
        refresh(true)
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
      seekBoundary(which, timeAt(event))
    })
  }

  track.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.trim-handle')) return
    if (!video) return
    video.pause()
    const next = Math.min(duration, Math.max(0, timeAt(event)))
    try { video.currentTime = next } catch {}
    ui.currentTime = next
    paintTrimPlayhead()
  })
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
  const qualityPercent = ((30 - settings.quality) / 14) * 100
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
        <div class="field-label"><span>恒定质量</span><span class="field-hint">数值越低越清晰</span></div>
        <span class="quality-value" id="quality-value">CRF ${settings.quality}</span>
      </div>
      <input class="quality-slider" id="quality-slider" type="range" min="16" max="30" step="1" value="${settings.quality}"
        style="background:linear-gradient(90deg,var(--accent) 0%,var(--accent) ${qualityPercent}%,rgba(255,255,255,.16) ${qualityPercent}%)">
      <div class="quality-scale"><span>更佳画质</span><span>更小体积</span></div>
      <div class="quality-note" id="quality-note">${icon('sparkles', 12)}${settings.quality <= 18 ? '接近视觉无损，适合归档与二次剪辑' : settings.quality <= 22 ? '画质与体积的平衡点，日常分享推荐' : '优先压缩体积，适合即时通讯与网页'}</div>
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
      </div>` : `<div class="audio-disabled-row">${icon('volumeX', 12)} 输出将不包含音频轨道</div>`}
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
  const clip = clipRange(file)
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
      file.trim = { start: 0, end: Number(info.duration) || 0 }
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
  if (patch.format && patch.format !== 'gif' && next.videoCodec === 'gif') {
    next.videoCodec = FORMAT_CODECS[patch.format][0]; next.audio = true
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
  const clip = clipRange(file)
  if (file.info.duration && clip.duration < 0.2) {
    showToast('error', '剪辑片段太短', '入点与出点至少需要间隔 0.2 秒')
    return
  }
  state.starting = true
  renderSettings()
  try {
    await api.startConversion({
      sourcePath: file.path,
      outputPath: state.outputPath,
      meta: file.info,
      trim: { start: clip.start, end: clip.end },
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
  $('#trim-toggle').addEventListener('click', () => {
    const file = activeFile()
    if (!file?.info) return
    state.trimMode = !state.trimMode
    ensureTrim(file)
    if (state.trimMode) {
      const video = $('#preview-video')
      if (video) {
        try { video.currentTime = ensureTrim(file).start } catch {}
      }
    }
    updateTrimToggle()
    renderTrimUI()
  })
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
    const quality = Number(slider.value)
    state.settings.quality = quality
    state.preset = 'custom'
    const percent = ((30 - quality) / 14) * 100
    slider.style.background = `linear-gradient(90deg,var(--accent) 0%,var(--accent) ${percent}%,rgba(255,255,255,.16) ${percent}%)`
    $('#quality-value').textContent = `CRF ${quality}`
    const estimate = estimateSize(activeInfo(), state.settings, clipRange(activeFile()).duration)
    if (activeInfo()) $('#estimate-value').textContent = `约 ${formatBytes(estimate)}`
    const note = quality <= 18 ? '接近视觉无损，适合归档与二次剪辑' : quality <= 22 ? '画质与体积的平衡点，日常分享推荐' : '优先压缩体积，适合即时通讯与网页'
    $('#quality-note').innerHTML = `${icon('sparkles', 12)}${note}`
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
      closeMenus(); closeModal(); return
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'o') {
      event.preventDefault(); void openFilesDialog(); return
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault(); if (!state.modal) void startConversion(); return
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
