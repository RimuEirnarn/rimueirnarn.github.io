
const KEYBIND_JOBNAME = "Keybind.js"
GJobControl.setJob(KEYBIND_JOBNAME)

const STATE = {
  eCMD: false
}

function triggerEditorCommand() {
  STATE.eCMD = true
  $("#editor-command[type=text]").focus()
}

function untriggerEditorCommand() {
  STATE.eCMD = false
  $("html").focus()
}

document.addEventListener("keyup", e => {
  if (e.ctrlKey || e.metaKey) return;
  if (/^(?:input|textarea|select|button)$/i.test(e.target.tagName)) return;

  e.preventDefault();
  if (e.key === ":" && STATE.eCMD === true) return;
  if (e.key === "Escape" && STATE.eCMD === true) return untriggerEditorCommand();
  if (e.key === ":" && STATE.eCMD === false) return triggerEditorCommand();
});

GJobControl.updateJob(KEYBIND_JOBNAME, 'done', 'loaded')
