# Third-party notices

## Electron

This application is built on the Electron runtime.

- Project: https://www.electronjs.org/
- License: MIT
- Copyright: Electron contributors, GitHub Inc.

The portable directory includes `LICENSE.electron.txt` and `LICENSES.chromium.html` from the Electron distribution.

## FFmpeg / FFprobe

The application invokes FFmpeg and FFprobe as separate command-line programs. It does not link against FFmpeg libraries.

Binaries included in the portable build:

| Binary | Package | Reported version | Notes |
| --- | --- | --- | --- |
| `ffmpeg.exe` | `@ffmpeg-installer/win32-x64@4.1.0` | `N-92722-gf22fcd4483` | GPL build, includes libx264, libx265, libvpx, libopus |
| `ffprobe.exe` | `@ffprobe-installer/win32-x64@5.1.0` | `2023-02-13-git-2296078397-essentials_build` | Gyan.dev essentials build |

- Project: https://ffmpeg.org/
- License: GPL v3 for these builds. FFmpeg is a trademark of Fabrice Bellard, originator of the FFmpeg project.
- Source code: https://ffmpeg.org/download.html and https://git.ffmpeg.org/ffmpeg.git

The binaries are redistributed unmodified. Anyone distributing this application further is responsible for complying with the GPL, including providing the corresponding source or a valid written offer where required.

## Fonts and visual assets

No third-party fonts or stock footage are bundled. The UI uses system fonts. The demo clip `samples/Afterglow.mp4` and the application mark were generated for this project by the author.
