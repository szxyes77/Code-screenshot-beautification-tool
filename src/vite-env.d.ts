/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ElectronAPI {
  getVersion: () => Promise<string>
  getPlatform: () => Promise<string>
  isPackaged: () => Promise<boolean>
}

interface Window {
  electronAPI?: ElectronAPI
}
