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

document.addEventListener('jobs.control.updated', (e) => {
    const d = e.detail
    const a = "#premount > .progress"
    const b = "#premount > .progress > .progress-bar"
    const c = "#premount-text"
    try {
        const rate = Math.round(d.stats.rate*100)
        document.querySelector(a).setAttribute("aria-valuenow", rate)
        document.querySelector(b).style.width = `${rate}%`
        document.querySelector(b).innerText = `${rate}%`
        document.querySelector(c).innerText = `[${d.job.status}] ${d.job.name} ${d.job.reason}`
    } catch (e) {
        console.log("I'm pretty much sure it's about null")
    }
})
