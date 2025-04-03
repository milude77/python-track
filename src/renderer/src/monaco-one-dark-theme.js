// Monaco编辑器的One Dark主题配置
// 与One Light主题对应的暗色主题

/**
 * One Dark颜色值
 * 这些颜色与One Light主题相对应，但适用于暗色背景
 */

const oneDark = {
  base: 'vs-dark', // 使用暗色主题作为基础
  inherit: true, // 继承基础主题的规则
  rules: [
    // 基本语法元素
    { token: '', foreground: 'abb2bf' }, // 默认文本颜色
    { token: 'comment', foreground: '5c6370', fontStyle: 'italic' }, // 注释
    { token: 'keyword', foreground: 'c678dd' }, // 关键字
    { token: 'operator', foreground: 'c678dd' }, // 操作符
    { token: 'string', foreground: '98c379' }, // 字符串
    { token: 'string.escape', foreground: '98c379' }, // 转义字符
    { token: 'constant', foreground: 'd19a66' }, // 常量
    { token: 'variable', foreground: '61afef' }, // 变量
    { token: 'variable.parameter', foreground: 'abb2bf' }, // 参数变量
    { token: 'variable.language', foreground: 'c678dd' }, // 语言变量 (this, self等)
    { token: 'function', foreground: '61afef' }, // 函数
    { token: 'number', foreground: 'd19a66' }, // 数字
    { token: 'boolean', foreground: 'd19a66' }, // 布尔值
    { token: 'regexp', foreground: '98c379' }, // 正则表达式

    // 标记和标签
    { token: 'tag', foreground: 'e06c75' }, // 标签
    { token: 'tag.attribute.name', foreground: 'd19a66' }, // 属性名
    { token: 'attribute.name', foreground: 'd19a66' }, // 属性名
    { token: 'attribute.value', foreground: '98c379' }, // 属性值

    // 特定语言
    // Python
    { token: 'keyword.control.python', foreground: 'c678dd' }, // Python控制关键字
    { token: 'keyword.python', foreground: 'c678dd' }, // Python关键字
    { token: 'support.function.python', foreground: '61afef' }, // Python内置函数
    { token: 'builtin.python', foreground: '61afef' }, // Python内置函数(另一种token名)
    { token: 'support.type.python', foreground: 'd19a66' }, // Python内置类型
    { token: 'support.variable.magic.python', foreground: 'e06c75' }, // Python魔术变量
    { token: 'constant.language.python', foreground: 'd19a66' }, // Python语言常量(True/False/None)
    { token: 'boolean.python', foreground: 'd19a66' }, // Python布尔值(另一种token名)

    // JavaScript
    { token: 'identifier.js', foreground: 'abb2bf' }, // JS标识符
    { token: 'keyword.operator.new.js', foreground: 'c678dd' }, // JS new操作符

    // JSON
    { token: 'string.key.json', foreground: 'e06c75' }, // JSON键
    { token: 'string.value.json', foreground: '98c379' }, // JSON值

    // CSS
    { token: 'entity.name.selector.css', foreground: 'e06c75' }, // CSS选择器
    { token: 'support.type.property-name.css', foreground: 'abb2bf' }, // CSS属性名
    { token: 'meta.property-value.css', foreground: '56b6c2' }, // CSS属性值
    { token: 'entity.other.attribute-name.class.css', foreground: 'd19a66' }, // CSS类

    // HTML
    { token: 'entity.name.tag.html', foreground: 'e06c75' }, // HTML标签
    { token: 'entity.other.attribute-name.html', foreground: 'd19a66' }, // HTML属性

    // Markdown
    { token: 'markup.heading.markdown', foreground: 'e06c75' }, // Markdown标题
    { token: 'markup.inline.raw.markdown', foreground: '98c379' }, // Markdown内联代码
    { token: 'markup.bold.markdown', foreground: 'd19a66', fontStyle: 'bold' }, // Markdown粗体
    { token: 'markup.italic.markdown', foreground: 'c678dd', fontStyle: 'italic' } // Markdown斜体
  ],
  colors: {
    // 编辑器基础颜色
    'editor.background': '#282c34', // 背景色
    'editor.foreground': '#abb2bf', // 前景色
    'editorCursor.foreground': '#528bff', // 光标颜色
    'editor.selectionBackground': '#3e4451', // 选择背景
    'editor.inactiveSelectionBackground': '#3a3f4b', // 非活动选择背景
    'editor.lineHighlightBackground': '#2c313a', // 当前行高亮

    // 编辑器组件颜色
    'editorLineNumber.foreground': '#5c6370', // 行号
    'editorIndentGuide.background': '#ffffff15', // 缩进指南
    'editorIndentGuide.activeBackground': '#626772', // 活动缩进指南
    'editorBracketMatch.background': '#3e4451', // 括号匹配背景
    'editorBracketMatch.border': '#528bff', // 括号匹配边框

    // 搜索和高亮
    'editor.findMatchBackground': '#3e4451', // 查找匹配
    'editor.findMatchHighlightBackground': '#3e445180', // 查找高亮

    // 错误和警告
    'editorError.foreground': '#e06c75', // 错误
    'editorWarning.foreground': '#d19a66', // 警告

    // 其他UI元素
    'editorGutter.background': '#282c34', // 行号背景
    'editorWidget.background': '#21252b', // 编辑器小部件背景
    'editorSuggestWidget.background': '#21252b', // 建议小部件背景
    'editorSuggestWidget.border': '#3a3f4b', // 建议小部件边框
    'editorSuggestWidget.selectedBackground': '#2c313a', // 建议小部件选中项
    'editorHoverWidget.background': '#21252b', // 悬停小部件背景
    'editorHoverWidget.border': '#3a3f4b' // 悬停小部件边框
  }
}

export default oneDark
