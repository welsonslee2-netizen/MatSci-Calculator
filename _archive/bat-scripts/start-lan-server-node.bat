@echo off
chcp 65001 >nul
echo ========================================
echo   MatSci Calculator Lab - 局域网服务器
echo   (Node.js 版本)
echo ========================================
echo.

REM 切换到脚本所在目录
cd /d "%~dp0"

echo 📁 当前目录: %CD%
echo.

REM 检查关键文件是否存在
if not exist "index.html" (
    echo ❌ 错误：找不到 index.html
    echo    当前目录: %CD%
    echo    请确保在此文件夹中运行此脚本
    echo.
    pause
    exit /b 1
)

echo ✅ 找到项目文件

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未检测到 Node.js
    echo.
    echo 请先安装 Node.js: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ 检测到 Node.js
node --version
echo.

REM 检查 http-server 是否安装
where http-server >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 正在安装 http-server...
    npm install -g http-server
    if %errorlevel% neq 0 (
        echo ❌ 安装失败，请手动运行: npm install -g http-server
        pause
        exit /b 1
    )
    echo ✅ http-server 安装成功
) else (
    echo ✅ http-server 已安装
)

echo.

REM 获取本机 IP 地址
echo 🔍 正在获取本机 IP 地址...
for /f "tokens=4 delims= " %%i in ('route print ^| findstr " 0.0.0.0.*0.0.0.0"') do (
    set LOCAL_IP=%%i
    goto :found_ip
)
:found_ip

if "%LOCAL_IP%"=="" (
    echo ⚠️  无法自动获取 IP，使用默认值
    set LOCAL_IP=127.0.0.1
)

echo ✅ 本机 IP: %LOCAL_IP%
echo.

echo 🚀 正在启动局域网服务器...
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║  📍 本地访问: http://localhost:8080                     ║
echo ║  📱 手机访问: http://%LOCAL_IP%:8080                    ║
echo ║  💻 其他电脑: http://%LOCAL_IP%:8080                    ║
echo ║                                                          ║
echo ║  ⚠️  重要提示:                                           ║
echo ║     1. 确保 Tailscale 已连接                             ║
echo ║     2. 防火墙允许 8080 端口                              ║
echo ║     3. 在其他设备上使用上面的 IP 地址访问                 ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo 💡 测试步骤:
echo    1. 在本机浏览器打开: http://localhost:8080
echo    2. 在手机浏览器打开: http://%LOCAL_IP%:8080
echo    3. 对比两者的显示效果
echo    4. 在手机上测试小键盘按钮点击
echo.
echo 🛑 按 Ctrl+C 停止服务器
echo.

REM 启动服务器并自动打开浏览器（-a 0.0.0.0 绑定所有网络接口）
start http://localhost:8080
http-server -p 8080 -a 0.0.0.0 -o

pause
