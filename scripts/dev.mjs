import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
let electronPath
try {
  electronPath = (await import('electron')).default
} catch {
  console.error('未找到 Electron。请先运行 npm install，或使用 E:\\FrameFerry\\FrameFerry.exe 打开便携版。')
  process.exit(1)
}

const env = { ...process.env }
delete env.ELECTRON_RUN_AS_NODE
delete env.VITE_DEV_SERVER_URL

const child = spawn(electronPath, ['.', ...process.argv.slice(2)], {
  cwd: root,
  stdio: 'inherit',
  env
})

child.on('close', (code) => process.exit(code ?? 0))
process.on('SIGINT', () => child.kill())
process.on('SIGTERM', () => child.kill())
