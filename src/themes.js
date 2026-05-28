/**
 * 主题与样式配置
 * 扩展新主题时：在此添加条目，并确保 shikiTheme 已在 Shiki 预加载列表中
 */

/** 预设代码主题（对应 Shiki 内置主题名） */
export const CODE_THEMES = [
  {
    id: 'dark-night',
    name: '暗夜黑',
    shikiTheme: 'github-dark',
    titleBarBg: '#161b22',
    codeBg: '#0d1117',
    lineNumberColor: '#6e7681',
    dotColors: { red: '#ff5f57', yellow: '#febc2e', green: '#28c840' },
  },
  {
    id: 'github-light',
    name: 'GitHub 白',
    shikiTheme: 'github-light',
    titleBarBg: '#f6f8fa',
    codeBg: '#ffffff',
    lineNumberColor: '#8b949e',
    dotColors: { red: '#ff5f57', yellow: '#febc2e', green: '#28c840' },
  },
  {
    id: 'vintage-warm',
    name: '复古暖色',
    shikiTheme: 'rose-pine-dawn',
    titleBarBg: '#f2e9e1',
    codeBg: '#faf4ed',
    lineNumberColor: '#9893a5',
    dotColors: { red: '#b4637a', yellow: '#ea9d34', green: '#286983' },
  },
]

/** @typedef {typeof CODE_THEMES[number]} CodeTheme */

/** @typedef {'dark-night' | 'github-light' | 'vintage-warm'} ThemeId */

/** 背景类型 */
export const BACKGROUND_TYPES = {
  SOLID: 'solid',
  GRADIENT: 'gradient',
  IMAGE: 'image',
}

/** 各主题默认背景预设（纯色 / 渐变） */
export const BACKGROUND_PRESETS = {
  'dark-night': {
    solid: '#1a1a2e',
    gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    defaultImage: '',
  },
  'github-light': {
    solid: '#e8eef4',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    defaultImage: '',
  },
  'vintage-warm': {
    solid: '#f5e6d3',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    defaultImage: '',
  },
}

/** 支持的语言列表（需与 App 中 Shiki 预加载一致） */
export const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'css', label: 'CSS' },
  { id: 'html', label: 'HTML' },
  { id: 'json', label: 'JSON' },
  { id: 'bash', label: 'Bash' },
  { id: 'go', label: 'Go' },
  { id: 'rust', label: 'Rust' },
  { id: 'cpp', label: 'C++' },
  { id: 'sql', label: 'SQL' },
  { id: 'markdown', label: 'Markdown' },
  { id: 'yaml', label: 'YAML' },
  { id: 'plaintext', label: 'Plain Text' },
]

/** 默认示例代码 */
export const DEFAULT_CODE = `// 在此粘贴或输入代码，右侧实时预览
function greet(name) {
  const message = \`Hello, \${name}!\`;
  console.log(message);
  return message;
}

greet('CodeSnap');
`
