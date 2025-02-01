@echo off
setlocal enabledelayedexpansion

REM Compactingly minify, copy files to dist.

REM Activate virtual environment if exists
if exist .venv\Scripts\activate.bat (
    call .venv\Scripts\activate.bat
)

set DIST=dist
set DISTCSS=%DIST%\static\css
set DISTJS=%DIST%\static\js
set SRC=src

REM Remove dist directory if it exists
if exist %DIST% (
    rmdir /s /q %DIST%
)

REM Create dist directory
mkdir %DIST%
mkdir %DIST%\static
mkdir %DISTCSS%
mkdir %DISTJS%

REM Step 1: Copy /public to /dist
xcopy /E /H /Y public\* %DIST%\
xcopy /E /H /Y public\.* %DIST%\

REM Step 2: Copy /src contents
xcopy /E /H /Y %SRC%\js %DIST%\static\
xcopy /E /H /Y %SRC%\css %DIST%\static\
xcopy /E /H /Y %SRC%\components %DIST%\
copy %SRC%\main.html %DIST%\
copy %SRC%\404.html %DIST%\

REM Step 2.1: Combining CSS files
(
    type %SRC%\css\color.css
    type %SRC%\css\custom.css
    type %SRC%\css\preloaded.css
) > %DISTCSS%\app.css

copy %DISTCSS%\app.css %DISTCSS%\404.css
type %SRC%\css\404.css >> %DISTCSS%\404.css

del %DISTCSS%\color.css
del %DISTCSS%\custom.css
del %DISTCSS%\preloaded.css

REM Step 2.2: Combining JS files (non-module)
(
    type %DISTJS%\jobcontrol.js
    type %DISTJS%\preloaded.js
    type %DISTJS%\debug-check.js
    type %DISTJS%\error-handler.js
    type %DISTJS%\keybinds.js
) > %DISTJS%\pre-main.js

del %DISTJS%\jobcontrol.js
del %DISTJS%\preloaded.js
del %DISTJS%\debug-check.js
del %DISTJS%\error-handler.js
del %DISTJS%\keybinds.js

REM Step 3: Patching
cd %DIST%
py ..\scripts\patch_compact.py
move /Y compact.html index.html

REM Done!
cd ..
endlocal