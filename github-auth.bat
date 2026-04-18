@echo off
chcp 65001 >nul 2>&1
setlocal EnableDelayedExpansion

title MatSci Calculator - Git 推送工具（无需 gh CLI）
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║   MatSci Calculator - GitHub 代码推送工具              ║
echo ║   （直接使用 Git + Token，无需 GitHub CLI）            ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

:: 检查 git
where git >nul 2>&1
if !errorlevel! neq 0 (
    echo [错误] 未找到 Git，请先安装: https://git-scm.com/
    pause
    exit /b 1
)
echo [OK] Git 已安装

:: 检查网络
curl.exe -s --connect-timeout 10 https://api.github.com >nul 2>&1
if !errorlevel! neq 0 (
    echo.
    echo [警告] 无法连接 GitHub API，网络可能不稳定。
    echo  如果你有代理，请按 Ctrl+C 退出，先设置代理环境变量：
    echo    set HTTP_PROXY=http://127.0.0.1:你的端口
    echo    set HTTPS_PROXY=http://127.0.0.1:你的端口
    echo  然后重新运行本脚本。
    echo.
    pause
)

echo.
echo ══════════════════════════════════════════════════════════
echo  第一步：创建 GitHub 仓库
echo ══════════════════════════════════════════════════════════
echo.
echo  请在浏览器中打开以下链接创建新仓库：
echo.
echo  https://github.com/new
echo.
echo  仓库设置：
echo    Name:          matsci-calculator
echo    Description:   Material Science Calculator Lab
echo    Visibility:    Public 或 Private 按需选择
echo    [不要] 勾选 Add a README / .gitignore / License
echo.
echo ══════════════════════════════════════════════════════════
echo.

:: 尝试自动打开浏览器
start "" "https://github.com/new"

set /p REPO_URL="  仓库创建好后，请粘贴仓库 URL（如 https://github.com/你的用户名/matsci-calculator.git）: "

if "!REPO_URL!"=="" (
    echo [错误] URL 不能为空
    pause
    exit /b 1
)

:: 验证 URL 格式
echo !REPO_URL! | findstr /r "github\.com.*\.git" >nul 2>&1
if !errorlevel! neq 0 (
    echo.
    echo [警告] URL 格式不标准，应该以 .git 结尾
    set /p CONTINUE="  仍然继续？(y/N): "
    if /i "!CONTINUE!" neq "y" exit /b 1
)

:: 如果没带 .git 后缀，补上
echo !REPO_URL! | findstr "\.git$" >nul 2>&1
if !errorlevel! neq 0 (
    set "REPO_URL=!REPO_URL!.git"
)

echo.
echo ══════════════════════════════════════════════════════════
echo  第二步：输入 Personal Access Token
echo ══════════════════════════════════════════════════════════
echo.
echo  需要一个具有 repo 和 workflow 权限的 Token
echo  如果还没有，请打开: https://github.com/settings/tokens/new
echo.
echo  如果已有 PAT，直接粘贴即可（以 ghp_ 开头）
echo.

:: 尝试自动打开 token 页面
start "" "https://github.com/settings/tokens/new?description=MatSci%20Calculator%20Build&scopes=repo,workflow&expiration=90d"

set /p TOKEN="  请粘贴你的 Personal Access Token (ghp_xxxx): "

if "!TOKEN!"=="" (
    echo [错误] Token 不能为空
    pause
    exit /b 1
)

echo.
echo ══════════════════════════════════════════════════════════
echo  第三步：推送代码到 GitHub
echo ══════════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

:: 检查/配置 Git 用户信息
git config user.name >nul 2>&1
if !errorlevel! neq 0 (
    echo [0/5] 首次使用 Git，需要配置用户信息...
    echo.
    set /p GIT_USER="  请输入你的名字（英文）: "
    if "!GIT_USER!"=="" set "GIT_USER=MatSci Developer"
    set /p GIT_EMAIL="  请输入你的邮箱: "
    if "!GIT_EMAIL!"=="" set "GIT_EMAIL=dev@matsci.local"
    git config --global user.name "!GIT_USER!"
    git config --global user.email "!GIT_EMAIL!"
    echo  已设置: !GIT_USER! (!GIT_EMAIL!)
    echo.
) else (
    echo [0/5] Git 用户信息: 
    git config user.name
    git config user.email
    echo.
)

:: 初始化 git 仓库（如果还没有）
if not exist ".git" (
    echo [1/5] 初始化 Git 仓库...
    git init
    if !errorlevel! neq 0 (
        echo [错误] git init 失败
        pause
        exit /b 1
    )
    
    echo [2/5] 添加所有文件...
    git add -A
    if !errorlevel! neq 0 (
        echo [错误] git add 失败
        pause
        exit /b 1
    )
    
    echo [3/5] 创建初始提交...
    git commit -m "Initial commit: MatSci Calculator Lab"
    if !errorlevel! neq 0 (
        echo [错误] git commit 失败
        pause
        exit /b 1
    )
) else (
    echo [1/5] Git 仓库已存在
    echo [2/5] 暂存所有更改...
    git add -A
    
    echo [3/5] 提交更改...
    git commit -m "Update: prepare for iOS cloud build"
    if !errorlevel! equ 0 (
        echo  已提交更改
    ) else (
        echo  没有新更改需要提交
    )
)

:: 配置远程仓库（使用 token 作为密码）
echo [4/5] 配置远程仓库...
git remote remove origin >nul 2>&1

:: 从 URL 中提取用户名和仓库名来构建带 token 的 URL
:: 格式: https://TOKEN@github.com/USER/REPO.git
set "AUTH_URL=!REPO_URL:https://=https://!TOKEN!@!"

git remote add origin "!AUTH_URL!"
if !errorlevel! neq 0 (
    echo [错误] 配置远程仓库失败
    pause
    exit /b 1
)

:: 设置分支为 main
git branch -M main 2>nul

echo [5/5] 推送到 GitHub...
echo  （首次推送可能需要 30-60 秒，请耐心等待...）
echo.

git push -u origin main 2>&1
if !errorlevel! neq 0 (
    echo.
    echo ══════════════════════════════════════════════════════════
    echo  推送失败！可能的原因和解决方案：
    echo ══════════════════════════════════════════════════════════
    echo.
    echo  1. Token 权限不足：确保 Token 有 repo 权限
    echo  2. 网络问题：如果使用代理，请先设置：
    echo     git config --global http.proxy http://127.0.0.1:端口
    echo     git config --global https.proxy http://127.0.0.1:端口
    echo  3. 仓库不存在：确认已在 GitHub 上创建了仓库
    echo  4. Token 过期：重新生成 Token 后再试
    echo.
    echo  修复后重新运行本脚本即可（已保存的设置会保留）。
    echo ══════════════════════════════════════════════════════════
    echo.
    
    :: 清理 remote 中的 token（安全）
    git remote set-url origin "!REPO_URL!"
    pause
    exit /b 1
)

:: 推送成功后，移除 remote URL 中的 token（安全！）
git remote set-url origin "!REPO_URL!"
echo.
echo ══════════════════════════════════════════════════════════
echo  推送成功！
echo ══════════════════════════════════════════════════════════
echo.
echo  代码已推送到: !REPO_URL:https://!=!
echo.

:: 从 URL 提取用户名和仓库名用于显示 Actions 链接
set "REPO_PAGE=!REPO_URL:.git=!"

echo  接下来：
echo.
echo  1. iOS 云构建已自动触发
echo  2. 查看构建进度：
echo     !REPO_PAGE:https://=!
echo.
echo  3. 构建完成后（约 10-15 分钟），在 Artifacts 区域下载 .ipa
echo.
echo  4. 安装 IPA 到 iPhone：
echo     - AltStore: https://altstore.io
echo     - Sideloadly: https://sideloadly.io
echo     - Apple Configurator 2（Mac）
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  注意：免费签名 IPA 在真机只能使用 7 天              ║
echo ║  如需长期使用，需要付费 Apple Developer 账号($99/年)  ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

pause
