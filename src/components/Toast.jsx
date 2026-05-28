import { memo, useEffect } from 'react'

/**
 * @typedef {'info' | 'success' | 'warning' | 'error'} ToastType
 */

/**
 * @typedef {Object} ToastProps
 * @property {string | null} message
 * @property {ToastType} [type]
 * @property {() => void} onClose
 * @property {number} [duration]
 */

const typeStyles = {
  info: 'border-slate-200 bg-white text-slate-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  error: 'border-red-200 bg-red-50 text-red-800',
}

/**
 * 轻量 Toast 提示
 * @param {ToastProps} props
 */
function Toast({ message, type = 'info', onClose, duration = 3200 }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!message) return null

  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-fade-in"
      role="status"
      aria-live="polite"
    >
      <div
        className={`pointer-events-auto max-w-md rounded-xl border px-4 py-3 text-sm shadow-lg ${typeStyles[type]}`}
      >
        {message}
      </div>
    </div>
  )
}

export default memo(Toast)
