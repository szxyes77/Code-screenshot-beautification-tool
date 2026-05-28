# 打包资源目录

## 应用图标（可选）

将 Windows 图标放到：`build/icon.ico`（建议 256×256）

未放置时使用 Electron 默认图标，不影响打包。

## 打包输出

执行 `npm run electron:build` 后，产物位于 `dist-electron/`：

- `CodeSnapshot-1.0.0-portable.exe` — 免安装便携版
- `CodeSnapshot-1.0.0-setup.exe` — NSIS 安装程序（可选安装目录、桌面快捷方式）
- `win-unpacked/` — 未打包目录（调试用）
