// @ts-nocheck
'use client'

import React, { useRef, useState, useMemo, useCallback, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  Line, 
  Text, 
  Float, 
  Billboard,
  MeshTransmissionMaterial, 
  Trail, 
  Sphere, 
  useTexture,
  Sparkles,
  ContactShadows,
  Environment,
  Lightformer,
  BakeShadows,
  AccumulativeShadows,
  RandomizedLight,
  Sky,
  Stars
} from '@react-three/drei'
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier'
import { EffectComposer, Bloom, ChromaticAberration, Vignette, DepthOfField, N8AO } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { useRouter } from 'next/navigation'
import { useGesture } from '@use-gesture/react'
import gsap from 'gsap'
import { createCrystalMaterial } from '@/lib/shaders/crystalShader'
import { getSoundManager } from '@/lib/audio/SoundManager'

// ============================================================================
// ADVANCED PARTICLE SYSTEM WITH PHYSICS
// ============================================================================

const PhysicsParticles = React.memo(({ count = 500 }: { count?: number }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
      ] as [number, number, number],
      velocity: [
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.2,
      color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
    }))
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return

    particles.forEach((particle, i) => {
      // Update position
      particle.position[0] += particle.velocity[0]
      particle.position[1] += particle.velocity[1]
      particle.position[2] += particle.velocity[2]

      // Boundary check
      if (Math.abs(particle.position[0]) > 50) particle.velocity[0] *= -1
      if (Math.abs(particle.position[1]) > 50) particle.velocity[1] *= -1
      if (Math.abs(particle.position[2]) > 50) particle.velocity[2] *= -1

      // Set matrix
      dummy.position.set(...particle.position)
      dummy.scale.setScalar(particle.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      meshRef.current.setColorAt(i, particle.color)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial
        emissive="#ffffff"
        emissiveIntensity={0.5}
        toneMapped={false}
      />
    </instancedMesh>
  )
})

// ============================================================================
// ENHANCED CRYSTAL NODE WITH ADVANCED SHADERS
// ============================================================================

const EnhancedCrystalNode = React.memo(({
  position,
  color,
  accent,
  name,
  subtitle,
  route,
  onClick,
  energy,
}: any) => {
  const group = useRef<THREE.Group>(null!)
  const crystalRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const { camera } = useThree()
  const soundManager = useMemo(() => getSoundManager(), [])

  // Custom shader material
  const crystalMaterial = useMemo(
    () => createCrystalMaterial(color, accent),
    [color, accent]
  )

  useFrame((state, delta) => {
    if (!group.current) return

    // Update shader time
    if (crystalMaterial.uniforms) {
      crystalMaterial.uniforms.time.value = state.clock.elapsedTime
      crystalMaterial.uniforms.pulseIntensity.value = hovered ? 2.0 : 1.0
    }

    // Rotation
    group.current.rotation.y += delta * 0.15

    // Breathing animation
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.06
    const targetScale = hovered ? 1.5 * breathe : 1 * breathe
    group.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    )

    // Floating
    group.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.6 + position[0]) * 0.2
  })

  const handleHover = useCallback(
    (isHovered: boolean) => {
      setHover(isHovered)
      document.body.style.cursor = isHovered ? 'pointer' : 'auto'

      if (isHovered) {
        soundManager.play('ui', 'hover')
        gsap.to(group.current.rotation, {
          y: group.current.rotation.y + Math.PI * 0.25,
          duration: 0.5,
          ease: 'back.out(1.7)',
        })
      }
    },
    [soundManager]
  )

  const handleClick = useCallback(() => {
    setActive(true)
    soundManager.play('crystal')
    soundManager.play('ui', 'whoosh')

    // GSAP animation for click
    gsap.to(group.current.scale, {
      x: 0.8,
      y: 0.8,
      z: 0.8,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    })

    setTimeout(() => {
      soundManager.play('portal')
      onClick(route)
    }, 200)
  }, [onClick, route, soundManager])

  const routeName = route === '/' ? 'HOME' : route.replace('/', '').toUpperCase()

  return (
    <RigidBody type="fixed" colliders="hull">
      <group ref={group} position={position}>
        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
          {/* Main Crystal with Custom Shader */}
          <mesh
            ref={crystalRef}
            onPointerOver={(e) => {
              e.stopPropagation()
              handleHover(true)
            }}
            onPointerOut={(e) => {
              e.stopPropagation()
              handleHover(false)
            }}
            onClick={(e) => {
              e.stopPropagation()
              handleClick()
            }}
            castShadow
            receiveShadow
          >
            <octahedronGeometry args={[1.6, 0]} />
            <primitive object={crystalMaterial} attach="material" />
          </mesh>

          {/* Inner Core with Transmission */}
          <mesh scale={0.7}>
            <icosahedronGeometry args={[1, 2]} />
            <MeshTransmissionMaterial
              backside
              samples={8}
              resolution={1024}
              thickness={1.2}
              chromaticAberration={0.5}
              anisotropy={0.5}
              distortion={0.3}
              distortionScale={0.5}
              temporalDistortion={0.2}
              color={accent}
              transmission={0.98}
              ior={2.8}
              roughness={0}
              clearcoat={1}
              clearcoatRoughness={0}
              attenuationDistance={1.0}
              attenuationColor={accent}
            />
          </mesh>

          {/* Sparkles Effect */}
          <Sparkles
            count={hovered ? 80 : 40}
            scale={hovered ? 4 : 3}
            size={hovered ? 3 : 2}
            speed={hovered ? 1 : 0.5}
            color={accent}
            opacity={hovered ? 1 : 0.6}
          />

          {/* Energy Rings */}
          {[0, 1, 2].map((i) => (
            <group
              key={i}
              rotation={[
                Math.PI / 4 * i,
                Math.PI / 3 * i,
                Math.PI / 6 * i,
              ]}
            >
              <mesh>
                <torusGeometry args={[2 + i * 0.2, 0.04, 16, 100]} />
                <meshStandardMaterial
                  color={accent}
                  emissive={accent}
                  emissiveIntensity={hovered ? 2 : 1}
                  transparent
                  opacity={hovered ? 0.8 : 0.4}
                  roughness={0}
                  metalness={1}
                />
              </mesh>
            </group>
          ))}

          {/* Glow Sphere */}
          {hovered && (
            <Sphere args={[2.5, 32, 32]}>
              <meshStandardMaterial
                color={accent}
                emissive={accent}
                emissiveIntensity={1.5}
                transparent
                opacity={0.15}
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
              />
            </Sphere>
          )}

          {/* Labels */}
          <Billboard position={[0, 4.5, 0]}>
            {/* Background Panel */}
            <mesh>
              <planeGeometry args={[5, 2.2]} />
              <meshStandardMaterial
                color="#000000"
                transparent
                opacity={0.85}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>

            {/* Border Glow */}
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[5.1, 2.3]} />
              <meshStandardMaterial
                color={accent}
                emissive={accent}
                emissiveIntensity={hovered ? 2 : 1}
                transparent
                opacity={0.3}
                side={THREE.BackSide}
              />
            </mesh>

            {/* Route Name */}
            <Text
              position={[0, 0.75, 0.1]}
              fontSize={0.32}
              color={accent}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.25}
              fontWeight={900}
              outlineWidth={0.04}
              outlineColor="#000000"
            >
              {routeName}
            </Text>

            {/* Main Name */}
            <Text
              position={[0, 0.1, 0.1]}
              fontSize={0.65}
              fontWeight={900}
              color="white"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.1}
              outlineColor="#000000"
              letterSpacing={0.12}
            >
              {name}
            </Text>

            {/* Subtitle */}
            <Text
              position={[0, -0.55, 0.1]}
              fontSize={0.26}
              color={hovered ? '#ffffff' : accent}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.25}
              fontWeight={700}
              outlineWidth={0.035}
              outlineColor="#000000"
            >
              {`[ ${subtitle} ]`}
            </Text>
          </Billboard>

          {/* Energy Bar */}
          <Billboard position={[0, -3.5, 0]}>
            {/* Bar Background */}
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[3.2, 0.18]} />
              <meshStandardMaterial
                color="#0a0a0a"
                transparent
                opacity={0.9}
                roughness={0.1}
                metalness={0.8}
              />
            </mesh>

            {/* Bar Border Glow */}
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[3.3, 0.22]} />
              <meshStandardMaterial
                color={accent}
                emissive={accent}
                emissiveIntensity={0.5}
                transparent
                opacity={0.4}
                side={THREE.BackSide}
              />
            </mesh>

            {/* Energy Fill */}
            <mesh position={[-(3.2 * (1 - energy)) / 2, 0, 0.01]}>
              <planeGeometry args={[3.2 * energy, 0.16]} />
              <meshStandardMaterial
                color={accent}
                emissive={accent}
                emissiveIntensity={2.5}
                transparent
                opacity={0.95}
                roughness={0}
                metalness={1}
              />
            </mesh>

            {/* Energy Highlight */}
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[3.2 * energy, 0.08]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={1.5}
                transparent
                opacity={0.4}
              />
            </mesh>

            {/* Percentage Text */}
            <Text
              position={[0, 0, 0.03]}
              fontSize={0.2}
              color="white"
              anchorX="center"
              anchorY="middle"
              fontWeight={900}
              outlineWidth={0.025}
              outlineColor="#000000"
            >
              {`${Math.round(energy * 100)}%`}
            </Text>
          </Billboard>

          {/* Trail Effect */}
          {active && (
            <Trail
              width={3}
              length={8}
              color={new THREE.Color(accent)}
              attenuation={(t) => t * t}
            >
              <Sphere args={[0.15, 16, 16]}>
                <meshStandardMaterial
                  color={accent}
                  emissive={accent}
                  emissiveIntensity={3}
                />
              </Sphere>
            </Trail>
          )}
        </Float>
      </group>
    </RigidBody>
  )
})

// ============================================================================
// ENHANCED ENERGY LINKS WITH ANIMATION
// ============================================================================

const EnhancedEnergyLinks = React.memo(() => {
  const linesRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!linesRef.current) return

    linesRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Line) {
        const material = child.material as THREE.LineBasicMaterial
        const wave = Math.sin(state.clock.elapsedTime * 2 + i * 0.3) * 0.5 + 0.5
        material.opacity = 0.3 + wave * 0.4
        material.color.setHSL(
          (state.clock.elapsedTime * 0.1 + i * 0.1) % 1,
          0.8,
          0.6
        )
      }
    })
  })

  const lines = useMemo(
    () =>
      LINKS.map(([s, e]) => ({
        start: new THREE.Vector3(
          ...(NODES[s].position as [number, number, number])
        ),
        end: new THREE.Vector3(
          ...(NODES[e].position as [number, number, number])
        ),
        color: NODES[s].accent,
      })),
    []
  )

  return (
    <group ref={linesRef}>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={[line.start, line.end]}
          color={line.color}
          lineWidth={2.5}
          transparent
          opacity={0.4}
          dashed
          dashScale={20}
          dashSize={1}
          gapSize={0.5}
        />
      ))}
    </group>
  )
})

// ============================================================================
// DATA CONFIGURATION
// ============================================================================

const NODES = [
  {
    name: 'KETHER',
    subtitle: 'CROWN',
    position: [0, 10, 0],
    color: '#ffffff',
    accent: '#a5f3fc',
    route: '/home',
    energy: 1.0,
  },
  {
    name: 'TIPHERET',
    subtitle: 'BEAUTY',
    position: [0, 0, 0],
    color: '#fde68a',
    accent: '#f59e0b',
    route: '/audiovisuel',
    energy: 0.9,
  },
  {
    name: 'YESOD',
    subtitle: 'FOUNDATION',
    position: [0, -7, 0],
    color: '#d8b4fe',
    accent: '#9333ea',
    route: '/communautes',
    energy: 0.7,
  },
  {
    name: 'MALKUTH',
    subtitle: 'KINGDOM',
    position: [0, -12, 0],
    color: '#a8a29e',
    accent: '#57534e',
    route: '/communautes',
    energy: 0.5,
  },
  {
    name: 'CHOKHMAH',
    subtitle: 'WISDOM',
    position: [6, 7, 0],
    color: '#e2e8f0',
    accent: '#38bdf8',
    route: '/ia',
    energy: 0.95,
  },
  {
    name: 'CHESED',
    subtitle: 'MERCY',
    position: [6, 1, 0],
    color: '#bfdbfe',
    accent: '#3b82f6',
    route: '/terminal',
    energy: 0.85,
  },
  {
    name: 'NETZACH',
    subtitle: 'VICTORY',
    position: [5, -5, 0],
    color: '#86efac',
    accent: '#10b981',
    route: '/terminal',
    energy: 0.75,
  },
  {
    name: 'BINAH',
    subtitle: 'INTELLECT',
    position: [-6, 7, 0],
    color: '#cbd5e1',
    accent: '#94a3b8',
    route: '/politique',
    energy: 0.9,
  },
  {
    name: 'GEVURAH',
    subtitle: 'STRENGTH',
    position: [-6, 1, 0],
    color: '#fca5a5',
    accent: '#ef4444',
    route: '/terminal',
    energy: 0.8,
  },
  {
    name: 'HOD',
    subtitle: 'GLORY',
    position: [-5, -5, 0],
    color: '#fdba74',
    accent: '#f97316',
    route: '/politique',
    energy: 0.7,
  },
]

const LINKS = [
  [0, 4],
  [4, 7],
  [7, 5],
  [5, 8],
  [8, 1],
  [1, 6],
  [6, 9],
  [9, 2],
  [2, 3],
  [0, 7],
  [0, 1],
  [4, 1],
  [7, 1],
  [5, 1],
  [8, 1],
  [6, 2],
  [9, 2],
  [5, 6],
  [8, 9],
]

// ============================================================================
// MAIN COMPONENT - ULTRA ENHANCED
// ============================================================================

export default function SephirotTree3DEnhanced() {
  const router = useRouter()
  const soundManager = useMemo(() => getSoundManager(), [])

  useEffect(() => {
    // Preload sounds
    soundManager.preloadSounds()

    // Start ambient
    soundManager.playAmbient(['/sounds/ambient-space.mp3'], 0.2)

    return () => {
      soundManager.stopAmbient()
    }
  }, [soundManager])

  const handleNodeClick = useCallback(
    (route: string) => {
      router.push(route)
    },
    [router]
  )

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%)',
      }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 50], fov: 50 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        performance={{ min: 0.5, max: 1 }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000510', 70, 200]} />

        {/* Advanced Lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[40, 40, 40]}
          intensity={2}
          color="#60a5fa"
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight
          position={[-40, -40, 40]}
          intensity={1.5}
          color="#a855f7"
        />
        <pointLight position={[0, 0, 30]} intensity={2} color="#ffffff" />
        <spotLight
          position={[0, 45, 25]}
          intensity={2.5}
          angle={0.3}
          penumbra={0.5}
          color="#3a86ff"
          castShadow
        />

        {/* Environment & Sky */}
        <Suspense fallback={null}>
          <Environment preset="night" />
          <Sky
            distance={450000}
            sunPosition={[0, 1, 0]}
            inclination={0.6}
            azimuth={0.25}
            mieCoefficient={0.005}
            mieDirectionalG={0.8}
            rayleigh={0.5}
          />
          <Stars
            radius={100}
            depth={50}
            count={10000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
        </Suspense>

        {/* Physics */}
        <Physics gravity={[0, 0, 0]}>
          {/* Particles */}
          <PhysicsParticles count={500} />

          {/* Sephirot Tree */}
          <group position={[0, 2, 0]}>
            <EnhancedEnergyLinks />
            {NODES.map((node, i) => (
              <EnhancedCrystalNode
                key={i}
                {...node}
                onClick={handleNodeClick}
              />
            ))}
          </group>
        </Physics>

        {/* Contact Shadows */}
        <ContactShadows
          position={[0, -15, 0]}
          opacity={0.4}
          scale={100}
          blur={2}
          far={50}
        />

        {/* Post-Processing */}
        <EffectComposer multisampling={4}>
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            mipmapBlur
            radius={0.6}
          />
          <ChromaticAberration
            offset={[0.0005, 0.0005]}
            blendFunction={BlendFunction.NORMAL}
          />
          <Vignette
            offset={0.3}
            darkness={0.6}
            blendFunction={BlendFunction.NORMAL}
          />
          <DepthOfField
            focusDistance={0}
            focalLength={0.02}
            bokehScale={2}
            height={480}
          />
          <N8AO
            aoRadius={5}
            intensity={1.5}
            color="#000000"
            quality="high"
          />
        </EffectComposer>

        {/* Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          autoRotate
          autoRotateSpeed={0.08}
          maxDistance={90}
          minDistance={20}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3.5}
          rotateSpeed={0.4}
          zoomSpeed={0.6}
          makeDefault
        />
      </Canvas>
    </div>
  )
}
