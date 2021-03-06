'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    if (jobs.length === 0) {
        return Promise.resolve([]);
    }

    let jobsResult = [];
    let globalIndex = 0;
    let currentJobs = [];
    const jobsState = [...Array(jobs.length).keys()].map(() => false);

    return new Promise(resolve => {
        if (jobs.length <= parallelNum) {
            currentJobs.push(...jobs.map((job, i) => ({ job, i })));
        } else {
            currentJobs.push(...jobs.map((job, i) => ({ job, i })).slice(0, parallelNum));
        }

        function nextJob(ind) {
            if (jobsState.every(i => i) && jobsResult.length === jobs.length) {
                resolve(jobsResult);
            }
            if (ind < jobs.length) {
                const job = jobs[ind];
                doJobWithTimer(job, ind);
            }
        }

        const startWork = tasks => {
            globalIndex = tasks.length;
            tasks.forEach(({ job, i }) => doJobWithTimer(job, i));
        };

        async function doJobWithTimer(job, i) {
            try {
                const result = await Promise.race([job(), startTimer()]);
                saveResultAndGoNext(result, i);
            } catch (e) {
                saveResultAndGoNext(e, i);
            }
        }

        function startTimer() {
            return new Promise((_, reject) => setTimeout(() => reject(new Error('Promise timeout')),
                timeout));
        }

        function saveResultAndGoNext(res, index) {
            jobsResult[index] = res;
            jobsState[index] = true;
            nextJob(globalIndex++);
        }

        startWork(currentJobs);
    });
}

module.exports = {
    runParallel,

    isStar
};
