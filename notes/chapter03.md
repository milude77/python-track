# 第3章 选择与循环

## 3.1 条件语句

### 3.1.1 if语句

if语句用于根据条件执行不同的代码块。Python中的if语句基本语法如下：

```python
if 条件表达式:
    语句块
```

示例：

```python
age = 20
if age >= 18:
    print("您已成年")
```

### 3.1.2 if-else语句

if-else语句用于在条件为真时执行一个代码块，在条件为假时执行另一个代码块。

```python
if 条件表达式:
    语句块1
else:
    语句块2
```

示例：

```python
age = 16
if age >= 18:
    print("您已成年")
else:
    print("您未成年")
```

### 3.1.3 if-elif-else语句

if-elif-else语句用于测试多个条件，并在满足条件时执行相应的代码块。

```python
if 条件表达式1:
    语句块1
elif 条件表达式2:
    语句块2
elif 条件表达式3:
    语句块3
else:
    语句块4
```

示例：

```python
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"
print(f"您的成绩等级是：{grade}")
```

### 3.1.4 嵌套if语句

在if语句内部可以嵌套另一个if语句，形成嵌套结构。

```python
if 条件表达式1:
    if 条件表达式2:
        语句块1
    else:
        语句块2
else:
    语句块3
```

示例：

```python
age = 20
has_id = True

if age >= 18:
    if has_id:
        print("您可以进入")
    else:
        print("请出示有效证件")
else:
    print("未成年人不得入内")
```

### 3.1.5 条件表达式（三元运算符）

Python提供了一种简洁的条件表达式，也称为三元运算符，用于根据条件选择不同的值。

```python
值1 if 条件表达式 else 值2
```

示例：

```python
age = 20
status = "成年" if age >= 18 else "未成年"
print(status)  # 输出: 成年
```

## 3.2 循环语句

### 3.2.1 while循环

while循环用于在条件为真时重复执行代码块。

```python
while 条件表达式:
    语句块
```

示例：

```python
count = 1
while count <= 5:
    print(count)
    count += 1
# 输出: 1 2 3 4 5
```

### 3.2.2 for循环

for循环用于遍历可迭代对象（如列表、元组、字符串等）中的元素。

```python
for 变量 in 可迭代对象:
    语句块
```

示例：

```python
# 遍历列表
fruits = ["apple", "banana", "orange"]
for fruit in fruits:
    print(fruit)
# 输出: apple banana orange

# 遍历字符串
for char in "Python":
    print(char)
# 输出: P y t h o n

# 使用range()函数
for i in range(5):
    print(i)
# 输出: 0 1 2 3 4
```

### 3.2.3 range()函数

range()函数用于生成一个整数序列，通常与for循环一起使用。

```python
# range(stop) - 生成从0到stop-1的整数序列
for i in range(5):
    print(i)  # 输出: 0 1 2 3 4

# range(start, stop) - 生成从start到stop-1的整数序列
for i in range(2, 6):
    print(i)  # 输出: 2 3 4 5

# range(start, stop, step) - 生成从start到stop-1的整数序列，步长为step
for i in range(1, 10, 2):
    print(i)  # 输出: 1 3 5 7 9
```

### 3.2.4 嵌套循环

循环可以嵌套使用，即在一个循环内部包含另一个循环。

```python
for i in range(3):
    for j in range(2):
        print(f"({i}, {j})")
```

输出：
```
(0, 0)
(0, 1)
(1, 0)
(1, 1)
(2, 0)
(2, 1)
```

示例：打印乘法表

```python
for i in range(1, 10):
    for j in range(1, i+1):
        print(f"{j}×{i}={i*j}", end="\t")
    print()  # 换行
```

## 3.3 循环控制语句

### 3.3.1 break语句

break语句用于提前退出循环，不再执行循环中的剩余语句。

```python
for i in range(10):
    if i == 5:
        break
    print(i)
# 输出: 0 1 2 3 4
```

### 3.3.2 continue语句

continue语句用于跳过当前循环的剩余语句，直接进入下一次循环。

```python
for i in range(10):
    if i % 2 == 0:  # 如果i是偶数
        continue
    print(i)
# 输出: 1 3 5 7 9
```

### 3.3.3 else子句

Python的循环语句（for和while）可以带有一个else子句，当循环正常结束时（不是通过break语句退出）执行else子句中的代码。

```python
# for循环的else子句
for i in range(5):
    print(i)
else:
    print("循环正常结束")
# 输出: 0 1 2 3 4 循环正常结束

# 使用break的情况
for i in range(5):
    if i == 3:
        break
    print(i)
else:
    print("循环正常结束")  # 不会执行
# 输出: 0 1 2

# while循环的else子句
count = 0
while count < 5:
    print(count)
    count += 1
else:
    print("循环正常结束")
# 输出: 0 1 2 3 4 循环正常结束
```

## 3.4 推导式

### 3.4.1 列表推导式

列表推导式是一种简洁的创建列表的方法，可以替代传统的for循环。

```python
# 基本语法
[表达式 for 变量 in 可迭代对象]

# 带条件的列表推导式
[表达式 for 变量 in 可迭代对象 if 条件表达式]
```

示例：

```python
# 生成平方数列表
squares = [x**2 for x in range(10)]
print(squares)  # 输出: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# 生成偶数的平方列表
even_squares = [x**2 for x in range(10) if x % 2 == 0]
print(even_squares)  # 输出: [0, 4, 16, 36, 64]
```

### 3.4.2 字典推导式

字典推导式用于创建字典，类似于列表推导式。

```python
# 基本语法
{键表达式: 值表达式 for 变量 in 可迭代对象}

# 带条件的字典推导式
{键表达式: 值表达式 for 变量 in 可迭代对象 if 条件表达式}
```

示例：

```python
# 创建平方映射字典
square_dict = {x: x**2 for x in range(5)}
print(square_dict)  # 输出: {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# 创建偶数的平方映射字典
even_square_dict = {x: x**2 for x in range(10) if x % 2 == 0}
print(even_square_dict)  # 输出: {0: 0, 2: 4, 4: 16, 6: 36, 8: 64}
```

### 3.4.3 集合推导式

集合推导式用于创建集合，类似于列表推导式。

```python
# 基本语法
{表达式 for 变量 in 可迭代对象}

# 带条件的集合推导式
{表达式 for 变量 in 可迭代对象 if 条件表达式}
```

示例：

```python
# 创建平方集合
square_set = {x**2 for x in range(10)}
print(square_set)  # 输出: {0, 1, 4, 9, 16, 25, 36, 49, 64, 81}

# 创建偶数的平方集合
even_square_set = {x**2 for x in range(10) if x % 2 == 0}
print(even_square_set)  # 输出: {0, 4, 16, 36, 64}
```

### 3.4.4 生成器表达式

生成器表达式类似于列表推导式，但它返回一个生成器对象，而不是列表。生成器对象是一种迭代器，可以按需生成值，而不是一次性生成所有值，因此更节省内存。

```python
# 基本语法
(表达式 for 变量 in 可迭代对象)

# 带条件的生成器表达式
(表达式 for 变量 in 可迭代对象 if 条件表达式)
```

示例：

```python
# 创建平方生成器
square_gen = (x**2 for x in range(10))
print(square_gen)  # 输出: <generator object <genexpr> at 0x...>

# 使用生成器
for square in square_gen:
    print(square, end=" ")
# 输出: 0 1 4 9 16 25 36 49 64 81

# 生成器只能遍历一次
for square in square_gen:
    print(square, end=" ")  # 不会输出任何内容，因为生成器已经被消耗完
```

## 3.5 实例：猜数游戏

下面是一个综合运用条件语句和循环语句的猜数游戏实例：

```python
import random

# 生成1到100之间的随机数
target = random.randint(1, 100)
print("我已经想好了一个1到100之间的数字，请你猜一猜。")

guess_count = 0
max_guesses = 7

while guess_count < max_guesses:
    try:
        guess = int(input(f"请输入你的猜测（还剩{max_guesses - guess_count}次机会）："))
        guess_count += 1
        
        if guess < 1 or guess > 100:
            print("请输入1到100之间的数字！")
            continue
            
        if guess < target:
            print("太小了！")
        elif guess > target:
            print("太大了！")
        else:
            print(f"恭喜你，猜对了！答案就是{target}。")
            print(f"你总共猜了{guess_count}次。")
            break
    except ValueError:
        print("请输入有效的数字！")
        
else:  # 当循环正常结束（没有通过break退出）时执行
    print(f"很遗憾，你已用完所有{max_guesses}次机会。")
    print(f"正确答案是{target}。")
```

## 3.6 本章小结

本章介绍了Python中的条件语句和循环语句，这些是编程中最基本的控制结构。条件语句（if、if-else、if-elif-else）用于根据条件执行不同的代码块；循环语句（while、for）用于重复执行代码块；循环控制语句（break、continue）用于控制循环的执行流程。此外，本章还介绍了Python特有的推导式语法，包括列表推导式、字典推导式、集合推导式和生成器表达式，这些语法可以使代码更简洁、更高效。

## 3.7 课后练习

1. 编写程序，判断一个整数是否为偶数，如果是偶数，输出"这是一个偶数"，否则输出"这是一个奇数"。

2. 编写程序，根据用户输入的成绩（0-100），输出对应的等级：90-100为A，80-89为B，70-79为C，60-69为D，0-59为F。

3. 编写程序，使用while循环计算1到100的和。

4. 编写程序，使用for循环计算1到100中所有偶数的和。

5. 编写程序，打印九九乘法表。

6. 编写程序，判断一个数是否为素数（质数）。

7. 编写程序，使用列表推导式生成一个包含1到100中所有能被3整除的数的列表。

8. 编写程序，使用字典推导式创建一个字典，键为1到10的整数，值为这些整数的平方。

9. 编写一个猜数游戏，电脑随机生成一个1到100之间的整数，用户有7次机会猜测这个数。每次猜测后，电脑会提示"太大了"或"太小了"，直到猜对为止或用完所有机会。

10. 编写程序，使用嵌套循环打印以下图案：
```
*
**
***
****
*****
```