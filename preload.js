/**
 * Electron 预加载脚本：向渲染进程安全暴露 IPC
 */
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getVersion: () => ipcRenderer.invoke('app:get-version'),
  getPlatform: () => ipcRenderer.invoke('app:get-platform'),
  isPackaged: () => ipcRenderer.invoke('app:is-packaged'),
})
