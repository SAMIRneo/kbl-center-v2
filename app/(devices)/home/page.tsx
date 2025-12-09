'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Text, Billboard, Stars, MeshDistortMaterial, Sphere, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useRef, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Triangle, Scroll, ChevronLeft, ChevronRight } from 'lucide-react'
import { tablets } from './tabletsData'

// === PARTICULES ÉSOTÉRIQUES OPTIMISÉES ===
function EsotericParticles() {
  const pointsRef = useRef<THREE.Points>(null!)
  const count = 3500

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)
    const szs = new Float32Array(count)
    
    const palette = [
      new THREE.Color('#fbbf24'),
      new THREE.Color('#f59e0b'),
      new THREE.Color('#8b5cf6'),
      new THREE.Color('#6366f1'),
      new THREE.Color('#38bdf8'),
      new THREE.Color('#fde68a'),
    ]

    for (let i = 0; i < count; i++) {
      const radius = 55 + Math.random() * 55
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      pos[i * 3 + 0] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radius * Math.cos(phi)

      const color = palette[Math.floor(Math.random() * palette.length)]
      const brightness = 0.7 + Math.random() * 0.3
      cols[i * 3 + 0] = color.r * brightness
      cols[i * 3 + 1] = color.g * brightness
      cols[i * 3 + 2] = color.b * brightness

      szs[i] = 0.18 + Math.random() * 0.3
    }
    return [pos, cols, szs]
  }, [])

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y += delta * 0.035
    pointsRef.current.rotation.x += delta * 0.012
  })

  const glyphs = ['✶', '✹', '✦', '☿', '☯', '✡', '⟁', '☾', '☀', '◬', '◭', '◮', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח']

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {Array.from({ length: 80 }).map((_, i) => {
        const radius = 48 + Math.random() * 38
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        const x = radius * Math.sin(phi) * Math.cos(theta)
        const y = radius * Math.sin(phi) * Math.sin(theta)
        const z = radius * Math.cos(phi)
        const glyph = glyphs[i % glyphs.length]
        const colors = ['#fbbf24', '#8b5cf6', '#38bdf8', '#f59e0b', '#fde68a']
        const col = colors[i % colors.length]
        const size = 0.85 + Math.random() * 0.8
        return (
          <Billboard key={i} position={[x, y, z]}>
            <Text fontSize={size} color={col} outlineWidth={0.07} outlineColor="#000000">
              {glyph}
            </Text>
          </Billboard>
        )
      })}
    </group>
  )
}

// === PYRAMIDE DIVINE ULTRA NETTE ===
function DivinePyramid() {
  const groupRef = useRef<THREE.Group>(null!)
  const eyeRef = useRef<THREE.Group>(null!)
  const ringsRef = useRef<THREE.Group>(null!)
  
  const pyramidTextures = useMemo(() => {
    return [
      { y: -3.8, scale: 7, color: '#d97706', emissive: '#f59e0b', intensity: 2.2, metalness: 0.98, roughness: 0.05 },
      { y: -0.3, scale: 5.2, color: '#ea580c', emissive: '#fb923c', intensity: 2.5, metalness: 0.96, roughness: 0.08 },
      { y: 3, scale: 3.3, color: '#fbbf24', emissive: '#fde68a', intensity: 2.8, metalness: 0.99, roughness: 0.02 },
    ]
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    
    groupRef.current.rotation.y = Math.sin(t * 0.18) * 0.6
    groupRef.current.position.y = 1.5 + Math.sin(t * 0.35) * 0.7
    
    if (eyeRef.current) {
      eyeRef.current.rotation.z = t * 0.3
      eyeRef.current.position.y = 5.5 + Math.sin(t * 0.5) * 0.3
    }
    
    if (ringsRef.current) {
      ringsRef.current.rotation.z = t * 0.15
    }
  })

  return (
    <group ref={groupRef} position={[0, 1.5, -14]}>
      {/* PYRAMIDES AVEC DÉTAILS */}
      {pyramidTextures.map((lvl, idx) => (
        <Float key={idx} speed={0.8 + idx * 0.35} floatIntensity={1} rotationIntensity={0.6}>
          <group position={[0, lvl.y, 0]}>
            {/* Pyramide principale */}
            <mesh rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
              <coneGeometry args={[lvl.scale, lvl.scale * 1.2, 4, 6]} />
              <meshPhysicalMaterial
                color={lvl.color}
                emissive={lvl.emissive}
                emissiveIntensity={lvl.intensity}
                metalness={lvl.metalness}
                roughness={lvl.roughness}
                clearcoat={1}
                clearcoatRoughness={0.05}
                envMapIntensity={2}
                reflectivity={1}
              />
            </mesh>

            {/* Wireframe */}
            <mesh rotation={[0, Math.PI / 4, 0]}>
              <coneGeometry args={[lvl.scale + 0.1, lvl.scale * 1.2, 4, 6]} />
              <meshStandardMaterial
                color="#fde68a"
                emissive="#fde68a"
                emissiveIntensity={3.5}
                wireframe
                transparent
                opacity={0.8}
              />
            </mesh>

            {/* Arêtes lumineuses */}
            {[0, 1, 2, 3].map((edge) => (
              <mesh key={edge} rotation={[0, (Math.PI / 2) * edge, 0]} position={[0, lvl.scale * 0.6, 0]}>
                <boxGeometry args={[0.08, lvl.scale * 1.2, 0.08]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  emissive="#fde68a"
                  emissiveIntensity={4}
                  transparent
                  opacity={0.9}
                />
              </mesh>
            ))}

            {/* Particules */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2
              const radius = lvl.scale * 1.3
              const x = Math.cos(angle) * radius
              const z = Math.sin(angle) * radius
              return (
                <Float key={`particle-${i}`} speed={2 + i * 0.1} floatIntensity={0.5}>
                  <mesh position={[x, 0, z]}>
                    <sphereGeometry args={[0.12, 12, 12]} />
                    <meshStandardMaterial
                      color="#fbbf24"
                      emissive="#fde68a"
                      emissiveIntensity={3}
                      transparent
                      opacity={0.8}
                    />
                  </mesh>
                </Float>
              )
            })}
          </group>
        </Float>
      ))}

      {/* ŒIL TOUT-VOYANT */}
      <Float speed={1.2} floatIntensity={1.5} rotationIntensity={0.8}>
        <group ref={eyeRef} position={[0, 5.5, 0]}>
          {/* Base */}
          <mesh castShadow>
            <circleGeometry args={[1.5, 64]} />
            <meshPhysicalMaterial
              color="#0a0a0a"
              emissive="#1e293b"
              emissiveIntensity={1.2}
              metalness={0.98}
              roughness={0.05}
              clearcoat={1}
              clearcoatRoughness={0.02}
            />
          </mesh>

          {/* Globe */}
          <Sphere args={[1, 64, 64]} castShadow>
            <MeshDistortMaterial
              color="#ffffff"
              emissive="#fbbf24"
              emissiveIntensity={2.5}
              metalness={0.99}
              roughness={0.01}
              distort={0.2}
              speed={2}
            />
          </Sphere>

          {/* Iris */}
          <mesh position={[0, 0, 0.75]}>
            <circleGeometry args={[0.55, 64]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#22d3ee"
              emissiveIntensity={4.5}
              transparent
              opacity={0.95}
            />
          </mesh>

          {/* Pupille */}
          <mesh position={[0, 0, 0.8]}>
            <circleGeometry args={[0.24, 64]} />
            <meshStandardMaterial color="#000000" />
          </mesh>

          {/* Reflet */}
          <mesh position={[0.25, 0.2, 0.85]}>
            <circleGeometry args={[0.15, 32]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={5}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Rayons */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <mesh key={i} rotation={[0, 0, (Math.PI / 4) * i]} position={[0, 0, -0.5]}>
              <planeGeometry args={[0.22, 4.2]} />
              <meshStandardMaterial
                color="#fde68a"
                emissive="#fde68a"
                emissiveIntensity={4}
                transparent
                opacity={0.85}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}

          {/* Halo */}
          <mesh>
            <ringGeometry args={[1.6, 2, 64]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fde68a"
              emissiveIntensity={3}
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Symboles */}
          {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח'].map((symbol, i) => {
            const angle = (i / 8) * Math.PI * 2
            const radius = 2.5
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            return (
              <Billboard key={i} position={[x, y, 0]}>
                <Text
                  fontSize={0.4}
                  color="#fbbf24"
                  outlineWidth={0.05}
                  outlineColor="#000000"
                  fontWeight={900}
                >
                  {symbol}
                </Text>
              </Billboard>
            )
          })}
        </group>
      </Float>

      {/* ANNEAUX */}
      <group ref={ringsRef}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Float key={i} speed={0.5 + i * 0.15} floatIntensity={0.3}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6 + i * 0.5, 0]}>
              <ringGeometry args={[7.5 + i * 2, 8 + i * 2, 64]} />
              <meshStandardMaterial
                color="#f59e0b"
                emissive="#fbbf24"
                emissiveIntensity={3 - i * 0.4}
                transparent
                opacity={0.7 - i * 0.1}
                side={THREE.DoubleSide}
              />
            </mesh>
            
            {Array.from({ length: 12 }).map((_, j) => {
              const angle = (j / 12) * Math.PI * 2
              const radius = 7.75 + i * 2
              const x = Math.cos(angle) * radius
              const z = Math.sin(angle) * radius
              return (
                <Float key={`ring-sphere-${j}`} speed={1.5 + j * 0.1} floatIntensity={0.4}>
                  <mesh position={[x, -6 + i * 0.5, z]}>
                    <sphereGeometry args={[0.08, 12, 12]} />
                    <meshStandardMaterial
                      color="#fbbf24"
                      emissive="#fde68a"
                      emissiveIntensity={3}
                    />
                  </mesh>
                </Float>
              )
            })}
          </Float>
        ))}
      </group>

      {/* PILIERS */}
      {[0, 1, 2, 3].map((i) => (
        <Float key={`pillar-${i}`} speed={1 + i * 0.2} floatIntensity={1.2}>
          <mesh
            position={[
              Math.cos((i / 4) * Math.PI * 2) * 6,
              0,
              Math.sin((i / 4) * Math.PI * 2) * 6,
            ]}
          >
            <cylinderGeometry args={[0.15, 0.15, 15, 24]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fde68a"
              emissiveIntensity={3.5}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}

      {/* GLYPHES */}
      {['✡', '◬', '◭', '☯', '☿'].map((glyph, i) => {
        const angle = (i / 5) * Math.PI * 2
        const radius = 12
        const height = Math.sin(i * 1.3) * 3
        const x = Math.cos(angle) * radius
        const y = height
        const z = Math.sin(angle) * radius
        return (
          <Float key={`glyph-${i}`} speed={1.5 + i * 0.3} floatIntensity={1.5} rotationIntensity={0.8}>
            <Billboard position={[x, y, z]}>
              <Text
                fontSize={1.2}
                color="#fbbf24"
                outlineWidth={0.1}
                outlineColor="#000000"
                fontWeight={900}
              >
                {glyph}
              </Text>
            </Billboard>
          </Float>
        )
      })}

      {/* PARTICULES ÉNERGIE */}
      {Array.from({ length: 20 }).map((_, i) => {
        const radius = 8 + Math.random() * 6
        const angle = Math.random() * Math.PI * 2
        const height = -4 + Math.random() * 12
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        return (
          <Float key={`energy-${i}`} speed={2 + Math.random() * 2} floatIntensity={1.5}>
            <mesh position={[x, height, z]}>
              <sphereGeometry args={[0.1, 12, 12]} />
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#fde68a"
                emissiveIntensity={4}
                transparent
                opacity={0.8}
              />
            </mesh>
          </Float>
        )
      })}

      {/* TITRE */}
      <Billboard position={[0, 10, 0]}>
        <Text
          fontSize={1.3}
          color="#fde68a"
          outlineWidth={0.12}
          outlineColor="#000000"
          fontWeight={900}
        >
          ◬ PYRAMIDE DIVINE ◭
        </Text>
      </Billboard>

      {/* SOUS-TITRE */}
      <Billboard position={[0, 8.5, 0]}>
        <Text
          fontSize={0.5}
          color="#fbbf24"
          outlineWidth={0.05}
          outlineColor="#000000"
          fontWeight={700}
        >
          כתר · חכמה · בינה
        </Text>
      </Billboard>
    </group>
  )
}

// === COMPOSANT PRINCIPAL ===
export default function HomeDevicePage() {
  const [activePage, setActivePage] = useState(0)
  const currentTablet = tablets[activePage]

  return (
    <div className="relative w-full h-screen overflow-y-auto bg-black">
      {/* 3D SCENE - CAMÉRA CENTRÉE */}
      <div className="sticky top-0 left-0 w-full h-[45vh] z-0">
        <Canvas
          camera={{ 
            position: [0, 3, 22], // Position centrée face à la pyramide
            fov: 55, // Angle de vue optimal
            near: 0.1,
            far: 1000,
          }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            alpha: false,
            stencil: false,
            depth: true,
          }}
          dpr={[1, 2]}
          shadows
        >
          <color attach="background" args={['#020202']} />
          <fog attach="fog" args={['#020202', 45, 100]} />

          <ambientLight intensity={0.5} />
          <pointLight position={[18, 22, 14]} intensity={5.5} color="#fbbf24" castShadow shadow-mapSize={[1024, 1024]} />
          <pointLight position={[-20, -12, 16]} intensity={4.5} color="#8b5cf6" />
          <pointLight position={[0, 12, 25]} intensity={3.5} color="#38bdf8" />
          <spotLight
            position={[0, 35, 10]}
            angle={0.6}
            intensity={5}
            penumbra={0.65}
            color="#fde68a"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          <Environment preset="night" />
          <Stars radius={220} depth={80} count={6000} factor={5} saturation={0.6} fade speed={0.2} />
          <EsotericParticles />
          <DivinePyramid />

          <EffectComposer multisampling={4}>
            <Bloom 
              intensity={2} 
              luminanceThreshold={0.2} 
              luminanceSmoothing={0.9} 
              mipmapBlur 
            />
            <ChromaticAberration offset={[0.002, 0.002]} />
            <Vignette offset={0.25} darkness={0.7} />
          </EffectComposer>

          <OrbitControls
            target={[0, 2, -14]} // Cible la pyramide (position Y ajustée)
            enableDamping
            dampingFactor={0.05}
            autoRotate
            autoRotateSpeed={0.25}
            maxDistance={40}
            minDistance={18}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 3}
            enablePan={false}
            makeDefault
          />
        </Canvas>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>

      {/* TABLETTES */}
      <div className="relative z-10 w-full bg-black py-16">
        <div className="max-w-5xl mx-auto px-6">
          {/* HEADER */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex flex-col items-center gap-4 px-12 py-7 rounded-3xl bg-gradient-to-b from-amber-950/95 to-slate-950/95 backdrop-blur-3xl border-4 border-amber-600/90 shadow-[0_0_100px_rgba(245,158,11,0.7)]">
              <div className="flex items-center gap-8">
                <Triangle className="w-8 h-8 text-amber-400 fill-amber-400/40 animate-pulse" />
                <Eye className="w-12 h-12 text-amber-300 animate-pulse drop-shadow-[0_0_20px_rgba(245,158,11,1)]" />
                <Triangle className="w-8 h-8 text-amber-400 fill-amber-400/40 animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight" style={{ fontFamily: 'Trajan Pro, Georgia, serif' }}>
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_6px_25px_rgba(245,158,11,1)]">
                  ספר קבלה
                </span>
              </h1>
              <p className="text-amber-400/95 text-sm tracking-[0.6em] uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                Liber Kabbalae · Tablettes Divines
              </p>
            </div>
          </motion.div>

          {/* TABLETTE */}
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div
              className="relative rounded-3xl p-3"
              style={{
                background: `linear-gradient(135deg, ${currentTablet.couleurPrimaire} 0%, ${currentTablet.couleurSecondaire} 50%, ${currentTablet.couleurPrimaire} 100%)`,
                boxShadow: `0 0 150px ${currentTablet.couleurEmissive}, inset 0 0 100px rgba(0,0,0,0.7)`,
              }}
            >
              <div
                className="rounded-2xl p-12 md:p-20 relative overflow-hidden"
                style={{ background: 'linear-gradient(180deg, #1c1208 0%, #0a0604 100%)' }}
              >
                {/* TEXTURE */}
                <div
                  className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='6' /%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")` }}
                />

                {/* ORNEMENTS */}
                {[
                  { t: true, l: true },
                  { t: true, r: true },
                  { b: true, l: true },
                  { b: true, r: true },
                ].map((pos, i) => (
                  <div
                    key={i}
                    className={`absolute ${pos.t ? 'top-4' : 'bottom-4'} ${pos.l ? 'left-4' : 'right-4'} w-20 h-20`}
                  >
                    <div
                      className={`w-full h-full border-4 ${
                        pos.t && pos.l
                          ? 'border-b-0 border-r-0 rounded-tl-2xl'
                          : pos.t && pos.r
                          ? 'border-b-0 border-l-0 rounded-tr-2xl'
                          : pos.b && pos.l
                          ? 'border-t-0 border-r-0 rounded-bl-2xl'
                          : 'border-t-0 border-l-0 rounded-br-2xl'
                      }`}
                      style={{ borderColor: currentTablet.couleurEmissive }}
                    />
                  </div>
                ))}

                {/* EN-TÊTE */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-14 pb-10 border-b-4"
                  style={{ borderColor: `${currentTablet.couleurPrimaire}99` }}
                >
                  <div className="flex items-center justify-center gap-8 mb-8">
                    <div
                      className="h-px flex-1"
                      style={{
                        background: `linear-gradient(to right, transparent, ${currentTablet.couleurEmissive}cc, ${currentTablet.couleurEmissive})`,
                      }}
                    />
                    <Eye
                      className="w-14 h-14 animate-pulse"
                      style={{
                        color: currentTablet.couleurEmissive,
                        filter: `drop-shadow(0 0 25px ${currentTablet.couleurEmissive})`,
                      }}
                    />
                    <div
                      className="h-px flex-1"
                      style={{
                        background: `linear-gradient(to left, transparent, ${currentTablet.couleurEmissive}cc, ${currentTablet.couleurEmissive})`,
                      }}
                    />
                  </div>

                  <div className="text-center space-y-5">
                    <div
                      className="inline-block px-10 py-5 rounded-full border-3"
                      style={{
                        background: `linear-gradient(to right, ${currentTablet.couleurPrimaire}80, ${currentTablet.couleurSecondaire}80)`,
                        borderColor: `${currentTablet.couleurEmissive}aa`,
                        boxShadow: `0 0 40px ${currentTablet.couleurEmissive}cc`,
                      }}
                    >
                      <h2
                        className="text-7xl md:text-9xl font-black"
                        style={{
                          color: currentTablet.couleurEmissive,
                          fontFamily: 'David Libre, serif',
                          textShadow: `0 6px 30px ${currentTablet.couleurEmissive}`,
                        }}
                      >
                        {currentTablet.numero}
                      </h2>
                    </div>
                    <h3
                      className="text-3xl md:text-5xl font-bold tracking-wider leading-tight px-4"
                      style={{
                        color: `${currentTablet.couleurEmissive}f0`,
                        fontFamily: 'Cinzel, Georgia, serif',
                      }}
                    >
                      {currentTablet.titre}
                    </h3>

                    <div className="flex items-center justify-center gap-5 pt-5">
                      <Scroll className="w-6 h-6 animate-pulse" style={{ color: currentTablet.couleurPrimaire }} />
                      <div
                        className="h-px w-32"
                        style={{
                          background: `linear-gradient(to right, transparent, ${currentTablet.couleurPrimaire}, transparent)`,
                        }}
                      />
                      <Scroll className="w-6 h-6 animate-pulse" style={{ color: currentTablet.couleurPrimaire }} />
                    </div>
                  </div>
                </motion.div>

                {/* TEXTE */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePage}
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -35 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                  >
                    <div
                      className="text-amber-100/95 leading-[2.5] text-justify space-y-10 text-lg md:text-xl"
                      style={{ fontFamily: 'Garamond, Baskerville, Georgia, serif', textShadow: '0 3px 6px rgba(0,0,0,0.7)' }}
                    >
                      {currentTablet.contenu.split('\n\n').map((para, i) => (
                        <p
                          key={i}
                          className="first-letter:text-8xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:leading-[0.7]"
                        >
                          <span
                            style={
                              i === 0
                                ? {
                                    color: currentTablet.couleurEmissive,
                                    filter: `drop-shadow(0 4px 15px ${currentTablet.couleurEmissive})`,
                                  }
                                : {}
                            }
                          >
                            {para}
                          </span>
                        </p>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* NAVIGATION */}
                <div className="mt-20 pt-12 border-t-4" style={{ borderColor: `${currentTablet.couleurPrimaire}99` }}>
                  <div className="flex items-center justify-between gap-8 max-w-4xl mx-auto">
                    <motion.button
                      whileHover={{ scale: 1.1, x: -10 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActivePage((p) => Math.max(0, p - 1))}
                      disabled={activePage === 0}
                      className="flex items-center gap-4 px-8 py-5 rounded-2xl disabled:opacity-15 disabled:cursor-not-allowed text-white font-bold transition-all border-3"
                      style={{
                        background: `linear-gradient(to right, ${currentTablet.couleurPrimaire}, ${currentTablet.couleurSecondaire})`,
                        borderColor: `${currentTablet.couleurEmissive}cc`,
                        boxShadow: `0 0 40px ${currentTablet.couleurEmissive}cc`,
                      }}
                    >
                      <ChevronLeft className="w-7 h-7" />
                      <span className="hidden sm:inline text-base tracking-wider">קודם</span>
                    </motion.button>

                    <div className="flex items-center gap-4">
                      {tablets.map((_, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.4 }}
                          whileTap={{ scale: 0.8 }}
                          onClick={() => setActivePage(i)}
                          className={`transition-all rounded-full ${i === activePage ? 'w-12 h-5' : 'w-5 h-5'}`}
                          style={{
                            backgroundColor: i === activePage ? currentTablet.couleurEmissive : `${currentTablet.couleurPrimaire}aa`,
                            boxShadow:
                              i === activePage
                                ? `0 0 25px ${currentTablet.couleurEmissive}`
                                : `0 0 12px ${currentTablet.couleurPrimaire}99`,
                          }}
                        />
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1, x: 10 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActivePage((p) => Math.min(tablets.length - 1, p + 1))}
                      disabled={activePage === tablets.length - 1}
                      className="flex items-center gap-4 px-8 py-5 rounded-2xl disabled:opacity-15 disabled:cursor-not-allowed text-white font-bold transition-all border-3"
                      style={{
                        background: `linear-gradient(to right, ${currentTablet.couleurPrimaire}, ${currentTablet.couleurSecondaire})`,
                        borderColor: `${currentTablet.couleurEmissive}cc`,
                        boxShadow: `0 0 40px ${currentTablet.couleurEmissive}cc`,
                      }}
                    >
                      <span className="hidden sm:inline text-base tracking-wider">הבא</span>
                      <ChevronRight className="w-7 h-7" />
                    </motion.button>
                  </div>

                  {/* SIGNATURE */}
                  <div className="flex items-center justify-center gap-5 mt-12">
                    <Scroll className="w-7 h-7 animate-pulse" style={{ color: currentTablet.couleurEmissive }} />
                    <p
                      className="text-sm tracking-[0.5em] uppercase"
                      style={{ color: `${currentTablet.couleurPrimaire}e0`, fontFamily: 'Cinzel, serif' }}
                    >
                      KBL · MMXXV · {currentTablet.numero}
                    </p>
                    <Scroll className="w-7 h-7 animate-pulse" style={{ color: currentTablet.couleurEmissive }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
