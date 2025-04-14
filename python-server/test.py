import socket

def tcp_server():
    # 创建TCP socket
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)  # 防止端口占用
    
    # 绑定IP和端口
    server_socket.bind(('0.0.0.0',5173))  # '0.0.0.0'监听所有本地IP
    server_socket.listen(5)  # 最大排队连接数
    
    print("TCP服务端已启动，等待连接...")
    
    try:
        while True:
            client_socket, addr = server_socket.accept()  # 接受客户端连接
            print(f"接收到来自 {addr} 的连接")
            
            while True:
                data = client_socket.recv(1024)  # 每次接收最多1024字节
                if not data:
                    break  # 连接关闭
                print(f"收到数据: {data.decode('utf-8')}")  # 假设是UTF-8文本
            
            client_socket.close()
    except KeyboardInterrupt:
        print("\n服务端关闭")
    finally:
        server_socket.close()

if __name__ == '__main__':
    tcp_server()