/**
 * 开发期视觉检查工具：连接已启动的 FrameFerry 的 DevTools 端口。
 *   node scripts/cdp.mjs shot docs/screenshots/hero.png
 *   node scripts/cdp.mjs eval "document.title"
 * 启动应用时附加 --remote-debugging-port=9333。
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const port = Number(process.env.CDP_PORT || 9333)
const mode = process.argv[2] || 'shot'
const argument = process.argv[3] || 'docs/screenshots/app.png'
const waitMs = Number(process.argv[4] || 1000)

const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json())
const target = targets.find((item) => item.type === 'page' && item.url.includes('FrameFerry'))
if (!target) throw new Error('未找到 FrameFerry 页面，请先以 --remote-debugging-port 启动应用')
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject })

let id = 0
const pending = new Map()
const logs = []
ws.onmessage = (message) => {
  const payload = JSON.parse(message.data)
  if (payload.id && pending.has(payload.id)) {
    const { resolve, reject } = pending.get(payload.id)
    pending.delete(payload.id)
    payload.error ? reject(new Error(JSON.stringify(payload.error))) : resolve(payload.result)
  } else if (payload.method === 'Runtime.exceptionThrown') {
    logs.push(payload.params.exceptionDetails?.text || 'exception')
  } else if (payload.method === 'Runtime.consoleAPICalled' && payload.params.type === 'error') {
    logs.push(payload.params.args.map((arg) => arg.value || arg.description).join(' '))
  }
}
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const callId = ++id
  pending.set(callId, { resolve, reject })
  ws.send(JSON.stringify({ id: callId, method, params }))
})

await send('Runtime.enable')
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
await new Promise((resolve) => setTimeout(resolve, waitMs))

if (mode === 'eval' || mode === 'eval-file') {
  const expression = mode === 'eval-file' ? await readFile(argument, 'utf8') : argument
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
    userGesture: true
  })
  console.log(JSON.stringify(result.result?.value ?? result.exceptionDetails, null, 2))
} else {
  const info = await send('Runtime.evaluate', {
    expression: `JSON.stringify({ title: document.title, width: document.body.scrollWidth, height: document.body.scrollHeight, active: document.querySelector('.source-card.is-active')?.innerText || null, toast: [...document.querySelectorAll('.toast')].map(t => t.innerText) })`,
    returnByValue: true
  })
  const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true })
  await mkdir(path.dirname(argument), { recursive: true })
  await writeFile(argument, Buffer.from(shot.data, 'base64'))
  console.log(info.result.value)
  console.log('saved', argument)
}
console.log('renderer errors:', JSON.stringify(logs.slice(-10)))
ws.close()
