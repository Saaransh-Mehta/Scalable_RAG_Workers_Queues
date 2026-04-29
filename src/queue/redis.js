import 'dotenv/config'

export const getRedisConnection = () => {
    const host = process.env.REDIS_HOST || '127.0.0.1'
    const port = Number(process.env.REDIS_PORT || 6379)
    const password = process.env.REDIS_PASSWORD || undefined
    const useTls = String(process.env.REDIS_TLS || '').toLowerCase() === 'true'

    return {
        host,
        port,
        password,
        tls: useTls ? {} : undefined,
        maxRetriesPerRequest: null,
    }
}
