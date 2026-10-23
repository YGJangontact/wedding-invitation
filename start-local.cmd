@echo off
cd /d "%~dp0"
set "BUNDLED_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
if exist "%BUNDLED_NODE%\node.exe" set "PATH=%BUNDLED_NODE%;%PATH%"
node node_modules/astro/bin/astro.mjs dev --host 127.0.0.1 --port 4325
pause
