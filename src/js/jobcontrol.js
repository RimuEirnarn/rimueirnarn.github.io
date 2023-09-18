// Job control to "ensure" scrips are running. This is the second script
// That MUST always works.

// Job Worker.
const _JobControl = () => {
    const jobs = {}
    const runningJobs = []
    let success = 0
    let errors = 0
    let completed = false
    let hasFinished = false
    // Example:
    // "main.css": {
    //   status: "starting",
    //   reason: null
    // }
    // Despite that, status can be filled as "starting", "done", and "error"
    // Reason should be filled when status is set to stopped.
    return {
        /**
         * Add a job to the entry.
         */
        setJob(name) {
            if (completed === true) throw new Error("Cannot set new job, job control is closed.")
            if (name in jobs) throw new Error("cannot set another existing job.")
            jobs[name] = {
                status: "starting",
                reason: null
            }
            runningJobs.push(name)
            //console.info(`[${name}] Starting...`)
        },
        /**
         * Fetch a job
         */
        getJob(name) {
            return jobs[name]
        },
        /**
         * Update a job status with reason.
         */
        updateJob(name, status, reason) {
            if (!(name in jobs)) throw new Error(`No such job of ${name}`)
            const job = jobs[name]
            const prevStat = job.status
            if (!['done', 'error'].includes(status)) throw new Error(`undefined status: ${status}`)
            job.status = status
            job.reason = reason
            if (status === 'done' && prevStat === 'starting') {
                success++
                console.info(`[${name}] ${reason}`)
            };
            if (status === 'error' && prevStat === 'starting') {
                errors++
                console.error(`[${name}] ${reason}`)
            };
            if (runningJobs.includes(name)) {
                const index = runningJobs.indexOf(name);
                if (index > -1) { // only splice array when item is found
                  runningJobs.splice(index, 1); // 2nd parameter means remove one item only
                }
            }
            const jobsDetails = {
                detail: {
                        stats: this.getStats(),
                        jobs: this.getJobs()
                }
            }
            if (this.getCompleted()) {
                console.info("[Job Control] Done")
                hasFinished = true
                !hasFinished ? document.dispatchEvent(new CustomEvent("jobs.control.completed", jobsDetails)) : null
            }
            if (!completed){
                jobsDetails.detail.job = job
                jobsDetails.detail.job.name = name
                document.dispatchEvent(new CustomEvent("jobs.control.updated", jobsDetails))
            }

        },
        /**
         *  Get all jobs
         */
        getJobs() {
            let _jobs = []
            for (const job in jobs) {
                if (jobs.hasOwnProperty(job)) {
                    const element = jobs[job];
                    _jobs.push([job, element.status, element.reason])
                }
            }
            return _jobs
        },
        /**
         * get overall statistics of running jobs.
         */
        getStats() {
            const jobLength = this.getJobs().length
            if (jobLength === 0) return {
                jobs: 0,
                success: 0,
                errors: 0,
                runs: 0,
                running: 0,
                rate: null,
                completed: completed
            }
            let runs = runningJobs.length
            return {
                jobs: jobLength,
                success: success,
                errors: errors,
                running: runs,
                rate: success/jobLength,
                completed: completed
            }
        },
        /**
        * Marks this job control as finished
        */
        setComplete() {
            if (hasFinished) return
            const stats = this.getStats()
            // Let the running as is, this only marks there's no more jobs
            if (stats.jobs >= 1) {
                completed = true
            }
            if (completed && runningJobs.length === 0) {
                if (!hasFinished) {
                    document.dispatchEvent(new CustomEvent("jobs.control.completed", {
                        detail: {
                            stats: this.getStats(),
                            jobs: this.getJobs()
                        }
                    }))
                    hasFinished = true
                }
                return true
            }
        },
        getCompleted() {
            if ((completed === true) && runningJobs.length === 0) {
                if (!hasFinished) document.dispatchEvent(new CustomEvent("jobs.control.completed", {
                    detail: {
                        stats: this.getStats(),
                        jobs: this.getJobs()
                    }
                }))
                return true
            }
            return false
        }
    }
}

const GJobControl = _JobControl();
window.GJobControl = GJobControl;
GJobControl.setJob('RimuEirnarn');
