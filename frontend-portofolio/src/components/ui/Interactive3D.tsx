import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Stars, OrbitControls } from '@react-three/drei';
import { Box, useTheme } from '@mui/material';
import type { GLTF } from 'three-stdlib';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface ModelProps {
    scale?: number;
    position?: [number, number, number];
}

const Model = (props: ModelProps) => {
    const { scene } = useGLTF('/models/vico_setup_it.glb') as GLTF;
    return <primitive object={scene} {...props} />;
};

const Scene = () => {
    const theme = useTheme();
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const [isTabActive, setIsTabActive] = useState(true);

    useEffect(() => {
        const handleVisibilityChange = () => setIsTabActive(!document.hidden);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    useFrame(() => {
        if (controlsRef.current) {
            controlsRef.current.autoRotate = isTabActive;
            if (isTabActive) {
                controlsRef.current.update();
            }
        }
    });

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
                ref={controlsRef}
                autoRotate
                autoRotateSpeed={0.5}
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 1.8}
            />
        </>
    );
};

export default function Interactive3D() {
    return (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, cursor: 'grab', '&:active': { cursor: 'grabbing' } }}>
            <Canvas
                camera={{ position: [0, 2, 30], fov: 45 }}
                gl={{ antialias: false, powerPreference: 'high-performance' }}
                dpr={[1, 1.5]}
                style={{ position: 'absolute', inset: 0, zIndex: 1 }}
            >
                <Scene />
            </Canvas>
        </Box>
    );
}