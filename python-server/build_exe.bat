@echo off
echo 正在使用PyInstaller打包Python后端...

:: 检查是否安装了PyInstaller
pip show pyinstaller >nul 2>&1
if %errorlevel% neq 0 (
    echo PyInstaller未安装，正在安装...
    pip install pyinstaller
    if %errorlevel% neq 0 (
        echo 安装PyInstaller失败，请手动安装后重试。
        exit /b 1
    )
)

:: 使用spec文件打包
echo 正在打包Python IPC服务器...
pyinstaller --clean build_exe.spec

if %errorlevel% neq 0 (
    echo 打包失败，请检查错误信息。
    exit /b 1
)

echo 打包完成，可执行文件位于 dist 目录中。

:: 复制可执行文件到Electron资源目录
echo 正在复制Python可执行文件到Electron资源目录...

:: 创建目标目录（如果不存在）
set RESOURCES_DIR=..\resources
if not exist %RESOURCES_DIR% (
    mkdir %RESOURCES_DIR%
    if %errorlevel% neq 0 (
        echo 创建资源目录失败。
        exit /b 1
    )
)

:: 复制可执行文件到resources目录（供Electron主进程直接访问）
copy /Y dist\python_ipc_server.exe %RESOURCES_DIR%\
if %errorlevel% neq 0 (
    echo 复制可执行文件到resources目录失败。
    exit /b 1
)

:: 同时复制到python-server目录（作为备份和符合extraResources配置）
set PYTHON_SERVER_DIR=..\python-server
if not exist %PYTHON_SERVER_DIR%\dist (
    mkdir %PYTHON_SERVER_DIR%\dist
    if %errorlevel% neq 0 (
        echo 创建python-server/dist目录失败。
        exit /b 1
    )
)

copy /Y dist\python_ipc_server.exe %PYTHON_SERVER_DIR%\dist\
if %errorlevel% neq 0 (
    echo 复制可执行文件到python-server/dist目录失败。
    exit /b 1
)

echo 复制完成，Python可执行文件已复制到Electron资源目录。

:: 提示用户可以继续构建Electron应用
echo.
echo 现在可以使用以下命令构建Electron应用：
echo npm run build:win    - 构建Windows应用
echo npm run build:mac    - 构建Mac应用
echo npm run build:linux  - 构建Linux应用
echo.

exit /b 0