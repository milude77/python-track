# 第2章 Python序列

## 2.1 序列概述

### 2.1.1 什么是序列

Python中的序列是一种有序的元素集合，每个元素都有一个位置索引。Python中的主要序列类型包括：

- 列表(list)
- 元组(tuple)
- 字符串(str)
- 字节序列(bytes)
- 字节数组(bytearray)
- 范围(range)

### 2.1.2 序列的共同特点

- 索引：通过索引访问元素，索引从0开始
- 切片：可以获取序列的一部分
- 长度：可以使用len()函数获取序列长度
- 迭代：可以使用for循环遍历序列中的元素
- 包含测试：可以使用in和not in运算符检查元素是否在序列中

## 2.2 列表

### 2.2.1 列表的创建

```python
# 知识点：Python列表的创建方法
# 列表是Python中最常用的数据结构之一，可以存储任意类型的数据
# 特点：
# 1. 列表是有序的集合
# 2. 列表中的元素可以是不同类型
# 3. 列表是可变的，可以随时添加、删除或修改元素

# 方法一：使用方括号[]创建空列表
empty_list = []          # 最简单的创建空列表的方法

# 方法二：使用list()函数创建空列表
empty_list2 = list()     # 使用list()内置函数创建空列表

# 创建包含元素的列表 - 在方括号中直接写入元素，用逗号分隔
numbers = [1, 2, 3, 4, 5]                # 创建一个包含整数的列表
fruits = ["apple", "banana", "orange"]   # 创建一个包含字符串的列表
mixed = [1, "hello", 3.14, True]         # 创建一个包含不同类型元素的列表

# 使用list()函数将其他序列转换为列表
chars = list("Python")   # 将字符串转换为字符列表，结果为['P', 'y', 't', 'h', 'o', 'n']
```

### 2.2.2 列表的访问和修改

```python
# 知识点：Python列表的访问和修改
# 列表支持通过索引访问和修改元素
# 索引规则：
# 1. 正向索引从0开始，最大索引为列表长度减1
# 2. 负向索引从-1开始，-1表示最后一个元素
# 3. 索引超出范围会引发IndexError异常

# 通过索引访问元素
fruits = ["apple", "banana", "orange"]
print(fruits[0])    # 使用正向索引0访问第一个元素，输出: apple
print(fruits[-1])   # 使用负向索引-1访问最后一个元素，输出: orange

# 修改元素 - 直接通过索引赋新值
fruits[1] = "pear"  # 将索引1位置的元素修改为"pear"
print(fruits)       # 输出修改后的列表: ['apple', 'pear', 'orange']
```

### 2.2.3 列表的切片

```python
# 知识点：Python列表的切片操作
# 切片用于获取列表的一部分，返回一个新列表
# 切片语法：list[start:end:step]
# 特点：
# 1. start是切片开始位置（包含）
# 2. end是切片结束位置（不包含）
# 3. step是步长，默认为1
# 4. start和end都可以是负数，表示从末尾开始计数

numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# 基本切片 [start:end] - 获取从start到end（不包括end）的元素
print(numbers[2:5])   # 获取索引2到4的元素，输出: [2, 3, 4]

# 省略start - 表示从列表开头开始
print(numbers[:3])    # 获取前3个元素，输出: [0, 1, 2]

# 省略end - 表示切片到列表末尾
print(numbers[7:])    # 获取索引7到末尾的元素，输出: [7, 8, 9]

# 负索引切片 - 使用负数索引从末尾开始计数
print(numbers[-3:])   # 获取最后3个元素，输出: [7, 8, 9]

# 步长切片 [start:end:step] - 指定间隔获取元素
print(numbers[1:8:2]) # 从索引1到7，每隔一个元素取一个，输出: [1, 3, 5, 7]

# 反向切片 - 使用负步长反向获取元素
print(numbers[::-1])  # 步长为-1，获取列表的反转，输出: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
```

### 2.2.4 列表的常用操作

```python
# 知识点：Python列表的基本运算操作
# Python列表支持多种运算操作，包括：
# 1. 列表连接（+运算符）
# 2. 列表重复（*运算符）
# 3. 长度计算（len函数）
# 4. 成员检测（in和not in运算符）

# 列表连接 - 使用+运算符将两个列表合并成一个新列表
list1 = [1, 2, 3]           # 创建第一个列表
list2 = [4, 5, 6]           # 创建第二个列表
list3 = list1 + list2       # 将list1和list2连接成一个新列表
print(list3)                # 输出连接后的结果: [1, 2, 3, 4, 5, 6]

# 列表重复 - 使用*运算符将列表重复多次
list4 = [0] * 5             # 将包含一个0的列表重复5次
print(list4)                # 输出重复后的结果: [0, 0, 0, 0, 0]

# 列表长度 - 使用len()函数获取列表中元素的个数
print(len(list3))           # 输出list3的长度: 6

# 检查元素是否在列表中 - 使用in和not in运算符
print(3 in list1)           # 检查3是否在list1中，输出: True
print(7 not in list2)       # 检查7是否不在list2中，输出: True
```

### 2.2.5 列表的方法

```python
# 知识点：Python列表的常用方法
# Python列表提供了丰富的内置方法，主要包括：
# 1. 添加元素：append(), insert(), extend()
# 2. 删除元素：remove(), pop()
# 3. 查找和计数：index(), count()
# 4. 排序和反转：sort(), reverse()
# 5. 复制：copy()

fruits = ["apple", "banana", "orange"]

# 添加元素的三种方法
# 1. append() - 在列表末尾添加一个元素
fruits.append("grape")        # 将"grape"添加到列表末尾
print(fruits)                # 输出: ['apple', 'banana', 'orange', 'grape']

# 2. insert() - 在指定位置插入元素
fruits.insert(1, "pear")     # 在索引1的位置插入"pear"
print(fruits)                # 输出: ['apple', 'pear', 'banana', 'orange', 'grape']

# 3. extend() - 将另一个列表的所有元素添加到当前列表末尾
fruits.extend(["kiwi", "melon"])  # 添加多个元素
print(fruits)                # 输出: ['apple', 'pear', 'banana', 'orange', 'grape', 'kiwi', 'melon']

# 删除元素的方法
# 1. remove() - 删除第一个匹配的元素
fruits.remove("banana")      # 删除第一个"banana"
print(fruits)                # 输出: ['apple', 'pear', 'orange', 'grape', 'kiwi', 'melon']

# 2. pop() - 删除并返回指定位置的元素
popped = fruits.pop()        # 不指定索引则删除最后一个元素
print(popped)                # 输出: melon
print(fruits)                # 输出: ['apple', 'pear', 'orange', 'grape', 'kiwi']

popped = fruits.pop(1)       # 删除索引1位置的元素
print(popped)                # 输出: pear
print(fruits)                # 输出: ['apple', 'orange', 'grape', 'kiwi']

# 查找和计数方法
# 1. index() - 返回第一个匹配元素的索引
index = fruits.index("orange")  # 查找"orange"的位置
print(index)                # 输出: 1

# 2. count() - 统计元素在列表中出现的次数
numbers = [1, 2, 3, 2, 1, 2, 3, 4]
count = numbers.count(2)     # 统计2出现的次数
print(count)                # 输出: 3

# 排序方法
# 1. sort() - 对列表进行原地排序
numbers.sort()              # 默认升序排序
print(numbers)              # 输出: [1, 1, 2, 2, 2, 3, 3, 4]

fruits.sort(reverse=True)    # reverse=True表示降序排序
print(fruits)                # 输出: ['orange', 'kiwi', 'grape', 'apple']

# 2. reverse() - 反转列表元素的顺序
fruits.reverse()            # 将列表元素顺序反转
print(fruits)                # 输出: ['apple', 'grape', 'kiwi', 'orange']

# 复制列表的方法
# 1. copy() - 创建列表的浅复制
fruits_copy = fruits.copy()
# 2. 使用切片创建副本
fruits_copy2 = fruits[:]     # 与copy()方法效果相同
```

### 2.2.6 列表推导式

列表推导式是一种简洁的创建列表的方法。

```python
# 知识点：Python列表推导式
# 列表推导式是Python特有的创建列表的简洁方法
# 主要特点：
# 1. 语法简洁，可读性强
# 2. 执行效率高于普通循环
# 3. 可以包含条件筛选
# 4. 支持多层嵌套

# 基本列表推导式 - [表达式 for 变量 in 可迭代对象]
squares = [x**2 for x in range(10)]    # 生成0到9的平方数列表
print(squares)                         # 输出: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# 带条件的列表推导式 - [表达式 for 变量 in 可迭代对象 if 条件]
# 只有满足if条件的元素才会被纳入列表
even_squares = [x**2 for x in range(10) if x % 2 == 0]  # 生成偶数的平方列表
print(even_squares)                    # 输出: [0, 4, 16, 36, 64]

# 多层列表推导式 - 用于处理多维数据结构
matrix = [[1, 2, 3],                  # 创建一个3x3的矩阵
         [4, 5, 6],
         [7, 8, 9]]
# 将二维列表展平为一维列表
flattened = [x for row in matrix for x in row]  # 外层循环遍历行，内层循环遍历每行的元素
print(flattened)                      # 输出: [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

## 2.3 元组

### 2.3.1 元组的创建

```python
# 知识点：Python元组的创建方法
# 元组是Python中的不可变序列类型
# 特点：
# 1. 元组是有序的集合
# 2. 元组中的元素不能修改（不可变性）
# 3. 元组通常用于表示一组相关的值

# 创建空元组的两种方法
empty_tuple = ()           # 使用空括号创建空元组
empty_tuple2 = tuple()     # 使用tuple()函数创建空元组

# 创建包含元素的元组 - 在圆括号中写入元素，用逗号分隔
numbers = (1, 2, 3, 4, 5)                # 创建包含整数的元组
fruits = ("apple", "banana", "orange")   # 创建包含字符串的元组
mixed = (1, "hello", 3.14, True)         # 创建包含不同类型元素的元组

# 创建单元素元组 - 必须在元素后面加逗号
single = (42,)            # 注意：必须加逗号，否则(42)会被解释为整数42

# 使用tuple()函数将其他序列转换为元组
chars = tuple("Python")   # 将字符串转换为字符元组，结果为('P', 'y', 't', 'h', 'o', 'n')
```

### 2.3.2 元组的访问

```python
# 知识点：Python元组的访问和切片
# 元组的访问方式与列表类似，但不能修改元素
# 访问特点：
# 1. 使用索引访问单个元素
# 2. 使用切片访问多个元素
# 3. 支持正向和负向索引

fruits = ("apple", "banana", "orange")

# 通过索引访问元素 - 索引从0开始
print(fruits[0])    # 访问第一个元素，输出: apple
print(fruits[-1])   # 访问最后一个元素，输出: orange

# 元组切片 - 获取元组的一部分
print(fruits[1:])   # 从索引1到末尾的所有元素，输出: ('banana', 'orange')
```

### 2.3.3 元组的不可变性

元组是不可变的，创建后不能修改其元素。

```python
# 知识点：Python元组的不可变性
# 元组最重要的特性是不可变性（immutability）
# 特点：
# 1. 创建后不能修改元素
# 2. 不能添加或删除元素
# 3. 不可变性使元组更安全，适合存储不应该被修改的数据

fruits = ("apple", "banana", "orange")

# 尝试修改元组元素 - 这将导致TypeError异常
# fruits[0] = "pear"  # TypeError: 'tuple' object does not support item assignment
# 上面的代码会报错，因为元组是不可变的，不支持元素赋值操作
```

但是，如果元组中包含可变对象（如列表），则可以修改这些可变对象的内容。

```python
# 知识点：元组中的可变元素
# 虽然元组本身不可变，但其元素如果是可变类型（如列表），则该元素的内容可以修改
# 重要概念：
# 1. 元组的不可变性只针对直接元素
# 2. 如果元组中包含可变对象，可变对象的内容是可以修改的
# 3. 这种特性需要谨慎使用，可能导致代码难以维护

t = (1, 2, [3, 4])        # 创建一个包含列表的元组
t[2][0] = 5               # 修改元组中列表的第一个元素
print(t)                  # 输出: (1, 2, [5, 4]) - 列表的内容被修改了
```

### 2.3.4 元组的常用操作

```python
# 知识点：Python元组的基本运算操作
# 虽然元组是不可变的，但它支持多种运算操作：
# 1. 元组连接（+运算符）
# 2. 元组重复（*运算符）
# 3. 长度计算（len函数）
# 4. 成员检测（in和not in运算符）

# 元组连接 - 使用+运算符创建一个新元组
tuple1 = (1, 2, 3)           # 创建第一个元组
tuple2 = (4, 5, 6)           # 创建第二个元组
tuple3 = tuple1 + tuple2     # 连接两个元组，创建一个新元组
print(tuple3)                # 输出: (1, 2, 3, 4, 5, 6)

# 元组重复 - 使用*运算符将元组重复多次
tuple4 = (0,) * 5            # 将单元素元组重复5次
print(tuple4)                # 输出: (0, 0, 0, 0, 0)

# 元组长度 - 使用len()函数获取元组中元素的个数
print(len(tuple3))           # 输出: 6

# 检查元素是否在元组中 - 使用in和not in运算符
print(3 in tuple1)           # 检查3是否在tuple1中，输出: True
print(7 not in tuple2)       # 检查7是否不在tuple2中，输出: True
```

### 2.3.5 元组的方法

元组只有两个方法：count()和index()。

```python
# 知识点：Python元组的内置方法
# 由于元组的不可变性，它只有两个内置方法：
# 1. count() - 计算元素出现的次数
# 2. index() - 查找元素第一次出现的索引
# 这两个方法都不会修改元组本身

numbers = (1, 2, 3, 2, 1, 2, 3, 4)

# count()方法 - 统计指定元素在元组中出现的次数
count = numbers.count(2)     # 统计元素2出现的次数
print(count)                # 输出: 3

# index()方法 - 返回指定元素第一次出现的索引
index = numbers.index(3)     # 查找元素3第一次出现的位置
print(index)                # 输出: 2（索引从0开始计数）
```

### 2.3.6 元组的解包

```python
# 知识点：Python元组的解包（拆包）
# 元组解包是Python的一个强大特性，允许将元组中的值同时赋给多个变量
# 特点：
# 1. 变量数量必须与元组元素数量匹配（使用*运算符的情况除外）
# 2. 可以使用*运算符收集多余的元素
# 3. *运算符会将收集到的元素放入列表中

# 基本解包 - 元素数量与变量数量相等
coordinates = (3, 4)         # 创建一个包含两个元素的元组
x, y = coordinates          # 将元组的元素分别赋值给x和y
print(x, y)                 # 输出: 3 4

# 使用*运算符收集多余的元素 - 在变量名前使用*
# 示例1：收集末尾的元素
first, *rest = (1, 2, 3, 4, 5)  # first获取第一个元素，*rest收集剩余所有元素
print(first)                # 输出: 1
print(rest)                 # 输出: [2, 3, 4, 5]（注意这是一个列表）

# 示例2：收集开头的元素
*beginning, last = (1, 2, 3, 4, 5)  # *beginning收集除最后一个外的所有元素
print(beginning)            # 输出: [1, 2, 3, 4]
print(last)                 # 输出: 5

# 示例3：收集中间的元素
first, *middle, last = (1, 2, 3, 4, 5)  # *middle收集中间的所有元素
print(first)                # 输出: 1
print(middle)               # 输出: [2, 3, 4]
print(last)                 # 输出: 5
```

### 2.3.7 元组与列表的比较

- 元组是不可变的，列表是可变的
- 元组通常用于表示固定的数据集合，列表用于表示可变的数据集合
- 元组作为字典键是安全的，列表不能作为字典键
- 元组通常比列表更节省内存
- 元组的操作通常比列表更快

## 2.4 字符串

### 2.4.1 字符串的创建

```python
# 知识点：Python字符串的创建方法
# Python提供了多种创建字符串的方式，每种方式都有其特定用途
# 特点：
# 1. 字符串是不可变的序列类型
# 2. 支持单引号、双引号和三引号
# 3. 三引号支持多行字符串

# 使用单引号创建字符串
s1 = 'Hello'               # 单引号适合用于包含双引号的字符串

# 使用双引号创建字符串
s2 = "World"              # 双引号适合用于包含单引号的字符串

# 使用三个单引号创建多行字符串
s3 = '''This is a
multi-line string'''     # 三个单引号可以创建跨越多行的字符串
                         # \n表示换行符

# 使用三个双引号创建多行字符串
s4 = """Another
multi-line string"""     # 三个双引号的作用与三个单引号相同
                         # 常用于文档字符串（docstring）
```

### 2.4.2 字符串的访问和切片

```python
# 知识点：Python字符串的访问和切片操作
# 字符串作为不可变序列，支持多种访问和切片操作
# 特点：
# 1. 支持正向和负向索引
# 2. 支持切片操作获取子串
# 3. 所有操作都会返回新的字符串

s = "Python"

# 通过索引访问字符 - 索引从0开始
print(s[0])     # 访问第一个字符，输出: P
print(s[-1])    # 访问最后一个字符，输出: n

# 字符串切片 - 获取子字符串
print(s[2:4])   # 获取索引2到3的字符，输出: th
print(s[:2])    # 获取前两个字符，输出: Py
print(s[2:])    # 获取索引2到末尾的字符，输出: thon
print(s[::-1])  # 使用负步长-1反转字符串，输出: nohtyP
```

### 2.4.3 字符串的不可变性

字符串是不可变的，创建后不能修改其字符。

```python
# 知识点：Python字符串的不可变性
# 字符串是不可变（immutable）的序列类型
# 特点：
# 1. 创建后不能修改任何字符
# 2. 所有的"修改"操作实际上都是创建新字符串
# 3. 不可变性保证了字符串的安全性和哈希一致性

s = "Python"

# 尝试直接修改字符串中的字符（这会引发错误）
# s[0] = "J"  # TypeError: 'str' object does not support item assignment
# 字符串不支持元素赋值，因为它是不可变的

# 正确的修改方式：创建一个新的字符串
s = "J" + s[1:]    # 通过字符串拼接创建新字符串
print(s)           # 输出: Jython
# 注意：原字符串并没有被修改，而是创建了一个新的字符串并将其赋值给变量s
```

### 2.4.4 字符串的常用操作

```python
# 知识点：Python字符串的基本运算操作
# 字符串支持多种运算操作，包括：
# 1. 字符串连接（+运算符）
# 2. 字符串重复（*运算符）
# 3. 长度计算（len函数）
# 4. 子串检测（in和not in运算符）

# 字符串连接 - 使用+运算符
s1 = "Hello"              # 第一个字符串
s2 = "World"              # 第二个字符串
s3 = s1 + " " + s2        # 连接字符串，中间加入空格
print(s3)                 # 输出: Hello World

# 字符串重复 - 使用*运算符
s4 = "Ha" * 3             # 将字符串重复3次
print(s4)                 # 输出: HaHaHa

# 字符串长度 - 使用len()函数
print(len(s3))            # 计算字符串s3的长度，输出: 11

# 检查子字符串 - 使用in和not in运算符
print("Hello" in s3)      # 检查s3是否包含"Hello"，输出: True
print("Python" not in s3)  # 检查s3是否不包含"Python"，输出: True
```

### 2.4.5 字符串的方法

```python
# 知识点：Python字符串的常用方法
# Python字符串提供了丰富的内置方法，主要包括：
# 1. 大小写转换方法
# 2. 空白处理方法
# 3. 查找和替换方法
# 4. 分割和连接方法
# 5. 字符串特性检查方法
# 6. 对齐和填充方法

s = "  Hello, World!  "    # 创建一个包含前后空格的字符串

# 1. 大小写转换方法
print(s.upper())          # 转换为大写，输出:   HELLO, WORLD!  
print(s.lower())          # 转换为小写，输出:   hello, world!  
print(s.capitalize())     # 首字母大写，输出:   hello, world!  
print(s.title())          # 每个单词首字母大写，输出:   Hello, World!  
print(s.swapcase())       # 大小写互换，输出:   hELLO, wORLD!  

# 2. 空白处理方法
print(s.strip())          # 去除两端空白，输出: Hello, World!
print(s.lstrip())         # 去除左端空白，输出: Hello, World!  
print(s.rstrip())         # 去除右端空白，输出:   Hello, World!

# 3. 查找和替换方法
print(s.find("World"))    # 查找子串位置，输出: 9
print(s.replace("World", "Python"))  # 替换子串，输出:   Hello, Python!  

# 4. 分割和连接方法
words = "apple,banana,orange".split(",")  # 按逗号分割字符串
print(words)              # 输出: ['apple', 'banana', 'orange']
print("-".join(words))     # 用-连接列表中的字符串，输出: apple-banana-orange

# 5. 字符串特性检查方法
print("123".isdigit())     # 检查是否全是数字，输出: True
print("abc".isalpha())     # 检查是否全是字母，输出: True
print("abc123".isalnum())  # 检查是否是字母和数字，输出: True
print("HELLO".isupper())   # 检查是否全是大写，输出: True
print("hello".islower())   # 检查是否全是小写，输出: True
print("Hello World".istitle())  # 检查是否标题格式，输出: True
print("  \t\n".isspace())  # 检查是否全是空白字符，输出: True

# 6. 对齐和填充方法
print("Hello".ljust(10, "*"))   # 左对齐，右侧填充*，输出: Hello*****
print("Hello".rjust(10, "*"))   # 右对齐，左侧填充*，输出: *****Hello
print("Hello".center(10, "*"))  # 居中对齐，两侧填充*，输出: **Hello***
print("123".zfill(5))           # 用0填充左侧，输出: 00123
```

### 2.4.6 字符串格式化

```python
# 知识点：Python字符串的格式化
# Python提供了三种主要的字符串格式化方式：
# 1. %运算符（传统方式）
# 2. str.format()方法（推荐方式）
# 3. f-string（最新最简洁的方式，Python 3.6+）

name = "Alice"
age = 25

# 1. 使用%运算符进行格式化（传统方式）
# %s表示字符串，%d表示整数
print("My name is %s and I am %d years old." % (name, age))

# 2. 使用str.format()方法
# 方式一：使用位置参数
print("My name is {} and I am {} years old.".format(name, age))
# 方式二：使用索引参数
print("My name is {0} and I am {1} years old.".format(name, age))
# 方式三：使用命名参数
print("My name is {n} and I am {a} years old.".format(n=name, a=age))

# 3. 使用f-string（Python 3.6+引入）
# 优点：直观、简洁，可以直接在{}中使用Python表达式
print(f"My name is {name} and I am {age} years old.")
# 在f-string中可以直接使用表达式和方法调用
print(f"My name is {name.upper()} and I am {age * 2} years old.")
```

## 2.5 range对象

### 2.5.1 range的创建和使用

```python
# range对象的知识点概述：
# - range是Python内置的序列类型，专门用于生成一系列连续的整数
# - 主要用途是在循环中控制迭代次数和生成数字序列
# - 支持索引、切片、迭代等序列通用操作

# range对象的重要特点：
# 1. 惰性求值（延迟计算）：
#    - 创建range对象时不会立即生成所有数字
#    - 只有在实际需要时（如迭代或转换为列表）才会生成具体的数字
#    - 这种特性使得range对象特别适合处理大范围的数字序列

# 2. 内存效率高：
#    - 只存储start（起始值）、stop（结束值）和step（步长）三个整数
#    - 无论范围多大，内存占用都是固定的
#    - 比存储实际数字的列表节省大量内存

# 3. 不可变性：
#    - 创建后不能修改其范围或步长
#    - 保证了数据的安全性和一致性

# 创建range对象的三种方式及其用法：

# 方式一：range(stop) - 从0开始，步长为1
r1 = range(5)            # 生成0到4的序列（不包含5）
print(list(r1))          # 转换为列表查看内容
                        # 输出: [0, 1, 2, 3, 4]
                        # 解释：生成从0开始的5个连续整数

# 方式二：range(start, stop) - 指定起始值和结束值
r2 = range(1, 6)         # 生成1到5的序列（不包含6）
print(list(r2))          # 输出: [1, 2, 3, 4, 5]
                        # 解释：生成从1开始的5个连续整数

# 方式三：range(start, stop, step) - 指定起始值、结束值和步长
r3 = range(1, 10, 2)     # 生成1到9之间的奇数序列
print(list(r3))          # 输出: [1, 3, 5, 7, 9]
                        # 解释：从1开始，每次增加2，直到不超过10

# range的实际应用示例：

# 1. 在for循环中控制迭代次数
for i in range(3):       # 最常见的用法：循环控制
    print(i)             # 依次输出: 0, 1, 2
                        # 解释：循环执行3次，i分别取值0、1、2

# 2. 使用in运算符检查元素是否在序列中
print(3 in r1)           # 输出: True
                        # 解释：3在0到4的范围内
print(10 in r3)          # 输出: False
                        # 解释：10不在1,3,5,7,9的序列中
```

### 2.5.2 range的特点

- range对象是不可变的序列类型
- range对象占用固定的内存空间，无论其表示的范围有多大
- range对象通常用于for循环中控制迭代次数

## 2.6 序列的高级操作

### 2.6.1 序列解包

```python
# 序列解包的知识点概述：
# - 序列解包是Python的一个强大特性，允许一次性将序列中的多个值赋给多个变量
# - 可以应用于任何可迭代对象（列表、元组、字符串等）
# - 提供了简洁优雅的方式来处理序列数据

# 序列解包的三种主要用法：

# 1. 基本序列解包
# - 变量数量必须与序列元素个数相等
a, b, c = [1, 2, 3]      # 将列表的三个元素分别赋值给a、b、c
print(a, b, c)           # 输出: 1 2 3
                        # 解释：a获得1，b获得2，c获得3

# 2. 使用星号运算符(*)进行扩展解包
# - 使用*可以收集多余的元素到一个列表中
# - *变量可以在任意位置，但在一次解包中只能使用一次
first, *rest = [1, 2, 3, 4, 5]
print(first)             # 输出: 1
                        # 解释：first获得第一个元素
print(rest)              # 输出: [2, 3, 4, 5]
                        # 解释：rest获得剩余所有元素的列表

# 3. 在函数调用中使用解包
# - 使用*可以将序列展开为独立的参数
def add(a, b, c):
    return a + b + c

numbers = [1, 2, 3]
print(add(*numbers))     # 输出: 6
                        # 解释：相当于add(1, 2, 3)
                        # numbers被解包为三个独立的参数
```

### 2.6.2 zip函数

```python
# zip函数的知识点概述：
# - zip()是Python内置函数，用于将多个序列对应位置的元素组合成元组
# - 返回一个迭代器，节省内存空间
# - 常用于并行处理多个序列

# zip函数的主要特点：
# 1. 并行迭代：同时处理多个序列
# 2. 惰性求值：只在需要时才生成元组
# 3. 长度匹配：以最短的序列为准

# zip函数的三种常见用法：

# 1. 基本的序列配对
names = ["Alice", "Bob", "Charlie"]
ages = [25, 30, 35]

# 将两个序列打包成元组的迭代器
zipped = zip(names, ages)
print(list(zipped))      # 输出: [('Alice', 25), ('Bob', 30), ('Charlie', 35)]
                        # 解释：将对应位置的名字和年龄组合成元组

# 2. 解压缩操作（使用*运算符）
# - 可以将zip对象恢复为原始序列
names2, ages2 = zip(*zip(names, ages))  # 先打包再解包
print(list(names2))      # 输出: ['Alice', 'Bob', 'Charlie']
                        # 解释：恢复原始的名字列表
print(list(ages2))       # 输出: [25, 30, 35]
                        # 解释：恢复原始的年龄列表

# 3. 创建字典
# - 结合dict()函数将配对数据转换为字典
user_dict = dict(zip(names, ages))
print(user_dict)         # 输出: {'Alice': 25, 'Bob': 30, 'Charlie': 35}
                        # 解释：names作为键，ages作为值创建字典
```

### 2.6.3 enumerate函数

```python
# enumerate函数的知识点概述：
# - enumerate()是Python内置函数，用于在迭代序列时同时获取索引和值
# - 返回一个迭代器，产生(索引,元素)形式的元组
# - 简化了需要同时使用索引和值的循环操作

# enumerate函数的主要特点：
# 1. 自动计数：自动为序列元素生成索引
# 2. 可定制起始值：支持自定义起始索引
# 3. 内存效率：返回迭代器，不会一次性生成所有数据

# enumerate函数的两种常见用法：

# 1. 基本用法：默认从0开始计数
fruits = ["apple", "banana", "orange"]

# 同时获取索引和值
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")
# 输出结果：
# 0: apple
# 1: banana
# 2: orange
# 解释：i是自动生成的索引（从0开始），fruit是对应的元素值

# 2. 自定义起始索引
# - 通过第二个参数指定起始计数值
for i, fruit in enumerate(fruits, 1):  # 从1开始计数
    print(f"{i}: {fruit}")
# 输出结果：
# 1: apple
# 2: banana
# 3: orange
# 解释：索引从1开始，更适合用于显示项目编号
```

### 2.6.4 sorted函数

```python
# sorted函数的知识点概述：
# - sorted()是Python内置函数，用于对任意可迭代对象进行排序
# - 返回一个新的已排序列表，原序列保持不变
# - 支持自定义排序规则和多级排序

# sorted函数的主要特点：
# 1. 通用性：可以排序任何可迭代对象
# 2. 稳定性：相等元素的相对位置保持不变
# 3. 灵活性：支持自定义排序规则

# sorted函数的四种常见用法：

# 1. 基本排序（默认升序）
numbers = [3, 1, 4, 1, 5, 9, 2]
sorted_numbers = sorted(numbers)
print(sorted_numbers)    # 输出: [1, 1, 2, 3, 4, 5, 9]
                        # 解释：将数字按从小到大排序

# 2. 降序排序（使用reverse参数）
desc_numbers = sorted(numbers, reverse=True)
print(desc_numbers)      # 输出: [9, 5, 4, 3, 2, 1, 1]
                        # 解释：将数字按从大到小排序

# 3. 自定义排序（使用key函数）
# - key函数用于指定排序依据
words = ["apple", "Banana", "orange", "Pear"]
sorted_words = sorted(words, key=str.lower)  # 忽略大小写排序
print(sorted_words)      # 输出: ['apple', 'Banana', 'orange', 'Pear']
                        # 解释：按字母顺序排序，不考虑大小写

# 4. 多级排序（使用元组作为key）
# - 当主要排序键相同时，使用次要排序键
students = [("Alice", 85), ("Bob", 75), ("Charlie", 85)]
# 先按成绩降序（-x[1]），成绩相同时按姓名升序（x[0]）
sorted_students = sorted(students, key=lambda x: (-x[1], x[0]))
print(sorted_students)    # 输出: [('Alice', 85), ('Charlie', 85), ('Bob', 75)]
                         # 解释：85分的按姓名排序，然后是75分的
```

## 2.7 本章小结

本章介绍了Python中的序列类型，包括列表、元组、字符串和range对象。这些序列类型是Python编程中最基本和最常用的数据结构，掌握它们的特性和操作方法对于Python编程至关重要。

列表是可变的序列，适合存储需要修改的数据；元组是不可变的序列，适合存储固定的数据；字符串是用于文本处理的不可变序列；range对象是一种特殊的序列，通常用于循环控制。

此外，本章还介绍了序列的高级操作，如序列解包、zip函数、enumerate函数和sorted函数，这些操作可以使代码更简洁、更高效。

## 2.8 课后练习

1. 创建一个包含5个不同水果名称的列表，然后使用列表的方法添加、删除和修改元素。
2. 编写程序，将一个列表中的元素反转，不使用reverse()方法。
3. 创建一个元组，包含你的个人信息（姓名、年龄、性别等），然后使用元组解包将这些信息分别赋值给不同的变量。
4. 编写程序，统计一个字符串中每个字符出现的次数，并以字典形式输出。
5. 使用列表推导式生成一个包含1到100之间所有素数的列表。
6. 编写程序，将两个列表交替合并成一个新列表。例如，将[1, 3, 5]和[2, 4, 6]合并为[1, 2, 3, 4, 5, 6]。
7. 使用zip函数将两个列表合并为一个字典，其中一个列表的元素作为键，另一个列表的元素作为值。
8. 编写程序，找出一个字符串中最长的单词。