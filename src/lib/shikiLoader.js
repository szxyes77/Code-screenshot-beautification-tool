/**
 * Shiki 动态加载封装
 * 使用 import() 延迟加载，配合 vite manualChunks 落入 shiki-vendor，不阻塞首屏
 */

/** @type {Promise<import('shiki').Highlighter> | null} */
let highlighterPromise = null

/**
 * 获取（或创建）全局单例 Highlighter
 * @param {string[]} themes - Shiki 主题名列表
 * @param {string[]} langs - 语言 id 列表
 * @returns {Promise<import('shiki').Highlighter>}
 */
export function getHighlighter(themes, langs) {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then(({ createHighlighter }) =>
      createHighlighter({ themes, langs }),
    )
  }
  return highlighterPromise
}

/** 重置实例（一般仅测试用） */
export function resetHighlighter() {
  highlighterPromise = null
}
