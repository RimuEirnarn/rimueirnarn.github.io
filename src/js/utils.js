// Utility

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


async function _sleep(time) {
    await new Promise(resolve => setTimeout(resolve, time * 1000))
}
/**
 * sleep
 * @param time time as second
 */
function sleep(time, callback) {
    _sleep(time).then(callback !== undefined ? callback : () => null)
}

/**
 * Get the value of a cookie
 * Source: https://gist.github.com/wpsmith/6cf23551dd140fb72ae7
 * @param  {String} name  The name of the cookie
 * @return {String}       The cookie value
 */
function getCookie(name) {
	let value = '; ' + document.cookie;
	let parts = value.split(`; ${name}=`);
	if (parts.length == 2) return decodeURIComponent(parts.pop().split(';').shift());
}

function setCookie(name, value) {
    const settings = {
        SameSite: 'strict',
        "max-age": 3600 * 24 * 365, // a whole year.
        path: "/"

    }
    var value = `${name}=${encodeURIComponent(value)}`
    for (let key in settings) {
        // F**k, init.
        value += `; ${key}=${settings[key]}`
    }
    document.cookie = value;
}

function isDebug() {
    return ["localhost", "local.rimueirnarn.net"].includes(location.host)
}

export { sanitize, getCookie, setCookie, sleep, isDebug }
