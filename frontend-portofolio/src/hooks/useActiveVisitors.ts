import { useState, useEffect } from 'react'
import { subscribeToVisitorCount } from '@/websocket'

export function useActiveVisitors() {
    const [count, setCount] = useState<number>(1)

    useEffect(() => {
        const unsubscribe = subscribeToVisitorCount((newCount) => {
            setCount(newCount)
        })
        return () => unsubscribe()
    }, [])

    return count
}