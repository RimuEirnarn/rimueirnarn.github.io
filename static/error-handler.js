// Everything is copied and included here to avoid 'errors'

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


window.onerror = function(msg, url, line, col, error) {
    let text = "Uh no, error has occurred!"

    if (['localhost', 'local.rimueirnarn.net'].includes(location.host)) {
        text += `<br>${sanitize(msg)} at ${sanitize(url)}:${line ? line : null}:${col ? col : null}`
    }
    
    $("#alerts").html(`<div class='alert alert-danger alert-dismissible fade show' role='alert'>
            <i class='bi bi-x-circle-fill'></i>
            ${text}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`)

    var suppressErrorAlert = false;
    return suppressErrorAlert;
};
