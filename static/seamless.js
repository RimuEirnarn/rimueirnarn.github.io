/**
 * @summary Application Config
 */
const CONFIG = {
    app: "#app"
}

function _ProcessData(targetDOM, content) {
    targetDOM.html(content)
    let virtualTitle = $("#app > title")
    let title = virtualTitle.text() || document.title
    document.title = title
    virtualTitle.remove()
    return title
}

/**
 * Process Ajax Data
 * @param {Object} response 
 * @param {String} urlPath 
 */
function processAjaxData(response, urlPath){
    let target = $(CONFIG.app)
    let content = target.get(0)
    if ((content.tagName !== "DIV") && (content.tagName !== "MAIN")) throw new Error("Content wrapper is not a div or main")
    
    let title = _ProcessData(target, response)
    window.history.pushState({"html": response, "pageTitle": title},"", urlPath)
}

window.onpopstate = function(e){
    if(e.state){
        _ProcessData($("#app"), e.state.html)
    }
};

/**
 * @brief Transition To, fetch -> change
 * @param {String} component
 */
function transitionTo(component) {
    $.ajax({
        url: `/components/${component}.html`,
        success(response) {
            processAjaxData(response, `${constructURL()}#/${component}`)
        },
        error(response, statusN, text){
            console.error(`${statusN} -> ${text}`)
        }
    })
}

function transitionRoot() {
     $.ajax({
        url: "/components/main.html",
        success(response) {
            processAjaxData(response, "/")
        },
        error(response, statusN, text){
            console.error(`${statusN} -> ${text}`)
        }
    })
}

function initRoot() {
    $.ajax({
        url: "/components/main.html",
        success(response) {
            _ProcessData($("#app"), response)
        },
        error(response, statusN, text){
            console.error(`${statusN} -> ${text}`)
        }
    })
}

function constructURL() {
    return `${window.location.pathname}`
}

console.log(`${window.location.host}/static/seamless.js Loaded`)

export { CONFIG, transitionTo, transitionRoot }
