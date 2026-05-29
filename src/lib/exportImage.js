/**
 * 图片导出：按需加载 html-to-image，与预览 DOM 一致（渐变、阴影、窗口按钮等）
 */

/** 代码卡片根节点 id，与 PreviewCard 保持一致 */
export const EXPORT_CARD_ID = 'code-snapshot-card'

/**
 * @param {unknown} error
 * @returns {string}
 */
export function getExportErrorMessage(error) {
  const message = error instanceof Error ? error.message : String(error)

  if (/tainted|cross-origin|cors|security|fetch/i.test(message)) {
    return '导出失败：背景图片存在跨域限制。请改用纯色或 CSS 渐变背景，或使用同源图片。'
  }

  if (/empty|zero|invalid/i.test(message)) {
    return '导出失败：预览区域为空或无法渲染，请先输入代码并等待高亮完成。'
  }

  if (/timeout/i.test(message)) {
    return '导出失败：渲染超时，请减少代码行数或降低字号后重试。'
  }

  return '导出失败：请稍后重试。若使用外链图片背景，请换纯色或渐变背景。'
}

/**
 * 解析导出目标节点：优先使用传入元素，否则按 id 查找
 * @param {HTMLElement | null | undefined} element
 * @returns {HTMLElement}
 */
function resolveExportTarget(element) {
  const target =
    element ?? document.getElementById(EXPORT_CARD_ID)

  if (!target || !(target instanceof HTMLElement)) {
    throw new Error('预览区域未就绪，请等待页面加载完成')
  }

  return target
}

/**
 * 截取代码卡片 DOM 并下载 PNG
 * @param {HTMLElement | null | undefined} element - 代码卡片容器（含背景与阴影）
 * @param {string} filename - 下载文件名
 * @returns {Promise<void>}
 */
export async function exportElementToPng(element, filename) {
  const target = resolveExportTarget(element)

  const { toPng } = await import('html-to-image')

  try {
    const dataUrl = await toPng(target, {
      quality: 1,
      pixelRatio: 2,
      cacheBust: true,
      includeQueryParams: true,
      // 保留外链背景图（需图片服务器允许 CORS）
      fetchRequestInit: {
        mode: 'cors',
      },
    })

    if (!dataUrl || dataUrl === 'data:,') {
      throw new Error('empty')
    }

    const link = document.createElement('a')
    link.download = filename
    link.href = dataUrl
    link.click()
  } catch (error) {
    throw new Error(getExportErrorMessage(error))
  }
}
