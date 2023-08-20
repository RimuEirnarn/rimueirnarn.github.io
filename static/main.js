// lmao, pythonic

import { getCookie, setCookie, sleep } from "/static/utils.js"
import { showAlert } from "/static/alerts.js"
import { transitionRoot, transitionTo } from "/static/seamless.js"

var __version__ = "0.1.0"

/**
 * show current project version or atleast the new version/rework version.
 */
function show_version() {
    console.log(__version__)
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

function __redir_anime() {
    // do i look like care about this?
    var target = `target-${Math.round(Math.random() * 100)}`
    var container = document.querySelector(".container-0")
    var data = `<div class="modal fade" tabindex="-1" id="modal-${target}">
  <div class="modal-dialog">
    <div class="modal-content bg-dark">
      <div class="modal-header">
        <h5 class="modal-title">Anime Redirection</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="refresh_modal()"></button>
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
    sleep(0.1, () => {
        var modal = new bootstrap.Modal(document.querySelector(`#modal-${target}`), {
            focus: true
        })
        modal.show()
    })
}

// To Be Added

document.addEventListener("DOMContentLoaded", function(event) { 
    console.info(`Loaded ${window.location.host}/main.js [${__version__}]`)
    $("button#anime").on("click", __redir_anime)
    transitionRoot()
    let initCookie = getCookie("init")
    if (initCookie === undefined) {
        showAlert({
            body: "This site is in beta version! Some is not in a good form and some haven't been added yet. More and more content will be there in the future. I hope. Also, this site uses cookies. No information is shared anyway.",
            type: "info"
        })
        setCookie("init", "yes")
    }
});
