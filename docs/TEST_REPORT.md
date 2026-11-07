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
| 可读性 | 1440×900 视觉检查 | 设置面板控件 12–13px、辅助信息 ≥10px、次要文字对比度提升；无关键操作被挤出首屏 |
| GIF 切换稳定 | 对比 MP4 / GIF 设置面板高度 | MP4 753px → GIF 770px（+17px），质量区和音轨区均保留占位，不再整块消失 |

截图：

- `docs/screenshots/hero.png`
- `docs/screenshots/conversion.png`
- `docs/screenshots/output-settings.png`
- `docs/screenshots/gif-settings.png`
- `docs/screenshots/split-editor.png`
- `docs/screenshots/trim-handles.png`

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

- 设置：GIF（自动 640 宽、12.5fps、256 色全局调色板、稳定抖动、无音轨）
- 结果：成功
- 输出：11,920,324 bytes（约 11.4 MB）
- ffprobe：125 帧，每帧 `pkt_duration_time=0.080000`，时长约 10s
- 修复前：15fps 在 GIF 的 10ms 延迟粒度下被拆成 70ms / 60ms 交替，肉眼表现为节奏跳变；改为 12.5fps 后所有帧固定 80ms

### 5.4 MOV / ProRes 422 HQ

- 设置：MOV、ProRes 422 HQ、480p、PCM 音频
- 结果：成功
- 输出：95,654,730 bytes
- ffprobe：视频 `prores / yuv422p10le`，音频 `pcm_s16le`
- 这一轮修复了此前所有非 GIF 编码统一被强制 `yuv420p` 的问题

### 5.5 分割与剪辑

- 白线交互：拖动白线到 5.0s，`Ctrl+B` 分割成功；双击白线 8.0s 处再次分割，得到 `0–5s / 5–8s / 8–10s`，渲染出两条白色分割线
- 操作：10s 素材打开「剪辑」，播放头在 3.0s 点「分割」，再在 7.0s 点「分割」，得到三段 `0–3s / 3–7s / 7–10s`
- 选中中间片段（片段 02），点「删除片段」，保留 `0–3s` 与 `7–10s`
- 界面：保留片段直接显示联系表，选中片段使用白色描边 + 白色手柄，删除区为深色斜纹；成片长度 `00:06.0`，预计体积约 5.2 MB
- 输出：`split-test.mp4`，H.264 + AAC，1920×1080，ffprobe 时长 **6.000000s**
- 再次编辑：选中片段 01，把末端白色圆角手柄从 3.0s 拖到 2.5s；拖动时气泡显示 `00:02.5`，成片变为 `5.5s`，输出 ffprobe 为 **5.500000s**
- 构建参数：多片段使用 `trim/atrim + setpts/asetpts + concat` 的 `filter_complex`；单片段使用 `-ss/-t`
- GIF：保留 `0–3s / 7–10s`，输出 75 帧、每帧 `0.080000s`
- 预览：播放会跳过删除区间，到最后一个保留片段的末尾自动暂停

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
| 并发同路径入队 | 两个任务分别输出 `race-test.mp4` 与 `race-test (2).mp4`，无覆盖 |
| 清除已完成 | 无运行中任务时清空后 `listJobs()` 返回 `[]`；单元测试确认运行中任务只保留一次 |
| 关闭应用 | WebM 转码中关闭窗口，3 秒后 `ffmpeg` 与 `FrameFerry` 进程均不存在 |
| 自定义扩展名 | `custom.mkv` 切到 WebM 后 UI 路径变为 `custom.webm` |
| 片段剪辑 | 2.0s–6.0s 输出 4.000s，进度/预计体积按片段计算 |
| 片段预览 | 播放到出点 6.0s 自动暂停 |
| 白线分割 | 拖动白线 + Ctrl+B / 双击白线，拆成三段并绘制两条白色分割线 |
| 白色片段手柄 | 末端 3.0s 拖到 2.5s，手柄跟手，气泡显示 00:02.5 |
| 无黄色遮挡 | 选中片段为白色描边，联系表保持原亮度；删除区显示深色斜纹 |
| 分割与删除 MP4 | 在 3s、7s 分割后删除中间段，输出 6.000s，音画均保留 |
| 分割片段再裁剪 | 把首段出点从 3.0s 拖到 2.5s，输出 5.500s |
| 分割后 GIF | 保留 0–3s / 7–10s，输出 75 帧 / 6s / 全部 80ms |
| 成片预览 | 播放跳过删除区间，到最后一个保留片段末尾暂停 |
| 播放图标居中 | 按钮与圆同心；纵向偏差 `dy=0`，水平方向按三角视觉重心做 2px 光学补偿 |
| 剪辑入口 | 预览右上角与播放控制条右侧均可进入剪辑；v1.2.0 状态栏可见 |
| 音频容器约束 | MP4 即使传入 Opus 也输出 AAC；MKV 可选 Opus；ProRes 输出 PCM |
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
| 清除已完成会复制运行中任务 | 代码审查：`clearFinished` 先过滤再 unshift 运行任务 | 直接过滤终态，不再重复插入 |
| 队列 LIFO | 单元测试确认最早任务未被先启动 | `pump()` 反向查找最早的 queued |
| 同路径并发入队 | 同输出路径可能同时分配给两个任务 | 队列串行化 + 路径占位，集成测试生成 `(2)` |
| 退出后 ffmpeg 未结束 | 关闭窗口后进程仍存在 | `before-quit` 调用 `shutdown()` 并杀子进程 |
| 自定义路径扩展名不跟随格式 | UI 显示与实际扩展名不一致 | 统一 `outputPathWithFormat()` |
| MP4/MOV 可选 Opus | 兼容性差且 ProRes 音频 UI 与实际不符 | 按容器锁定音频编码，ProRes 显示 PCM |
| ProRes pix_fmt 错误 | 强制 yuv420p，与 422 HQ 不符 | 改为 yuv422p10le，ffprobe 验证 |
| 进度广播旧快照回退 | 高频进度下 UI 可能回退 | leading + trailing 节流 |
| 探测缓存不随文件变化 | 替换同路径文件后信息过期 | key 加入 size + mtime |
| 播放三角不在圆内中心 | 空 `play-ring` span 参与 grid 布局，把图标顶高约 9.7px | 移除空节点并修正三角路径；纵向归零，水平加 2px 光学补偿以匹配三角视觉重心 |

## 8. 未覆盖

- 真实鼠标拖放（DevTools 合成的 File 无法携带宿主文件路径）——代码走 Electron 官方 `webUtils.getPathForFile` 路径；建议验收时手动拖入一次。
- H.265 与 H.264 MOV 的真实转码尚未逐项跑完（ProRes MOV 已验证）。
- 多显示器、高 DPI 200%、Windows 10。
- 代码签名与 SmartScreen 正式发布流程。
- 多音频轨/字幕轨选择。
- 拖拽排序、片段复制/叠加、画面裁剪、旋转、滤镜和转场（当前支持多片段顺序分割/删除/再裁剪）。

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
