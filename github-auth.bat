@echo off
chcp 936 >nul 2>&1
setlocal EnableDelayedExpansion

title MatSci Calculator - Git Push Tool
color 0A

echo.
echo ========================================================
echo   MatSci Calculator - GitHub Push Tool
echo   (Git + Token, no GitHub CLI needed)
echo ========================================================
echo.

:: check git
where git >nul 2>&1
if !errorlevel! neq 0 (
    echo [ERROR] Git not found. Install: https://git-scm.com/
    pause
    exit /b 1
)
echo [OK] Git found

:: check network
curl.exe -s --connect-timeout 10 https://api.github.com >nul 2>&1
if !errorlevel! neq 0 (
    echo.
    echo [WARN] Cannot connect to GitHub API.
    echo  If you use proxy, set it first:
    echo    set HTTP_PROXY=http://127.0.0.1:PORT
    echo    set HTTPS_PROXY=http://127.0.0.1:PORT
    echo.
    pause
)

echo.
echo ========================================================
echo  Step 1: Enter your repo URL
echo ========================================================
echo.
echo  Make sure you already created a repo on GitHub:
echo  https://github.com/new
echo  (Name: matsci-calculator, do NOT check README/gitignore/License)
echo.
echo  Example URL: https://github.com/USERNAME/matsci-calculator.git
echo.

set /p REPO_URL="  Paste repo URL: "

if "!REPO_URL!"=="" (
    echo [ERROR] URL is empty
    pause
    exit /b 1
)

:: Remove trailing .git if present, then add it back (avoid double .git)
set "REPO_URL=!REPO_URL:.git=!"
set "REPO_URL=!REPO_URL!.git"

:: Extract repo page URL for display
set "REPO_PAGE=!REPO_URL:.git=!"

echo  Repo URL: !REPO_URL!
echo.

echo ========================================================
echo  Step 2: Enter your Personal Access Token
echo ========================================================
echo.
echo  Need a token with repo + workflow scopes
echo  Create one: https://github.com/settings/tokens/new
echo.

set /p TOKEN="  Paste token (ghp_xxxx): "

if "!TOKEN!"=="" (
    echo [ERROR] Token is empty
    pause
    exit /b 1
)

echo.
echo ========================================================
echo  Step 3: Push code to GitHub
echo ========================================================
echo.

cd /d "%~dp0"

:: Check/configure Git user info
git config user.name >nul 2>&1
if !errorlevel! neq 0 (
    echo [1/5] Configure Git user info...
    echo.
    set /p GIT_USER="  Your name: "
    if "!GIT_USER!"=="" set "GIT_USER=MatSci Developer"
    set /p GIT_EMAIL="  Your email: "
    if "!GIT_EMAIL!"=="" set "GIT_EMAIL=dev@matsci.local"
    git config --global user.name "!GIT_USER!"
    git config --global user.email "!GIT_EMAIL!"
    echo  Set: !GIT_USER! (!GIT_EMAIL!)
    echo.
) else (
    echo [1/5] Git user: 
    for /f "tokens=*" %%i in ('git config user.name 2^>^&1') do echo    %%i
    for /f "tokens=*" %%i in ('git config user.email 2^>^&1') do echo    %%i
    echo.
)

:: Init git repo if needed
if not exist ".git" (
    echo [2/5] Init Git repo...
    git init
    if !errorlevel! neq 0 (
        echo [ERROR] git init failed
        pause
        exit /b 1
    )

    echo [3/5] Add all files...
    git add -A
    if !errorlevel! neq 0 (
        echo [ERROR] git add failed
        pause
        exit /b 1
    )

    echo [4/5] Create initial commit...
    git commit -m "Initial commit: MatSci Calculator Lab"
    if !errorlevel! neq 0 (
        echo [ERROR] git commit failed
        pause
        exit /b 1
    )
) else (
    echo [2/5] Git repo exists
    echo [3/5] Stage changes...
    git add -A

    echo [4/5] Commit changes...
    git commit -m "Update: prepare for iOS cloud build"
    if !errorlevel! equ 0 (
        echo  Changes committed
    ) else (
        echo  No new changes to commit
    )
)

:: Set remote with token
echo [5/5] Push to GitHub...
echo.

:: Remove old origin
git remote remove origin >nul 2>&1

:: Build auth URL: https://TOKEN@github.com/USER/REPO.git
set "AUTH_URL=https://!TOKEN!@!REPO_URL:https://=!"

git remote add origin "!AUTH_URL!"
if !errorlevel! neq 0 (
    echo [ERROR] Failed to set remote
    pause
    exit /b 1
)

:: Ensure main branch
git branch -M main 2>nul

echo  Pushing... (may take 30-60 seconds, please wait...)
echo.

git push -u origin main 2>&1
set PUSH_RESULT=!errorlevel!

:: Clean token from remote URL (security)
git remote set-url origin "!REPO_URL!"

echo.
if !PUSH_RESULT! neq 0 (
    echo ========================================================
    echo  PUSH FAILED!
    echo ========================================================
    echo.
    echo  Possible causes:
    echo  1. Token has no repo permission
    echo  2. Network issue - set proxy if needed:
    echo     git config --global http.proxy http://127.0.0.1:PORT
    echo     git config --global https.proxy http://127.0.0.1:PORT
    echo  3. Repo does not exist on GitHub
    echo  4. Token expired or invalid
    echo.
    echo  Fix the issue and re-run this script.
    echo ========================================================
    echo.
    pause
    exit /b 1
)

echo ========================================================
echo  PUSH SUCCESS!
echo ========================================================
echo.
echo  Repo: !REPO_PAGE!
echo.
echo  iOS cloud build triggered automatically.
echo  Check build progress:
echo  !REPO_PAGE!/actions
echo.
echo  After build (10-15 min), download .ipa from Artifacts.
echo.
echo  Install .ipa on iPhone:
echo    - AltStore: https://altstore.io
echo    - Sideloadly: https://sideloadly.io
echo    - Apple Configurator 2 (Mac)
echo.
echo  NOTE: Free signing IPA expires after 7 days.
echo  For permanent use, you need Apple Developer ($99/year).
echo.
echo ========================================================
echo.

pause
