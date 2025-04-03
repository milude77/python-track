// Monaco编辑器的One Light主题配置
// 基于Atom's One Light主题和prism-one-light.css

/**
 * One Light颜色值 (来自prism-one-light.css)
 * --mono-1: hsl(230, 8%, 24%)  - 主要文本
 * --mono-2: hsl(230, 6%, 44%)  - 次要文本
 * --mono-3: hsl(230, 4%, 64%)  - 注释
 * --hue-1: hsl(198, 99%, 37%)  - URL
 * --hue-2: hsl(221, 87%, 60%)  - 变量、函数
 * --hue-3: hsl(301, 63%, 40%)  - 关键字
 * --hue-4: hsl(119, 34%, 47%)  - 字符串
 * --hue-5: hsl(5, 74%, 59%)    - 属性、标签
 * --hue-5-2: hsl(344, 84%, 43%) - 插值标点
 * --hue-6: hsl(35, 99%, 36%)   - 属性名、布尔值、常量
 * --hue-6-2: hsl(35, 99%, 40%) - 数字
 * --syntax-fg: hsl(230, 8%, 24%)  - 前景色
 * --syntax-bg: hsl(230, 1%, 98%)  - 背景色
 * --syntax-selection: hsl(230, 1%, 90%) - 选择背景
 */

const oneLight = {
  base: 'vs', // 使用浅色主题作为基础
  inherit: true, // 继承基础主题的规则
  rules: [
    // 基本语法元素
    { token: '', foreground: '383a42' }, // 默认文本颜色 (--syntax-fg)
    { token: 'comment', foreground: '9d9d9f', fontStyle: 'italic' }, // 注释 (--mono-3)
    { token: 'keyword', foreground: 'a626a4' }, // 关键字 (--hue-3)
    { token: 'operator', foreground: 'a626a4' }, // 操作符 (--hue-3)
    { token: 'string', foreground: '50a14f' }, // 字符串 (--hue-4)
    { token: 'string.escape', foreground: '50a14f' }, // 转义字符
    { token: 'constant', foreground: 'c18401' }, // 常量 (--hue-6)
    { token: 'variable', foreground: '4078f2' }, // 变量 (--hue-2)
    { token: 'variable.parameter', foreground: '383a42' }, // 参数变量
    { token: 'variable.language', foreground: 'a626a4' }, // 语言变量 (this, self等)
    { token: 'function', foreground: '4078f2' }, // 函数 (--hue-2)
    { token: 'number', foreground: 'c18401' }, // 数字 (--hue-6)
    { token: 'boolean', foreground: 'c18401' }, // 布尔值 (--hue-6)
    { token: 'regexp', foreground: '50a14f' }, // 正则表达式 (--hue-4)

    // 标记和标签
    { token: 'tag', foreground: 'e45649' }, // 标签 (--hue-5)
    { token: 'tag.attribute.name', foreground: 'c18401' }, // 属性名 (--hue-6)
    { token: 'attribute.name', foreground: 'c18401' }, // 属性名 (--hue-6)
    { token: 'attribute.value', foreground: '50a14f' }, // 属性值 (--hue-4)

    // 特定语言
    // Python
    { token: 'keyword.control.python', foreground: 'a626a4' }, // Python控制关键字
    { token: 'keyword.python', foreground: 'a626a4' }, // Python关键字
    { token: 'support.function.python', foreground: '4078f2' }, // Python内置函数
    { token: 'builtin.python', foreground: '4078f2' }, // Python内置函数(另一种token名)
    { token: 'support.type.python', foreground: 'c18401' }, // Python内置类型
    { token: 'support.variable.magic.python', foreground: 'e45649' }, // Python魔术变量
    { token: 'constant.language.python', foreground: 'c18401' }, // Python语言常量(True/False/None)
    { token: 'boolean.python', foreground: 'c18401' }, // Python布尔值(另一种token名)

    // JavaScript
    { token: 'identifier.js', foreground: '383a42' }, // JS标识符
    { token: 'keyword.operator.new.js', foreground: 'a626a4' }, // JS new操作符

    // JSON
    { token: 'string.key.json', foreground: 'e45649' }, // JSON键
    { token: 'string.value.json', foreground: '50a14f' }, // JSON值

    // CSS
    { token: 'entity.name.selector.css', foreground: 'e45649' }, // CSS选择器
    { token: 'support.type.property-name.css', foreground: '383a42' }, // CSS属性名
    { token: 'meta.property-value.css', foreground: '0184bc' }, // CSS属性值
    { token: 'entity.other.attribute-name.class.css', foreground: 'c18401' }, // CSS类

    // HTML
    { token: 'entity.name.tag.html', foreground: 'e45649' }, // HTML标签
    { token: 'entity.other.attribute-name.html', foreground: 'c18401' }, // HTML属性

    // Markdown
    { token: 'markup.heading.markdown', foreground: 'e45649' }, // Markdown标题
    { token: 'markup.inline.raw.markdown', foreground: '50a14f' }, // Markdown内联代码
    { token: 'markup.bold.markdown', foreground: 'c18401', fontStyle: 'bold' }, // Markdown粗体
    { token: 'markup.italic.markdown', foreground: 'a626a4', fontStyle: 'italic' } // Markdown斜体
  ],
  colors: {
    // 编辑器基础颜色
    'editor.background': '#fafafa', // 背景色 (--syntax-bg)
    'editor.foreground': '#383a42', // 前景色 (--syntax-fg)
    'editorCursor.foreground': '#526fff', // 光标颜色 (--syntax-accent)
    'editor.selectionBackground': '#e5e5e6', // 选择背景 (--syntax-selection)
    'editor.inactiveSelectionBackground': '#e5e5e6', // 非活动选择背景
    'editor.lineHighlightBackground': '#f2f2f2', // 当前行高亮 (--syntax-cursor-line)

    // 编辑器组件颜色
    'editorLineNumber.foreground': '#9d9d9f', // 行号 (--syntax-gutter)
    'editorIndentGuide.background': '#00000015', // 缩进指南 (--syntax-guide)
    'editorIndentGuide.activeBackground': '#626772', // 活动缩进指南
    'editorBracketMatch.background': '#e5e5e6', // 括号匹配背景
    'editorBracketMatch.border': '#526fff', // 括号匹配边框

    // 搜索和高亮
    'editor.findMatchBackground': '#e5e5e6', // 查找匹配
    'editor.findMatchHighlightBackground': '#e5e5e680', // 查找高亮

    // 错误和警告
    'editorError.foreground': '#e45649', // 错误 (--hue-5)
    'editorWarning.foreground': '#c18401', // 警告 (--hue-6)

    // 其他UI元素
    'editorGutter.background': '#fafafa', // 行号背景
    'editorWidget.background': '#f5f5f5', // 编辑器小部件背景
    'editorSuggestWidget.background': '#f5f5f5', // 建议小部件背景
    'editorSuggestWidget.border': '#e5e5e6', // 建议小部件边框
    'editorSuggestWidget.selectedBackground': '#e5e5e6', // 建议小部件选中项
    'editorHoverWidget.background': '#f5f5f5', // 悬停小部件背景
    'editorHoverWidget.border': '#e5e5e6' // 悬停小部件边框
  }
}

export default oneLight
