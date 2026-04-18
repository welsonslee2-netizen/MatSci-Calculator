@echo off
chcp 65001 >nul
echo ========================================
echo   MatSci Calculator Lab - 启动服务器
echo   (Python 版本)
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

REM 检查 Python 是否安装
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未检测到 Python
    echo.
    echo 请先安装 Python: https://www.python.org/
    echo    安装时务必勾选 "Add Python to PATH"
    echo.
    pause
    exit /b 1
)

echo ✅ 检测到 Python
python --version
echo.
echo 🚀 正在启动本地服务器...
echo.
echo 📍 访问地址: http://localhost:8080
echo.
echo 💡 提示:
echo    - 按 Ctrl+C 停止服务器
echo    - 浏览器会自动打开
echo    - 在浏览器中访问 diagnose.html 进行诊断
echo.

REM 启动服务器并自动打开浏览器
start http://localhost:8080
python -m http.server 8080

pause
