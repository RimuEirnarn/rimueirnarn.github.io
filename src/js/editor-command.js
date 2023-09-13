// Editor Command

const JOBNAME = "editor-command.js"

GJobControl.setJob(JOBNAME)

const buffout = "#editor-command > #buffer > #buffout"
const path = "#editor-command > #buffer > input"

const FUNCTIONS = {
    alertfn() {
        alert('a')
    },
    ping() {
        (async () => {
            const pingpong = await fetch("/ping")
            const utf8Decoder = new TextDecoder("utf-8");
            const reader = pingpong.body.getReader();
            let { value: chunk, done: readerDone } = await reader.read();
            chunk = chunk ? utf8Decoder.decode(chunk) : "";

            $(buffout).text(chunk)
        })()
          .then(() => null)
          .catch((e) => console.error(e))
    }
}

function fetchContent() {
    let content = $(path)
    return content.val()
}

$(path).on('keydown', (e) => {
    if (e.key === "Enter") {
        let content = fetchContent()
        if (content in FUNCTIONS) {
            FUNCTIONS[content]()
        } else {
            $(buffout).html('<p class="text-danger">Not an editor command!</p>')
        }
        $(path).val("")
    }
})

GJobControl.updateJob(JOBNAME, 'done', 'loaded')

export { fetchContent }
