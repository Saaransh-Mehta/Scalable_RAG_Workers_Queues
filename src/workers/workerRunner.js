import { startIngestionWorker } from './ingestionWorker.js'

export const startWorkers = () => {
    const ingestionWorker = startIngestionWorker()

    ingestionWorker.on('completed', (job, result) => {
        console.log('[ingestion] completed', job.id, result)
    })

    ingestionWorker.on('failed', (job, error) => {
        console.error('[ingestion] failed', job?.id, error)
    })

    return { ingestionWorker }
}
