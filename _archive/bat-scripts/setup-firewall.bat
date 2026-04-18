@echo off
chcp 65001 >nul
echo ========================================
echo   配置 Windows 防火墙 - 允许 8080 端口
echo ========================================
echo.

echo ⚠️  此脚本需要管理员权限
echo    如果提示 UAC，请点击"是"
echo.
pause

echo.
echo 🔧 正在添加防火墙规则...
echo.

REM 添加入站规则允许 TCP 8080 端口
netsh advfirewall firewall add rule name="MatSci Calculator Lab - HTTP 8080" dir=in action=allow protocol=TCP localport=8080

if %errorlevel% equ 0 (
    echo ✅ 防火墙规则添加成功！
    echo.
    echo 📋 规则详情:
    echo    名称: MatSci Calculator Lab - HTTP 8080
    echo    方向: 入站
    echo    协议: TCP
    echo    端口: 8080
    echo    操作: 允许
    echo.
) else (
    echo ❌ 防火墙规则添加失败
    echo.
    echo 💡 请手动添加防火墙规则:
    echo    1. 打开 "Windows Defender 防火墙"
    echo    2. 点击 "高级设置"
    echo    3. 点击 "入站规则" → "新建规则"
    echo    4. 选择 "端口" → "下一步"
    echo    5. 选择 "TCP"，特定本地端口输入 "8080"
    echo    6. 选择 "允许连接" → "下一步"
    echo    7. 勾选所有配置文件 → "下一步"
    echo    8. 名称输入 "MatSci Calculator Lab - HTTP 8080"
    echo    9. 点击 "完成"
    echo.
)

echo 🎯 测试步骤:
echo    1. 运行 start-lan-server.bat 启动服务器
echo    2. 在手机浏览器访问显示的 IP 地址
echo    3. 如果无法访问，检查 Tailscale 是否连接
echo.

pause
