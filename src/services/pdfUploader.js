import { enqueueIngestion } from './ingestionQueueService.js'

export const uploadPdf = async ({ filePath, collectionName = 'Scalable', metadata }) => {
    return enqueueIngestion({ filePath, collectionName, metadata })
}

