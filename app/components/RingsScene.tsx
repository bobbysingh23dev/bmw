"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { Environment, Float, Lightformer, PresentationControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// Brilliant-cut silhouette, revolved into a faceted gem.
function useDiamondGeometry() {
  return useMemo(() => {
    const profile = [
      new THREE.Vector2(0, -0.42),
      new THREE.Vector2(0.3, -0.02),
      new THREE.Vector2(0.32, 0.03),
      new THREE.Vector2(0.2, 0.16),
      new THREE.Vector2(0, 0.17),
    ];
    const g = new THREE.LatheGeometry(profile, 8);
    g.computeVertexNormals();
    return g;
  }, []);
}

function Diamond() {
  const geometry = useDiamondGeometry();
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.6;
  });
  return (
    <group position={[0, 1.2, 0]}>
      {/* prongs */}
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.2, 0.02, Math.sin(a) * 0.2]} rotation={[0, -a, Math.cos(a) * 0.3]}>
            <cylinderGeometry args={[0.025, 0.035, 0.34, 8]} />
            <meshStandardMaterial color="#f1cf7a" metalness={1} roughness={0.18} />
          </mesh>
        );
      })}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.16, 0.12, 0.14, 16]} />
        <meshStandardMaterial color="#e6be62" metalness={1} roughness={0.2} />
      </mesh>
      <mesh ref={ref} geometry={geometry} position={[0, 0.22, 0]} scale={0.95}>
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0}
          roughness={0}
          transmission={1}
          thickness={0.6}
          ior={2.4}
          dispersion={5}
          iridescence={0.6}
          iridescenceIOR={1.8}
          specularIntensity={1}
          envMapIntensity={2.5}
          flatShading
        />
      </mesh>
    </group>
  );
}

function Ring({ color, ...props }: { color: string } & ThreeElements["group"]) {
  return (
    <group {...props}>
      <mesh>
        <torusGeometry args={[1, 0.13, 64, 200]} />
        <meshStandardMaterial color={color} metalness={1} roughness={0.12} envMapIntensity={2.4} />
      </mesh>
      {/* fine milgrain edge */}
      <mesh>
        <torusGeometry args={[1, 0.135, 8, 200]} />
        <meshStandardMaterial color={color} metalness={1} roughness={0.35} wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function Rings() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t * 0.35) * 0.55;
  });
  return (
    <group ref={group}>
      <Ring color="#e9c46a" position={[-0.62, -0.1, 0]} rotation={[0.25, 0.55, 0.15]} />
      <group position={[0.62, 0.05, 0]} rotation={[-0.15, -0.6, -0.1]}>
        <Ring color="#f0b8a0" />
        <Diamond />
      </group>
    </group>
  );
}

export default function RingsScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.2, 5.2], fov: 38 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{ touchAction: "pan-y" }}
    >
      <ambientLight intensity={0.25} />
      <spotLight position={[4, 6, 5]} angle={0.4} penumbra={1} intensity={60} color="#fff1d0" />
      <pointLight position={[-4, -2, 3]} intensity={12} color="#ff9fb3" />

      <PresentationControls
        global={false}
        cursor
        snap
        speed={1.4}
        polar={[-0.4, 0.4]}
        azimuth={[-0.9, 0.9]}
      >
        <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.8}>
          <Rings />
        </Float>
      </PresentationControls>

      <Sparkles count={70} scale={[7, 4, 3]} size={3.2} speed={0.35} color="#ffe3a0" opacity={0.9} />

      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#7a4a2a"]} />
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={5} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={3} />
          <Lightformer form="circle" intensity={2.5} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="ring" color="#ffd9a0" intensity={4} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={3} />
          <Lightformer form="rect" color="#ffb3c1" intensity={3} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[10, 2, 1]} />
          <Lightformer form="rect" intensity={6} position={[0, 0, 8]} scale={[8, 1, 1]} />
          <Lightformer form="rect" color="#fff2d6" intensity={4} position={[0, -6, 2]} rotation-x={-Math.PI / 2} scale={[12, 6, 1]} />
          <Lightformer form="rect" color="#ffe0a8" intensity={3} position={[-8, 3, 4]} rotation-y={Math.PI / 3} scale={[6, 8, 1]} />
        </group>
      </Environment>
    </Canvas>
  );
}
