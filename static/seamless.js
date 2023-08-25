import { getCookie } from "/static/utils.js"
import { showAlert } from "/static/alerts.js"

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
    let currentHistory = window.history.state || {'url': "/"}
    if ((currentHistory.url == urlPath) && window.history.length >= 2) {
        window.history.replaceState({'html': response, 'pageTitle': title, "url": urlPath}, "", urlPath)
        return
    }
    window.history.pushState({"html": response, "pageTitle": title, "url": urlPath},"", urlPath)
}

window.onpopstate = function(e){
    if(e.state){
        _ProcessData($("#app"), e.state.html)
    }
};

function _makeTransitionConfig(config) {
    return config === undefined ? {
        success(response) {},
        error(response, statusN, text) {
            showAlert({title: `Transition failed`, body: text, type: "error"})
        },
        init: false
    } : {
        success: config.success !== undefined ? config.success : (default_response) => null,
        error: config.error !== undefined ? config.error : (default_response, statusN, text) => null,
        init: config.init !== undefined ? config.init : false
    }
}

function _checkPath(path) {
    return path.includes("..")
}

/**
 * @brief Transition To, fetch -> change
 * @param {String} component
 */
function transitionTo(component, config) {
    let _config = _makeTransitionConfig(config)
    if (_checkPath(component)) {
        console.error("Nope, what are you gonna do?")
        _config.error({}, 500, "Path Traversal Error")
        return
    }
    $.ajax({
        url: `/components/${component}.html`,
        success(response) {
            let title = `${constructURL()}#/${component}`
            console.info(`[seamless.js] Transition to ${title}`)
            processAjaxData(response, title)
            _config.success(response)
        },
        error(response, statusN, text){
            console.error(`${statusN} -> ${text}`)
            _config.error(response, statusN, text)
        }
    })
}

function transitionRoot(config) {
    let _config = _makeTransitionConfig(config)
    let component = getCookie('default.view') || 'main'
    if (_checkPath(component)) {
        console.error("Nope, what are you gonna do?")
        component = "main"
    }

    $.ajax({
        url: `/components/${component}.html`,
        success(response) {
            console.info("[seamless.js] Transitioning to root")
            processAjaxData(response, "/")
            _config.success(response)
        },
        error(response, statusN, text){
            console.error(`${statusN} -> ${text}`)
            _config.error(response, statusN, text)
        }
    })
}

function constructURL() {
    return `${window.location.pathname}`
}

console.info(`${window.location.host}/static/seamless.js Loaded`)

export { CONFIG, transitionTo, transitionRoot }
