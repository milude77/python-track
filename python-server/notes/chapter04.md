# 第4章 字符串与正则表达式

## 4.1 字符串基础

### 字符串的创建与表示

字符串在Python中是不可变的序列类型，这意味着一旦创建，其内容就不能被修改。任何看似修改字符串的操作实际上都是创建了一个新的字符串对象。

```python
# 字符串创建
s1 = 'Hello'              # 单引号
s2 = "Python's string"    # 双引号
s3 = '''多行
字符串'''                # 三引号

# 转义字符
path = 'C:\\Users\\Documents'  # 反斜杠转义
raw_path = r'C:\Users\Documents'  # 原始字符串

# Unicode字符串
u_str = '你好，Python'
print(len(u_str))  # 8
```

### 字符串索引与切片

```python
# 字符串索引
text = "Python"
print(text[0])    # 'P'
print(text[-1])   # 'n'

# 字符串切片
print(text[0:2])  # 'Py'
print(text[2:])   # 'thon'
print(text[:2])   # 'Py'
print(text[::2])  # 'Pto'
print(text[::-1]) # 'nohtyP'
```

## 4.2 字符串操作

### 常用字符串方法

| 方法 | 说明 | 示例 |
|------|------|------|
| find/rfind | 查找子串位置 | str.find('sub') |
| index/rindex | 查找子串位置 | str.index('sub') |
| count | 计算子串出现次数 | str.count('sub') |
| split/rsplit | 分割字符串 | str.split(',') |
| join | 连接字符串 | '-'.join(list) |
| strip | 去除两端空白 | str.strip() |
| replace | 替换子串 | str.replace('old', 'new') |
| upper/lower | 大小写转换 | str.upper() |

```python
# 字符串查找
text = "Hello, Python!"
print(text.find('Python'))    # 7
print(text.find('Java'))      # -1

# 字符串分割
words = "apple,banana,orange"
fruit_list = words.split(',')
print(fruit_list)  # ['apple', 'banana', 'orange']

# 字符串连接
delimiter = '-'
joined = delimiter.join(['2023', '12', '31'])
print(joined)  # '2023-12-31'

# 字符串替换
text = "Hello, World!"
new_text = text.replace('World', 'Python')
print(new_text)  # 'Hello, Python!'

# 字符串清理
text = "   Python   \n"
clean_text = text.strip()
print(clean_text)  # 'Python'
```

### 字符串格式化

```python
# %操作符格式化
name = "Alice"
age = 20
print("Name: %s, Age: %d" % (name, age))

# format()方法格式化
print("Name: {}, Age: {}".format(name, age))
print("Name: {0}, Age: {1}".format(name, age))
print("Name: {n}, Age: {a}".format(n=name, a=age))

# f-string格式化（Python 3.6+）
print(f"Name: {name}, Age: {age}")
print(f"1 + 1 = {1 + 1}")

# 格式化选项
pi = 3.14159
print(f"Pi: {pi:.2f}")  # 保留小数点
price = 12345.6789
print(f"Price: ${price:,.2f}")  # 添加千位分隔符

# 对齐和填充
for i in range(1, 4):
    print(f"{i:>3}: {i*i:>3}")
```

## 4.3 正则表达式

### 正则表达式语法

正则表达式是一种强大的文本模式匹配和处理工具，在Python中通过`re`模块实现。以下是正则表达式的主要组成部分及其详细说明：

以下是整理成表格形式的正则表达式主要元素：

### 正则表达式核心元素表格

| 类别         | 元字符/语法     | 说明                           | 示例                               |
| ------------ | --------------- | ------------------------------ | ---------------------------------- |
| **字符类**   | `\d`            | 匹配任何数字（0-9）            | `\d\d` 匹配 "42"                   |
|              | `\w`            | 匹配字母数字或下划线           | `\w+` 匹配 "word_1"                |
|              | `\s`            | 匹配空白字符（空格、制表符等） | `\s+` 匹配 "  "                    |
|              | `.`             | 匹配除换行符外的任意字符       | `a.c` 匹配 "abc"、"a c"            |
|              | `[abc]`         | 匹配括号内的任意字符           | `[aeiou]` 匹配 "a"、"e"等          |
|              | `[^abc]`        | 匹配不在括号内的字符           | `[^0-9]` 匹配字母                  |
| **数量词**   | `*`             | 匹配0次或多次（贪婪）          | `a*` 匹配 ""、"a"、"aa"            |
|              | `+`             | 匹配1次或多次                  | `\d+` 匹配 "1"、"123"              |
|              | `?`             | 匹配0次或1次                   | `colou?r` 匹配 "color"或"colour"   |
|              | `{n}`           | 精确匹配n次                    | `a{3}` 匹配 "aaa"                  |
|              | `{n,m}`         | 匹配n到m次                     | `\d{2,4}` 匹配 "12"、"1234"        |
| **位置匹配** | `^`             | 匹配字符串开头                 | `^Start` 匹配行首的"Start"         |
|              | `$`             | 匹配字符串结尾                 | `end$` 匹配行尾的"end"             |
|              | `\b`            | 匹配单词边界                   | `\bword\b` 匹配独立的"word"        |
| **分组**     | `(pattern)`     | 捕获分组                       | `(ab)+` 匹配 "abab"（捕获到分组1） |
|              | `(?:pattern)`   | 非捕获分组                     | `(?:ab)+` 不保存分组               |
|              | `(?P<name>...)` | 命名分组                       | `(?P<year>\d{4})` 捕获为year组     |
| **其他**     | `\|`            | 或运算符                       | `cat\|dog` 匹配 "cat"或"dog"       |
|              | `\`             | 转义特殊字符                   | `\.` 匹配字面量"."                 |

### 高级特性补充表

| 功能           | 语法           | 说明         | 示例                                                    |
| -------------- | -------------- | ------------ | ------------------------------------------------------- |
| **非贪婪匹配** | `*?` `+?` `??` | 最小化匹配   | `a.*?b` 匹配 "aab"中的"aab"（而非贪婪模式的整个字符串） |
| **前瞻断言**   | `(?=pattern)`  | 正向肯定前瞻 | `\d+(?=px)` 匹配后面跟"px"的数字                        |
|                | `(?!pattern)`  | 正向否定前瞻 | `\d+(?!px)` 匹配后面不跟"px"的数字                      |
| **后顾断言**   | `(?<=pattern)` | 正向肯定后顾 | `(?<=\$)\d+` 匹配前面有"$"的数字                        |
|                | `(?<!pattern)` | 正向否定后顾 | `(?<!\$)\d+` 匹配前面没有"$"的数字                      |

### 正则表达式示例

```python
import re

# 基本匹配
text = "Python 3.9"
if re.match(r"Python \d\.\d", text):
    print("版本号匹配")

# 查找所有匹配
text = "电话：021-12345678，手机：13812345678"
phones = re.findall(r'\d{2,3}-?\d{8}', text)
print(phones)  # ['021-12345678', '13812345678']

# 替换字符串
text = "Hello, World!"
new_text = re.sub(r'World', 'Python', text)
print(new_text)  # 'Hello, Python!'

# 分割字符串
text = "apple;banana,orange\n grape"
fruits = re.split(r'[;,\s]+', text)
print(fruits)  # ['apple', 'banana', 'orange', 'grape']

# 使用groups
text = "生日：1990-05-15"
match = re.search(r'(\d{4})-(\d{2})-(\d{2})', text)
if match:
    year, month, day = match.groups()
    print(f"年：{year}, 月：{month}, 日：{day}")

# 命名捕获组
text = "姓名：张三，年龄：25"
match = re.search(r'姓名：(?P<name>\w+)，年龄：(?P<age>\d+)', text)
if match:
    print(match.groupdict())
```

### 常用正则表达式模式

| 用途 | 正则表达式 | 说明 |
|------|------------|------|
| 邮箱 | `[\w\.-]+@[\w\.-]+\.\w+` | 基本邮箱格式 |
| 手机号 | `1[3-9]\d{9}` | 中国手机号 |
| 日期 | `\d{4}-\d{2}-\d{2}` | yyyy-mm-dd格式 |
| IP地址 | `\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}` | IPv4地址 |
| URL | `https?://[\w\-\.]+[\w/]+` | 网址 |

## 4.4 高级应用

### 文本处理示例

```python
# 提取文本中的所有URL
text = """
访问 https://www.python.org 了解更多信息
文档：http://docs.python.org/3/
下载：https://www.python.org/downloads/
"""

urls = re.findall(r'https?://[\w\-\.]+[\w/]+', text)
for url in urls:
    print(url)

# 解析日志文件
log_line = '192.168.1.1 - - [21/Nov/2023:10:55:36 +0800] "GET /index.html HTTP/1.1" 200 2326'
pattern = r'(?P<ip>[\d\.]+) .* \[(?P<date>[^\]]+)\] "(?P<request>[^"]+)" (?P<status>\d+) (?P<size>\d+)'
match = re.search(pattern, log_line)
if match:
    print(match.groupdict())

# 密码强度检查
def check_password_strength(password):
    checks = [
        (r'[A-Z]', '大写字母'),
        (r'[a-z]', '小写字母'),
        (r'\d', '数字'),
        (r'[^A-Za-z0-9]', '特殊字符')
    ]

    strength = 0
    missing = []
    for pattern, desc in checks:
        if re.search(pattern, password):
            strength += 1
        else:
            missing.append(desc)

    return strength, missing

# 测试密码强度
password = "Python2023!"
strength, missing = check_password_strength(password)
print(f"密码强度：{strength}/4")
if missing:
    print(f"缺少：{', '.join(missing)}")
```
