import {
  lazy,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from 'react'
import ExportOverlay from './components/ExportOverlay.jsx'
import LazySectionFallback from './components/LazySectionFallback.jsx'
import Toast from './components/Toast.jsx'
import { APP_VERSION } from './constants.js'
import { useCodeHighlight } from './hooks/useCodeHighlight.js'
import { exportElementToPng } from './lib/exportImage.js'
import {
  BACKGROUND_PRESETS,
  BACKGROUND_TYPES,
  CODE_THEMES,
  DEFAULT_CODE,
  LANGUAGES,
} from './themes.js'

/** @typedef {import('./themes.js').ThemeId} ThemeId */

const Toolbar = lazy(() => import('./components/Toolbar.jsx'))
const CodeEditor = lazy(() => import('./components/CodeEditor.jsx'))
const PreviewCard = lazy(() => import('./components/PreviewCard.jsx'))

const SHIKI_THEMES = CODE_THEMES.map((t) => t.shikiTheme)
const SHIKI_LANGS = LANGUAGES.map((l) => (l.id === 'plaintext' ? 'text' : l.id))

export default function App() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [language, setLanguage] = useState('javascript')
  const [themeId, setThemeId] = useState(/** @type {ThemeId} */ (CODE_THEMES[0].id))
  const [backgroundType, setBackgroundType] = useState(BACKGROUND_TYPES.SOLID)
  const [solidColor, setSolidColor] = useState(BACKGROUND_PRESETS['dark-night'].solid)
  const [gradientValue, setGradientValue] = useState(BACKGROUND_PRESETS['dark-night'].gradient)
  const [imageUrl, setImageUrl] = useState('')
  const [fontSize, setFontSize] = useState(14)
  const [isExporting, setIsExporting] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [toast, setToast] = useState(/** @type {{ message: string, type: 'info'|'success'|'warning'|'error' } | null} */ (null))

  const currentTheme = useMemo(
    () => CODE_THEMES.find((t) => t.id === themeId) ?? CODE_THEMES[0],
    [themeId],
  )

  const lineCount = useMemo(() => code.split('\n').length, [code])

  const showToast = useCallback(
    (
      /** @type {'info'|'success'|'warning'|'error'} */ type,
      /** @type {string} */ message,
    ) => {
      setToast({ type, message })
    },
    [],
  )

  const handleLanguageFallback = useCallback(
    (/** @type {string | null} */ msg) => {
      if (msg) {
        showToast('warning', msg)
      }
    },
    [showToast],
  )

  const {
    highlightedHtml,
    isHighlighting,
    highlighterReady,
    initError,
  } = useCodeHighlight({
    code,
    language,
    shikiTheme: currentTheme.shikiTheme,
    themes: SHIKI_THEMES,
    langs: SHIKI_LANGS,
    onLanguageFallback: handleLanguageFallback,
  })

  const handleThemeChange = useCallback((/** @type {string} */ newThemeId) => {
    setThemeId(/** @type {ThemeId} */ (newThemeId))
    if (newThemeId in BACKGROUND_PRESETS) {
      const preset = BACKGROUND_PRESETS[/** @type {ThemeId} */ (newThemeId)]
      setSolidColor(preset.solid)
      setGradientValue(preset.gradient)
    }
  }, [])

  const backgroundStyle = useMemo(() => {
    switch (backgroundType) {
      case BACKGROUND_TYPES.GRADIENT:
        return { background: gradientValue }
      case BACKGROUND_TYPES.IMAGE:
        return imageUrl
          ? {
              backgroundImage: `url("${imageUrl}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : { background: solidColor }
      case BACKGROUND_TYPES.SOLID:
      default:
        return { background: solidColor }
    }
  }, [backgroundType, solidColor, gradientValue, imageUrl])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopySuccess(true)
      showToast('success', '代码已复制到剪贴板')
      setTimeout(() => setCopySuccess(false), 2000)
    } catch {
      showToast('error', '复制失败，请检查系统剪贴板权限')
    }
  }, [code, showToast])

  const handleExport = useCallback(async () => {
    const cardEl = document.getElementById('code-snapshot-card')

    if (!cardEl) {
      showToast('warning', '预览尚未就绪，请等待高亮加载完成')
      return
    }

    if (!highlighterReady || isHighlighting) {
      showToast('warning', '请等待代码高亮完成后再导出')
      return
    }

    setIsExporting(true)
    try {
      await exportElementToPng(
        cardEl,
        `CodeSnapshot-${Date.now()}.png`,
      )
      showToast('success', 'PNG 图片已成功导出到下载目录')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '导出失败，请稍后重试'
      showToast('error', message)
    } finally {
      setIsExporting(false)
    }
  }, [highlighterReady, isHighlighting, showToast])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-800">
      <ExportOverlay visible={isExporting} />
      <Toast
        message={toast?.message ?? null}
        type={toast?.type ?? 'info'}
        onClose={() => setToast(null)}
      />

      <header className="shrink-0 border-b border-slate-200/80 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              CodeSnapshot
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              代码截图美化 · 纯本地运行 · 隐私安全
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
            v{APP_VERSION}
          </span>
        </div>
      </header>

      <main className="mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 flex-col gap-4 overflow-hidden px-5 py-4">
        <Suspense fallback={<LazySectionFallback label="工具栏" />}>
          <Toolbar
            themes={CODE_THEMES}
            currentThemeId={themeId}
            onThemeChange={handleThemeChange}
            backgroundType={backgroundType}
            onBackgroundTypeChange={setBackgroundType}
            backgroundTypes={BACKGROUND_TYPES}
            solidColor={solidColor}
            onSolidColorChange={setSolidColor}
            gradientValue={gradientValue}
            onGradientChange={setGradientValue}
            imageUrl={imageUrl}
            onImageUrlChange={setImageUrl}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
            onExport={handleExport}
            onCopy={handleCopy}
            isExporting={isExporting}
            copySuccess={copySuccess}
          />
        </Suspense>

        {initError && (
          <div className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {initError}
          </div>
        )}

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-6">
          <Suspense fallback={<LazySectionFallback label="代码编辑器" />}>
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={setLanguage}
              languages={LANGUAGES}
            />
          </Suspense>

          <section className="flex min-h-0 flex-col gap-2">
            <h2 className="shrink-0 text-sm font-medium text-slate-600">实时预览</h2>
            <div className="flex min-h-0 flex-1 items-start justify-center overflow-auto rounded-xl border border-slate-200/60 bg-white p-3">
              {!highlighterReady ? (
                <LazySectionFallback label="语法高亮引擎" />
              ) : (
                <div className="w-full max-w-full">
                  <Suspense fallback={<LazySectionFallback label="预览卡片" />}>
                    <PreviewCard
                      highlightedHtml={highlightedHtml}
                      lineCount={lineCount}
                      theme={currentTheme}
                      fontSize={fontSize}
                      backgroundStyle={backgroundStyle}
                      isHighlighting={isHighlighting}
                    />
                  </Suspense>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="shrink-0 border-t border-slate-200/80 bg-white px-5 py-3 text-center text-xs text-slate-400">
        <p>所有代码与图片均在本地处理，不会上传至服务器</p>
        <p className="mt-1">CodeSnapshot v{APP_VERSION}</p>
      </footer>
    </div>
  )
}
