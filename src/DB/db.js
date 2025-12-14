import {QdrantClient} from '@qdrant/js-client-rest';
import 'dotenv/config'


export const client = new QdrantClient({
    url: process.env.CLUSTER_URL,
    apiKey: process.env.QADRANT_API_KEY,
});

