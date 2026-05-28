import { memo, useMemo } from 'react'

/**
 * @typedef {import('../themes.js').CodeTheme} CodeTheme
 */

/**
 * @typedef {Object} PreviewCardProps
 * @property {string} highlightedHtml
 * @property {number} lineCount
 * @property {CodeTheme} theme
 * @property {number} fontSize
 * @property {import('react').CSSProperties} backgroundStyle
 * @property {boolean} isHighlighting
 */

/**
 * @param {PreviewCardProps} props
 */
function PreviewCard({
  highlightedHtml,
  lineCount,
  theme,
  fontSize,
  backgroundStyle,
  isHighlighting,
}) {
  const lineNumbers = useMemo(
    () => Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1),
    [lineCount],
  )

  const codeStyle = useMemo(
    () => ({ fontSize: `${fontSize}px`, lineHeight: 1.6 }),
    [fontSize],
  )

  return (
    <div
      className="inline-block w-full max-w-full overflow-hidden rounded-2xl shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
      style={backgroundStyle}
    >
      <div className="p-6 sm:p-8">
        <div
          className="overflow-hidden rounded-xl shadow-md"
          style={{ backgroundColor: theme.codeBg }}
        >
          <div
            className="flex items-center gap-2 px-4 py-2.5"
            style={{ backgroundColor: theme.titleBarBg }}
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: theme.dotColors.red }}
              aria-hidden
            />
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: theme.dotColors.yellow }}
              aria-hidden
            />
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: theme.dotColors.green }}
              aria-hidden
            />
            <span className="ml-2 flex-1 text-center text-xs text-slate-500 opacity-60">
              snippet
            </span>
          </div>

          <div className="flex overflow-x-auto">
            <div
              className="select-none border-r border-slate-200/10 py-3 pl-3 pr-2 text-right font-mono tabular-nums"
              style={{
                color: theme.lineNumberColor,
                ...codeStyle,
              }}
              aria-hidden
            >
              {lineNumbers.map((num) => (
                <div key={num}>{num}</div>
              ))}
            </div>

            <div
              className="min-w-0 flex-1 py-3 pr-3 font-mono [&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!bg-transparent"
              style={codeStyle}
            >
              {isHighlighting ? (
                <p className="px-2 text-slate-400">高亮渲染中...</p>
              ) : highlightedHtml ? (
                <div dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
              ) : (
                <p className="px-2 text-slate-400">等待输入代码...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(PreviewCard)
