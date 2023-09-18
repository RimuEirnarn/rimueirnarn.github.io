#!/bin/sh

. ./.venv/bin/activate

watchmedo shell-command -R -w -W -p "*.js;*.css;*.html;*.mjs" -c 'scripts/wautobuild "${watch_event_type}" "${watch_object}"' public/ src/
