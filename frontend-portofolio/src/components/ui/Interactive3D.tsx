import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  Stars,
  OrbitControls,
  Float,
  ContactShadows,
  PerformanceMonitor,
  Preload,
} from "@react-three/drei";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { useInView } from "framer-motion";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

interface Interactive3DProps {
  rootRef: React.RefObject<HTMLDivElement | null>;
}

interface ModelProps {
  scale?: number;
  position?: [number, number, number];
}

const Model = (props: ModelProps) => {
  const { scene } = useGLTF("/models/vico_setup_it.glb") as GLTF;

  // Enable shadows on all meshes within the model
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} {...props} />;
};

const Controls = ({
  rootRef,
}: {
  rootRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { gl } = useThree();
  const [isTabActive, setIsTabActive] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => setIsTabActive(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useFrame(() => {
    if (controlsRef.current && isTabActive) {
      controlsRef.current.update();
    }
  });

  useEffect(() => {
    if (controlsRef.current && rootRef.current) {
      const originalDomElement = gl.domElement;
      controlsRef.current.connect(rootRef.current);
      return () => {
        controlsRef.current?.connect(originalDomElement);
      };
    }
  }, [rootRef, gl.domElement]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      autoRotate
      autoRotateSpeed={0.3}
      enableZoom={false}
      enablePan={true}
      minPolarAngle={Math.PI / 3.5}
      maxPolarAngle={Math.PI / 1.8}
      dampingFactor={0.05}
    />
  );
};

const Scene = ({
  rootRef,
}: {
  rootRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const theme = useTheme();
  // Reduce star count significantly on mobile devices for better performance
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Stars
        radius={100}
        depth={50}
        count={isMobile ? 1500 : 4000}
        factor={6}
        saturation={0.5}
        fade
        speed={1}
      />
      <Environment preset="city" />
      <ambientLight intensity={0.6} />

      {/* Main Key Light */}
      <pointLight
        position={[10, 15, 15]}
        intensity={2.5}
        color={theme.palette.primary.main}
        castShadow
      />
      {/* Fill Light */}
      <pointLight
        position={[-15, -5, 5]}
        intensity={1.5}
        color={theme.palette.secondary.main}
      />
      {/* Rim Light */}
      <directionalLight
        position={[0, 10, -10]}
        intensity={1.5}
        color="#ffffff"
      />

      <Suspense fallback={null}>
        <Float
          speed={1.2}
          rotationIntensity={0.15}
          floatIntensity={0.4}
          floatingRange={[-0.1, 0.1]}
        >
          <group rotation-y={-1.5}>
            <Model scale={1.7} position={[0, -2, 0]} />
          </group>
        </Float>

        {/* Beautiful soft grounded shadow - baked for performance */}
        <ContactShadows
          position={[0, -2.8, 0]}
          opacity={0.7}
          scale={15}
          blur={2}
          far={4.5}
          color="#000000"
          resolution={512}
          frames={1}
        />
      </Suspense>
      <Controls rootRef={rootRef} />
    </>
  );
};

export default function Interactive3D({ rootRef }: Interactive3DProps) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "0px 0px -100px 0px" });
  const [dpr, setDpr] = useState(1.5);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <Canvas
        shadows
        frameloop={isInView ? "always" : "never"}
        camera={{ position: [0, 2, 32], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        dpr={dpr}
        eventSource={rootRef as React.RefObject<HTMLElement>}
        eventPrefix="client"
      >
        <PerformanceMonitor
          onIncline={() => setDpr(2)}
          onDecline={() => setDpr(1)}
        />
        <Scene rootRef={rootRef} />
        <Preload all />
      </Canvas>
    </Box>
  );
}
