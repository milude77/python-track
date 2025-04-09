# 第7章 文件操作

## 7.1 文件操作基础

文件操作是Python中常见的任务，理解文件操作的基本流程对于数据处理和存储至关重要：

### 1. 打开文件
- **open()函数**：Python使用内置的`open()`函数打开文件
  ```python
  file = open('example.txt', 'r', encoding='utf-8')
  ```
- **文件模式选择**：根据需要选择适当的模式（读、写、追加等）
- **编码设置**：处理文本文件时，指定正确的字符编码（如UTF-8）

### 2. 读/写操作
- **读取操作**：
  - `read()`：读取整个文件或指定字节数
  - `readline()`：读取单行
  - `readlines()`：读取所有行到列表
  - 文件迭代器：直接遍历文件对象读取每行

- **写入操作**：
  - `write()`：写入字符串
  - `writelines()`：写入字符串列表

- **文件指针操作**：
  - `seek()`：移动文件指针到指定位置
  - `tell()`：获取当前文件指针位置

### 3. 关闭文件
- **手动关闭**：使用`file.close()`方法
- **自动关闭**：使用`with`语句（上下文管理器）
  ```python
  with open('example.txt', 'r') as file:
      content = file.read()
  # 文件在with块结束后自动关闭
  ```

### 4. 资源释放
- 文件关闭后，系统会释放相关资源
- 使用`with`语句可以确保即使发生异常，文件也能正确关闭
- 未正确关闭的文件可能导致资源泄漏或数据丢失

正确的文件操作流程不仅可以提高程序的效率，还能避免资源泄漏和数据损坏等问题。推荐始终使用`with`语句处理文件操作，以确保资源的正确释放。

### 文件打开模式

| 模式 | 描述 | 文件不存在时 | 文件存在时 |
|------|------|-------------|------------|
| 'r' | 只读 | 报错 | 读取 |
| 'w' | 只写 | 创建 | 覆盖 |
| 'a' | 追加 | 创建 | 追加 |
| 'x' | 独占写入 | 创建 | 报错 |
| 'b' | 二进制模式 | - | - |
| 't' | 文本模式 | - | - |
| '+' | 读写模式 | - | - |

## 7.2 文本文件操作

### 基本读写操作

```python
# 写入文本文件
with open('example.txt', 'w', encoding='utf-8') as f:
    f.write('Hello, Python!\n')
    f.write('文件操作示例\n')

# 读取文本文件
with open('example.txt', 'r', encoding='utf-8') as f:
    # 读取全部内容
    content = f.read()
    print(content)

# 逐行读取
with open('example.txt', 'r', encoding='utf-8') as f:
    for line in f:
        print(line.strip())

# 读取指定字节数
with open('example.txt', 'r', encoding='utf-8') as f:
    chunk = f.read(10)  # 读取10个字符
    print(chunk)

# 文件指针操作
with open('example.txt', 'r', encoding='utf-8') as f:
    f.seek(0)  # 移动到文件开头
    f.tell()   # 获取当前位置
    f.seek(0, 2)  # 移动到文件末尾
```

### 文件读写方法

```python
# 读取所有行
with open('example.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    print(lines)

# 读取单行
with open('example.txt', 'r', encoding='utf-8') as f:
    line = f.readline()
    print(line)

# 写入多行
lines = ['行1\n', '行2\n', '行3\n']
with open('example.txt', 'w', encoding='utf-8') as f:
    f.writelines(lines)

# 追加内容
with open('example.txt', 'a', encoding='utf-8') as f:
    f.write('追加的内容\n')
```

## 7.3 二进制文件操作

### 二进制文件处理

```python
# 写入二进制文件
with open('data.bin', 'wb') as f:
    data = bytes([0, 1, 2, 3, 4])
    f.write(data)

# 读取二进制文件
with open('data.bin', 'rb') as f:
    data = f.read()
    print(data)

# 图片文件复制示例
def copy_image(src, dst):
    with open(src, 'rb') as fsrc:
        with open(dst, 'wb') as fdst:
            while True:
                chunk = fsrc.read(4096)  # 每次读取4KB
                if not chunk:
                    break
                fdst.write(chunk)
```

## 7.4 文件系统操作

### 路径操作

```python
import os
import os.path

# 路径操作
path = 'C:/Users/Documents/example.txt'
print(os.path.dirname(path))   # 目录名
print(os.path.basename(path))  # 文件名
print(os.path.split(path))     # 分割路径
print(os.path.splitext(path))  # 分割扩展名

# 路径判断
print(os.path.exists(path))    # 是否存在
print(os.path.isfile(path))    # 是否是文件
print(os.path.isdir(path))     # 是否是目录

# 路径拼接
dir_path = 'C:/Users/Documents'
file_name = 'example.txt'
full_path = os.path.join(dir_path, file_name)
```

### 目录操作

```python
# 创建目录
os.mkdir('new_directory')           # 创建单个目录
os.makedirs('path/to/directory')    # 创建多级目录

# 删除操作
os.remove('file.txt')               # 删除文件
os.rmdir('empty_directory')         # 删除空目录
import shutil
shutil.rmtree('directory')         # 删除目录及内容

# 遍历目录
for root, dirs, files in os.walk('.'):
    print(f'当前目录: {root}')
    print(f'子目录: {dirs}')
    print(f'文件: {files}')

# 列出目录内容
print(os.listdir('.'))              # 列出当前目录内容
```

## 7.5 高级文件操作

### 文件属性和权限

```python
import os
import time

# 获取文件信息
stat = os.stat('example.txt')
print(f'大小: {stat.st_size} 字节')
print(f'创建时间: {time.ctime(stat.st_ctime)}')
print(f'修改时间: {time.ctime(stat.st_mtime)}')
print(f'访问时间: {time.ctime(stat.st_atime)}')

# 修改文件权限
os.chmod('example.txt', 0o755)  # 修改权限为755
```

### 文件操作实用函数

```python
import shutil

# 文件复制
shutil.copy('src.txt', 'dst.txt')         # 复制文件
shutil.copy2('src.txt', 'dst.txt')        # 复制文件及元数据
shutil.copyfile('src.txt', 'dst.txt')     # 仅复制内容

# 移动文件
shutil.move('src.txt', 'dst.txt')

# 修改文件名
os.rename('old.txt', 'new.txt')
```

## 7.6 文件操作最佳实践

### 异常处理

```python
# 安全的文件操作
try:
    with open('example.txt', 'r') as f:
        content = f.read()
except FileNotFoundError:
    print('文件不存在')
except PermissionError:
    print('没有权限访问文件')
except Exception as e:
    print(f'发生错误：{str(e)}')

# 文件备份
def backup_file(filename):
    import time
    timestamp = time.strftime('%Y%m%d_%H%M%S')
    backup_name = f'{filename}.{timestamp}.bak'
    try:
        shutil.copy2(filename, backup_name)
        return True
    except Exception as e:
        print(f'备份失败：{str(e)}')
        return False
```

### 文件操作工具函数

```python
def safe_delete(path):
    """安全删除文件或目录"""
    try:
        if os.path.isfile(path):
            os.remove(path)
        elif os.path.isdir(path):
            shutil.rmtree(path)
        return True
    except Exception as e:
        print(f'删除失败：{str(e)}')
        return False

def get_file_size(path, unit='bytes'):
    """获取文件大小，支持不同单位"""
    size = os.path.getsize(path)
    units = {
        'bytes': 1,
        'kb': 1024,
        'mb': 1024 * 1024,
        'gb': 1024 * 1024 * 1024
    }
    return size / units.get(unit.lower(), 1)

def create_unique_file(directory, prefix='file', extension='.txt'):
    """创建唯一文件名"""
    import uuid
    while True:
        filename = f'{prefix}_{uuid.uuid4().hex[:8]}{extension}'
        path = os.path.join(directory, filename)
        if not os.path.exists(path):
            return path
```

## 7.7 文件操作应用实例

### 文件监控系统

```python
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class MyHandler(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory:
            print(f'文件创建: {event.src_path}')
    
    def on_modified(self, event):
        if not event.is_directory:
            print(f'文件修改: {event.src_path}')
    
    def on_deleted(self, event):
        if not event.is_directory:
            print(f'文件删除: {event.src_path}')

def monitor_directory(path):
    event_handler = MyHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=False)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
```

### 文件批处理

```python
def batch_process_files(directory, extensions=None):
    """批量处理指定目录下的文件"""
    if extensions is None:
        extensions = ['.txt', '.log']
    
    processed = 0
    for root, _, files in os.walk(directory):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                file_path = os.path.join(root, file)
                try:
                    # 处理文件
                    process_file(file_path)
                    processed += 1
                except Exception as e:
                    print(f'处理文件 {file} 时出错: {str(e)}')
    return processed

def process_file(file_path):
    """处理单个文件的具体操作"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        # 进行处理...
    
    # 处理后保存
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(processed_content)
```