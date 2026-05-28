import { memo } from 'react'

/**
 * @typedef {import('../themes.js').CodeTheme} CodeTheme
 */

/**
 * @param {Object} props
 * @param {import('react').ReactNode} props.icon
 * @param {import('react').ReactNode} props.children
 * @param {() => void} props.onClick
 * @param {boolean} [props.disabled]
 * @param {'default' | 'primary'} [props.variant]
 * @param {boolean} [props.loading]
 */
function ToolbarButton({
  icon,
  children,
  onClick,
  disabled = false,
  variant = 'default',
  loading = false,
}) {
  const base =
    'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50'
  const variants = {
    default: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    primary: 'border border-slate-800 bg-slate-800 text-white hover:bg-slate-700',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]}`}
    >
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
          aria-hidden
        />
      ) : (
        icon
      )}
      {children}
    </button>
  )
}

function IconTheme() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
      />
    </svg>
  )
}

function IconDownload() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  )
}

function IconCopy() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  )
}

/**
 * @typedef {Object} ToolbarProps
 * @property {CodeTheme[]} themes
 * @property {string} currentThemeId
 * @property {(themeId: string) => void} onThemeChange
 * @property {string} backgroundType
 * @property {(type: string) => void} onBackgroundTypeChange
 * @property {typeof import('../themes.js').BACKGROUND_TYPES} backgroundTypes
 * @property {string} solidColor
 * @property {(color: string) => void} onSolidColorChange
 * @property {string} gradientValue
 * @property {(value: string) => void} onGradientChange
 * @property {string} imageUrl
 * @property {(url: string) => void} onImageUrlChange
 * @property {number} fontSize
 * @property {(size: number) => void} onFontSizeChange
 * @property {() => void | Promise<void>} onExport
 * @property {() => void | Promise<void>} onCopy
 * @property {boolean} isExporting
 * @property {boolean} copySuccess
 */

/**
 * @param {ToolbarProps} props
 */
function Toolbar({
  themes,
  currentThemeId,
  onThemeChange,
  backgroundType,
  onBackgroundTypeChange,
  backgroundTypes,
  solidColor,
  onSolidColorChange,
  gradientValue,
  onGradientChange,
  imageUrl,
  onImageUrlChange,
  fontSize,
  onFontSizeChange,
  onExport,
  onCopy,
  isExporting,
  copySuccess,
}) {
  return (
    <div className="shrink-0 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-slate-500">
          <IconTheme />
          主题
        </span>
        {themes.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onThemeChange(t.id)}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${
              currentThemeId === t.id
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">背景类型</label>
          <select
            value={backgroundType}
            onChange={(e) => onBackgroundTypeChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
          >
            <option value={backgroundTypes.SOLID}>纯色</option>
            <option value={backgroundTypes.GRADIENT}>渐变</option>
            <option value={backgroundTypes.IMAGE}>图片 URL</option>
          </select>
        </div>

        {backgroundType === backgroundTypes.SOLID && (
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">纯色</label>
            <input
              type="color"
              value={solidColor}
              onChange={(e) => onSolidColorChange(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
            />
          </div>
        )}

        {backgroundType === backgroundTypes.GRADIENT && (
          <div className="min-w-[180px] flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-500">CSS 渐变</label>
            <input
              type="text"
              value={gradientValue}
              onChange={(e) => onGradientChange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
              placeholder="linear-gradient(...)"
            />
          </div>
        )}

        {backgroundType === backgroundTypes.IMAGE && (
          <div className="min-w-[180px] flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-500">图片 URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => onImageUrlChange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
              placeholder="https://example.com/bg.jpg"
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-3">
        <label className="flex min-w-[160px] flex-1 items-center gap-3 text-sm text-slate-600">
          <span className="shrink-0 text-xs font-medium text-slate-500">字号 {fontSize}px</span>
          <input
            type="range"
            min={10}
            max={24}
            value={fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className="h-2 flex-1 cursor-pointer accent-slate-800"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <ToolbarButton icon={<IconCopy />} onClick={onCopy}>
            {copySuccess ? '已复制' : '复制代码'}
          </ToolbarButton>
          <ToolbarButton
            icon={<IconDownload />}
            onClick={onExport}
            disabled={isExporting}
            loading={isExporting}
            variant="primary"
          >
            {isExporting ? '导出中...' : '导出 PNG'}
          </ToolbarButton>
        </div>
      </div>
    </div>
  )
}

export default memo(Toolbar)
