import { Worker } from 'bullmq'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { client } from '../DB/db.js'
import { parsePDF } from '../services/pdfParser.js'
import { getEmbeddings } from '../services/embeddings.js'
import { publishEvent } from '../queue/eventBus.js'
import { getRedisConnection } from '../queue/redis.js'

const connection = getRedisConnection()

const ensureCollection = async (collectionName, vectorSize) => {
    try {
        await client.getCollection(collectionName)
    } catch (error) {
        await client.createCollection(collectionName, {
            vectors: {
                size: vectorSize,
                distance: 'Cosine',
            },
        })
    }
}

export const startIngestionWorker = () => {
    const worker = new Worker(
        'ingestion',
        async (job) => {
            const { filePath, collectionName } = job.data

            publishEvent('document.ingested', { jobId: job.id, filePath, collectionName })
            job.updateProgress(5)

            const docs = await parsePDF(filePath)
            publishEvent('document.parsed', { jobId: job.id, pages: docs.length })
            job.updateProgress(20)

            const splitter = new RecursiveCharacterTextSplitter({
                chunkSize: 300,
                chunkOverlap: 40,
            })
            const texts = await splitter.splitDocuments(docs)

            const embeddings = []
            for (let i = 0; i < texts.length; i += 1) {
                const embedding = await getEmbeddings(texts[i].pageContent)
                embeddings.push(embedding)
                job.updateProgress(20 + Math.floor((i + 1) / texts.length * 50))
            }

            if (embeddings.length === 0) {
                throw new Error('No embeddings generated for document')
            }

            await ensureCollection(collectionName, embeddings[0].length)

            for (let i = 0; i < texts.length; i += 1) {
                await client.upsert(collectionName, {
                    points: [
                        {
                            id: i,
                            vector: embeddings[i],
                            payload: {
                                text: texts[i].pageContent,
                            },
                        },
                    ],
                })
            }

            publishEvent('document.indexed', { jobId: job.id, chunks: texts.length })
            job.updateProgress(100)

            return { chunks: texts.length }
        },
        {
            connection,
            concurrency: Number(process.env.INGESTION_CONCURRENCY || 2),
        }
    )

    return worker
}
