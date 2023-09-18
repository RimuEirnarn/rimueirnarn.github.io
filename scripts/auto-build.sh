#!/bin/sh

. ./.venv/bin/activate

watchmedo shell-command -R -w -W -p "*.js;*.css;*.html;*.mjs" -c 'scripts/wautobuild "${watch_event_type}" "${watch_object}" "${watch_src_path}" "${watch_dest_path}"' public/ src/
