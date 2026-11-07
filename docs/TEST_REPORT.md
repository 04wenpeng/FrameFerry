# 测试记录 · 帧渡 FrameFerry

测试日期：2026-11-07  
测试对象：`E:\FrameFerry\FrameFerry.exe`（Electron 44.7.0 便携版）  
操作系统：Windows 11 x64

## 1. 测试环境

| 项 | 值 |
| --- | --- |
| Electron | 44.7.0 |
| FFmpeg | `N-92722-gf22fcd4483`（GPL build，含 libx264 / libx265 / libvpx / libopus） |
| FFprobe | `2023-02-13-git-2296078397-essentials_build` |
| 硬件 | AMD GPU；FFmpeg 实测 `h264_amf` 可用 |
| 演示素材 | `samples/Afterglow.mp4`，1920×1080 / 30fps / 10s / H.264 + AAC |

## 2. 启动与界面

| 用例 | 操作 | 结果 |
| --- | --- | --- |
| 无参启动 | 双击 `FrameFerry.exe` | 通过，显示空素材库与导入引导 |
| 带文件启动 | `FrameFerry.exe --open-file=E:\FrameFerry\samples\Afterglow.mp4` | 通过，自动载入并选中 |
| 单实例 | 重复启动 | 复用已有窗口（主进程单实例锁） |
| 布局 | 1440×900 | 无横向溢出；主按钮 Dock 常驻可见 |
| 无 renderer error | DevTools Protocol 收集 `Runtime.exceptionThrown` / `console.error` | 0 条 |

截图：

- `docs/screenshots/hero.png`
- `docs/screenshots/conversion.png`
- `docs/screenshots/output-settings.png`

## 3. 媒体探测与缩略图

| 用例 | 结果 |
| --- | --- |
| ffprobe 解析容器 | `QuickTime / MOV` → 展示为 MP4 容器 |
| 视频信息 | 1920×1080、30fps、H.264 High、yuv420p、7.2 Mbps |
| 音频信息 | AAC、mono、48 kHz、192 kbps |
| 海报帧 | 成功生成并显示 |
| 6 帧联系表 | 成功生成，覆盖全片 |
| 缓存 | 二次打开复用缓存（按 path+size+mtime 哈希） |

## 4. 应用内播放

| 用例 | 结果 |
| --- | --- |
| 点击播放 | `readyState=4`，无 `MediaError` |
| 连续播放 3 秒 | `currentTime=2.89302`，`paused=false` |
| 私有协议 Range | 使用 `frameflow://media` + Range 请求，可拖动时间轴 |
| 暂停 | 通过 |

## 5. 转换结果

### 5.1 MP4 / H.264 硬件路径

- 设置：MP4、H.264、1080p、CRF 21、AAC 192 kbps、AMD AMF
- 结果：成功
- 输出：`Afterglow_converted.mp4`，8,667,452 bytes
- ffprobe：H.264 1920×1080 30fps + AAC mono，时长 10.005s
- UI 提示：「AMD AMF 硬件编码完成」，任务卡绿色完成态

### 5.2 WebM / VP9 软件路径

- 设置：WebM（自动 VP9 + Opus）、1080p、CRF 21
- 结果：成功
- 输出：8,982,491 bytes
- ffprobe：VP9 1920×1080 30fps + Opus mono，时长 10.013s
- 实测速度约 0.47×–0.59×，进度、速度、剩余时间均有更新

### 5.3 GIF

- 设置：GIF（自动 640 宽、15fps、调色板、无音轨）
- 结果：成功
- 输出：11,149,218 bytes
- ffprobe：GIF 640×360 15fps，时长 9.99s

## 6. 输出路径与任务行为

| 用例 | 结果 |
| --- | --- |
| 默认保存文件夹 | 通过：启动时从 `userData/settings.json` 读取，输出路径自动落入该目录 |
| 默认目录实际转换 | 通过：设置 `E:\FrameFerry\exports` 后，MP4 成功写入该目录（8,667,452 bytes） |
| 输出目录为源文件目录（未设置默认目录） | 通过 |
| 同名文件已存在 | 自动生成 ` (2)`，不覆盖 |
| 中文/空格路径 | 文件对话框与 Node 参数均为数组传参，不经过 shell 拼接 |
| 取消任务 | 运行中可发送取消并结束子进程 |
| 历史记录 | 成功后写入 `userData/history.json`，面板可定位输出 |
| 硬件失败回退 | 代码路径存在；当前机器 AMF 可用，未触发实际失败回退 |

## 7. 发现并修复的问题

| 问题 | 证据 | 修复 |
| --- | --- | --- |
| 输出路径 `E:` 被清洗为 `E_` | 任务详情 `outputPath` 为 `E_\\FrameFerry\\...` | 改成只清洗 `basename`，目录和盘符保持原样 |
| 主按钮在 900px 高度下不可见 | 首屏截图 | 固定底部 Inspector Dock |
| 队列在设置面板内不可见 | 完成态截图只有顶部任务计数 | 队列压缩为 Dock 任务卡 |
| Toast 遮挡主按钮 | 完成态截图 | 通知移至左下角 |
| WebM 下仍显示「加速 AMD AMF」 | 转换中截图 | 非 H.264 显示 CPU 实际编码路径 |
| 关闭硬件开关仍使用硬件 | 代码审查发现 `job.settings` 未被读取 | 队列读取 `job.settings.hardware` |

## 8. 未覆盖

- 真实鼠标拖放（DevTools 合成的 File 无法携带宿主文件路径）——代码走 Electron 官方 `webUtils.getPathForFile` 路径；建议验收时手动拖入一次。
- H.265 / ProRes / MOV 的真实转码（参数路径已实现，未在本次机器上逐项跑完）。
- 多显示器、高 DPI 200%、Windows 10。
- 代码签名与 SmartScreen 正式发布流程。
- 多音频轨/字幕轨选择。

## 9. 复现测试

```powershell
# 1. 启动（带 DevTools 端口，便于截图）
$env:ELECTRON_RUN_AS_NODE = $null
Start-Process 'E:\FrameFerry\FrameFerry.exe' -ArgumentList '--remote-debugging-port=9333','--open-file=E:\FrameFerry\samples\Afterglow.mp4'

# 2. 截图 / 读取 DOM
node scripts/cdp.mjs shot docs/screenshots/hero.png
node scripts/cdp.mjs eval "document.title"

# 3. 校验输出
E:\FrameFerry\resources\bin\ffprobe.exe -v error -show_entries format=duration,size -show_entries stream=codec_name,width,height -of json E:\FrameFerry\samples\Afterglow_converted.mp4
```
