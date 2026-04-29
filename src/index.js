import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { dataRetrieval } from './services/DataRetrievalService.js'
import { enqueueIngestion } from './services/ingestionQueueService.js'
import { ingestionQueue } from './queue/queues.js'
import { startWorkers } from './workers/workerRunner.js'
import { onEvent } from './queue/eventBus.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

if (String(process.env.START_WORKERS || '').toLowerCase() === 'true') {
    startWorkers()
}

if (String(process.env.LOG_EVENTS || '').toLowerCase() === 'true') {
    onEvent('document.ingested', (payload) => console.log('[event] ingested', payload))
    onEvent('document.parsed', (payload) => console.log('[event] parsed', payload))
    onEvent('document.indexed', (payload) => console.log('[event] indexed', payload))
}

app.get('/', (req, res) => {
    res.send('API is running')
})

app.post('/ingest', async (req, res) => {
    const { filePath, collectionName = 'Scalable', metadata } = req.body || {}

    if (!filePath) {
        return res.status(400).json({ error: 'filePath is required' })
    }

    const job = await enqueueIngestion({ filePath, collectionName, metadata })
    return res.status(202).json({ jobId: job.id })
})

app.get('/jobs/:id', async (req, res) => {
    const job = await ingestionQueue.getJob(req.params.id)
    if (!job) {
        return res.status(404).json({ error: 'Job not found' })
    }

    const state = await job.getState()
    const progress = job.progress

    return res.json({ id: job.id, state, progress })
})

const port = Number(process.env.PORT || 3000)
app.listen(port, () => {
    console.log(`API listening on ${port}`)
})

if (String(process.env.RUN_DEMO_QUERY || '').toLowerCase() === 'true') {
    await dataRetrieval('who is Saaransh')
}