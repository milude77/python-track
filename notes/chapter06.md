# 第6章 面向对象程序设计

## 6.1 面向对象编程基础

### 6.1.1 面向对象编程概述

面向对象编程（Object-Oriented Programming，OOP）是一种编程范式，它使用"对象"来设计应用程序和计算机程序。在Python中，一切皆为对象。面向对象编程的主要特点包括：

- **封装**：将数据和方法捆绑在一起，对外部隐藏实现细节
- **继承**：允许一个类（子类）获取另一个类（父类）的属性和方法
- **多态**：不同类可以定义相同的方法名，但具有不同的行为

### 6.1.2 类和对象

类是对象的蓝图或模板，定义了对象的属性和行为。对象是类的实例，代表类的具体实体。

```python
# 定义一个简单的类
class Person:
    # 类变量，被所有实例共享
    species = "Homo sapiens"
    
    # 构造方法，初始化对象
    def __init__(self, name, age):
        # 实例变量，每个实例独有
        self.name = name
        self.age = age
    
    # 实例方法
    def introduce(self):
        return f"My name is {self.name} and I am {self.age} years old."

# 创建类的实例（对象）
person1 = Person("Alice", 25)
person2 = Person("Bob", 30)

# 访问实例变量和方法
print(person1.name)  # 输出: Alice
print(person2.introduce())  # 输出: My name is Bob and I am 30 years old.

# 访问类变量
print(person1.species)  # 输出: Homo sapiens
print(Person.species)  # 输出: Homo sapiens
```

## 6.2 类的定义和使用

### 6.2.1 类的定义

在Python中，使用`class`关键字定义类：

```python
class ClassName:
    # 类体（属性和方法）
    pass
```

### 6.2.2 构造方法

`__init__`方法是类的构造方法，在创建类的实例时自动调用：

```python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
```

### 6.2.3 实例方法

实例方法是定义在类中的函数，第一个参数通常是`self`，代表实例本身：

```python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def perimeter(self):
        return 2 * (self.width + self.height)
```

### 6.2.4 类方法和静态方法

- **类方法**：使用`@classmethod`装饰器，第一个参数是`cls`，代表类本身
- **静态方法**：使用`@staticmethod`装饰器，不需要特定的第一个参数

```python
class MathUtils:
    # 类变量
    pi = 3.14159
    
    # 实例方法
    def __init__(self, value):
        self.value = value
    
    # 类方法
    @classmethod
    def circle_area(cls, radius):
        return cls.pi * radius * radius
    
    # 静态方法
    @staticmethod
    def is_prime(n):
        if n <= 1:
            return False
        for i in range(2, int(n**0.5) + 1):
            if n % i == 0:
                return False
        return True
```

## 6.3 封装

### 6.3.1 访问控制

Python中通过命名约定实现访问控制：

- 公有成员：普通命名，如`name`
- 保护成员：单下划线前缀，如`_name`（约定，不强制）
- 私有成员：双下划线前缀，如`__name`（会被转换为`_ClassName__name`）

```python
class Account:
    def __init__(self, name, balance):
        self.name = name  # 公有属性
        self._type = "Savings"  # 保护属性
        self.__balance = balance  # 私有属性
    
    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            return True
        return False
    
    def withdraw(self, amount):
        if 0 < amount <= self.__balance:
            self.__balance -= amount
            return True
        return False
    
    def get_balance(self):
        return self.__balance
```

### 6.3.2 属性装饰器

Python提供`@property`装饰器，用于创建可控制访问的属性：

```python
class Person:
    def __init__(self, name, age):
        self._name = name
        self._age = age
    
    @property
    def name(self):
        return self._name
    
    @name.setter
    def name(self, value):
        if not isinstance(value, str):
            raise TypeError("Name must be a string")
        self._name = value
    
    @property
    def age(self):
        return self._age
    
    @age.setter
    def age(self, value):
        if not isinstance(value, int):
            raise TypeError("Age must be an integer")
        if value < 0 or value > 150:
            raise ValueError("Age must be between 0 and 150")
        self._age = value
```

## 6.4 继承

### 6.4.1 单继承

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        return f"My name is {self.name} and I am {self.age} years old."

class Student(Person):
    def __init__(self, name, age, student_id):
        # 调用父类的构造方法
        super().__init__(name, age)
        self.student_id = student_id
    
    def introduce(self):
        # 重写父类方法
        return f"{super().introduce()} My student ID is {self.student_id}."
```

### 6.4.2 多继承

Python支持多继承，一个类可以继承多个父类：

```python
class A:
    def method(self):
        print("Method from A")

class B:
    def method(self):
        print("Method from B")

class C(A, B):
    pass

c = C()
c.method()  # 输出: Method from A（按照MRO顺序）
```

### 6.4.3 方法解析顺序(MRO)

Python使用C3线性化算法确定多继承时的方法解析顺序：

```python
class BaseClass(object):
    def show(self):
        print('BaseClass')

class SubClassA(BaseClass):
    def show(self):
        print('Enter SubClassA')
        super().show()
        print('Exit SubClassA')

class SubClassB(BaseClass):
    def show(self):
        print('Enter SubClassB')
        super().show()
        print('Exit SubClassB')

class SubClassC(BaseClass):
    def show(self):
        print('Enter SubClassC')
        super().show()
        print('Exit SubClassC')

class SubClassD(SubClassA, SubClassB, SubClassC):
    def show(self):
        print('Enter SubClassD')
        super().show()
        print('Exit SubClassD')

d = SubClassD()
d.show()
print(SubClassD.mro())  # 查看MRO顺序
```

## 6.5 多态

多态允许不同类的对象对同一消息做出响应，每个类可以以自己的方式实现方法：

```python
class Animal:
    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        return "Woof!"

class Cat(Animal):
    def speak(self):
        return "Meow!"

class Duck(Animal):
    def speak(self):
        return "Quack!"

# 多态函数
def animal_sound(animal):
    return animal.speak()

# 不同对象，相同方法调用
print(animal_sound(Dog()))  # 输出: Woof!
print(animal_sound(Cat()))  # 输出: Meow!
print(animal_sound(Duck()))  # 输出: Quack!
```

## 6.6 特殊方法

Python类可以实现特殊方法（魔术方法），以支持内置操作：

### 6.6.1 字符串表示

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    # 非正式字符串表示
    def __str__(self):
        return f"({self.x}, {self.y})"
    
    # 正式字符串表示
    def __repr__(self):
        return f"Point({self.x}, {self.y})"
```

### 6.6.2 比较操作

```python
class Country:
    def __init__(self, name, area):
        self.__name = name
        self.__area = area
    
    def getName(self):
        return self.__name
    
    def getArea(self):
        return self.__area
    
    # 小于比较
    def __lt__(self, other):
        return self.__area < other.__area
    
    # 等于比较
    def __eq__(self, other):
        return self.__area == other.__area
    
    def __str__(self):
        return f"({self.__name}, {self.__area})"
```

### 6.6.3 容器操作

```python
class MyList:
    def __init__(self, data=None):
        self.data = data or []
    
    # 获取长度
    def __len__(self):
        return len(self.data)
    
    # 索引访问
    def __getitem__(self, index):
        return self.data[index]
    
    # 索引赋值
    def __setitem__(self, index, value):
        self.data[index] = value
    
    # 迭代支持
    def __iter__(self):
        return iter(self.data)
```

## 6.7 课后练习

1. 创建一个`Rectangle`类，包含计算面积和周长的方法。
2. 创建一个`BankAccount`类，实现存款和取款功能，确保账户余额不能为负。
3. 创建一个`Vehicle`类，然后创建`Car`和`Motorcycle`子类，演示继承和多态。
4. 实现一个`Stack`类，包含`push`、`pop`和`peek`方法。
5. 创建一个`Shape`类和子类`Circle`、`Rectangle`、`Triangle`，每个子类都实现`area`方法。