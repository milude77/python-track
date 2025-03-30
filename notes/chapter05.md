# 第5章 函数的设计和使用

## 5.1 函数基础

### 5.1.1 什么是函数

函数是一段可重复使用的代码块，用于执行特定任务。函数可以接受输入参数，并返回处理结果。使用函数可以提高代码的可读性、可维护性和可重用性。

### 5.1.2 函数的定义与调用

在Python中，使用`def`关键字定义函数，基本语法如下：

```python
def 函数名(参数列表):
    函数体
    return 返回值
```

示例：

```python
# 定义函数
def greet(name):
    """向指定的人打招呼"""
    return f"Hello, {name}!"

# 调用函数
message = greet("Alice")
print(message)  # 输出: Hello, Alice!
```

### 5.1.3 函数文档字符串

文档字符串（docstring）是函数的说明文档，用三引号括起来，放在函数定义的第一行。

```python
def square(x):
    """计算一个数的平方。
    
    参数:
        x (int/float): 要计算平方的数
        
    返回:
        int/float: x的平方
    """
    return x ** 2

# 访问文档字符串
print(square.__doc__)
```

### 5.1.4 函数的返回值

函数可以使用`return`语句返回值。如果没有`return`语句，函数将返回`None`。

```python
# 返回单个值
def add(a, b):
    return a + b

# 返回多个值（实际上是返回一个元组）
def get_min_max(numbers):
    return min(numbers), max(numbers)

# 解包返回的元组
minimum, maximum = get_min_max([1, 2, 3, 4, 5])
print(minimum, maximum)  # 输出: 1 5
```

## 5.2 函数参数

### 5.2.1 位置参数

位置参数是最基本的参数类型，调用函数时按照定义的顺序传递参数。

```python
def power(x, n):
    return x ** n

result = power(2, 3)  # x=2, n=3
print(result)  # 输出: 8
```

### 5.2.2 关键字参数

关键字参数在调用函数时使用参数名指定参数值，可以不按照定义的顺序传递参数。

```python
def greet(name, message):
    return f"{message}, {name}!"

# 使用关键字参数
result = greet(message="Good morning", name="Alice")
print(result)  # 输出: Good morning, Alice!
```

### 5.2.3 默认参数

默认参数是在函数定义时指定默认值的参数，如果调用函数时没有提供该参数的值，将使用默认值。

```python
def greet(name, message="Hello"):
    return f"{message}, {name}!"

# 使用默认参数
result1 = greet("Alice")  # message使用默认值"Hello"
print(result1)  # 输出: Hello, Alice!

# 覆盖默认参数
result2 = greet("Alice", "Good morning")
print(result2)  # 输出: Good morning, Alice!
```

注意：默认参数必须放在非默认参数之后。

```python
# 正确
def func(a, b=1, c=2):
    pass

# 错误
# def func(a=1, b, c):
#     pass
```

### 5.2.4 可变参数

可变参数允许函数接受任意数量的位置参数，在参数名前加一个星号`*`。

```python
def sum_numbers(*args):
    """计算所有参数的和"""
    return sum(args)

result1 = sum_numbers(1, 2, 3)
print(result1)  # 输出: 6

result2 = sum_numbers(1, 2, 3, 4, 5)
print(result2)  # 输出: 15

# 传递列表或元组
numbers = [1, 2, 3, 4, 5]
result3 = sum_numbers(*numbers)  # 解包列表
print(result3)  # 输出: 15
```

### 5.2.5 关键字可变参数

关键字可变参数允许函数接受任意数量的关键字参数，在参数名前加两个星号`**`。

```python
def print_info(**kwargs):
    """打印所有关键字参数"""
    for key, value in kwargs.items():
        print(f"{key}: {value}")

# 使用关键字可变参数
print_info(name="Alice", age=25, city="New York")
# 输出:
# name: Alice
# age: 25
# city: New York

# 传递字典
info = {"name": "Bob", "age": 30, "city": "London"}
print_info(**info)  # 解包字典
# 输出:
# name: Bob
# age: 30
# city: London
```

### 5.2.6 参数顺序

在Python中，函数参数的顺序必须遵循以下规则：
1. 位置参数
2. 默认参数
3. 可变参数 (`*args`)
4. 关键字参数
5. 关键字可变参数 (`**kwargs`)

```python
def func(a, b=1, *args, c, **kwargs):
    pass

# 调用函数
func(1, 2, 3, 4, c=5, d=6, e=7)
# a=1, b=2, args=(3, 4), c=5, kwargs={"d": 6, "e": 7}
```

## 5.3 函数的作用域

### 5.3.1 局部变量和全局变量

- 局部变量：在函数内部定义的变量，只能在函数内部访问。
- 全局变量：在函数外部定义的变量，可以在整个模块中访问。

```python
# 全局变量
x = 10

def func():
    # 局部变量
    y = 20
    print("在函数内部：")
    print(f"x = {x}")  # 可以访问全局变量
    print(f"y = {y}")  # 可以访问局部变量

func()
print("在函数外部：")
print(f"x = {x}")  # 可以访问全局变量
# print(f"y = {y}")  # 错误：不能访问局部变量
```

### 5.3.2 global关键字

使用`global`关键字可以在函数内部修改全局变量。

```python
x = 10

def func():
    global x  # 声明x是全局变量
    x = 20    # 修改全局变量
    print(f"在函数内部：x = {x}")

func()
print(f"在函数外部：x = {x}")  # 输出: 在函数外部：x = 20
```

### 5.3.3 nonlocal关键字

使用`nonlocal`关键字可以在嵌套函数中修改外层函数的变量。

```python
def outer():
    x = 10
    
    def inner():
        nonlocal x  # 声明x是外层函数的变量
        x = 20      # 修改外层函数的变量
        print(f"在inner函数内部：x = {x}")
    
    inner()
    print(f"在outer函数内部：x = {x}")

outer()
# 输出:
# 在inner函数内部：x = 20
# 在outer函数内部：x = 20
```

## 5.4 函数式编程

### 5.4.1 Lambda表达式

Lambda表达式是一种创建匿名函数的方式，适用于简单的函数定义。

```python
# 普通函数
def square(x):
    return x ** 2

# 等价的lambda表达式
square_lambda = lambda x: x ** 2

print(square(5))       # 输出: 25
print(square_lambda(5))  # 输出: 25

# 多参数lambda表达式
sum_lambda = lambda x, y: x + y
print(sum_lambda(3, 4))  # 输出: 7

# 带条件的lambda表达式
max_lambda = lambda x, y: x if x > y else y
print(max_lambda(5, 8))  # 输出: 8
```

### 5.4.2 高阶函数

高阶函数是接受函数作为参数或返回函数的函数。

#### map函数

`map()`函数将一个函数应用到一个可迭代对象的每个元素上，返回一个迭代器。

```python
# 将列表中的每个元素平方
numbers = [1, 2, 3, 4, 5]
squared = map(lambda x: x ** 2, numbers)
print(list(squared))  # 输出: [1, 4, 9, 16, 25]

# 使用普通函数
def cube(x):
    return x ** 3

cubed = map(cube, numbers)
print(list(cubed))  # 输出: [1, 8, 27, 64, 125]

# 多参数map
list1 = [1, 2, 3]
list2 = [4, 5, 6]
summed = map(lambda x, y: x + y, list1, list2)
print(list(summed))  # 输出: [5, 7, 9]
```

#### filter函数

`filter()`函数使用一个函数过滤可迭代对象中的元素，返回一个迭代器。

```python
# 过滤出偶数
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = filter(lambda x: x % 2 == 0, numbers)
print(list(evens))  # 输出: [2, 4, 6, 8, 10]

# 使用普通函数
def is_prime(n):
    """判断一个数是否为素数"""
    if n <= 1:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

primes = filter(is_prime, range(1, 20))
print(list(primes))  # 输出: [2, 3, 5, 7, 11, 13, 17, 19]
```

#### reduce函数

`reduce()`函数对可迭代对象中的元素进行累积操作，返回一个值。需要从`functools`模块导入。

```python
from functools import reduce

# 计算列表中所有元素的和
numbers = [1, 2, 3, 4, 5]
sum_result = reduce(lambda x, y: x + y, numbers)
print(sum_result)  # 输出: 15

# 计算列表中所有元素的乘积
product_result = reduce(lambda x, y: x * y, numbers)
print(product_result)  # 输出: 120

# 使用普通函数
def add(x, y):
    return x + y

sum_result2 = reduce(add, numbers)
print(sum_result2)  # 输出: 15
```

### 5.4.3 装饰器

装饰器是一种特殊的函数，用于修改其他函数的功能。

```python
# 定义装饰器
def timer(func):
    """计算函数执行时间的装饰器"""
    import time
    
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__}函数执行时间：{end_time - start_time:.6f}秒")
        return result
    
    return wrapper

# 使用装饰器
@timer
def slow_function(n):
    """一个耗时的函数"""
    import time
    time.sleep(n)  # 休眠n秒
    return n

result = slow_function(1)
# 输出: slow_function函数执行时间：1.001234秒
```

#### 带参数的装饰器

```python
def repeat(n):
    """重复执行n次的装饰器"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            results = []
            for _ in range(n):
                results.append(func(*args, **kwargs))
            return results
        return wrapper
    return decorator

# 使用带参数的装饰器
@repeat(3)
def greet(name):
    return f"Hello, {name}!"

results = greet("Alice")
print(results)  # 输出: ['Hello, Alice!', 'Hello, Alice!', 'Hello, Alice!']
```

#### 多个装饰器

```python
def bold(func):
    def wrapper(*args, **kwargs):
        return f"<b>{func(*args, **kwargs)}</b>"
    return wrapper

def italic(func):
    def wrapper(*args, **kwargs):
        return f"<i>{func(*args, **kwargs)}</i>"
    return wrapper

# 使用多个装饰器（从下到上执行）
@bold
@italic
def greet(name):
    return f"Hello, {name}!"

result = greet("Alice")
print(result)  # 输出: <b><i>Hello, Alice!</i></b>
```

### 5.4.4 闭包

闭包是一个函数，它记住了创建它的环境中的变量，即使这些变量在函数执行完毕后已经不存在。

```python
def make_counter():
    count = 0
    
    def counter():
        nonlocal count
        count += 1
        return count
    
    return counter

# 创建计数器
counter1 = make_counter()
counter2 = make_counter()

print(counter1())  # 输出: 1
print(counter1())  # 输出: 2
print(counter1())  # 输出: 3

print(counter2())  # 输出: 1 (独立的计数器)
```

## 5.5 递归函数

递归函数是调用自身的函数。递归函数通常包含一个基本情况（终止条件）和一个递归情况。

### 5.5.1 阶乘计算

```python
def factorial(n):
    """计算n的阶乘"""
    if n == 0 or n == 1:  # 基本情况
        return 1
    else:  # 递归情况
        return n * factorial(n - 1)

print(factorial(5))  # 输出: 120 (5! = 5 * 4 * 3 * 2 * 1)
```

### 5.5.2 斐波那契数列

```python
def fibonacci(n):
    """计算斐波那契数列的第n项"""
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

# 打印斐波那契数列的前10项
for i in range(10):
    print(fibonacci(i), end=" ")  # 输出: 0 1 1 2 3 5 8 13 21 34
```

### 5.5.3 递归的优缺点

优点：
- 代码简洁，易于理解
- 适合解决具有递归结构的问题（如树的遍历、分治算法等）

缺点：
- 可能导致栈溢出（Python默认递归深度限制为1000）
- 重复计算导致效率低下（可以使用记忆化技术优化）

### 5.5.4 尾递归优化

尾递归是一种特殊的递归形式，递归调用是函数的最后一个操作。尾递归可以被编译器优化，避免栈溢出。

```python
# 普通递归（非尾递归）
def factorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * factorial(n - 1)  # 递归调用后还有乘法操作

# 尾递归优化
def factorial_tail(n, accumulator=1):
    if n == 0 or n == 1:
        return accumulator
    else:
        return factorial_tail(n - 1, n * accumulator)  # 递归调用是最后一个操作

print(factorial_tail(5))  # 输出: 120
```

注意：Python解释器没有实现尾递归优化，所以即使使用尾递归形式，仍然可能发生栈溢出。

## 5.6 生成器函数

生成器函数使用`yield`语句返回值，每次调用生成器的`next()`方法时，函数会执行到下一个`yield`语句。

```python
def count_up_to(n):
    """生成从1到n的整数"""
    i = 1
    while i <= n:
        yield i
        i += 1

# 使用生成器
counter = count_up_to(5)
print(next(counter))  # 输出: 1
print(next(counter))  # 输出: 2
print(next(counter))  # 输出: 3

# 使用for循环遍历生成器
for num in count_up_to(5):
    print(num, end=" ")  # 输出: 1 2 3 4 5
```

### 5.6.1 生成器表达式

生成器表达式类似于列表推导式，但使用圆括号而不是方括号。

```python
# 列表推导式（一次性生成所有元素）
squares_list = [x**2 for x in range(1, 6)]
print(squares_list)  # 输出: [1, 4, 9, 16, 25]

# 生成器表达式（按需生成元素）
squares_gen = (x**2 for x in range(1, 6))
print(squares_gen)  # 输出: <generator object <genexpr> at 0x...>

# 遍历生成器
for square in squares_gen:
    print(square, end=" ")  # 输出: 1 4 9 16 25
```

### 5.6.2 生成器的优点

- 内存效率高：生成器按需生成元素，不会一次性占用大量内存
- 惰性计算：只在需要时计算值，适合处理大数据集或无限序列

```python
# 生成斐波那契数列
def fibonacci_generator():
    a, b = 0, 1
    while True:  # 无限序列
        yield a
        a, b = b, a + b

# 获取斐波那契数列的前10项
fib_gen = fibonacci_generator()
for _ in range(10):
    print(next(fib_gen), end=" ")  # 输出: 0 1 1 2 3 5 8 13 21 34
```

## 5.7 实例：自定义排序函数

```python
def bubble_sort(arr, key=None, reverse=False):
    """冒泡排序算法
    
    参数:
        arr (list): 要排序的列表
        key (function, optional): 排序键函数
        reverse (bool, optional): 是否降序排序
        
    返回:
        list: 排序后的列表
    """
    # 创建列表的副本
    result = arr.copy()
    n = len(result)
    
    # 定义比较函数
    def compare(x, y):
        # 应用键函数（如果提供）
        x_key = key(x) if key else x
        y_key = key(y) if key else y
        
        # 根据排序方向比较
        if reverse:
            return x_key < y_key  # 降序时交换条件
        else:
            return x_key > y_key  # 升序时交换条件
    
    # 冒泡排序
    for i in range(n):
        for j in range(0, n - i - 1):
            if compare(result[j], result[j + 1]):
                result[j], result[j + 1] = result[j + 1], result[j]
    
    return result

# 测试排序函数
numbers = [5, 2, 8, 1, 9, 3]
print(bubble_sort(numbers))  # 输出: [1, 2, 3, 5, 8, 9]
print(bubble_sort(numbers, reverse=True))  # 输出: [9, 8, 5, 3, 2, 1]

# 使用键函数
students = [("Alice", 85), ("Bob", 75), ("Charlie", 90)]
print(bubble_sort(students, key=lambda x: x[1]))  # 按成绩排序
# 输出: [('Bob', 75), ('Alice', 85), ('Charlie', 90)]
```

## 5.8 本章小结

本章介绍了Python函数的设计和使用，包括函数的基本概念、参数类型、作用域规则、函数式编程特性（Lambda表达式、高阶函数、装饰器、闭包）、递归函数和生成器函数。函数是Python编程的核心概念，掌握函数的设计和使用可以提高代码的可读性、可维护性和可重用性。

## 5.9 课后练习

1. 编写一个函数，计算给定范围内所有素数的和。

2. 编写一个装饰器，记录函数的调用次数。

3. 使用递归函数计算一个数的阶乘，并使用记忆化技术优化。

4. 编写一个生成器函数，生成斐波那契数列的前n项。

5. 使用Lambda表达式和`filter()`函数筛选出列表中的偶数。

6. 编写一个函数，接受任意数量的位置参数和关键字参数，并打印所有参数。

7. 实现一个简单的计算器函数，支持加、减、乘、除四种运算。

8. 编写一个闭包函数，创建一个计数器，每次调用返回递增的值。

9. 使用高阶函数实现一个简单的映射-归约操作，计算列表中所有元素的平方和。

10. 编写一个函数，将嵌套列表（如`[1, [2, [3, 4], 5], 6]`）转换为一维列表（如`[1, 2, 3, 4, 5, 6]`）。