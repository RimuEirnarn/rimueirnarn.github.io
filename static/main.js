// lmao, pythonic

import { getCookie, setCookie, sleep, isDebug, sanitize } from "/static/utils.js"
import { showAlert } from "/static/alerts.js"
import { transitionRoot, transitionTo } from "/static/seamless.js"

var __version__ = "0.1.3b"

const STATE = {
    isGaveUp: false
}

const SWEnabled = $("#app").attr('data-sw') === 'true' ? true : false

/**
 * show current project version or atleast the new version/rework version.
 */
function show_version() {
    console.log(__version__)
}

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
    if (!SWEnabled) return
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

const varies = {
    main: "Default view",
    terminal: "Terminal-like view",
    card: "Card view"
}

function refresh_modal(){
    var container = document.querySelector(".container-0")
    var x = document.querySelector(".container-0 > .modal")
    if (x) {
        x.classList.add("fade")
        x.style = ""
        sleep(0.3, () => {
            while (container.firstChild) {
                container.removeChild(container.firstChild)
            }
        })
    }
}

function _fetchSelection() {
    let selections = ""
    let currentView = getCookie('default.view')
    for (let component in varies) {
        selections += `<option value="${encodeURIComponent(component)}" ${currentView === component ? 'selected' : ''}>${sanitize(varies[component])}</option>`
    }
    return selections
}

function main_switcher(){
    if ($("#target-cmain-switch") === {}) return
    let data = `
<div class="modal fade" tabindex="-1" id="main-component-switcher">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Change Default View</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="mcs-modal-close"></button>
      </div>
      <div class="modal-body">
        <p>Tired of seeing long stuff? You can pick other views i created.</p>
        <select class="form-select" aria-label="Switch views" id="mcs-select">
        </select>
        <p class='visually-hidden text-danger' id='mcs-modal-error-text'></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="mcs-modal-close">Close</button>
        <button type="button" class="btn btn-primary" id="mcs-modal-submit">Change</button>
      </div>
    </div>
  </div>
</div>
`
    $("#navd-functions").append(`<li><button id="target-cmain-switch" class='dropdown-item' type='button'><i class="bi bi-sliders2"></i> View Switch</button></li>`)
    $("#target-cmain-switch").on('click', () => {
        $(".container-0").html(data)
        $("#mcs-select").html(_fetchSelection())
        if (STATE.isGaveUp) {
            $("#mcs-select").prop('disabled', true)
        }
        let textError = $("#mcs-modal-error-text")
        let transitionConfig = {
            success(response) {
                !textError.hasClass('visually-hidden') ? textError.addClass('visually-hidden') : null
                let _modal = $("#main-component-switcher")
                modal.hide()
                _modal.on('hidden.bs.modal', () => _modal.remove())
                $("#dcomp-output").text(`/ ${getCookie('default.view')}`)
            },
            error(jqxhr, stat, error) {
                textError.hasClass('visually-hidden') ? textError.removeClass('visually-hidden') : null
                textError.text(error)
                setCookie('default.view', currentView)
            }
        }

        var modal = new bootstrap.Modal(document.querySelector("#main-component-switcher"), {
            focus: true
        })
        modal.show()
        $("#mcs-modal-close").on('click', refresh_modal)
        $("#mcs-modal-submit").on('click', () => {
            if (STATE.isGaveUp) return
            let component = $("#mcs-select").val()
            if (!component) {
                return
            }
            setCookie('default.view', component)
            transitionRoot(transitionConfig)
        })
    })
}

function debugNav() {
    if ($("#target-debug") === {}) return
    if (isDebug()) {
        let data = `
<div class="modal fade" tabindex="-1" id="debug-modal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Debug Component Transitioner</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="debug-modal-close"></button>
      </div>
      <div class="modal-body">
        <p>You can put and check component name</p>
        <input type='text' id="debug-modal-text" class='form-control' placeholder='main'>
        <p class='visually-hidden text-danger' id='debug-modal-error-text'></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="debug-modal-close">Close</button>
        <button type="button" class="btn btn-primary" id="debug-modal-submit">Transition</button>
      </div>
    </div>
  </div>
</div>
`        
        $("#navd-functions").append(`<li><button id="target-debug" class='dropdown-item' type='button'><i class="bi bi-person-fill-exclamation"></i> Debug</button></li>`)
        $("#target-debug").on('click', () => {
            $('.container-0').html(data)
            let textError = $("#debug-modal-error-text")
            let transitionConfig = {
                success(response) {
                    !textError.hasClass('visually-hidden') ? textError.addClass('visually-hidden') : null
                    let _modal = $("#debug-modal")
                    modal.hide()
                    _modal.on('hidden.bs.modal', () => _modal.remove())
                },
                error(jqxhr, stat, error) {
                    textError.hasClass('visually-hidden') ? textError.removeClass('visually-hidden') : null
                    textError.text(error)
                }
            }

            var modal = new bootstrap.Modal(document.querySelector("#debug-modal"), {
                focus: true
            })
            modal.show()
            $("#debug-modal-close").on('click', refresh_modal)
            $("#debug-modal-submit").on('click', () => {
                let component = $("#debug-modal-text").val()
                if (!component) {
                    transitionRoot(transitionConfig)
                    return
                }
                transitionTo(component, transitionConfig)
            })
        })
    }
}

function __redir_anime() {
    // do i look like care about this?
    var target = `target-${Math.round(Math.random() * 100)}`
    var container = document.querySelector(".container-0")
    var data = `<div class="modal fade" tabindex="-1" id="modal-${target}">
  <div class="modal-dialog">
    <div class="modal-content bg-dark">
      <div class="modal-header">
        <h5 class="modal-title">Anime Redirection</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="${target}-no1"></button>
      </div>
      <div class="modal-body">
        <p>Proceed?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="${target}-no">No</button>
        <button type="button" class="btn btn-primary" id="${target}">Yes</button>
      </div>
    </div>
  </div>
</div>`
    var fragment = document.createDocumentFragment()
    var inside_container = document.createElement('div')
    inside_container.innerHTML = data
    fragment.appendChild(inside_container)
    container.appendChild(fragment)
    var target_element = document.querySelector(`#${target}`)
    target_element.onclick = () => {
        document.location = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
    document.querySelector(`#${target}-no`).onclick = refresh_modal
    document.querySelector(`#${target}-no1`).onclick = refresh_modal
    sleep(0.1, () => {
        var modal = new bootstrap.Modal(document.querySelector(`#modal-${target}`), {
            focus: true
        })
        modal.show()
    })
}

// To Be Added

document.addEventListener("DOMContentLoaded", function(event) {
    _swtellInit()
    $.ajax({
        url: "/status",
        success(response) {
            console.info(`status -> ${response}`)
            if (response === "13") {
                STATE.isGaveUp = true
                let backup = getCookie('default.view')
                if (backup !== 'gaveup') {
                    setCookie('default.view', 'gaveup')
                    setCookie('backup.default.view', backup)
                }
            } else {
                let backup = getCookie("backup.default.view") || getCookie('default.view')
                setCookie('default.view', backup)
            }
            $("#version").append(` v${sanitize(__version__)}`)
            $("#dcomp-output").text(`/ ${getCookie('default.view')}`)
            $("button#nav-root-goto").on("click", () => {
                transitionRoot()
            })
            $("#swc-control").on("click", swCacheControl)
            $("button#anime").on("click", __redir_anime)
            main_switcher()
            debugNav()
            transitionRoot()
            let initCookie = getCookie("init")
            if (initCookie === undefined) {
                showAlert({
                    title: "Hello!",
                    body: "This site is in beta version! Some is not in a good form and some haven't been added yet. More and more content will be there in the future. I hope. Also, this site uses cookies. No information is shared anyway.",
                    type: "info"
                })
                setCookie("default.view", "main")
                setCookie("sw.cache.external", "no")
                setCookie("init", "yes")
            }
        },
        error(jqxhr, status_, text) {
            showAlert({
                title: "Uh no!",
                body: "Error has occurred, no status of its owner has found.",
                type: 'error'
            })
        }
    })
    console.info(`Loaded ${window.location.host}/main.js [${__version__}] [debug? ${isDebug()}]`)
});
