import { SWRResponse } from 'swr'

type Mutator = (key: string) => Promise<SWRResponse<any, any>[] | undefined>

let ws: WebSocket | null = null
let reconnectTimeout: NodeJS.Timeout

const connect = (mutate: Mutator) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = import.meta.env.DEV ? 'localhost:8080' : window.location.host
    const wsUrl = `${protocol}//${host}/ws`

    ws = new WebSocket(wsUrl)

    ws.onopen = () => {
        console.log('WebSocket connected')
    }

    ws.onmessage = (event) => {
        try {
            const message = JSON.parse(event.data)
            if (message.event === 'change' && message.key) {
                console.log('Received cache invalidation for:', message.key)
                mutate(message.key)
            }
        } catch (e) {
            console.error('Failed to parse websocket message', e)
        }
    }

    ws.onclose = (event) => {
        if (event.code !== 1000) {
            console.log('WebSocket disconnected, attempting to reconnect...')
            clearTimeout(reconnectTimeout)
            reconnectTimeout = setTimeout(() => connect(mutate), 3000)
        }
    }

    ws.onerror = (err) => {
        console.error('WebSocket error:', err)
        if (ws) {
            ws.close()
        }
    }
}

export const initWebSocket = (mutate: Mutator) => {
    if (!ws) {
        connect(mutate)
    }
}