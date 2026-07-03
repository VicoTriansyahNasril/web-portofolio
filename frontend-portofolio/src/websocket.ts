import { SWRResponse } from 'swr'

type Mutator = (key: string) => Promise<SWRResponse<any, any>[] | undefined>
type CountListener = (count: number) => void

let ws: WebSocket | null = null
let reconnectTimeout: NodeJS.Timeout
let isConnecting = false
const countListeners: Set<CountListener> = new Set()

const notifyCountListeners = (count: number) => {
    countListeners.forEach(listener => listener(count))
}

const connect = (mutate: Mutator) => {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        return
    }

    if (isConnecting) return
    isConnecting = true

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = import.meta.env.DEV
        ? 'localhost:8080'
        : 'web-portofolio-p2rn.onrender.com'

    const wsUrl = `${protocol}//${host}/ws`

    console.log('[WS] Connecting to:', wsUrl)

    ws = new WebSocket(wsUrl)

    ws.onopen = () => {
        console.log('[WS] Connected')
        isConnecting = false
    }

    ws.onmessage = (event) => {
        try {
            const message = JSON.parse(event.data)

            if (message.event === 'change' && message.key) {
                console.log('♻️ [WS] Live Update Triggered for:', message.key)
                mutate(message.key).catch(err => console.error("Mutate error:", err))
            }
            if (message.event === 'visitor_count' && message.payload) {
                const count = parseInt(message.payload, 10)
                if (!isNaN(count)) {
                    notifyCountListeners(count)
                }
            }
        } catch (e) {
            console.error('[WS] Parse error', e)
        }
    }

    ws.onclose = (event) => {
        isConnecting = false
        if (event.code !== 1000) {
            console.log(`[WS] Disconnected (code: ${event.code}), reconnecting in 3s...`)
            clearTimeout(reconnectTimeout)
            reconnectTimeout = setTimeout(() => connect(mutate), 3000)
        }
    }

    ws.onerror = (err) => {
        console.error('[WS] Error:', err)
        isConnecting = false
        if (ws) ws.close()
    }
}

export const initWebSocket = (mutate: Mutator) => {
    connect(mutate)
    window.addEventListener('beforeunload', () => {
        if (ws) ws.close(1000)
    })
}

export const subscribeToVisitorCount = (callback: CountListener) => {
    countListeners.add(callback)
    return () => {
        countListeners.delete(callback)
    }
}