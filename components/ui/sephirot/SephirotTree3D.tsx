// @ts-nocheck
'use client'

import React, { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line, Text, Float, Stars, Sparkles, Billboard, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useRouter } from 'next/navigation'

// --- DONNÉES ---
const NODES = [
  { name: 'KETHER', subtitle: 'CROWN', position: [0, 10, 0], color: '#ffffff', accent: '#a5f3fc', route: '/' },
  { name: 'TIPHERET', subtitle: 'BEAUTY', position: [0, 0, 0], color: '#fde68a', accent: '#f59e0b', route: '/audiovisuel' },
  { name: 'YESOD', subtitle: 'FOUNDATION', position: [0, -7, 0], color: '#d8b4fe', accent: '#9333ea', route: '/communautes' },
  { name: 'MALKUTH', subtitle: 'KINGDOM', position: [0, -12, 0], color: '#a8a29e', accent: '#57534e', route: '/communautes' },
  { name: 'CHOKHMAH', subtitle: 'WISDOM', position: [6, 7, 0], color: '#e2e8f0', accent: '#38bdf8', route: '/ia' },
  { name: 'CHESED', subtitle: 'MERCY', position: [6, 1, 0], color: '#bfdbfe', accent: '#3b82f6', route: '/terminal' },
  { name: 'NETZACH', subtitle: 'VICTORY', position: [5, -5, 0], color: '#86efac', accent: '#10b981', route: '/terminal' },
  { name: 'BINAH', subtitle: 'INTELLECT', position: [-6, 7, 0], color: '#cbd5e1', accent: '#94a3b8', route: '/politique' },
  { name: 'GEVURAH', subtitle: 'STRENGTH', position: [-6, 1, 0], color: '#fca5a5', accent: '#ef4444', route: '/terminal' },
  { name: 'HOD', subtitle: 'GLORY', position: [-5, -5, 0], color: '#fdba74', accent: '#f97316', route: '/politique' },
]

const LINKS = [
  [0, 4], [4, 7], [7, 5], [5, 8], [8, 1], [1, 6], [6, 9], [9, 2], [2, 3],
  [0, 7], [0, 1], [4, 1], [7, 1], [5, 1], [8, 1], [6, 2], [9, 2], [5, 6], [8, 9]
]

function PalantirNode({ position, color, accent, name, subtitle, route, onClick }: any) {
  const group = useRef<THREE.Group>(null!)
  const [hovered, setHover] = useState(false)

  useFrame((state, delta) => {
    if(group.current) group.current.rotation.y += delta * 0.1
    const scale = hovered ? 1.3 : 1
    group.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
  })

  return (
    <group ref={group} position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh
          onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; setHover(true) }}
          onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; setHover(false) }}
          onClick={(e) => { e.stopPropagation(); onClick(route) }}
        >
          <octahedronGeometry args={[1.2, 0]} />
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={0.5}
            chromaticAberration={0.2}
            anisotropy={0.3}
            distortion={0.1}
            color="#ffffff"
            roughness={0}
            transmission={1}
          />
        </mesh>
        <mesh scale={0.5}>
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={accent} wireframe wireframeLinewidth={2} />
        </mesh>
        <group rotation={[Math.PI / 3, 0, 0]}>
          <mesh>
            <ringGeometry args={[1.4, 1.45, 64]} />
            <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>
        </group>
        {hovered && <Sparkles count={30} scale={4} size={4} speed={2} opacity={0.8} color={accent} />}
        <Billboard position={[0, -2, 0]}>
          <Text position={[0, 0, 0]} fontSize={0.5} fontWeight={800} color="white" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="black">{name}</Text>
          <Text position={[0, -0.3, 0]} fontSize={0.2} color={accent} anchorX="center" anchorY="middle" letterSpacing={0.1}>{`[ ${subtitle} ]`}</Text>
        </Billboard>
      </Float>
    </group>
  )
}

function DataLinks() {
  const lines = useMemo(() => LINKS.map(([s, e]) => [
    new THREE.Vector3(...(NODES[s].position as [number, number, number])), 
    new THREE.Vector3(...(NODES[e].position as [number, number, number]))
  ]), [])
  return <>{lines.map((p, i) => <Line key={i} points={p} color="white" lineWidth={1} transparent opacity={0.1} />)}</>
}

export default function SephirotTree3D() {
  const router = useRouter()

  return (
    // IMPORTANT: Forcer la taille du container parent
    <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, background: 'black' }}>
      <Canvas 
        dpr={[1, 2]} 
        camera={{ position: [0, 0, 45], fov: 40 }} // Camera reculée à 45
        gl={{ antialias: true }}
        style={{ width: '100%', height: '100%' }} // Canvas prend 100%
      >
        <fog attach="fog" args={['#000000', 30, 100]} />
        <ambientLight intensity={0.6} />
        <spotLight position={[20, 20, 20]} intensity={2} color="#60a5fa" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#a855f7" />
        
        <Stars radius={200} depth={50} count={4000} factor={4} saturation={0} fade speed={0.3} />
        
        <group position={[0, 2, 0]}>
          <DataLinks />
          {NODES.map((node, i) => (
            <PalantirNode key={i} {...node} onClick={(r: string) => router.push(r)} />
          ))}
        </group>

        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          autoRotate 
          autoRotateSpeed={0.2} 
          maxDistance={70} 
          minDistance={10} 
        />
      </Canvas>
    </div>
  )
}
