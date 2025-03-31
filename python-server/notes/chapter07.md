# 第7章 文件操作

## 7.1 文件基础

### 7.1.1 文件的概念

文件是存储在计算机存储介质上的一组相关数据的集合。在Python中，文件被视为一个对象，通过文件对象可以对文件进行读写操作。

### 7.1.2 文件路径

Python中的文件路径可以是相对路径或绝对路径：

- **绝对路径**：从根目录开始的完整路径，如`C:\Users\username\Documents\file.txt`
- **相对路径**：相对于当前工作目录的路径，如`data\file.txt`

在Windows系统中，路径分隔符为反斜杠`\`，但在Python字符串中需要使用双反斜杠`\\`或正斜杠`/`来表示。

```python
# 使用双反斜杠
path1 = "C:\\Users\\username\\Documents\\file.txt"

# 使用正斜杠
path2 = "C:/Users/username/Documents/file.txt"

# 使用原始字符串
path3 = r"C:\Users\username\Documents\file.txt"
```

## 7.2 文件的打开与关闭

### 7.2.1 打开文件

Python使用`open()`函数打开文件，返回一个文件对象：

```python
file = open(filename, mode, encoding=None)
```

参数说明：
- `filename`：文件路径
- `mode`：打开模式
- `encoding`：文件编码方式

常用的文件打开模式：

| 模式 | 描述 |
| --- | --- |
| `'r'` | 只读模式（默认） |
| `'w'` | 写入模式，会覆盖已有内容 |
| `'a'` | 追加模式，在文件末尾添加内容 |
| `'b'` | 二进制模式 |
| `'t'` | 文本模式（默认） |
| `'+'` | 读写模式 |

这些模式可以组合使用，如`'rb'`表示以二进制只读模式打开文件。

### 7.2.2 关闭文件

使用`close()`方法关闭文件：

```python
file = open("example.txt", "r")
# 文件操作
file.close()
```

为了确保文件被正确关闭，推荐使用`with`语句，它会在代码块结束后自动关闭文件：

```python
with open("example.txt", "r") as file:
    # 文件操作
    content = file.read()
# 文件已自动关闭
```

## 7.3 文件的读取

### 7.3.1 读取整个文件

使用`read()`方法读取整个文件内容：

```python
with open("example.txt", "r", encoding="utf-8") as file:
    content = file.read()
    print(content)
```

### 7.3.2 按行读取

使用`readline()`方法读取一行：

```python
with open("example.txt", "r", encoding="utf-8") as file:
    line = file.readline()
    print(line)
```

使用`readlines()`方法读取所有行并返回一个列表：

```python
with open("example.txt", "r", encoding="utf-8") as file:
    lines = file.readlines()
    for line in lines:
        print(line.strip())  # strip()去除行尾的换行符
```

直接遍历文件对象也可以按行读取：

```python
with open("example.txt", "r", encoding="utf-8") as file:
    for line in file:
        print(line.strip())
```

### 7.3.3 读取指定字节数

`read()`方法可以指定读取的字节数：

```python
with open("example.txt", "r", encoding="utf-8") as file:
    chunk = file.read(10)  # 读取前10个字符
    print(chunk)
```

## 7.4 文件的写入

### 7.4.1 写入文本

使用`write()`方法写入文本：

```python
with open("output.txt", "w", encoding="utf-8") as file:
    file.write("Hello, World!\n")
    file.write("This is a new line.")
```

### 7.4.2 写入多行

使用`writelines()`方法写入多行：

```python
lines = ["Line 1\n", "Line 2\n", "Line 3\n"]
with open("output.txt", "w", encoding="utf-8") as file:
    file.writelines(lines)
```

注意：`writelines()`不会自动添加换行符，需要在每行末尾手动添加。

## 7.5 文件指针操作

### 7.5.1 获取当前位置

使用`tell()`方法获取文件指针的当前位置：

```python
with open("example.txt", "r", encoding="utf-8") as file:
    print(file.tell())  # 0
    file.read(5)
    print(file.tell())  # 5
```

### 7.5.2 移动文件指针

使用`seek()`方法移动文件指针：

```python
with open("example.txt", "r", encoding="utf-8") as file:
    file.seek(10)  # 将指针移动到第10个字节
    print(file.read(5))  # 从第10个字节开始读取5个字节
```

`seek()`方法的语法为`seek(offset, whence)`：
- `offset`：偏移量
- `whence`：起始位置，可选值为：
  - 0：文件开头（默认）
  - 1：当前位置
  - 2：文件末尾

```python
with open("example.txt", "rb") as file:  # 二进制模式
    file.seek(-10, 2)  # 从文件末尾向前移动10个字节
    print(file.read())  # 读取最后10个字节
```

## 7.6 文件和目录操作

### 7.6.1 os模块

Python的`os`模块提供了与操作系统交互的函数：

```python
import os

# 获取当前工作目录
current_dir = os.getcwd()
print(current_dir)

# 改变当前工作目录
os.chdir("C:/Users/username/Documents")

# 列出目录内容
files = os.listdir()
print(files)

# 创建目录
os.mkdir("new_folder")

# 删除文件
os.remove("file.txt")

# 删除空目录
os.rmdir("empty_folder")

# 重命名文件或目录
os.rename("old_name.txt", "new_name.txt")

# 检查路径是否存在
if os.path.exists("file.txt"):
    print("文件存在")

# 判断是文件还是目录
if os.path.isfile("file.txt"):
    print("这是一个文件")
if os.path.isdir("folder"):
    print("这是一个目录")
```

### 7.6.2 os.path模块

`os.path`模块提供了处理文件路径的函数：

```python
import os.path

# 获取绝对路径
abs_path = os.path.abspath("file.txt")
print(abs_path)

# 获取目录名
dir_name = os.path.dirname("C:/Users/username/Documents/file.txt")
print(dir_name)  # C:/Users/username/Documents

# 获取文件名
file_name = os.path.basename("C:/Users/username/Documents/file.txt")
print(file_name)  # file.txt

# 分离目录名和文件名
dir_name, file_name = os.path.split("C:/Users/username/Documents/file.txt")
print(dir_name, file_name)  # C:/Users/username/Documents file.txt

# 分离文件名和扩展名
file_name, ext = os.path.splitext("file.txt")
print(file_name, ext)  # file .txt

# 拼接路径
path = os.path.join("C:/Users/username", "Documents", "file.txt")
print(path)  # C:/Users/username/Documents/file.txt
```

### 7.6.3 shutil模块

`shutil`模块提供了更高级的文件和目录操作：

```python
import shutil

# 复制文件
shutil.copy("source.txt", "destination.txt")

# 复制文件，保留元数据
shutil.copy2("source.txt", "destination.txt")

# 复制目录
shutil.copytree("source_dir", "destination_dir")

# 移动文件或目录
shutil.move("source.txt", "destination.txt")

# 删除目录及其内容
shutil.rmtree("directory")
```

## 7.7 文件的其他操作

### 7.7.1 临时文件

`tempfile`模块提供了创建临时文件和目录的函数：

```python
import tempfile

# 创建临时文件
with tempfile.TemporaryFile() as temp:
    temp.write(b"Hello, World!")
    temp.seek(0)
    print(temp.read())  # b'Hello, World!'

# 创建命名临时文件
with tempfile.NamedTemporaryFile() as temp:
    print(temp.name)  # 临时文件的路径

# 创建临时目录
with tempfile.TemporaryDirectory() as temp_dir:
    print(temp_dir)  # 临时目录的路径
```

### 7.7.2 文件压缩与解压

Python提供了多个模块处理压缩文件：

```python
# 使用zipfile模块处理ZIP文件
import zipfile

# 创建ZIP文件
with zipfile.ZipFile("archive.zip", "w") as zip_file:
    zip_file.write("file1.txt")
    zip_file.write("file2.txt")

# 解压ZIP文件
with zipfile.ZipFile("archive.zip", "r") as zip_file:
    zip_file.extractall("extracted_folder")

# 列出ZIP文件内容
with zipfile.ZipFile("archive.zip", "r") as zip_file:
    print(zip_file.namelist())
```

```python
# 使用tarfile模块处理TAR文件
import tarfile

# 创建TAR文件
with tarfile.open("archive.tar.gz", "w:gz") as tar:
    tar.add("file1.txt")
    tar.add("file2.txt")

# 解压TAR文件
with tarfile.open("archive.tar.gz", "r:gz") as tar:
    tar.extractall("extracted_folder")

# 列出TAR文件内容
with tarfile.open("archive.tar.gz", "r:gz") as tar:
    print(tar.getnames())
```

## 7.8 CSV文件操作

CSV（Comma-Separated Values）是一种常用的数据交换格式。Python的`csv`模块提供了处理CSV文件的功能：

```python
import csv

# 写入CSV文件
with open("data.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["Name", "Age", "City"])
    writer.writerow(["Alice", 25, "New York"])
    writer.writerow(["Bob", 30, "London"])

# 读取CSV文件
with open("data.csv", "r") as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)

# 使用字典读写CSV文件
with open("data.csv", "w", newline="") as file:
    fieldnames = ["Name", "Age", "City"]
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerow({"Name": "Alice", "Age": 25, "City": "New York"})
    writer.writerow({"Name": "Bob", "Age": 30, "City": "London"})

with open("data.csv", "r") as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(row["Name"], row["Age"], row["City"])
```

## 7.9 JSON文件操作

JSON（JavaScript Object Notation）是一种轻量级的数据交换格式。Python的`json`模块提供了处理JSON数据的功能：

```python
import json

# Python对象转JSON字符串
data = {
    "name": "Alice",
    "age": 25,
    "city": "New York",
    "languages": ["Python", "JavaScript", "C++"],
    "is_student": False
}

json_str = json.dumps(data, indent=4)
print(json_str)

# 写入JSON文件
with open("data.json", "w") as file:
    json.dump(data, file, indent=4)

# JSON字符串转Python对象
json_str = '{"name": "Bob", "age": 30, "city": "London"}'
obj = json.loads(json_str)
print(obj["name"])  # Bob

# 读取JSON文件
with open("data.json", "r") as file:
    obj = json.load(file)
    print(obj["name"])  # Alice
```

## 7.10 课后练习

1. 编写一个程序，统计文本文件中的字符数、单词数和行数。
2. 创建一个程序，将一个文本文件的内容复制到另一个文件，同时将所有字母转换为大写。
3. 编写一个程序，读取CSV文件，并计算每列数值的平均值。
4. 创建一个程序，遍历指定目录及其子目录，列出所有指定扩展名的文件。
5. 编写一个程序，读取JSON文件，修改其中的某些值，然后保存回文件。