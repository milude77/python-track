# 第10章 网络编程

## 10.1 网络基础

### 10.1.1 计算机网络概述

计算机网络是指将地理位置不同的具有独立功能的多台计算机及其外部设备，通过通信线路连接起来，在网络操作系统、网络管理软件及网络通信协议的管理和协调下，实现资源共享和信息传递的计算机系统。

主要网络类型：
- 局域网（LAN）：覆盖范围小，通常在一个建筑物或校园内
- 广域网（WAN）：覆盖范围大，可跨越城市、国家甚至全球
- 互联网（Internet）：全球最大的网络，连接了世界各地的计算机

### 10.1.2 网络协议

网络协议是为计算机网络中进行数据交换而建立的规则、标准或约定的集合。

#### TCP/IP协议族

TCP/IP（传输控制协议/互联网协议）是互联网的基础通信协议，由多个协议组成：

- **应用层**：HTTP、FTP、SMTP、DNS等
- **传输层**：TCP、UDP
- **网络层**：IP
- **链路层**：以太网、Wi-Fi等

#### TCP和UDP

**TCP（传输控制协议）**：
- 面向连接的协议
- 提供可靠的数据传输
- 有流量控制和拥塞控制
- 适用于对可靠性要求高的应用（如网页浏览、文件传输）

**UDP（用户数据报协议）**：
- 无连接的协议
- 不保证数据传输的可靠性
- 传输速度快，开销小
- 适用于对实时性要求高的应用（如视频流、在线游戏）

### 10.1.3 IP地址和端口

**IP地址**是用于标识网络上的设备的数字标签：
- IPv4：32位地址，如192.168.1.1
- IPv6：128位地址，如2001:0db8:85a3:0000:0000:8a2e:0370:7334

**端口**是应用程序在计算机上的标识，范围从0到65535：
- 0-1023：系统端口（如HTTP:80, HTTPS:443, FTP:21）
- 1024-49151：注册端口
- 49152-65535：动态或私有端口

## 10.2 Python的网络编程模块

### 10.2.1 socket模块

`socket`模块是Python中进行网络编程的基础，提供了使用Berkeley套接字API的接口。

#### 创建套接字

```python
import socket

# 创建TCP套接字
tcp_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 创建UDP套接字
udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
```

参数说明：
- `socket.AF_INET`：使用IPv4地址族
- `socket.AF_INET6`：使用IPv6地址族
- `socket.SOCK_STREAM`：使用TCP协议
- `socket.SOCK_DGRAM`：使用UDP协议

### 10.2.2 urllib模块

`urllib`是Python标准库中用于处理URL的模块，包含多个子模块：

- `urllib.request`：打开和读取URL
- `urllib.error`：包含urllib.request抛出的异常
- `urllib.parse`：解析URL
- `urllib.robotparser`：解析robots.txt文件

```python
from urllib.request import urlopen

# 打开URL并读取内容
with urlopen('https://www.python.org') as response:
    html = response.read()
    print(len(html))
```

### 10.2.3 http模块

Python的`http`模块提供了HTTP协议的客户端和服务器实现：

- `http.client`：HTTP客户端
- `http.server`：HTTP服务器
- `http.cookies`：HTTP cookie处理
- `http.cookiejar`：HTTP cookie管理

## 10.3 TCP编程

### 10.3.1 TCP服务器

```python
import socket

# 创建TCP套接字
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 绑定地址和端口
server_socket.bind(('127.0.0.1', 8888))

# 开始监听，参数表示最大连接数
server_socket.listen(5)
print('服务器已启动，等待连接...')

while True:
    # 接受客户端连接
    client_socket, client_address = server_socket.accept()
    print(f'客户端 {client_address} 已连接')
    
    # 接收数据
    data = client_socket.recv(1024)  # 一次最多接收1024字节
    print(f'收到数据：{data.decode("utf-8")}')
    
    # 发送响应
    client_socket.send('已收到您的消息'.encode('utf-8'))
    
    # 关闭客户端连接
    client_socket.close()
```

### 10.3.2 TCP客户端

```python
import socket

# 创建TCP套接字
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 连接服务器
client_socket.connect(('127.0.0.1', 8888))

# 发送数据
client_socket.send('Hello, Server!'.encode('utf-8'))

# 接收响应
response = client_socket.recv(1024)
print(f'服务器响应：{response.decode("utf-8")}')

# 关闭连接
client_socket.close()
```

### 10.3.3 多客户端处理

使用线程处理多个客户端连接：

```python
import socket
import threading

def handle_client(client_socket, client_address):
    print(f'客户端 {client_address} 已连接')
    
    # 接收数据
    data = client_socket.recv(1024)
    print(f'收到数据：{data.decode("utf-8")}')
    
    # 发送响应
    client_socket.send('已收到您的消息'.encode('utf-8'))
    
    # 关闭客户端连接
    client_socket.close()

# 创建TCP套接字
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind(('127.0.0.1', 8888))
server_socket.listen(5)
print('服务器已启动，等待连接...')

try:
    while True:
        # 接受客户端连接
        client_socket, client_address = server_socket.accept()
        
        # 创建新线程处理客户端连接
        client_thread = threading.Thread(
            target=handle_client,
            args=(client_socket, client_address)
        )
        client_thread.start()
        
except KeyboardInterrupt:
    print('服务器关闭')
    server_socket.close()
```

## 10.4 UDP编程

### 10.4.1 UDP服务器

```python
import socket

# 创建UDP套接字
server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# 绑定地址和端口
server_socket.bind(('127.0.0.1', 9999))
print('UDP服务器已启动，等待数据...')

while True:
    # 接收数据和客户端地址
    data, client_address = server_socket.recvfrom(1024)
    print(f'收到来自 {client_address} 的数据：{data.decode("utf-8")}')
    
    # 发送响应
    server_socket.sendto('已收到您的消息'.encode('utf-8'), client_address)
```

### 10.4.2 UDP客户端

```python
import socket

# 创建UDP套接字
client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# 服务器地址
server_address = ('127.0.0.1', 9999)

# 发送数据
client_socket.sendto('Hello, UDP Server!'.encode('utf-8'), server_address)

# 接收响应
response, _ = client_socket.recvfrom(1024)
print(f'服务器响应：{response.decode("utf-8")}')

# 关闭套接字
client_socket.close()
```

## 10.5 HTTP编程

### 10.5.1 使用urllib发送HTTP请求

```python
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
import json

# 简单的GET请求
try:
    with urlopen('https://api.github.com/users/python') as response:
        data = json.loads(response.read().decode('utf-8'))
        print(f"用户名: {data['login']}")
        print(f"仓库数: {data['public_repos']}")
except HTTPError as e:
    print(f'HTTP错误: {e.code}')
except URLError as e:
    print(f'URL错误: {e.reason}')

# 自定义请求头的GET请求
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}
req = Request('https://api.github.com/users/python', headers=headers)
with urlopen(req) as response:
    data = json.loads(response.read().decode('utf-8'))
    print(f"用户名: {data['login']}")
```

### 10.5.2 使用requests库

`requests`是一个第三方库，提供了更简单的HTTP请求接口：

```python
import requests

# GET请求
response = requests.get('https://api.github.com/users/python')
if response.status_code == 200:
    data = response.json()
    print(f"用户名: {data['login']}")
    print(f"仓库数: {data['public_repos']}")
else:
    print(f'请求失败: {response.status_code}')

# POST请求
data = {'key1': 'value1', 'key2': 'value2'}
response = requests.post('https://httpbin.org/post', data=data)
print(response.json())

# 自定义请求头
headers = {'User-Agent': 'my-app/0.0.1'}
response = requests.get('https://api.github.com/users/python', headers=headers)
print(response.json())

# 处理cookies
response = requests.get('https://httpbin.org/cookies/set/sessionid/123456789')
print(response.cookies['sessionid'])

# 会话对象保持cookies
session = requests.Session()
session.get('https://httpbin.org/cookies/set/sessionid/123456789')
response = session.get('https://httpbin.org/cookies')
print(response.json())
```

### 10.5.3 实现简单的HTTP服务器

使用`http.server`模块实现简单的HTTP服务器：

```python
from http.server import HTTPServer, BaseHTTPRequestHandler

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(b'<html><body><h1>Hello, World!</h1></body></html>')

# 创建服务器
server_address = ('', 8000)  # 空字符串表示所有可用接口
httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
print('服务器已启动在 http://localhost:8000')

# 启动服务器
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print('服务器关闭')
    httpd.server_close()
```

## 10.6 网络爬虫基础

### 10.6.1 网络爬虫概述

网络爬虫是一种自动获取网页内容的程序，用于从互联网上收集信息。爬虫的基本流程：

1. 发送HTTP请求获取网页内容
2. 解析网页内容提取所需信息
3. 存储数据
4. 根据需要继续爬取其他页面

### 10.6.2 使用Beautiful Soup解析HTML

`Beautiful Soup`是一个用于解析HTML和XML的Python库：

```python
import requests
from bs4 import BeautifulSoup

# 获取网页内容
response = requests.get('https://www.python.org')
html = response.text

# 创建Beautiful Soup对象
soup = BeautifulSoup(html, 'html.parser')

# 查找元素
title = soup.title.string
print(f'网页标题: {title}')

# 查找所有链接
links = soup.find_all('a')
for link in links[:5]:  # 只打印前5个链接
    print(link.get('href'))

# 根据CSS选择器查找元素
events = soup.select('.event-widget li')
for event in events:
    name = event.select_one('.event-title').text
    time = event.select_one('.event-date').text
    print(f'{name} - {time}')
```

### 10.6.3 爬虫注意事项

1. **遵守robots.txt规则**：网站的robots.txt文件指定了爬虫可以访问的页面
2. **控制爬取速度**：避免短时间内发送大量请求
3. **设置合适的User-Agent**：标识爬虫的身份
4. **处理反爬虫机制**：如验证码、IP封锁等
5. **遵守法律法规**：不爬取敏感或违法内容

```python
# 检查robots.txt
from urllib.robotparser import RobotFileParser

rp = RobotFileParser()
rp.set_url('https://www.python.org/robots.txt')
rp.read()

# 检查爬虫是否可以爬取特定URL
can_fetch = rp.can_fetch('*', 'https://www.python.org/downloads/')
print(f'是否可以爬取: {can_fetch}')
```

## 10.7 实际应用案例

### 10.7.1 实现聊天程序

基于TCP的简单聊天程序：

```python
# chat_server.py
import socket
import threading

def handle_client(client_socket, client_address):
    while True:
        try:
            # 接收消息
            message = client_socket.recv(1024).decode('utf-8')
            if not message:
                break
                
            print(f'{client_address}: {message}')
            
            # 广播消息给所有客户端
            broadcast_message = f'{client_address}: {message}'
            for client in clients:
                if client != client_socket:
                    try:
                        client.send(broadcast_message.encode('utf-8'))
                    except:
                        # 移除断开连接的客户端
                        client.close()
                        clients.remove(client)
        except:
            break
    
    # 客户端断开连接
    print(f'{client_address} 断开连接')
    client_socket.close()
    clients.remove(client_socket)

# 创建TCP套接字
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind(('127.0.0.1', 8888))
server_socket.listen(5)
print('聊天服务器已启动，等待连接...')

# 客户端列表
clients = []

try:
    while True:
        # 接受客户端连接
        client_socket, client_address = server_socket.accept()
        print(f'{client_address} 已连接')
        
        # 添加到客户端列表
        clients.append(client_socket)
        
        # 创建新线程处理客户端
        client_thread = threading.Thread(
            target=handle_client,
            args=(client_socket, client_address)
        )
        client_thread.daemon = True
        client_thread.start()
        
except KeyboardInterrupt:
    print('服务器关闭')
    server_socket.close()
```

```python
# chat_client.py
import socket
import threading

def receive_messages(client_socket):
    while True:
        try:
            message = client_socket.recv(1024).decode('utf-8')
            print(message)
        except:
            print('连接已断开')
            client_socket.close()
            break

# 创建TCP套接字
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
    # 连接服务器
    client_socket.connect(('127.0.0.1', 8888))
    print('已连接到服务器')
    
    # 创建接收消息的线程
    receive_thread = threading.Thread(target=receive_messages, args=(client_socket,))
    receive_thread.daemon = True
    receive_thread.start()
    
    # 发送消息
    while True:
        message = input()
        if message.lower() == 'quit':
            break
        client_socket.send(message.encode('utf-8'))
        
except ConnectionRefusedError:
    print('无法连接到服务器')
except KeyboardInterrupt:
    pass
finally:
    client_socket.close()
```

### 10.7.2 实现文件下载器

```python
import requests
import os
from tqdm import tqdm  # 进度条库

def download_file(url, save_path):
    # 发送HEAD请求获取文件大小
    response = requests.head(url)
    file_size = int(response.headers.get('content-length', 0))
    
    # 创建目录（如果不存在）
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    
    # 下载文件
    response = requests.get(url, stream=True)
    with open(save_path, 'wb') as f:
        with tqdm(total=file_size, unit='B', unit_scale=True, desc=os.path.basename(save_path)) as pbar:
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    f.write(chunk)
                    pbar.update(len(chunk))
    
    return save_path

# 使用示例
url = 'https://www.python.org/ftp/python/3.9.7/python-3.9.7-amd64.exe'
save_path = 'downloads/python-3.9.7-amd64.exe'

try:
    downloaded_file = download_file(url, save_path)
    print(f'文件已下载到: {downloaded_file}')
except Exception as e:
    print(f'下载失败: {e}')
```

## 10.8 课后练习

1. 编写一个TCP服务器和客户端，实现简单的回显功能（服务器将客户端发送的消息原样返回）。
2. 实现一个UDP聊天程序，允许多个客户端之间互相发送消息。
3. 使用`requests`库和`Beautiful Soup`编写一个简单的网络爬虫，爬取某个网站的标题和链接。
4. 实现一个多线程的文件下载器，可以同时下载多个文件。
5. 编写一个简单的Web服务器，能够提供静态文件服务。