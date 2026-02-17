import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment, Stars, OrbitControls } from '@react-three/drei'
import { Box, useTheme } from '@mui/material'
import { useInView } from 'framer-motion'
import type { GLTF } from 'three-stdlib'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

interface Interactive3DProps {
    rootRef: React.RefObject<HTMLDivElement | null>
}

interface ModelProps {
    scale?: number
    position?: [number, number, number]
}

const Model = (props: ModelProps) => {
    const { scene } = useGLTF('/models/vico_setup_it.glb') as GLTF
    return <primitive object={scene} {...props} />
}

const Controls = ({ rootRef }: { rootRef: React.RefObject<HTMLDivElement | null> }) => {
    const controlsRef = useRef<OrbitControlsImpl>(null)
    const { gl } = useThree()
    const [isTabActive, setIsTabActive] = useState(true)

    useEffect(() => {
        const handleVisibilityChange = () => setIsTabActive(!document.hidden)
        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [])

    useFrame(() => {
        if (controlsRef.current && isTabActive) {
            controlsRef.current.update()
        }
    })

    useEffect(() => {
        if (controlsRef.current && rootRef.current) {
            const originalDomElement = gl.domElement
            controlsRef.current.connect(rootRef.current)
            return () => {
                controlsRef.current?.connect(originalDomElement)
            }
        }
    }, [rootRef, gl.domElement])

    return (
        <OrbitControls
            ref={controlsRef}
            makeDefault
            autoRotate
            autoRotateSpeed={0.5}
            enableZoom={false}
            enablePan={true}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
        />
    )
}

const Scene = ({ rootRef }: { rootRef: React.RefObject<HTMLDivElement | null> }) => {
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
                    <Model scale={1.7} position={[0, -2, 0]} />
                </group>
            </Suspense>
            <Controls rootRef={rootRef} />
        </>
    )
}

export default function Interactive3D({ rootRef }: Interactive3DProps) {
    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { margin: "0px 0px -100px 0px" })

    return (
        <Box
            ref={containerRef}
            sx={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
            }}
        >
            <Canvas
                frameloop={isInView ? "always" : "never"}
                camera={{ position: [0, 2, 30], fov: 45 }}
                gl={{ antialias: false, powerPreference: 'high-performance' }}
                dpr={[1, 1.5]}
                eventSource={rootRef as React.RefObject<HTMLElement>}
                eventPrefix="client"
            >
                <Scene rootRef={rootRef} />
            </Canvas>
        </Box>
    )
}