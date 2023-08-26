// Scripts are loaded once if they're a module, use event.

let now = new Date()

new Promise(resolve => setTimeout(resolve, 200)).then(() => {
    $("#terminal-view").addClass("show")

    $("#datetime").text(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`)
})
