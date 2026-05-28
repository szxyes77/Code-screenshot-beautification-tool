/**
 * React.lazy + Suspense 的占位 UI
 */

/**
 * @param {{ label?: string }} props
 */
export default function LazySectionFallback({ label = '模块' }) {
  return (
    <div
      className="flex animate-pulse items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-8"
      role="status"
      aria-live="polite"
    >
      <p className="text-sm text-slate-400">正在加载{label}...</p>
    </div>
  )
}
