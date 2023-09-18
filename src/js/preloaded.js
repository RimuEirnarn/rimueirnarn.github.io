// Preload JS

// Presume preloading, cdocument.querySelectorange whenever new scrips alive.
//GJobControl.setJob('abc')

document.addEventListener('jobs.control.completed', () => {
    document.querySelector('body').style.overflow = ''
    $("#loading").fadeOut({
        duration: 500,
        complete(){
            $("#loading").html("")
        }
    })
})

function _jcuUpdate(parent_, child, value) {
    parent_.setAttribute("aria-valuenow", value)
    parent_.style.width = `${value}%`
    child.innerText = `${value}%`
}

document.addEventListener('jobs.control.updated', (e) => {
    const d = e.detail
    const a = "#prog-success"
    const b = "#prog-success > .progress-bar"
    const g = "#prog-error"
    const f = "#prog-error > .progress-bar"
    const c = "#premount-text"
    try {
        const length = d.stats.jobs
        const success = d.stats.success
        const errors = d.stats.errors
        const all_ = success + errors
        let A = document.querySelector(a)
        let B = document.querySelector(b)
        let C = document.querySelector(c)
        let D = document.querySelector(g)
        let E = document.querySelector(f)
        _jcuUpdate(A, B, Math.round((success/length)*100))
        _jcuUpdate(D, E, Math.round((errors/length)*100))
        C.innerText = `[${Math.round((all_/length)*100)}%] [${d.job.status}] ${d.job.name} ${d.job.reason}`
    } catch (e) {
        console.log("I'm pretty much sure it's about null")
    }
})
