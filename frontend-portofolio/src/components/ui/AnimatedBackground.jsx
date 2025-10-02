//src/components/ui/AnimatedBackground.jsx
import { useEffect, useRef } from 'react'
import { useTheme } from '@mui/material/styles'

export default function AnimatedBackground() {
    const theme = useTheme()
    const canvasRef = useRef(null)
    const rafRef = useRef(0)

    useEffect(() => {
        const c = canvasRef.current
        const ctx = c.getContext('2d')
        let w = (c.width = window.innerWidth)
        let h = (c.height = window.innerHeight)

        const onResize = () => {
            w = c.width = window.innerWidth
            h = c.height = window.innerHeight
        }
        window.addEventListener('resize', onResize)

        const isDark = theme.palette.mode === 'dark'
        let t = 0

        const draw = () => {
            ctx.clearRect(0, 0, w, h)

            if (isDark) {
                const gradient = ctx.createLinearGradient(0, 0, 0, h);
                gradient.addColorStop(0, '#0B1020');
                gradient.addColorStop(1, '#11162A');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, w, h);

                const bands = [
                    { hue: 280, alpha: 0.15, speed: 0.0008, amp: 100, baseY: h * 0.3 },
                    { hue: 220, alpha: 0.2, speed: 0.001, amp: 120, baseY: h * 0.5 },
                    { hue: 190, alpha: 0.1, speed: 0.0006, amp: 80, baseY: h * 0.7 },
                ];

                for (const band of bands) {
                    ctx.fillStyle = `hsla(${band.hue}, 70%, 60%, ${band.alpha})`
                    ctx.beginPath()
                    ctx.moveTo(0, h)
                    for (let x = 0; x <= w; x += 20) {
                        const y = band.baseY + Math.sin((x + t * 50 * band.speed) * 0.01) * band.amp + Math.cos((x * 0.005) - t * band.speed * 2) * band.amp * 0.5;
                        ctx.lineTo(x, y)
                    }
                    ctx.lineTo(w, h)
                    ctx.closePath()
                    ctx.fill()
                }

            } else {
                const gradient = ctx.createLinearGradient(0, 0, w, h)
                gradient.addColorStop(0, '#F0F4F8');
                gradient.addColorStop(1, '#DDE3EA');
                ctx.fillStyle = gradient
                ctx.fillRect(0, 0, w, h)

                const bands = [
                    { hue: 260, alpha: 0.2, speed: 0.001, amp: 40, baseY: h * 0.3 },
                    { hue: 320, alpha: 0.15, speed: 0.0008, amp: 50, baseY: h * 0.5 },
                    { hue: 210, alpha: 0.2, speed: 0.0012, amp: 35, baseY: h * 0.7 },
                ];

                for (const band of bands) {
                    ctx.fillStyle = `hsla(${band.hue}, 80%, 80%, ${band.alpha})`
                    ctx.beginPath()
                    ctx.moveTo(-100, h + 100)
                    for (let x = -100; x <= w + 100; x += 20) {
                        const y = band.baseY + Math.sin((x + t * 50 * band.speed) * 0.01) * band.amp + Math.cos((x * 0.002) - t * band.speed) * band.amp * 0.3;
                        ctx.lineTo(x, y)
                    }
                    ctx.lineTo(w + 100, h + 100)
                    ctx.closePath()
                    ctx.fill()
                }
            }

            t += 1
            rafRef.current = requestAnimationFrame(draw)
        }

        draw()
        return () => {
            cancelAnimationFrame(rafRef.current)
            window.removeEventListener('resize', onResize)
        }
    }, [theme.palette.mode])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: -1,
                pointerEvents: 'none',
            }}
        />
    )
}