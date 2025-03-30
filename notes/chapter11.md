# 第11章 多线程编程

## 11.1 多线程基础

### 11.1.1 进程与线程

**进程**是操作系统分配资源的基本单位，每个进程都有自己的地址空间、内存、数据栈以及其他记录其运行状态的辅助数据。

**线程**是进程的一个实体，是CPU调度和分派的基本单位，它是比进程更小的能独立运行的基本单位。一个进程可以拥有多个线程。

进程与线程的区别：
- 进程是资源分配的最小单位，线程是CPU调度的最小单位
- 进程之间相互独立，同一进程下的线程共享进程的资源
- 进程切换开销大，线程切换开销小
- 进程间通信复杂，线程间通信相对简单

### 11.1.2 并发与并行

**并发(Concurrency)**：在一段时间内，多个任务交替执行，单核CPU实现多任务的方式。

**并行(Parallelism)**：在同一时刻，多个任务同时执行，需要多核CPU支持。

### 11.1.3 多线程的优缺点

**优点**：
- 提高CPU利用率
- 提高程序响应速度
- 简化程序结构
- 便于建模

**缺点**：
- 线程安全问题
- 增加程序复杂度
- 可能引起死锁
- 上下文切换开销

## 11.2 Python中的多线程

### 11.2.1 threading模块

Python中的`threading`模块提供了多线程相关的功能。

#### 创建线程的方式

**方式一：直接使用Thread类**

```python
import threading
import time

def worker():
    print(f"线程 {threading.current_thread().name} 开始工作")
    time.sleep(2)  # 模拟工作
    print(f"线程 {threading.current_thread().name} 工作结束")

# 创建线程
t = threading.Thread(target=worker, name="WorkerThread")

# 启动线程
t.start()

# 等待线程结束
t.join()

print("主线程结束")
```

**方式二：继承Thread类**

```python
import threading
import time

class MyThread(threading.Thread):
    def __init__(self, name=None):
        super().__init__(name=name)
    
    def run(self):
        print(f"线程 {self.name} 开始工作")
        time.sleep(2)  # 模拟工作
        print(f"线程 {self.name} 工作结束")

# 创建线程
t = MyThread(name="CustomThread")

# 启动线程
t.start()

# 等待线程结束
t.join()

print("主线程结束")
```

### 11.2.2 线程的生命周期

线程的生命周期包括以下几个状态：

1. **新建(New)**：创建线程对象
2. **就绪(Runnable)**：调用start()方法后，线程进入就绪状态，等待CPU调度
3. **运行(Running)**：获得CPU时间片，执行run()方法
4. **阻塞(Blocked)**：线程暂停执行，让出CPU时间片
   - 等待阻塞：执行wait()方法
   - 同步阻塞：获取同步锁失败
   - 其他阻塞：执行sleep()或join()方法
5. **死亡(Dead)**：线程执行完毕或异常终止

### 11.2.3 线程的属性和方法

**Thread类的常用属性**：
- `name`：线程名称
- `daemon`：是否为守护线程
- `ident`：线程的标识符

**Thread类的常用方法**：
- `start()`：启动线程
- `run()`：线程要执行的方法
- `join([timeout])`：等待线程结束
- `is_alive()`：判断线程是否在运行
- `setDaemon(bool)`：设置线程为守护线程

**threading模块的常用函数**：
- `active_count()`：返回当前活动的线程数
- `current_thread()`：返回当前线程对象
- `enumerate()`：返回当前活动的线程列表
- `main_thread()`：返回主线程对象

## 11.3 线程同步

### 11.3.1 线程安全问题

当多个线程同时访问共享资源时，可能会导致数据不一致的问题，这就是线程安全问题。

```python
import threading

# 共享变量
counter = 0

def increment():
    global counter
    for _ in range(100000):
        counter += 1

# 创建两个线程
t1 = threading.Thread(target=increment)
t2 = threading.Thread(target=increment)

# 启动线程
t1.start()
t2.start()

# 等待线程结束
t1.join()
t2.join()

# 理论上counter应该等于200000，但实际上可能小于这个值
print(f"Counter: {counter}")
```

### 11.3.2 互斥锁(Lock)

互斥锁是最简单的线程同步机制，它确保同一时刻只有一个线程可以访问共享资源。

```python
import threading

# 共享变量
counter = 0
# 创建锁
lock = threading.Lock()

def increment():
    global counter
    for _ in range(100000):
        # 获取锁
        lock.acquire()
        try:
            counter += 1
        finally:
            # 释放锁
            lock.release()

# 创建两个线程
t1 = threading.Thread(target=increment)
t2 = threading.Thread(target=increment)

# 启动线程
t1.start()
t2.start()

# 等待线程结束
t1.join()
t2.join()

# 现在counter应该等于200000
print(f"Counter: {counter}")
```

也可以使用`with`语句简化锁的使用：

```python
def increment():
    global counter
    for _ in range(100000):
        with lock:
            counter += 1
```

### 11.3.3 可重入锁(RLock)

可重入锁允许同一个线程多次获取锁，而不会导致死锁。

```python
import threading

# 创建可重入锁
rlock = threading.RLock()

def outer_function():
    with rlock:
        print("获取外层锁")
        inner_function()

def inner_function():
    with rlock:
        print("获取内层锁")

# 创建线程
t = threading.Thread(target=outer_function)

# 启动线程
t.start()

# 等待线程结束
t.join()
```

### 11.3.4 条件变量(Condition)

条件变量用于线程间的通信，它允许线程等待某个条件满足后再继续执行。

```python
import threading
import time

# 创建条件变量
condition = threading.Condition()
# 共享资源
products = []

def producer():
    with condition:
        for i in range(5):
            products.append(f"产品{i}")
            print(f"生产了产品{i}")
            # 通知消费者
            condition.notify()
            time.sleep(1)

def consumer():
    with condition:
        while True:
            # 等待产品
            condition.wait()
            if products:
                product = products.pop(0)
                print(f"消费了{product}")
            if len(products) == 0 and not producer_thread.is_alive():
                break

# 创建线程
producer_thread = threading.Thread(target=producer)
consumer_thread = threading.Thread(target=consumer)

# 启动线程
producer_thread.start()
consumer_thread.start()

# 等待线程结束
producer_thread.join()
consumer_thread.join()
```

### 11.3.5 信号量(Semaphore)

信号量用于控制同时访问共享资源的线程数量。

```python
import threading
import time
import random

# 创建信号量，限制最多3个线程同时访问
semaphore = threading.Semaphore(3)

def worker(i):
    with semaphore:
        print(f"线程{i}获得资源")
        time.sleep(random.random() * 2)  # 模拟工作
        print(f"线程{i}释放资源")

# 创建10个线程
threads = []
for i in range(10):
    t = threading.Thread(target=worker, args=(i,))
    threads.append(t)
    t.start()

# 等待所有线程结束
for t in threads:
    t.join()
```

### 11.3.6 事件(Event)

事件用于线程间的通信，它允许一个线程发送信号，而其他线程等待该信号。

```python
import threading
import time

# 创建事件
event = threading.Event()

def waiter():
    print("等待事件...")
    event.wait()  # 等待事件被设置
    print("事件已被设置，继续执行")

def setter():
    time.sleep(3)  # 等待3秒
    print("设置事件")
    event.set()  # 设置事件

# 创建线程
waiter_thread = threading.Thread(target=waiter)
setter_thread = threading.Thread(target=setter)

# 启动线程
waiter_thread.start()
setter_thread.start()

# 等待线程结束
waiter_thread.join()
setter_thread.join()
```

## 11.4 线程池

线程池是一种线程使用模式，它预先创建一定数量的线程，用于执行任务，避免了频繁创建和销毁线程的开销。

Python 3.2以后，可以使用`concurrent.futures`模块中的`ThreadPoolExecutor`来实现线程池。

```python
import concurrent.futures
import time

def task(n):
    print(f"执行任务{n}")
    time.sleep(1)  # 模拟耗时操作
    return f"任务{n}的结果"

# 创建线程池，最大线程数为5
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    # 提交10个任务
    futures = [executor.submit(task, i) for i in range(10)]
    
    # 获取任务结果
    for future in concurrent.futures.as_completed(futures):
        result = future.result()
        print(result)
```

也可以使用`map`方法：

```python
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    # 提交10个任务并获取结果
    results = list(executor.map(task, range(10)))
    
    # 打印结果
    for result in results:
        print(result)
```

## 11.5 守护线程

守护线程是在后台运行的线程，当所有非守护线程结束时，守护线程会自动终止。守护线程通常用于执行不重要的后台任务。

```python
import threading
import time

def daemon_thread():
    while True:
        print("守护线程正在运行...")
        time.sleep(1)

def non_daemon_thread():
    for i in range(3):
        print(f"非守护线程正在运行...{i}")
        time.sleep(1)
    print("非守护线程结束")

# 创建守护线程
d = threading.Thread(target=daemon_thread)
d.daemon = True  # 设置为守护线程

# 创建非守护线程
t = threading.Thread(target=non_daemon_thread)

# 启动线程
d.start()
t.start()

# 等待非守护线程结束
t.join()

print("主线程结束")
# 此时守护线程也会自动终止
```

## 11.6 线程的优先级和调度

Python的线程调度由操作系统决定，Python本身不提供设置线程优先级的方法。但可以通过`time.sleep()`来让出CPU时间片，影响线程的执行顺序。

```python
import threading
import time

def low_priority():
    for i in range(5):
        print(f"低优先级线程: {i}")
        time.sleep(0.1)  # 让出CPU时间片

def high_priority():
    for i in range(5):
        print(f"高优先级线程: {i}")

# 创建线程
low = threading.Thread(target=low_priority)
high = threading.Thread(target=high_priority)

# 启动线程
low.start()
time.sleep(0.01)  # 确保低优先级线程先启动
high.start()

# 等待线程结束
low.join()
high.join()
```

## 11.7 多线程的应用场景

### 11.7.1 I/O密集型任务

I/O密集型任务是指程序的大部分时间都在等待I/O操作完成，如文件读写、网络请求等。多线程可以有效提高I/O密集型任务的效率。

```python
import threading
import requests
import time

urls = [
    "https://www.python.org",
    "https://www.google.com",
    "https://www.github.com",
    "https://www.stackoverflow.com",
    "https://www.microsoft.com"
]

def download(url):
    response = requests.get(url)
    print(f"下载完成: {url}, 大小: {len(response.content)} 字节")

# 单线程下载
def single_thread():
    start = time.time()
    for url in urls:
        download(url)
    end = time.time()
    print(f"单线程耗时: {end - start:.2f}秒")

# 多线程下载
def multi_thread():
    start = time.time()
    threads = []
    for url in urls:
        t = threading.Thread(target=download, args=(url,))
        threads.append(t)
        t.start()
    
    for t in threads:
        t.join()
    end = time.time()
    print(f"多线程耗时: {end - start:.2f}秒")

print("单线程下载:")
single_thread()

print("\n多线程下载:")
multi_thread()
```

### 11.7.2 GUI应用程序

在GUI应用程序中，使用多线程可以避免界面卡顿，提高用户体验。

```python
import tkinter as tk
import threading
import time

def long_running_task():
    # 模拟耗时操作
    for i in range(10):
        time.sleep(0.5)
        # 更新进度条
        progress_var.set((i + 1) / 10)
        # 更新标签文本
        label_var.set(f"进度: {(i + 1) * 10}%")

def start_task():
    # 禁用按钮，避免重复点击
    start_button.config(state=tk.DISABLED)
    # 创建并启动线程
    t = threading.Thread(target=long_running_task)
    t.daemon = True  # 设置为守护线程
    t.start()
    # 启动检查线程状态的函数
    check_thread(t)

def check_thread(thread):
    if thread.is_alive():
        # 如果线程还在运行，100ms后再次检查
        root.after(100, check_thread, thread)
    else:
        # 线程结束，启用按钮
        start_button.config(state=tk.NORMAL)

# 创建主窗口
root = tk.Tk()
root.title("多线程GUI示例")
root.geometry("300x150")

# 创建变量
progress_var = tk.DoubleVar()
label_var = tk.StringVar()
label_var.set("点击开始按钮")

# 创建控件
label = tk.Label(root, textvariable=label_var)
label.pack(pady=10)

progress = tk.ttk.Progressbar(root, variable=progress_var, length=200, mode="determinate")
progress.pack(pady=10)

start_button = tk.Button(root, text="开始任务", command=start_task)
start_button.pack(pady=10)

# 启动主循环
root.mainloop()
```

### 11.7.3 服务器应用

在服务器应用中，多线程可以同时处理多个客户端请求。

```python
import socket
import threading

def handle_client(client_socket, addr):
    print(f"接受来自 {addr} 的连接")
    
    # 接收客户端数据
    data = client_socket.recv(1024)
    print(f"接收到数据: {data.decode('utf-8')}")
    
    # 发送响应
    client_socket.send("Hello from server!".encode('utf-8'))
    
    # 关闭连接
    client_socket.close()
    print(f"与 {addr} 的连接已关闭")

def start_server():
    # 创建服务器套接字
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(("localhost", 8888))
    server_socket.listen(5)
    print("服务器已启动，等待连接...")
    
    try:
        while True:
            # 接受客户端连接
            client_socket, addr = server_socket.accept()
            
            # 创建新线程处理客户端请求
            client_thread = threading.Thread(target=handle_client, args=(client_socket, addr))
            client_thread.daemon = True
            client_thread.start()
    except KeyboardInterrupt:
        print("服务器关闭")
    finally:
        server_socket.close()

if __name__ == "__main__":
    start_server()
```

## 11.8 多线程的最佳实践

### 11.8.1 避免全局变量

全局变量在多线程环境中容易引起线程安全问题，应尽量避免使用。如果必须使用，应通过锁机制保护。

### 11.8.2 使用线程安全的数据结构

Python的`queue`模块提供了线程安全的队列实现，可以用于线程间的安全通信。

```python
import threading
import queue
import time
import random

# 创建线程安全的队列
q = queue.Queue()

def producer():
    for i in range(5):
        item = f"产品{i}"
        q.put(item)  # 将产品放入队列
        print(f"生产了{item}")
        time.sleep(random.random())

def consumer():
    while True:
        item = q.get()  # 从队列中获取产品
        print(f"消费了{item}")
        q.task_done()  # 标记任务完成
        time.sleep(random.random() * 2)

# 创建生产者线程
producer_thread = threading.Thread(target=producer)
producer_thread.daemon = True

# 创建消费者线程
consumer_thread = threading.Thread(target=consumer)
consumer_thread.daemon = True

# 启动线程
consumer_thread.start()
producer_thread.start()

# 等待所有产品被消费
producer_thread.join()
q.join()

print("所有产品已被消费")
```

### 11.8.3 避免死锁

死锁是指两个或多个线程互相等待对方释放资源，导致所有线程都无法继续执行的情况。

避免死锁的方法：
1. 按照固定的顺序获取锁
2. 使用超时机制
3. 使用可重入锁
4. 避免嵌套锁

### 11.8.4 合理使用线程池

对于需要频繁创建和销毁线程的场景，应使用线程池来提高效率。

### 11.8.5 使用本地线程存储

`threading.local()`提供了线程本地存储，每个线程都有自己独立的存储空间，避免了线程间的数据共享问题。

```python
import threading
import random

# 创建线程本地存储
local_data = threading.local()

def worker():
    # 设置线程本地数据
    local_data.x = random.randint(1, 100)
    print(f"线程 {threading.current_thread().name} 设置 x = {local_data.x}")
    
    # 模拟其他操作
    process_data()

def process_data():
    # 访问线程本地数据
    print(f"线程 {threading.current_thread().name} 访问 x = {local_data.x}")

# 创建多个线程
threads = []
for i in range(5):
    t = threading.Thread(target=worker, name=f"Thread-{i}")
    threads.append(t)
    t.start()

# 等待所有线程结束
for t in threads:
    t.join()
```

## 11.9 课后练习

1. 创建两个线程，一个线程打印1-10的奇数，另一个线程打印1-10的偶数，要求交替打印。

2. 实现一个简单的生产者-消费者模型，生产者生产数据，消费者消费数据，使用队列作为缓冲区。

3. 使用多线程实现一个简单的Web服务器，能够处理多个客户端的并发请求。

4. 编写一个多线程下载程序，能够同时下载多个文件，并显示下载进度。

5. 使用线程池实现一个并发爬虫，爬取指定网站的多个页面。