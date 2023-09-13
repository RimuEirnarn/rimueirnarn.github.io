// Service Worker Config

const SWEnabled = $("#app").attr('data-sw') === 'true' ? true : false

function _swtellInit(){
    if (!SWEnabled) return
    $.ajax({
        url: "https://serviceworker.dummy", // yes.
        method: "POST",
        headers: {
            "data": getCookie("sw.cache") || 'false'
        },
        success(response) {
            setCookie('sw.cache', response)
        },
        error(jqxhr, statusN, text) {
            console.info("Error telling service worker, refresh may do.")
        }
    })

}

function swCacheControl(){
    if (!SWEnabled) {
        showAlert({
            title: "No service worker",
            body: "The service worker is not registered.",
            type: 'info'
        })
        return
    }
    $.ajax({
        url: "https://serviceworker.dummy", // yes.
        method: "POST",
        headers: {
            "data": (() => {
                let state = getCookie('sw.cache').toString()
                if (state === 'false')
                    return 'true'
                return 'false'
            })()
        },
        success(response) {
            setCookie('sw.cache', response)
            showAlert({
                title: "Done",
                body: `Service worker now ${response === 'true' ? "will cache request" : "fetch from network"}`,
                type: 'info'
            })
        },
        error(jqxhr, statusN, text) {
            showAlert({
                title: 'Failed',
                body: `Unable to interact with service worker ${text}`,
                type: 'error'
            })
        }
    })
}

