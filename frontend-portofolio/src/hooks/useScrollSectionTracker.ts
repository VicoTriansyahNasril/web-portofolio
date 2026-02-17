import { useEffect, useRef, useCallback } from 'react'
import { trackPageVisit } from '@/lib/axios'

const SECTION_PATHS: Record<string, string> = {
    home: '/',
    projects: '/projects',
    about: '/about',
}

export function useScrollSectionTracker() {
    const currentSectionRef = useRef<string>('')
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const intersectionObserverRef = useRef<IntersectionObserver | null>(null)
    const mutationObserverRef = useRef<MutationObserver | null>(null)
    const observedSectionsRef = useRef<Set<string>>(new Set())

    const trackSection = useCallback((sectionId: string) => {
        if (currentSectionRef.current === sectionId) return

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }

        debounceTimerRef.current = setTimeout(() => {
            const path = SECTION_PATHS[sectionId]
            if (!path) return
            currentSectionRef.current = sectionId
            trackPageVisit(path)
        }, 800)
    }, [])

    const tryObserveSection = useCallback((sectionId: string) => {
        const observer = intersectionObserverRef.current
        if (!observer) return

        // Sudah di-observe, skip
        if (observedSectionsRef.current.has(sectionId)) return

        const el = document.getElementById(sectionId)
        if (el) {
            observer.observe(el)
            observedSectionsRef.current.add(sectionId)
        }
    }, [])

    useEffect(() => {
        const sectionIds = Object.keys(SECTION_PATHS)
        const io = new IntersectionObserver(
            (entries) => {
                let maxRatio = 0
                let winner = ''

                for (const entry of entries) {
                    if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                        maxRatio = entry.intersectionRatio
                        winner = entry.target.id
                    }
                }

                if (winner) {
                    trackSection(winner)
                }
            },
            {
                rootMargin: '-35% 0px -35% 0px',
                threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
            }
        )
        intersectionObserverRef.current = io

        sectionIds.forEach(tryObserveSection)
        const mo = new MutationObserver(() => {
            const allObserved = sectionIds.every(id =>
                observedSectionsRef.current.has(id)
            )
            if (allObserved) {
                mo.disconnect()
                return
            }
            sectionIds.forEach(tryObserveSection)
        })

        mo.observe(document.body, {
            childList: true,
            subtree: true,
        })
        mutationObserverRef.current = mo

        return () => {
            io.disconnect()
            mo.disconnect()
            observedSectionsRef.current.clear()
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
        }
    }, [trackSection, tryObserveSection])
}