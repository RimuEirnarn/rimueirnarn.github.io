// Alerts

import { sanitize } from "/static/utils.js"

const ALERT_CONFIG = {
    target: "#alerts"
}


function _reparse(name) {
    switch (name) {
        case "error":
        case "err":
            return "danger"
        case "primary":
        case "secondary":
        case "success":
        case "info":
        case "danger":
        case "light":
        case "dark":
        case "warning":
            return name
        default:
            return "primary"
    }
}

function _fetchIcon(type) {
    switch (type) {
        case "danger":
            return '<i class="bi bi-x-circle-fill"></i>'
        case "warning":
            return '<i class="bi bi-exclamation-circle-fill"></i>'
        case "success":
            return '<i class="bi bi-check-circle-fill"></i>'
        default:
            return '<i class="bi bi-info-circle-fill"></i>'
    }
}

function showAlert(config) {
    let title = config.title === undefined ? "" : `<strong>${sanitize(config.title)}</strong>`
    let body = config.body === undefined ? "Content" : config.body
    let aType = _reparse(config.type)

    let html = `<div class="alert alert-${aType} alert-dismissible fade show" role="alert">
    ${_fetchIcon(aType)} ${title} - ${sanitize(body)}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
    $(ALERT_CONFIG.target).prepend(html)
    console.info("[alerts.js] Invoked alert")
}

console.info(`${window.location.host}/static/alerts.js Loaded`)

export { showAlert }
