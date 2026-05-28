/**
 * 图片导出：按需加载 html2canvas，并提供友好错误信息
 */

/**
 * @param {unknown} error
 * @returns {string}
 */
export function getExportErrorMessage(error) {
  const message = error instanceof Error ? error.message : String(error)

  if (/tainted|cross-origin|cors|security/i.test(message)) {
    return '导出失败：背景图片存在跨域限制。请改用纯色或 CSS 渐变背景，或使用同源图片。'
  }

  if (/canvas|empty|zero/i.test(message)) {
    return '导出失败：预览区域为空或无法渲染，请先输入代码并等待高亮完成。'
  }

  if (/timeout/i.test(message)) {
    return '导出失败：渲染超时，请减少代码行数或降低字号后重试。'
  }

  return '导出失败：请稍后重试。若使用外链图片背景，请换纯色或渐变背景。'
}

/**
 * 截取 DOM 并下载 PNG
 * @param {HTMLElement} element
 * @param {string} filename
 */
export async function exportElementToPng(element, filename) {
  if (!element) {
    throw new Error('预览区域未就绪，请等待页面加载完成')
  }

  const { default: html2canvas } = await import('html2canvas')

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
    })

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('canvas empty')
    }

    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = filename
    link.href = dataUrl
    link.click()
  } catch (error) {
    throw new Error(getExportErrorMessage(error))
  }
}
