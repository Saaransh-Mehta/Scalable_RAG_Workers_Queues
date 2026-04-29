import crypto from 'node:crypto'
import { ingestionQueue } from '../queue/queues.js'

const buildJobId = ({ filePath, collectionName }) => {
    const raw = `${collectionName}:${filePath}`
    return crypto.createHash('sha256').update(raw).digest('hex')
}

export const enqueueIngestion = async ({ filePath, collectionName, metadata }) => {
    const jobId = buildJobId({ filePath, collectionName })

    return ingestionQueue.add(
        'ingest-document',
        { filePath, collectionName, metadata },
        { jobId }
    )
}
