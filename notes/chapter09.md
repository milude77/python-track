# 第9章 模块和包

## 9.1 模块基础

### 9.1.1 什么是模块

模块是一个包含Python定义和语句的文件，可以被其他Python程序导入和使用。模块的文件名就是模块名加上`.py`后缀。模块允许你将代码分割成相关的部分，提高代码的可维护性和重用性。

### 9.1.2 模块的导入

Python提供了多种导入模块的方式：

```python
# 导入整个模块
import math
print(math.pi)  # 使用模块中的变量

# 导入模块中的特定项
from math import pi, sqrt
print(pi)  # 直接使用导入的变量
print(sqrt(16))  # 直接使用导入的函数

# 导入模块中的所有内容（不推荐）
from math import *
print(pi)
print(sqrt(16))

# 使用别名
import math as m
print(m.pi)

from math import sqrt as square_root
print(square_root(16))
```

### 9.1.3 模块搜索路径

Python解释器在导入模块时会按照以下顺序搜索模块：

1. 当前目录
2. 环境变量PYTHONPATH中的目录
3. Python标准库目录
4. 第三方包安装目录（如site-packages）

可以通过`sys.path`查看和修改模块搜索路径：

```python
import sys
print(sys.path)  # 查看当前的模块搜索路径

# 添加自定义路径
sys.path.append('/path/to/my/modules')
```

## 9.2 创建和使用模块

### 9.2.1 创建自己的模块

创建模块非常简单，只需编写一个`.py`文件：

```python
# mymodule.py
def greeting(name):
    return f"Hello, {name}!"

def add(a, b):
    return a + b

PI = 3.14159

class Circle:
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return PI * self.radius ** 2
```

### 9.2.2 使用自定义模块

```python
# 导入自定义模块
import mymodule

print(mymodule.greeting("Alice"))  # Hello, Alice!
print(mymodule.add(5, 3))  # 8
print(mymodule.PI)  # 3.14159

circle = mymodule.Circle(5)
print(circle.area())  # 78.53975
```

### 9.2.3 模块的`__name__`属性

每个模块都有一个`__name__`属性。当模块被直接运行时，`__name__`的值为`"__main__"`；当模块被导入时，`__name__`的值为模块名。

这个特性常用于编写既可以作为模块导入，又可以作为脚本直接运行的代码：

```python
# mymodule.py
def greeting(name):
    return f"Hello, {name}!"

def add(a, b):
    return a + b

PI = 3.14159

class Circle:
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return PI * self.radius ** 2

# 当模块被直接运行时执行
if __name__ == "__main__":
    print(greeting("World"))
    print(f"5 + 3 = {add(5, 3)}")
    c = Circle(3)
    print(f"Circle area: {c.area()}")
```

## 9.3 包

### 9.3.1 什么是包

包是一种组织Python模块的方式，是一个包含多个模块的目录。一个包必须包含一个特殊的文件`__init__.py`（在Python 3.3+中这个文件可以为空或者省略，但为了兼容性，建议保留）。

包的结构示例：

```
mypackage/
    __init__.py
    module1.py
    module2.py
    subpackage/
        __init__.py
        module3.py
        module4.py
```

### 9.3.2 创建包

创建一个简单的包：

1. 创建包目录结构
2. 在每个目录中创建`__init__.py`文件
3. 添加模块文件

```python
# mypackage/__init__.py
# 可以为空，也可以包含包级别的初始化代码
print("Initializing mypackage")

# mypackage/module1.py
def function1():
    return "This is function1 from module1"

# mypackage/module2.py
def function2():
    return "This is function2 from module2"

# mypackage/subpackage/__init__.py
print("Initializing subpackage")

# mypackage/subpackage/module3.py
def function3():
    return "This is function3 from module3"
```

### 9.3.3 导入包

```python
# 导入包
import mypackage

# 导入包中的模块
import mypackage.module1
print(mypackage.module1.function1())

# 导入子包中的模块
import mypackage.subpackage.module3
print(mypackage.subpackage.module3.function3())

# 使用from导入
from mypackage import module2
print(module2.function2())

from mypackage.subpackage.module3 import function3
print(function3())
```

### 9.3.4 相对导入

在包内部的模块之间可以使用相对导入：

```python
# mypackage/subpackage/module4.py
# 相对导入同级模块
from . import module3

# 相对导入上级包的模块
from .. import module1

def function4():
    return f"Function4 calls: {module3.function3()} and {module1.function1()}"
```

## 9.4 标准库

### 9.4.1 Python标准库概述

Python标准库是Python安装时自带的一组模块和包，提供了丰富的功能。以下是一些常用的标准库模块：

| 模块名 | 描述 |
| --- | --- |
| `os` | 操作系统接口 |
| `sys` | 系统特定参数和函数 |
| `math` | 数学函数 |
| `random` | 生成伪随机数 |
| `datetime` | 日期和时间处理 |
| `collections` | 特殊容器数据类型 |
| `itertools` | 高效循环的迭代器函数 |
| `functools` | 高阶函数和可调用对象上的操作 |
| `re` | 正则表达式 |
| `json` | JSON编码和解码 |
| `pickle` | Python对象序列化 |
| `sqlite3` | SQLite数据库接口 |
| `urllib` | URL处理模块 |
| `email` | 电子邮件和MIME处理 |
| `logging` | 日志记录 |
| `threading` | 线程化编程 |
| `multiprocessing` | 基于进程的并行处理 |

### 9.4.2 常用标准库示例

#### os模块

```python
import os

# 获取当前工作目录
print(os.getcwd())

# 列出目录内容
print(os.listdir('.'))

# 创建目录
os.mkdir('new_folder')

# 重命名文件或目录
os.rename('old_name.txt', 'new_name.txt')

# 删除文件
os.remove('file.txt')

# 执行系统命令
os.system('echo Hello, World!')
```

#### datetime模块

```python
from datetime import datetime, timedelta

# 获取当前日期和时间
now = datetime.now()
print(now)

# 创建特定的日期
date = datetime(2023, 1, 1, 12, 0, 0)
print(date)

# 日期格式化
print(now.strftime('%Y-%m-%d %H:%M:%S'))

# 日期计算
tomorrow = now + timedelta(days=1)
print(tomorrow)
```

#### random模块

```python
import random

# 生成随机整数
print(random.randint(1, 10))

# 从序列中随机选择一个元素
print(random.choice(['apple', 'banana', 'cherry']))

# 随机打乱序列
list1 = [1, 2, 3, 4, 5]
random.shuffle(list1)
print(list1)

# 生成随机浮点数
print(random.random())  # 0.0 到 1.0 之间
print(random.uniform(1.0, 10.0))  # 1.0 到 10.0 之间
```

#### collections模块

```python
from collections import Counter, defaultdict, namedtuple

# Counter：计数器
words = ['apple', 'banana', 'apple', 'cherry', 'apple', 'banana']
counter = Counter(words)
print(counter)  # Counter({'apple': 3, 'banana': 2, 'cherry': 1})
print(counter.most_common(2))  # [('apple', 3), ('banana', 2)]

# defaultdict：带默认值的字典
dd = defaultdict(list)
dd['a'].append(1)
dd['a'].append(2)
dd['b'].append(4)
print(dd)  # defaultdict(<class 'list'>, {'a': [1, 2], 'b': [4]})

# namedtuple：命名元组
Person = namedtuple('Person', ['name', 'age', 'gender'])
p = Person('Alice', 25, 'female')
print(p.name)  # Alice
print(p.age)  # 25
print(p)  # Person(name='Alice', age=25, gender='female')
```

## 9.5 第三方包

### 9.5.1 安装第三方包

Python使用pip包管理器安装第三方包：

```bash
# 安装包
pip install package_name

# 安装特定版本
pip install package_name==1.0.0

# 升级包
pip install --upgrade package_name

# 卸载包
pip uninstall package_name

# 列出已安装的包
pip list

# 查看包信息
pip show package_name
```

### 9.5.2 常用第三方包

以下是一些流行的第三方包：

| 包名 | 描述 |
| --- | --- |
| `numpy` | 科学计算基础库，提供多维数组对象和相关工具 |
| `pandas` | 数据分析和操作工具 |
| `matplotlib` | 绘图库 |
| `requests` | HTTP库 |
| `beautifulsoup4` | HTML和XML解析库 |
| `flask` | 轻量级Web应用框架 |
| `django` | 全功能Web应用框架 |
| `sqlalchemy` | SQL工具包和ORM |
| `pytest` | 测试框架 |
| `pillow` | 图像处理库 |
| `scikit-learn` | 机器学习库 |
| `tensorflow` | 深度学习框架 |
| `pytorch` | 深度学习框架 |

### 9.5.3 使用虚拟环境

虚拟环境是Python的一个重要特性，它允许你为不同的项目创建隔离的Python环境，避免包版本冲突：

```bash
# 创建虚拟环境
python -m venv myenv

# 激活虚拟环境（Windows）
myenv\Scripts\activate

# 激活虚拟环境（Unix/MacOS）
source myenv/bin/activate

# 安装包
pip install package_name

# 退出虚拟环境
deactivate
```

## 9.6 发布自己的包

### 9.6.1 包的结构

一个标准的Python包结构：

```
mypackage/
    setup.py
    README.md
    LICENSE
    mypackage/
        __init__.py
        module1.py
        module2.py
    tests/
        __init__.py
        test_module1.py
        test_module2.py
```

### 9.6.2 创建setup.py

`setup.py`是包的安装脚本，包含了包的元数据：

```python
from setuptools import setup, find_packages

setup(
    name="mypackage",
    version="0.1.0",
    author="Your Name",
    author_email="your.email@example.com",
    description="A short description of the package",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/mypackage",
    packages=find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.6",
    install_requires=[
        "numpy",
        "pandas",
    ],
)
```

### 9.6.3 构建和发布包

```bash
# 安装构建工具
pip install setuptools wheel twine

# 构建包
python setup.py sdist bdist_wheel

# 上传到PyPI测试服务器
twine upload --repository-url https://test.pypi.org/legacy/ dist/*

# 上传到PyPI
twine upload dist/*
```

## 9.7 模块设计最佳实践

### 9.7.1 模块设计原则

1. **单一职责原则**：一个模块应该只有一个明确的职责
2. **接口清晰**：提供清晰的API和文档
3. **封装内部实现**：使用下划线前缀标记内部使用的函数和变量
4. **提供文档**：使用文档字符串记录模块、类和函数的用途

### 9.7.2 文档字符串

```python
def calculate_area(length, width):
    """
    计算矩形的面积。
    
    参数:
        length (float): 矩形的长度
        width (float): 矩形的宽度
        
    返回:
        float: 矩形的面积
        
    示例:
        >>> calculate_area(5, 3)
        15.0
    """
    return length * width
```

### 9.7.3 导入约定

```python
# 标准库导入
import os
import sys

# 第三方库导入
import numpy as np
import pandas as pd

# 本地应用/库特定导入
from mypackage import module1
from mypackage.subpackage import module2
```

## 9.8 课后练习

1. 创建一个名为`calculator`的模块，包含加、减、乘、除四个基本运算函数，并在另一个Python文件中导入并使用这些函数。
2. 创建一个包含多个模块的包，实现一个简单的文件管理系统，包括文件创建、读取、写入和删除功能。
3. 使用标准库中的`datetime`模块编写一个程序，计算两个日期之间的天数差异。
4. 使用`collections`模块中的`Counter`类统计一个文本文件中每个单词出现的频率。
5. 安装一个第三方包（如`requests`），并编写一个简单的程序使用该包获取网页内容。