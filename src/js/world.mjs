const PATH = "/world/main.py"

await (async () => {
    let data;
    try {
        data = await (await fetch(PATH)).text()
    } catch (_) {
        data = "ERROR: Network issues"
    }
    const content = document.querySelector("#content")
    content.innerHTML = data
    try {
        content.removeAttribute("data-highlighted")
    } catch {}
    if (hljs) {
        hljs.highlightAll()
    }
})()