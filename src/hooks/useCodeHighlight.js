import { useEffect, useRef, useState, startTransition } from 'react'
import { getHighlighter } from '../lib/shikiLoader.js'
import { LANGUAGES } from '../themes.js'

const DEBOUNCE_MS = 180

/**
 * @param {Object} options
 * @param {string} options.code
 * @param {string} options.language
 * @param {string} options.shikiTheme
 * @param {string[]} options.themes
 * @param {string[]} options.langs
 * @param {(msg: string | null) => void} [options.onLanguageFallback]
 */
export function useCodeHighlight({
  code,
  language,
  shikiTheme,
  themes,
  langs,
  onLanguageFallback,
}) {
  const [highlightedHtml, setHighlightedHtml] = useState('')
  const [isHighlighting, setIsHighlighting] = useState(false)
  const [highlighterReady, setHighlighterReady] = useState(false)
  const [initError, setInitError] = useState(/** @type {string | null} */ (null))

  const highlighterRef = useRef(/** @type {import('shiki').Highlighter | null} */ (null))
  const timerRef = useRef(/** @type {ReturnType<typeof setTimeout> | null} */ (null))
  const requestIdRef = useRef(0)

  useEffect(() => {
    let cancelled = false

    getHighlighter(themes, langs)
      .then((highlighter) => {
        if (!cancelled) {
          highlighterRef.current = highlighter
          setHighlighterReady(true)
          setInitError(null)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setInitError('语法高亮引擎加载失败，请刷新页面重试')
        }
      })

    return () => {
      cancelled = true
    }
  }, [themes, langs])

  useEffect(() => {
    if (!highlighterReady || !highlighterRef.current) return

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    const requestId = ++requestIdRef.current
    setIsHighlighting(true)

    timerRef.current = setTimeout(() => {
      const highlighter = highlighterRef.current
      if (!highlighter || requestId !== requestIdRef.current) return

      const requestedLang = language === 'plaintext' ? 'text' : language
      const loadedLangs = highlighter.getLoadedLanguages()

      let actualLang = requestedLang
      if (!loadedLangs.includes(requestedLang)) {
        actualLang = 'text'
        const label =
          LANGUAGES.find((l) => l.id === language)?.label ?? language
        onLanguageFallback?.(
          `「${label}」暂未加载语法支持，已使用纯文本显示。请从列表中选择已支持的语言。`,
        )
      } else {
        onLanguageFallback?.(null)
      }

      try {
        const html = highlighter.codeToHtml(code, {
          lang: actualLang,
          theme: shikiTheme,
        })

        startTransition(() => {
          if (requestId === requestIdRef.current) {
            setHighlightedHtml(html)
          }
        })
      } catch {
        const escaped = escapeHtml(code)
        startTransition(() => {
          if (requestId === requestIdRef.current) {
            setHighlightedHtml(`<pre><code>${escaped}</code></pre>`)
          }
        })
        onLanguageFallback?.('代码高亮渲染出错，已回退为纯文本预览')
      } finally {
        if (requestId === requestIdRef.current) {
          setIsHighlighting(false)
        }
      }
    }, DEBOUNCE_MS)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [
    code,
    language,
    shikiTheme,
    highlighterReady,
    onLanguageFallback,
  ])

  return {
    highlightedHtml,
    isHighlighting,
    highlighterReady,
    initError,
  }
}

/**
 * @param {string} text
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
