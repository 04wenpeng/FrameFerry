export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** index
  return `${value >= 100 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`
}

export function formatBitrate(bitsPerSecond) {
  if (!Number.isFinite(bitsPerSecond) || bitsPerSecond <= 0) return '—'
  if (bitsPerSecond >= 1_000_000) return `${(bitsPerSecond / 1_000_000).toFixed(1)} Mbps`
  return `${Math.round(bitsPerSecond / 1000)} kbps`
}

export function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '00:00'
  const total = Math.round(seconds)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return h > 0
    ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function formatFps(value) {
  if (!Number.isFinite(value) || value <= 0) return '—'
  const rounded = Math.round(value * 100) / 100
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(2)} fps`
}

export function codecLabel(codec = '') {
  return (
    {
      h264: 'H.264',
      hevc: 'H.265',
      h265: 'H.265',
      vp9: 'VP9',
      vp8: 'VP8',
      av1: 'AV1',
      prores: 'ProRes',
      aac: 'AAC',
      opus: 'Opus',
      mp3: 'MP3',
      flac: 'FLAC',
      pcm_s16le: 'PCM',
      ac3: 'AC-3',
      eac3: 'E-AC-3'
    }[codec] || String(codec || '—').toUpperCase()
  )
}

export function containerLabel(formatName = '', ext = '') {
  const name = `${formatName} ${ext}`.toLowerCase()
  if (name.includes('mp4') || name.includes('mov')) return ext ? ext.toUpperCase() : 'MP4'
  if (name.includes('matroska') || name.includes('webm')) return ext === 'webm' ? 'WebM' : 'MKV'
  if (name.includes('avi')) return 'AVI'
  if (name.includes('gif')) return 'GIF'
  return (ext || formatName || '—').toUpperCase()
}

export function extOf(filePath = '') {
  const found = String(filePath).toLowerCase().match(/\.([a-z0-9]{1,5})$/)
  return found ? found[1] : ''
}

export function fileStem(filePath = '') {
  const name = String(filePath).split(/[\\/]/).pop() || 'video'
  return name.replace(/\.[^.]+$/, '')
}

export function directoryOf(filePath = '') {
  const index = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'))
  return index >= 0 ? filePath.slice(0, index) : '.'
}
