// Everything is copied and included here to avoid 'errors'
//
function fetchTimeNow() {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }
    return new Intl.DateTimeFormat(undefined, options).format(new Date)
}

const __ErrorEventLog = () => {
    const _logs = []
    return {
        push(time, data) {
            _logs.push({time: time, data: data})
        },
        view() {
            return _logs
        }
    }
}
const _ErrorEventLog = __ErrorEventLog()


function sanitize(string) {
  const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return string.replace(reg, (match)=>(map[match]));
}


window.onerror = function(msg, url, line, col, _) {
    const name = $("#name")
    let text = ""
    let log = ""

    if (['localhost', 'local.rimueirnarn.net'].includes(location.host)) {
        text += `${sanitize(msg)} at ${sanitize(url)}:${line ? line : null}:${col ? col : null}`
    } else {
        text += "Contact <a href='https://github.com/RimuEirnarn'>RimuEirnarn</a> or add new issue <a href='https://github.com/RimuEirnarn/rimueirnarn.github.io/issues/new/choose'>here</a>. For technical logs, click this site's setting then click view logs."
    }
    log = `${sanitize(url)}:${line ? line : null}:${col ? col : null}<br>&nbsp;&nbsp;${sanitize(msg)}`

    $("#alerts").prepend(`<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" id="toast-error"><div class="toast-header"><div class='text-danger me-1'><i class="bi bi-x-circle-fill"></i></div><strong class="me-auto">Uh no, error has occured!</strong><button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button></div><div class="toast-body">${text}</div></div>`)

    if (name.hasClass('color-text-cyan')) $("#name").removeClass('color-text-cyan');
    if (!name.hasClass('text-danger')) $("#name").addClass('text-danger')
    const toastLiveExample = document.getElementById("toast-error")
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample, {delay: 2000})
    toastBootstrap.show()
    _ErrorEventLog.push(fetchTimeNow(), log)

    var suppressErrorAlert = false;
    return suppressErrorAlert;
};
