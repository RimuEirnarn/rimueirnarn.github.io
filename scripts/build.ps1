# Compactingly minify, copy files to dist.

# Activate virtual environment if exists
if (Test-Path ".venv/Scripts/Activate.ps1") {
    . .\.venv\Scripts\Activate.ps1
}

$DIST = "dist"
$DISTCSS = "$DIST/static/css"
$DISTJS = "$DIST/static/js"
$SRC = "src"

# Remove dist directory if it exists
if (Test-Path $DIST) {
    Remove-Item -Recurse -Force $DIST
}

# Create dist directory
New-Item -ItemType Directory -Path $DIST | Out-Null
New-Item -ItemType Directory -Path "$DIST/static" | Out-Null
New-Item -ItemType Directory -Path $DISTCSS | Out-Null
New-Item -ItemType Directory -Path $DISTJS | Out-Null

# Step 1: Copy /public to /dist
Copy-Item -Recurse -Force public/* $DIST/
Copy-Item -Recurse -Force public/.[!.]* $DIST/ -ErrorAction SilentlyContinue

# Step 2: Copy /src contents
Copy-Item -Recurse -Force $SRC/js $DIST/static/
Copy-Item -Recurse -Force $SRC/css $DIST/static/
Copy-Item -Recurse -Force $SRC/components $DIST/
Copy-Item -Force $SRC/main.html $DIST/
Copy-Item -Force $SRC/404.html $DIST/

# Step 2.1: Combining CSS files
Get-Content $SRC/css/color.css, $SRC/css/custom.css, $SRC/css/preloaded.css | Set-Content $DISTCSS/app.css
Copy-Item -Force $DISTCSS/app.css $DISTCSS/404.css
Get-Content $SRC/css/404.css | Add-Content $DISTCSS/404.css

Remove-Item -Force $DISTCSS/color.css, $DISTCSS/custom.css, $DISTCSS/preloaded.css

# Step 2.2: Combining JS files (non-module)
Get-Content $DISTJS/jobcontrol.js, $DISTJS/preloaded.js, $DISTJS/debug-check.js, $DISTJS/error-handler.js, $DISTJS/keybinds.js | Set-Content $DISTJS/pre-main.js

Remove-Item -Force $DISTJS/jobcontrol.js, $DISTJS/preloaded.js, $DISTJS/debug-check.js, $DISTJS/error-handler.js, $DISTJS/keybinds.js

# Step 3: Patching
Set-Location $DIST
python ../scripts/patch_compact.py
Rename-Item -Force compact.html index.html

# Done!
Set-Location ..