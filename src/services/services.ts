import {lastfmWorker} from './lastfm/worker'

const workers = [
    lastfmWorker
]

export const initWorkers = () => {

    for (const worker of workers){
        worker();
    }

}