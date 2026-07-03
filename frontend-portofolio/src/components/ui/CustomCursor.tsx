import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)

    useEffect(() => {
        // Detect touch devices, disable custom cursor if true
        if (window.matchMedia('(pointer: coarse)').matches) {
            return;
        }

        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            // Check if hovered element is clickable
            if (
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('cursor-pointer')
            ) {
                setIsHovering(true)
            } else {
                setIsHovering(false)
            }
        }

        window.addEventListener('mousemove', updateMousePosition)
        window.addEventListener('mouseover', handleMouseOver)

        return () => {
            window.removeEventListener('mousemove', updateMousePosition)
            window.removeEventListener('mouseover', handleMouseOver)
        }
    }, [])

    // Do not render on touch devices
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null;
    }

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-3 h-3 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
                animate={{
                    x: mousePosition.x - 6,
                    y: mousePosition.y - 6,
                    scale: isHovering ? 0 : 1,
                    opacity: isHovering ? 0 : 1
                }}
                transition={{
                    type: 'spring',
                    stiffness: 1000,
                    damping: 40,
                    mass: 0.1
                }}
            />
            <motion.div
                className="fixed top-0 left-0 w-10 h-10 border border-primary/50 rounded-full pointer-events-none z-[9998] mix-blend-difference hidden md:block"
                animate={{
                    x: mousePosition.x - 20,
                    y: mousePosition.y - 20,
                    scale: isHovering ? 1.5 : 1,
                    backgroundColor: isHovering ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                }}
                transition={{
                    type: 'spring',
                    stiffness: 150,
                    damping: 15,
                    mass: 0.5
                }}
            />
        </>
    )
}