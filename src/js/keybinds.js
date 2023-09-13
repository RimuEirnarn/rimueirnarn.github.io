
const KEYBIND_JOBNAME = "Keybind.js"
GJobControl.setJob(KEYBIND_JOBNAME)

const editbuffer = "#editor-command > #buffer > input"
const editcmd = "#editor-command"
const buffout = "#editor-command > #buffer > #buffout"

const STATE = {
  eCMD: false
}

function __show(tag) {
    tag.hasClass('disable') ? tag.removeClass('disable') : null
    tag.addClass('enable')
}

function __hide(tag) {
    tag.hasClass('enable') ? tag.removeClass('enable') : null
    tag.addClass('disable')
}

function __triggerEditorCommand() {
  STATE.eCMD = true
  __show($(editcmd))
  document.querySelector("body").style.overflow = 'hidden'
  document.querySelector(editbuffer).focus()
}

function __untriggerEditorCommand() {
  STATE.eCMD = false
  document.querySelector("body").style.overflow = ''
  __hide($(editcmd))
  $(buffout).html("")

  document.querySelector("html").focus()
}

document.addEventListener("keydown", e => {
  if (!(e.key === "Escape" || e.key === ":")) return;
  if (/^(?:input|textarea|select|button)$/i.test(e.target.tagName)) {
        if (e.key === "Escape") return __untriggerEditorCommand();
  };

  e.preventDefault();
  if (e.key === ":" && STATE.eCMD === true) return;
  if (e.key === "Escape" && STATE.eCMD === true) return __untriggerEditorCommand();
  if (e.key === ":" && STATE.eCMD === false) return __triggerEditorCommand();
});

document.addEventListener('DOMContentLoaded', () => {
    $("#editor-command > #buffer > input").on('focusout', () => __untriggerEditorCommand())
})

GJobControl.updateJob(KEYBIND_JOBNAME, 'done', 'loaded')
