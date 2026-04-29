import { Queue, QueueEvents } from 'bullmq'
import { getRedisConnection } from './redis.js'

const connection = getRedisConnection()

export const ingestionQueue = new Queue('ingestion', {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: 1000,
    },
})

export const ingestionQueueEvents = new QueueEvents('ingestion', { connection })
