#!/bin/bash

# Compactingly minify, copy files to dist.

if [ -f .venv/bin/activate ]; then 
    source .venv/bin/activate
fi

DIST="./dist"
DISTCSS="$DIST/static/css"
DISTJS="$DIST/static/js"
SRC="./src"

if [ -d $DIST ]; then
    rm -rf $DIST
fi

if [ ! -d $DIST ]; then
    mkdir $DIST
fi

# For now, we don't bundle stuff. Leave them minified by minifier

# Step 1, /public -> /dist

cp -r ./public/* $DIST/
cp -r ./public/.[!.]* $DIST/

# Step 2, /src

mkdir $DIST/static

cp -r $SRC/js $DIST/static/
cp -r $SRC/css $DIST/static/
cp -r $SRC/components $DIST/
cp $SRC/main.html $DIST/
cp $SRC/404.html $DIST/

# Step 2.1, combining css files

cat $SRC/css/{color,custom,preloaded}.css > $DISTCSS/app.css
cat $DISTCSS/app.css > $DISTCSS/404.css
cat $SRC/css/404.css >> $DISTCSS/404.css

rm $DISTCSS/{color,custom,preloaded}.css

# Step 2.2, combining some js (non-module) files

cat $DISTJS/{jobcontrol,preloaded,debug-check,error-handler,keybinds}.js > $DISTJS/pre-main.js
rm $DISTJS/{jobcontrol,preloaded,debug-check,error-handler,keybinds}.js

# Step 3, patching.

cd $DIST

python3.11 ../scripts/patch_compact.py
mv compact.html index.html

# This line cause deployment to be broken
#css-html-js-minify static --overwrite


# Done!

cd ..

