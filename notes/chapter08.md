# 第8章 异常处理

## 8.1 异常处理基础

### 8.1.1 什么是异常

异常是程序运行时发生的错误，会导致程序中断执行。Python使用异常对象来表示这些错误情况，当异常发生时，如果没有适当的处理机制，程序将终止并显示错误信息。

常见的内置异常类型：

| 异常类型 | 描述 |
| --- | --- |
| `SyntaxError` | 语法错误 |
| `NameError` | 尝试访问未定义的变量 |
| `TypeError` | 操作或函数应用于不适当类型的对象 |
| `ValueError` | 操作或函数接收到类型正确但值不合适的参数 |
| `IndexError` | 序列中没有此索引 |
| `KeyError` | 字典中没有此键 |
| `FileNotFoundError` | 找不到文件或目录 |
| `ZeroDivisionError` | 除数为零 |
| `ImportError` | 导入模块失败 |
| `IOError` | 输入/输出操作失败 |

### 8.1.2 异常的结构

当异常发生时，Python会创建一个异常对象，其中包含：

- 异常类型
- 异常描述信息
- 异常发生的位置（回溯信息）

## 8.2 异常处理机制

### 8.2.1 try-except 语句

`try-except`语句用于捕获和处理异常：

```python
try:
    # 可能引发异常的代码
    result = 10 / 0
except ZeroDivisionError:
    # 处理特定类型的异常
    print("除数不能为零！")
```

可以捕获多种异常类型：

```python
try:
    num = int(input("请输入一个整数："))
    result = 10 / num
except ZeroDivisionError:
    print("除数不能为零！")
except ValueError:
    print("输入必须是整数！")
```

也可以使用一个`except`子句捕获多种异常：

```python
try:
    num = int(input("请输入一个整数："))
    result = 10 / num
except (ValueError, ZeroDivisionError):
    print("输入无效或除数为零！")
```

捕获所有异常（不推荐）：

```python
try:
    # 可能引发异常的代码
    result = 10 / 0
except:
    # 处理所有异常
    print("发生了异常！")
```

### 8.2.2 获取异常信息

可以在`except`子句中获取异常对象：

```python
try:
    num = int(input("请输入一个整数："))
    result = 10 / num
except Exception as e:
    print(f"发生异常：{type(e).__name__}")
    print(f"异常信息：{e}")
```

### 8.2.3 else 子句

`else`子句在`try`块中的代码没有引发异常时执行：

```python
try:
    num = int(input("请输入一个整数："))
    result = 10 / num
except ValueError:
    print("输入必须是整数！")
except ZeroDivisionError:
    print("除数不能为零！")
else:
    print(f"结果是：{result}")
```

### 8.2.4 finally 子句

`finally`子句无论是否发生异常都会执行，通常用于释放资源：

```python
try:
    file = open("example.txt", "r")
    content = file.read()
except FileNotFoundError:
    print("文件不存在！")
finally:
    # 确保文件被关闭，即使发生异常
    if 'file' in locals() and not file.closed:
        file.close()
        print("文件已关闭")
```

## 8.3 异常的传播

### 8.3.1 异常传播机制

当函数中发生异常且未被处理时，异常会向上传播到调用该函数的代码：

```python
def divide(a, b):
    return a / b

def calculate():
    result = divide(10, 0)  # 这里会引发ZeroDivisionError
    return result

try:
    calculate()
except ZeroDivisionError:
    print("除数不能为零！")
```

### 8.3.2 异常堆栈跟踪

当异常未被捕获时，Python会显示异常堆栈跟踪，帮助定位错误：

```python
def func1():
    return func2()

def func2():
    return func3()

def func3():
    return 1 / 0  # 引发ZeroDivisionError

func1()  # 将显示完整的异常堆栈跟踪
```

## 8.4 自定义异常

### 8.4.1 创建自定义异常类

可以通过继承`Exception`类（或其子类）来创建自定义异常：

```python
class InsufficientFundsError(Exception):
    """当账户余额不足时引发的异常"""
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount
        self.deficit = amount - balance
        super().__init__(f"余额不足。当前余额：{balance}，需要：{amount}，差额：{self.deficit}")

class BankAccount:
    def __init__(self, name, balance=0):
        self.name = name
        self.balance = balance
        
    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("存款金额必须为正数")
        self.balance += amount
        return self.balance
    
    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("取款金额必须为正数")
        if amount > self.balance:
            raise InsufficientFundsError(self.balance, amount)
        self.balance -= amount
        return self.balance

# 使用自定义异常
try:
    account = BankAccount("Alice", 100)
    account.withdraw(150)
except InsufficientFundsError as e:
    print(e)
    print(f"您需要再存入至少 {e.deficit} 元")
```

### 8.4.2 异常层次结构

Python的内置异常形成了一个层次结构，所有异常都继承自`BaseException`类：

```
BaseException
 ├── SystemExit
 ├── KeyboardInterrupt
 ├── GeneratorExit
 └── Exception
      ├── StopIteration
      ├── ArithmeticError
      │    ├── FloatingPointError
      │    ├── OverflowError
      │    └── ZeroDivisionError
      ├── AssertionError
      ├── AttributeError
      ├── BufferError
      ├── EOFError
      ├── ImportError
      │    └── ModuleNotFoundError
      ├── LookupError
      │    ├── IndexError
      │    └── KeyError
      ├── MemoryError
      ├── NameError
      │    └── UnboundLocalError
      ├── OSError
      │    ├── BlockingIOError
      │    ├── ChildProcessError
      │    ├── ConnectionError
      │    │    ├── BrokenPipeError
      │    │    ├── ConnectionAbortedError
      │    │    ├── ConnectionRefusedError
      │    │    └── ConnectionResetError
      │    ├── FileExistsError
      │    ├── FileNotFoundError
      │    ├── InterruptedError
      │    ├── IsADirectoryError
      │    ├── NotADirectoryError
      │    ├── PermissionError
      │    ├── ProcessLookupError
      │    └── TimeoutError
      ├── ReferenceError
      ├── RuntimeError
      │    ├── NotImplementedError
      │    └── RecursionError
      ├── SyntaxError
      │    └── IndentationError
      │         └── TabError
      ├── SystemError
      ├── TypeError
      ├── ValueError
      │    └── UnicodeError
      │         ├── UnicodeDecodeError
      │         ├── UnicodeEncodeError
      │         └── UnicodeTranslateError
      └── Warning
           ├── DeprecationWarning
           ├── PendingDeprecationWarning
           ├── RuntimeWarning
           ├── SyntaxWarning
           ├── UserWarning
           ├── FutureWarning
           ├── ImportWarning
           ├── UnicodeWarning
           ├── BytesWarning
           └── ResourceWarning
```

## 8.5 使用 with 语句

### 8.5.1 上下文管理器

`with`语句用于简化资源管理，确保资源在使用后被正确释放，即使发生异常：

```python
# 不使用with语句
file = open("example.txt", "r")
try:
    content = file.read()
finally:
    file.close()

# 使用with语句
with open("example.txt", "r") as file:
    content = file.read()
# 文件自动关闭
```

### 8.5.2 自定义上下文管理器

可以通过实现`__enter__`和`__exit__`方法创建自定义上下文管理器：

```python
class MyContextManager:
    def __init__(self, name):
        self.name = name
        
    def __enter__(self):
        print(f"{self.name} 已打开")
        return self  # 返回值赋给as后的变量
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"{self.name} 已关闭")
        # 如果返回True，则抑制异常传播
        if exc_type is not None:
            print(f"处理异常：{exc_type.__name__}: {exc_val}")
            return True  # 抑制异常

# 使用自定义上下文管理器
with MyContextManager("资源") as resource:
    print("正在使用资源")
    # 引发异常
    # raise ValueError("发生错误")
```

### 8.5.3 contextlib模块

`contextlib`模块提供了更简单的方式创建上下文管理器：

```python
from contextlib import contextmanager

@contextmanager
def my_context_manager(name):
    print(f"{name} 已打开")
    try:
        yield name  # yield的值赋给as后的变量
    except Exception as e:
        print(f"处理异常：{type(e).__name__}: {e}")
        # 不重新引发异常
    finally:
        print(f"{name} 已关闭")

# 使用装饰器创建的上下文管理器
with my_context_manager("资源") as resource:
    print(f"正在使用{resource}")
    # 引发异常
    # raise ValueError("发生错误")
```

## 8.6 断言

### 8.6.1 assert语句

`assert`语句用于在调试期间验证条件，如果条件为假，则引发`AssertionError`：

```python
def calculate_average(numbers):
    assert len(numbers) > 0, "列表不能为空"
    return sum(numbers) / len(numbers)

# 正常情况
print(calculate_average([1, 2, 3, 4, 5]))  # 3.0

# 异常情况
# print(calculate_average([]))  # AssertionError: 列表不能为空
```

注意：在生产环境中，可以使用`-O`选项运行Python，这会禁用所有断言。

## 8.7 调试技巧

### 8.7.1 使用try-except进行调试

可以使用`try-except`语句捕获并打印详细的异常信息：

```python
import traceback

def debug_function():
    try:
        # 可能引发异常的代码
        result = 1 / 0
    except Exception as e:
        print(f"异常类型：{type(e).__name__}")
        print(f"异常信息：{e}")
        print("异常堆栈跟踪：")
        traceback.print_exc()

debug_function()
```

### 8.7.2 使用logging模块记录异常

`logging`模块提供了更灵活的方式记录异常信息：

```python
import logging

# 配置日志记录
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='app.log'
)

def divide(a, b):
    try:
        result = a / b
        logging.info(f"计算结果：{a} / {b} = {result}")
        return result
    except Exception as e:
        logging.error(f"计算 {a} / {b} 时发生错误", exc_info=True)
        raise

try:
    divide(10, 0)
except Exception:
    print("已记录异常信息到日志文件")
```

## 8.8 课后练习

1. 编写一个程序，尝试打开一个不存在的文件，并使用异常处理机制处理可能发生的异常。
2. 创建一个自定义异常类`NegativeNumberError`，并在一个计算平方根的函数中使用它。
3. 编写一个程序，使用`try-except-else-finally`结构处理用户输入的整数。
4. 创建一个自定义上下文管理器，用于计算代码块的执行时间。
5. 编写一个函数，接受一个列表和索引，使用异常处理返回指定索引的元素，如果索引无效则返回None。