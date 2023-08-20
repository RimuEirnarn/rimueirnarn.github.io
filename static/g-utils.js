/**
 * show current project version or atleast the new version/rework version.
 */
function show_version() {
    console.log(__version__)
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
