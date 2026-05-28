import { memo } from 'react'

/**
 * 导出 PNG 时的全屏 loading 遮罩
 * @param {{ visible: boolean }} props
 */
function ExportOverlay({ visible }) {
  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]"
      role="alert"
      aria-busy="true"
      aria-label="正在导出图片"
    >
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-8 py-6 shadow-xl">
        <div
          className="h-10 w-10 animate-spin rounded-full border-[3px] border-slate-200 border-t-slate-800"
          aria-hidden
        />
        <p className="text-sm font-medium text-slate-700">正在生成 PNG 图片...</p>
        <p className="text-xs text-slate-400">代码较长时可能需要几秒钟</p>
      </div>
    </div>
  )
}

export default memo(ExportOverlay)
