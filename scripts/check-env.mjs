import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const tools = [
  ['ffmpeg', ['vendor', 'bin', 'ffmpeg.exe']],
  ['ffprobe', ['vendor', 'bin', 'ffprobe.exe']]
]

let missing = false
for (const [name, parts] of tools) {
  const candidate = path.join(root, ...parts)
  if (!existsSync(candidate)) {
    console.log(`✗ ${name}: 未找到 ${path.join(...parts)}`)
    missing = true
    continue
  }
  const result = spawnSync(candidate, ['-hide_banner', '-version'], { encoding: 'utf8', windowsHide: true })
  const version = `${result.stdout || ''}${result.stderr || ''}`.split(/\r?\n/)[0]
  console.log(`✓ ${name}: ${version}`)
}

if (missing) {
  console.log('\n请将 ffmpeg.exe 与 ffprobe.exe 放入 vendor/bin，或通过 FFMPEG_PATH / FFPROBE_PATH 指定路径。')
  process.exit(1)
}
