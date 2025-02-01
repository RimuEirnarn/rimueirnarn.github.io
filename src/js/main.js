// lmao, pythonic

import { getCookie, setCookie, sleep, isDebug, sanitize, isSmallScreen } from "/static/js/utils.js"
import { showAlert, showError } from "/static/js/html_utils/alerts.js"
import { makeModal } from "/static/js/html_utils/modals.js"
import { transitionRoot, transitionTo } from "/static/js/seamless.js"
import "/static/js/editor-command.js"

const __package__ = "PRE-EnigmaRimu.js"
const __version__ = "0.2.2"
const JOBNAME = "main.js"
const STATE = {
    isGaveUp: false,
    wasLoaded: false,
    settingsLoaded: false,
    settingsOpened: false
}

GJobControl.setJob(JOBNAME)

const SWEnabled = $("#app").attr('data-sw') === 'true' ? true : false

function swCacheControl() {}

const varies = {
    main: "Default view",
    terminal: "Terminal-like view",
    card: "Card view",
    chat: "Chat view"
}

// Limit what mobile can do
const desktop_views = [
    'card',
    'chat'
]

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

function debugNav() {
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
        $("#debug").on('click', () => {
            if (document.querySelector("#main-settings")) {
                new bootstrap.Modal($("#main-settings")).dispose()
                $("div.modal-backdrop").remove()
            }

            $('.container-0').html(data)
            let textError = $("#debug-modal-error-text")
            let transitionConfig = {
                success() {
                    !textError.hasClass('visually-hidden') ? textError.addClass('visually-hidden') : null
                    let _modal = $("#debug-modal")
                    modal.hide()
                    _modal.on('hidden.bs.modal', () => _modal.remove())
                },
                error(_, __, error) {
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

function _onViewSelect(textError) {
    const hideTE = () => !textError.hasClass('visually-hidden') ? textError.addClass('visually-hidden') : null
    const showTE = (text) => {
        textError.hasClass('visually-hidden') ? textError.removeClass('visually-hidden') : null
        textError.text(text)
    }
    let transitionConfig = {
        success() {
            hideTE()
            $("#dcomp-output").text(`/ ${getCookie('default.view')}`)
        },
        error(_, __, error) {
            showTE(error)
            setCookie('default.view', currentView)
        }
    }
    if (STATE.isGaveUp) {
        showTE("Unable to change, the site owner has gave up. To disable this behavior, you can't.")
        return
    }
    let component = $("#viewSelect").val()
    if (!component) {
        return
    }
    // Card is unstable on mobile
    if (desktop_views.includes(component) && !isDebug() && isSmallScreen()) {
        showTE("Mobile device cannot access card.")
        showError("Mobile device cannot access card.")
        return
    }
    setCookie('default.view', component)
    setCookie('backup.default.view', component)
    transitionRoot(transitionConfig)

}

function settings() {
    if (STATE.settingsLoaded) return null;
    const debugOption = isDebug() ? `<button id="debug" type='button' class='btn bg-danger'>Debug</button>` : ""
    $("#ms-button").on('click', () => {
        makeModal("main-settings", {
            title: "Site settings",
            body: `<form class="row g-3">
  <div>
    <label for="viewSelect" class="form-label">Change if you don't like default view</label>
    <select id="viewSelect" class="form-select">
    ${_fetchSelection()}
    </select>
    <p class='visually-hidden text-danger' id='selectionFailure'></p>
    <hr>
    <div class='mb-3'>
        ${debugOption}
        <button id="anime" type='button' class='btn bg-info'>Anime</button>
        <button id='view-elogs' type='button' class='btn bg-danger'>View Logs</button>
    </div>
  </div>
  <div class="col-12">
    <div class="form-check">
      <input class="form-check-input" type="checkbox" id="swc-cache" disabled>
      <label class="form-check-label" for="swc-cache">
        Service Worker Cache Control
      </label>
    </div>
  </div>
</form>`,
            submitText: "Save",
            onSubmit() {
                _onViewSelect($("#selectionFailure"))
            }
        })
        var modal = new bootstrap.Modal(document.querySelector("#main-settings"), {
                focus: true
        })
        modal.show()
        $("button#anime").on("click", __redir_anime)
        $("button#view-elogs").on('click', () => {
            transitionTo("error")
            modal.hide()
            document.querySelector("#main-settings").addEventListener('hidden.bs.modal', (e) => modal.dispose())
        })
        debugNav()
    })
}

function __redir_anime() {
    if (document.querySelector("#main-settings")) {
        new bootstrap.Modal($("#main-settings")).dispose()
        $("div.modal-backdrop").remove()
    }

    // do i look like care about this?
    var target = `target-${Math.round(Math.random() * 100)}`
    makeModal(`modal-${target}`, {
        title: "Anime Redirection",
        body: `<p>Proceed?</p>`,
        submitText: "Proceed",
        onSubmit() {
            document.location = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        }
    })
    var modal = new bootstrap.Modal(document.querySelector(`#modal-${target}`), {focus: true})
    modal.show()
}
function Status13(response){
    console.info(`status -> ${response}`)
    if (response === "13") {
        STATE.isGaveUp = true
        let backup = getCookie('default.view') || 'main'
        if (backup !== 'gaveup') {
            setCookie('default.view', 'gaveup')
            setCookie('backup.default.view', backup)
        }
    } else {
        let backup = getCookie("backup.default.view") || getCookie('default.view')
        setCookie('default.view', backup)
    }
}

function mainLoaded() {
    if (STATE.wasLoaded) return
    $("#version").append(` v${sanitize(__version__)}`)
    $("#dcomp-output").text(`/ ${getCookie('default.view')}`)
    $("button#nav-root-goto").on("click", () => {
        transitionRoot()
    })
    if (SWEnabled) {
        $("#swc-control").on("click", swCacheControl)
    } else {
        $("#swc-control").remove()
    }

    settings()
    //main_switcher()
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

    var component = getCookie('default.view')
    if (desktop_views.includes(component) && isSmallScreen()) {
        showAlert({title: "Incompatible view", body: `Selected view (${component}) is not supported on mobile yet. Particularly because it can cause the view to be fuzzy.`, type: 'info', delay: 5000})
    } else {
        $("#app").html($(`#pr-${getCookie('default.view')}`).detach())
    }
    GJobControl.updateJob(JOBNAME, 'done', `Loaded, debug: ${isDebug()}, version: ${__version__}`)
    STATE.wasLoaded = true
}

// To Be Added

document.addEventListener("DOMContentLoaded", function() {
    $.ajax({
        url: "/status",
        success(response) {
            Status13(response)
            mainLoaded()
        },
        error() {
            showAlert({
                title: "Uh no!",
                body: "Error has occurred, no status of its owner has found.",
                type: 'error'
            })
        }
    })
});

document.addEventListener('jobs.control.completed', (e) => {
    const detail = e.detail
    console.info(`[${JOBNAME}] ${detail.stats.success} / ${detail.stats.jobs} (${detail.stats.rate*100}%) [${detail.stats.errors} errors]`)
})

function _resize_event() {
    if (isSmallScreen() && getCookie("default.view") === "card") {
       setCookie("default.view", "main")
       transitionRoot()
    }
}

_resize_event()

document.addEventListener('resize', _resize_event)

window.onload = () => {
    GJobControl.updateJob('RimuEirnarn', 'done', 'Everything has been loaded')
    GJobControl.setComplete()
    if (STATE.wasLoaded === false) mainLoaded()
    console.log(`${location.hostname}: running ${__package__} v${__version__}`)
}
