const PATH = "/world/main.py"

await (async () => {
    let data;
    try {
        data = await (await fetch(PATH)).text()
    } catch (_) {
        data = "ERROR: Network issues"
    }
    document.querySelector("#content").innerHTML = data
})()