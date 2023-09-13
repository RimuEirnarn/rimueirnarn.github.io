# A TODO-list, for yeah.

change the default `static.yml` to a custom one, that is, using our script to build the site.

It is recommended to use python as whole as we're loading python scripts many times, or not. The call is used to compile css and js files and moving them in a order.

`/src/js` -> `/dist/static/js`
`/src/main.html` -> `/dist/main.html`
`/src/main.html+/src/components/{main,card,terminal}.html` -> `/dist/index.html`
`/src/css` -> `/dist/static/css`
