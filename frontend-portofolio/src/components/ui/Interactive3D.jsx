// src/components/ui/Interactive3D.jsx
import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Environment, Stars, OrbitControls } from '@react-three/drei'
import { Box, useTheme } from '@mui/material'

function Model(props) {
    const { scene } = useGLTF('/models/vico_setup_it.glb')
    return <primitive object={scene} {...props} />
}

function Scene() {
    const theme = useTheme()

    return (
        <>
            <Stars radius={80} depth={50} count={5000} factor={5} saturation={0} fade speed={1.5} />
            <Environment preset="city" />

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 15]} intensity={1.8} color={theme.palette.primary.main} />
            <pointLight position={[-15, -8, 5]} intensity={1.2} color={theme.palette.secondary.main} />
            <directionalLight position={[0, -10, 0]} intensity={0.5} />

            <Suspense fallback={null}>
                <group rotation-y={-1.5}>
                    <Model scale={1.5} position={[0, -1, 0]} />
                </group>
            </Suspense>

            <OrbitControls
                autoRotate
                autoRotateSpeed={0.5}
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 1.8}
            />
        </>
    )
}

function LightParticlesCanvas() {
    const theme = useTheme()
    const ref = useRef(null)
    const rafRef = useRef(0)

    useEffect(() => {
        if (theme.palette.mode !== 'light') return

        const c = ref.current
        const ctx = c.getContext('2d', { alpha: true })
        const dpr = Math.max(1, window.devicePixelRatio || 1)

        const parent = c.parentElement
        const getSize = () => {
            const r = parent.getBoundingClientRect()
            return { w: Math.max(1, r.width), h: Math.max(1, r.height) }
        }

        let { w, h } = getSize()
        const fit = () => {
            const s = getSize()
            w = s.w; h = s.h
            c.width = Math.floor(w * dpr)
            c.height = Math.floor(h * dpr)
            c.style.width = `${w}px`
            c.style.height = `${h}px`
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.scale(dpr, dpr)
        }
        fit()
        const ro = new ResizeObserver(fit)
        ro.observe(parent)

        const COUNT = Math.min(90, Math.floor((w * h) / 26000))
        const parts = Array.from({ length: COUNT }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.22,
            vy: (Math.random() - 0.5) * 0.22,
            r: 0.8 + Math.random() * 1.4,
        }))
        const mouse = { x: -9999, y: -9999 }
        const onMove = (e) => {
            const r = c.getBoundingClientRect()
            mouse.x = e.clientX - r.left
            mouse.y = e.clientY - r.top
        }
        const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }

        const linkDist = 110
        const dotColor = 'rgba(20,20,20,0.45)'
        const lineBase = 0.12

        const draw = () => {
            ctx.clearRect(0, 0, w, h)

            for (let i = 0; i < 120; i++) {
                const x = (i * 97) % w
                const y = (i * 53) % h
                const r = (i % 3) * 0.3 + 0.2
                ctx.beginPath()
                ctx.arc(x, y, r, 0, Math.PI * 2)
                ctx.fillStyle = 'rgba(0,0,0,0.06)'
                ctx.fill()
            }

            for (const p of parts) {
                p.x += p.vx; p.y += p.vy
                if (p.x < 0 || p.x > w) p.vx *= -1
                if (p.y < 0 || p.y > h) p.vy *= -1

                const dx = mouse.x - p.x, dy = mouse.y - p.y
                const d2 = dx * dx + dy * dy
                if (d2 < 150 * 150) {
                    const inv = 1 / Math.sqrt(d2 + 0.0001)
                    p.vx += dx * inv * 0.0006
                    p.vy += dy * inv * 0.0006
                }

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                ctx.fillStyle = dotColor
                ctx.fill()
            }

            ctx.lineWidth = 0.6
            for (let i = 0; i < parts.length; i++) {
                for (let j = i + 1; j < parts.length; j++) {
                    const a = parts[i], b = parts[j]
                    const dx = a.x - b.x, dy = a.y - b.y
                    const d = Math.hypot(dx, dy)
                    if (d < linkDist) {
                        const alpha = lineBase * (1 - d / linkDist)
                        ctx.strokeStyle = `rgba(0,0,0,${alpha})`
                        ctx.beginPath()
                        ctx.moveTo(a.x, a.y)
                        ctx.lineTo(b.x, b.y)
                        ctx.stroke()
                    }
                }
            }

            rafRef.current = requestAnimationFrame(draw)
        }

        c.addEventListener('mousemove', onMove)
        c.addEventListener('mouseleave', onLeave)
        rafRef.current = requestAnimationFrame(draw)

        return () => {
            cancelAnimationFrame(rafRef.current)
            ro.disconnect()
            c.removeEventListener('mousemove', onMove)
            c.removeEventListener('mouseleave', onLeave)
        }
    }, [theme.palette.mode])

    if (theme.palette.mode !== 'light') return null

    return (
        <canvas
            ref={ref}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                display: 'block',
                pointerEvents: 'none',
                zIndex: 0
            }}
        />
    )
}

export default function Interactive3D() {
    const theme = useTheme()

    return (
        <Box
            sx={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                cursor: 'grab',
                '&:active': { cursor: 'grabbing' },
            }}
        >

            {theme.palette.mode === 'light' && (
                <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <LightParticlesCanvas />
                </Box>
            )}

            <Canvas
                camera={{ position: [0, 2, 30], fov: 45 }}
                gl={{ antialias: true, powerPreference: 'high-performance' }}
                dpr={[1, 2]}
                style={{ position: 'absolute', inset: 0, zIndex: 1 }}
            >
                <Scene />
            </Canvas>
        </Box>
    )
}
