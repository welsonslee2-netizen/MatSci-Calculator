@echo off
chcp 65001 >nul
echo ========================================
echo   MatSci Calculator Lab - 启动服务器
echo ========================================
echo.

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未检测到 Node.js
    echo.
    echo 请先安装 Node.js: https://nodejs.org/
    echo.
    echo 或者使用 Python 方案:
    echo   python -m http.server 8080
    echo.
    pause
    exit /b 1
)

echo ✅ 检测到 Node.js
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
echo 🚀 正在启动本地服务器...
echo.
echo 📍 访问地址: http://localhost:8080
echo.
echo 💡 提示:
echo    - 按 Ctrl+C 停止服务器
echo    - 浏览器会自动打开
echo.

REM 启动服务器并自动打开浏览器
start http://localhost:8080
http-server -p 8080 -o

pause
