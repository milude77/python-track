# 第4章 字符串与正则表达式

## 4.1 字符串基础

### 4.1.1 字符串的创建与表示

Python中的字符串是由单引号或双引号括起来的任意文本。

```python
# 使用单引号创建字符串
s1 = 'Hello, Python!'

# 使用双引号创建字符串
s2 = "Hello, Python!"

# 三引号字符串，可以跨多行
s3 = '''Hello,
Python!'''

s4 = """Hello,
Python!"""
```

### 4.1.2 转义字符

转义字符用于表示特殊字符，以反斜杠`\`开头。

```python
# 常用转义字符
print("Hello\nWorld")  # 换行
print("Hello\tWorld")  # 制表符
print("He said, \"Hello!\"")  # 双引号
print('He said, \'Hello!\'')  # 单引号
print("C:\\Program Files")  # 反斜杠
print("\u00A9")  # Unicode字符（版权符号）
```

### 4.1.3 原始字符串

原始字符串（Raw String）前缀为`r`，不会处理其中的转义字符。

```python
# 普通字符串中的转义字符会被处理
print("C:\new\text.txt")  # 输出: C:
ew	ext.txt（\n会被解释为换行）

# 原始字符串中的转义字符不会被处理
print(r"C:\new\text.txt")  # 输出: C:\new\text.txt
```

### 4.1.4 字符串的不可变性

Python中的字符串是不可变的，一旦创建就不能修改。

```python
s = "Hello"

# s[0] = "h"  # 这会引发错误：TypeError: 'str' object does not support item assignment

# 要修改字符串，需要创建一个新的字符串
s = "h" + s[1:]
print(s)  # 输出: hello
```

## 4.2 字符串操作

### 4.2.1 字符串索引与切片

```python
s = "Python"

# 索引（从0开始）
print(s[0])  # 输出: P
print(s[1])  # 输出: y

# 负索引（从-1开始，表示从末尾开始）
print(s[-1])  # 输出: n
print(s[-2])  # 输出: o

# 切片 [start:end:step]（包含start，不包含end）
print(s[0:2])  # 输出: Py
print(s[2:4])  # 输出: th
print(s[:2])  # 输出: Py（省略start表示从开头开始）
print(s[2:])  # 输出: thon（省略end表示到末尾）
print(s[::2])  # 输出: Pto（步长为2）
print(s[::-1])  # 输出: nohtyP（步长为-1，即反转字符串）
```

### 4.2.2 字符串连接与重复

```python
# 字符串连接
first_name = "John"
last_name = "Doe"
full_name = first_name + " " + last_name
print(full_name)  # 输出: John Doe

# 字符串重复
print("*" * 10)  # 输出: **********
print("abc" * 3)  # 输出: abcabcabc
```

### 4.2.3 字符串比较

```python
# 字符串比较使用比较运算符
print("apple" == "apple")  # 输出: True
print("apple" != "orange")  # 输出: True
print("apple" < "banana")  # 输出: False（按字母顺序比较）
print("apple" > "Apple")  # 输出: True（小写字母的ASCII值大于大写字母）

# 检查子字符串
print("py" in "python")  # 输出: True
print("Py" in "python")  # 输出: False（区分大小写）
print("x" not in "python")  # 输出: True
```

### 4.2.4 字符串方法

Python的字符串类型提供了丰富的方法用于字符串处理。

#### 大小写转换

```python
s = "Hello, World!"

print(s.upper())  # 输出: HELLO, WORLD!
print(s.lower())  # 输出: hello, world!
print(s.capitalize())  # 输出: Hello, world!
print(s.title())  # 输出: Hello, World!
print(s.swapcase())  # 输出: hELLO, wORLD!
```

#### 查找和替换

```python
s = "Hello, World!"

# 查找子字符串
print(s.find("World"))  # 输出: 7（返回第一次出现的索引）
print(s.find("Python"))  # 输出: -1（未找到返回-1）
print(s.index("World"))  # 输出: 7（类似find，但未找到会引发ValueError）
# print(s.index("Python"))  # 会引发ValueError

# 替换子字符串
print(s.replace("World", "Python"))  # 输出: Hello, Python!
print(s.replace("l", "L", 1))  # 输出: HeLlo, World!（只替换第一个）
```

#### 分割和连接

```python
# 分割字符串
s = "apple,banana,orange"
fruits = s.split(",")
print(fruits)  # 输出: ['apple', 'banana', 'orange']

# 按行分割
text = "Line 1\nLine 2\nLine 3"
lines = text.splitlines()
print(lines)  # 输出: ['Line 1', 'Line 2', 'Line 3']

# 连接字符串
fruits = ["apple", "banana", "orange"]
s = ", ".join(fruits)
print(s)  # 输出: apple, banana, orange
```

#### 去除空白

```python
s = "   Hello, World!   "

print(s.strip())  # 输出: "Hello, World!"（去除两端空白）
print(s.lstrip())  # 输出: "Hello, World!   "（去除左侧空白）
print(s.rstrip())  # 输出: "   Hello, World!"（去除右侧空白）

# 去除指定字符
s = "###Hello, World!###"
print(s.strip("#"))  # 输出: "Hello, World!"（去除两端的#）
```

#### 判断字符串特性

```python
# 检查字符串内容
print("123".isdigit())  # 输出: True（是否全是数字）
print("abc".isalpha())  # 输出: True（是否全是字母）
print("abc123".isalnum())  # 输出: True（是否全是字母或数字）
print("   ".isspace())  # 输出: True（是否全是空白字符）

# 检查字符串大小写
print("ABC".isupper())  # 输出: True（是否全是大写）
print("abc".islower())  # 输出: True（是否全是小写）
print("Hello World".istitle())  # 输出: True（是否是标题形式）
```

#### 对齐和填充

```python
s = "Hello"

print(s.ljust(10))  # 输出: "Hello     "（左对齐，总长度为10）
print(s.rjust(10))  # 输出: "     Hello"（右对齐，总长度为10）
print(s.center(10))  # 输出: "  Hello   "（居中对齐，总长度为10）

# 指定填充字符
print(s.ljust(10, "*"))  # 输出: "Hello*****"（左对齐，用*填充）
print(s.rjust(10, "*"))  # 输出: "*****Hello"（右对齐，用*填充）
print(s.center(10, "*"))  # 输出: "**Hello***"（居中对齐，用*填充）

# 数字填充
print("42".zfill(5))  # 输出: "00042"（用0填充）
```

### 4.2.5 字符串格式化

Python提供了多种字符串格式化的方式。

#### %运算符（旧式格式化）

```python
name = "Alice"
age = 25

# 基本格式化
print("My name is %s and I am %d years old." % (name, age))

# 常用格式说明符
# %s - 字符串
# %d - 整数
# %f - 浮点数
# %x - 十六进制数
# %o - 八进制数
# %e - 科学计数法

# 控制浮点数精度
pi = 3.14159
print("Pi is approximately %.2f" % pi)  # 输出: Pi is approximately 3.14

# 控制宽度和对齐
print("%10s" % name)  # 输出: "     Alice"（右对齐，宽度为10）
print("%-10s" % name)  # 输出: "Alice     "（左对齐，宽度为10）
```

#### format()方法

```python
name = "Bob"
age = 30

# 基本格式化
print("My name is {} and I am {} years old.".format(name, age))

# 使用位置索引
print("My name is {0} and I am {1} years old.".format(name, age))
print("{1} is {0} years old.".format(age, name))  # 输出: Bob is 30 years old.

# 使用命名参数
print("My name is {name} and I am {age} years old.".format(name=name, age=age))

# 格式说明符
pi = 3.14159
print("Pi is approximately {:.2f}".format(pi))  # 输出: Pi is approximately 3.14

# 控制宽度和对齐
print("{:10}".format(name))  # 输出: "Bob       "（右对齐，宽度为10）
print("{:<10}".format(name))  # 输出: "Bob       "（左对齐，宽度为10）
print("{:>10}".format(name))  # 输出: "       Bob"（右对齐，宽度为10）
print("{:^10}".format(name))  # 输出: "   Bob    "（居中对齐，宽度为10）

# 填充字符
print("{:*>10}".format(name))  # 输出: "*******Bob"（右对齐，用*填充）

# 数字格式化
print("{:,}".format(1000000))  # 输出: "1,000,000"（添加千位分隔符）
print("{:.2%}".format(0.25))  # 输出: "25.00%"（百分比格式）
print("{:b}".format(10))  # 输出: "1010"（二进制格式）
print("{:x}".format(255))  # 输出: "ff"（十六进制格式）
```

#### f-string（Python 3.6+）

f-string是Python 3.6引入的一种新的字符串格式化语法，更简洁、更高效。

```python
name = "Charlie"
age = 35

# 基本格式化
print(f"My name is {name} and I am {age} years old.")

# 表达式求值
print(f"Next year, I will be {age + 1} years old.")

# 调用方法
print(f"My name in uppercase is {name.upper()}.")

# 格式说明符
pi = 3.14159
print(f"Pi is approximately {pi:.2f}")  # 输出: Pi is approximately 3.14

# 控制宽度和对齐
print(f"{name:10}")  # 输出: "Charlie   "（左对齐，宽度为10）
print(f"{name:>10}")  # 输出: "   Charlie"（右对齐，宽度为10）
print(f"{name:^10}")  # 输出: " Charlie  "（居中对齐，宽度为10）

# 填充字符
print(f"{name:*>10}")  # 输出: "***Charlie"（右对齐，用*填充）

# 数字格式化
print(f"{1000000:,}")  # 输出: "1,000,000"（添加千位分隔符）
print(f"{0.25:.2%}")  # 输出: "25.00%"（百分比格式）
```

## 4.3 正则表达式

### 4.3.1 正则表达式简介

正则表达式（Regular Expression，简称regex）是一种用于匹配字符串模式的强大工具。在Python中，通过`re`模块使用正则表达式。

```python
import re
```

### 4.3.2 基本模式匹配

```python
import re

# 使用re.match()函数从字符串开头匹配模式
result = re.match(r"Hello", "Hello, World!")
if result:
    print("Match found:", result.group())  # 输出: Match found: Hello

# 使用re.search()函数在整个字符串中搜索模式
result = re.search(r"World", "Hello, World!")
if result:
    print("Match found:", result.group())  # 输出: Match found: World

# 使用re.findall()函数找出所有匹配项
result = re.findall(r"o", "Hello, World!")
print(result)  # 输出: ['o', 'o']

# 使用re.sub()函数替换匹配项
result = re.sub(r"World", "Python", "Hello, World!")
print(result)  # 输出: Hello, Python!
```

### 4.3.3 元字符

正则表达式中的元字符具有特殊含义。

```python
import re

# . - 匹配任意字符（除了换行符）
print(re.findall(r"h.t", "hit hat hot hut"))  # 输出: ['hit', 'hat', 'hot', 'hut']

# ^ - 匹配字符串开头
print(re.findall(r"^h", "hello hi hey"))  # 输出: ['h']

# $ - 匹配字符串结尾
print(re.findall(r"y$", "hey why cry"))  # 输出: ['y']

# * - 匹配前一个字符0次或多次
print(re.findall(r"ab*c", "ac abc abbc"))  # 输出: ['ac', 'abc', 'abbc']

# + - 匹配前一个字符1次或多次
print(re.findall(r"ab+c", "ac abc abbc"))  # 输出: ['abc', 'abbc']

# ? - 匹配前一个字符0次或1次
print(re.findall(r"ab?c", "ac abc abbc"))  # 输出: ['ac', 'abc']

# {} - 指定匹配次数
print(re.findall(r"ab{2}c", "ac abc abbc"))  # 输出: ['abbc']
print(re.findall(r"ab{1,2}c", "ac abc abbc"))  # 输出: ['abc', 'abbc']

# | - 或运算符
print(re.findall(r"cat|dog", "I have a cat and a dog"))  # 输出: ['cat', 'dog']

# [] - 字符集，匹配集合中的任意一个字符
print(re.findall(r"[aeiou]", "hello"))  # 输出: ['e', 'o']

# [^] - 否定字符集，匹配不在集合中的任意一个字符
print(re.findall(r"[^aeiou]", "hello"))  # 输出: ['h', 'l', 'l']

# - - 在字符集中表示范围
print(re.findall(r"[a-z]", "Hello123"))  # 输出: ['e', 'l', 'l', 'o']
print(re.findall(r"[0-9]", "Hello123"))  # 输出: ['1', '2', '3']

# \ - 转义字符
print(re.findall(r"\.", "Hello. World."))  # 输出: ['.', '.']
```

### 4.3.4 预定义字符集

```python
import re

# \d - 匹配任意数字，等价于[0-9]
print(re.findall(r"\d", "Hello123"))  # 输出: ['1', '2', '3']

# \D - 匹配任意非数字，等价于[^0-9]
print(re.findall(r"\D", "Hello123"))  # 输出: ['H', 'e', 'l', 'l', 'o']

# \w - 匹配任意字母、数字或下划线，等价于[a-zA-Z0-9_]
print(re.findall(r"\w", "Hello_123"))  # 输出: ['H', 'e', 'l', 'l', 'o', '_', '1', '2', '3']

# \W - 匹配任意非字母、数字或下划线，等价于[^a-zA-Z0-9_]
print(re.findall(r"\W", "Hello, World!"))  # 输出: [',', ' ', '!']

# \s - 匹配任意空白字符（空格、制表符、换行符等）
print(re.findall(r"\s", "Hello World\t\n"))  # 输出: [' ', '\t', '\n']

# \S - 匹配任意非空白字符
print(re.findall(r"\S", "Hello World"))  # 输出: ['H', 'e', 'l', 'l', 'o', 'W', 'o', 'r', 'l', 'd']

# \b - 匹配单词边界
print(re.findall(r"\bworld\b", "hello world!"))  # 输出: ['world']

# \B - 匹配非单词边界
print(re.findall(r"\Bor\B", "hello world"))  # 输出: []
print(re.findall(r"\Bor\B", "tomorrow"))  # 输出: ['or']
```

### 4.3.5 分组和捕获

```python
import re

# 使用()进行分组
result = re.search(r"(\d+)-(\d+)-(\d+)", "Date: 2023-05-15")
if result:
    print("Full match:", result.group(0))  # 输出: 2023-05-15
    print("Year:", result.group(1))  # 输出: 2023
    print("Month:", result.group(2))  # 输出: 05
    print("Day:", result.group(3))  # 输出: 15
    print("All groups:", result.groups())  # 输出: ('2023', '05', '15')

# 命名分组
result = re.search(r"(?P<year>\d+)-(?P<month>\d+)-(?P<day>\d+)", "Date: 2023-05-15")
if result:
    print("Year:", result.group("year"))  # 输出: 2023
    print("Month:", result.group("month"))  # 输出: 05
    print("Day:", result.group("day"))  # 输出: 15

# 非捕获分组 (?:...)
result = re.findall(r"(?:\d+)-(?:\d+)-(?:\d+)", "Dates: 2023-05-15, 2023-06-20")
print(result)  # 输出: ['2023-05-15', '2023-06-20']
```

### 4.3.6 贪婪与非贪婪匹配

默认情况下，正则表达式使用贪婪匹配，尽可能多地匹配字符。通过在量词后添加`?`可以实现非贪婪（懒惰）匹配。

```python
import re

text = "<div>Content 1</div><div>Content 2</div>"

# 贪婪匹配
result = re.search(r"<div>.*</div>", text)
print(result.group())  # 输出: <div>Content 1</div><div>Content 2</div>

# 非贪婪匹配
result = re.search(r"<div>.*?</div>", text)
print(result.group())  # 输出: <div>Content 1</div>

# 查找所有匹配项
result = re.findall(r"<div>.*?</div>", text)
print(result)  # 输出: ['<div>Content 1</div>', '<div>Content 2</div>']
```

### 4.3.7 正则表达式标志

```python
import re

text = "Hello\nWorld"

# re.I 或 re.IGNORECASE - 忽略大小写
print(re.findall(r"hello", text, re.I))  # 输出: ['Hello']

# re.M 或 re.MULTILINE - 多行模式，^和$匹配每一行的开头和结尾
print(re.findall(r"^\w+", text, re.M))  # 输出: ['Hello', 'World']

# re.S 或 re.DOTALL - 点号匹配包括换行符在内的所有字符
print(re.findall(r"Hello.World", text))  # 输出: []
print(re.findall(r"Hello.World", text, re.S))  # 输出: ['Hello\nWorld']

# re.X 或 re.VERBOSE - 详细模式，可以添加注释和空白
pattern = re.compile(r"""
    \d+      # 一个或多个数字
    [-/]     # 连字符或斜杠
    \d+      # 一个或多个数字
    [-/]     # 连字符或斜杠
    \d+      # 一个或多个数字
""", re.X)
print(pattern.findall("Dates: 2023-05-15, 2023/06/20"))  # 输出: ['2023-05-15', '2023/06/20']
```

### 4.3.8 编译正则表达式

对于重复使用的正则表达式，可以预先编译以提高效率。

```python
import re

# 编译正则表达式
pattern = re.compile(r"\d+")

# 使用编译后的正则表达式
print(pattern.findall("There are 123 apples and 456 oranges"))  # 输出: ['123', '456']
print(pattern.search("There are 123 apples").group())  # 输出: 123
print(pattern.match("123 apples").group())  # 输出: 123
```

## 4.4 实例：文本处理

### 4.4.1 提取电子邮件地址

```python
import re

text = """Contact us at info@example.com or support@example.org.
For sales inquiries, email sales@example.com."""

# 匹配电子邮件地址的正则表达式
email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"

# 提取所有电子邮件地址
emails = re.findall(email_pattern, text)
print(emails)  # 输出: ['info@example.com', 'support@example.org', 'sales@example.com']
```

### 4.4.2 验证密码强度

```python
import re

def check_password_strength(password):
    """检查密码强度

    要求：
    - 至少8个字符
    - 至少包含一个大写字母
    - 至少包含一个小写字母
    - 至少包含一个数字
    - 至少包含一个特殊字符
    """
    if len(password) < 8:
        return False

    if not re.search(r"[A-Z]", password):
        return False

    if not re.search(r"[a-z]", password):
        return False

    if not re.search(r"\d", password):
        return False

    if not re.search(r"[!@#$%^&*(),.?":{}|<>]", password):
        return False

    return True

# 测试密码强度
passwords = ["abc123", "Password123", "Password123!", "pass"]
for password in passwords:
    if check_password_strength(password):
        print(f"\"{password}\" is a strong password.")
    else:
        print(f"\"{password}\" is not a strong password.")
```

### 4.4.3 解析CSV数据

```python
import re

csv_data = """
Name,Age,Email
John Doe,30,john@example.com
Jane Smith,25,jane@example.com
"Doe, Robert",45,robert@example.com
"""

# 解析CSV数据（处理带引号的字段）
pattern = r'(?:^|,)("(?:[^"]*(?:""[^"]*)*)"|[^,]*)'  # 匹配CSV字段

for line in csv_data.strip().split('\n')[1:]:
    fields = []
    pos = 0
    while pos < len(line):
        match = re.match(pattern, line[pos:])
        if match:
            field = match.group(1) or match.group(0)
            if field.startswith('"') and field.endswith('"'):
                field = field[1:-1].replace('""', '"')
            fields.append(field.strip(','))
            pos += len(match.group(0))
        else:
            break
    print(fields)

# 输出:
# ['John Doe', '30', 'john@example.com']
# ['Jane Smith', '25', 'jane@example.com']
# ['Doe, Robert', '45', 'robert@example.com']
```

## 4.5 课后习题

### 基础练习题

1. 编写程序，输入一个字符串，统计其中英文字母、数字和其他字符的个数。

2. 编写程序，将输入的字符串中的小写字母全部转换为大写字母，大写字母全部转换为小写字母。

3. 编写程序，判断用户输入的字符串是否是回文字符串（正读和反读都一样，如"level"）。

4. 编写程序，统计一个字符串中每个字符出现的次数，并按照字符的ASCII码值从小到大排序输出。

5. 编写程序，使用正则表达式验证用户输入的电子邮件地址是否合法。

### 综合应用题

1. 编写程序，从一段英文文本中提取所有的网址（URL），要求使用正则表达式实现。

2. 编写程序，实现字符串的加密和解密。加密规则：将字符串中的每个字符按ASCII码值加上它在字符串中的位置（从0开始）后对128取余作为新的ASCII码值。解密规则：将加密后的字符串中的每个字符按ASCII码值减去它在字符串中的位置后对128取余作为新的ASCII码值。

3. 编写程序，实现以下功能：
   - 输入一个包含多个单词的英文句子
   - 去除句子中的标点符号
   - 将每个单词的首字母大写，其他字母小写
   - 按照单词长度从大到小排序
   - 如果长度相同，按照字母顺序排序
   - 最后输出排序后的结果，每个单词占一行

4. 编写程序，使用正则表达式实现以下功能：
   - 从一段文本中提取所有的日期（支持多种日期格式，如：2023-12-31、2023/12/31、2023.12.31）
   - 判断日期是否合法（考虑闰年、大小月等情况）
   - 将所有合法日期转换为统一格式（YYYY-MM-DD）输出
