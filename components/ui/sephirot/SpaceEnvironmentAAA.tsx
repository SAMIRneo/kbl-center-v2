// @ts-nocheck
'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// ============================================================================
// VOLUMETRIC NEBULA SHADER - DARK SPACE VERSION
// ============================================================================

const VolumetricNebulaMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(1024, 1024),
    cameraPos: new THREE.Vector3(),
    color1: new THREE.Color('#2a0a3a'),
    color2: new THREE.Color('#1a0a2a'),
    color3: new THREE.Color('#0a0a2a'),
    color4: new THREE.Color('#0a2a1a'),
    density: 0.06,
    brightness: 0.4,
  },
  `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float time;
    uniform vec2 resolution;
    uniform vec3 cameraPos;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    uniform vec3 color4;
    uniform float density;
    uniform float brightness;
    
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    float hash(vec3 p) {
      p = fract(p * 0.3183099 + 0.1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }
    
    float noise(vec3 x) {
      vec3 i = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      
      return mix(
        mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
            mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
            mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
        f.z
      );
    }
    
    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for(int i = 0; i < 3; i++) {
        value += amplitude * noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }
    
    void main() {
      vec2 uv = vUv;
      vec3 rayDir = normalize(vWorldPosition - cameraPos);
      vec3 rayOrigin = vWorldPosition;
      
      float maxDist = 60.0;
      float stepSize = 1.2;
      int steps = 32;
      
      vec3 pos = rayOrigin;
      vec4 accumColor = vec4(0.0);
      
      for(int i = 0; i < steps; i++) {
        if(accumColor.a >= 0.95) break;
        
        float angle = length(pos.xy) * 0.03 + time * 0.015;
        vec3 rotatedPos = vec3(
          cos(angle) * pos.x - sin(angle) * pos.y,
          sin(angle) * pos.x + cos(angle) * pos.y,
          pos.z
        );
        
        float densitySample = fbm(rotatedPos * 0.015 + time * 0.02);
        densitySample = smoothstep(0.4, 0.75, densitySample);
        
        float colorMix = fbm(rotatedPos * 0.02 + time * 0.03);
        
        vec3 nebulaColor = mix(color1, color2, colorMix);
        nebulaColor = mix(nebulaColor, color3, pow(densitySample, 2.0) * 0.4);
        nebulaColor = mix(nebulaColor, color4, sin(angle * 2.0) * 0.5 + 0.5);
        
        float glow = pow(densitySample, 4.0) * 0.8;
        nebulaColor += vec3(glow) * brightness;
        
        float alpha = densitySample * density * stepSize;
        accumColor.rgb += nebulaColor * alpha * (1.0 - accumColor.a);
        accumColor.a += alpha * (1.0 - accumColor.a);
        
        pos += rayDir * stepSize;
      }
      
      float vignette = 1.0 - length(uv - 0.5) * 0.5;
      accumColor.rgb *= vignette;
      
      gl_FragColor = accumColor;
    }
  `
)

extend({ VolumetricNebulaMaterial })

// ============================================================================
// HDR STARFIELD OPTIMISÉ AMD
// ============================================================================

export const HDRStarfield = React.memo(() => {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const count = 18000
  
  const { positions, colors, scales, twinkles } = useMemo(() => {
    const pos = []
    const cols = []
    const scls = []
    const twinks = []
    
    const starTypes = [
      { color: new THREE.Color('#ffffff'), weight: 0.35 },
      { color: new THREE.Color('#fff8f0'), weight: 0.25 },
      { color: new THREE.Color('#ffe8e0'), weight: 0.15 },
      { color: new THREE.Color('#ffd8d8'), weight: 0.1 },
      { color: new THREE.Color('#e0f0ff'), weight: 0.1 },
      { color: new THREE.Color('#d0e0ff'), weight: 0.05 },
    ]
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 120 + Math.random() * 380
      
      pos.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      )
      
      let random = Math.random()
      let selectedColor = starTypes[0].color
      for (const type of starTypes) {
        if (random < type.weight) {
          selectedColor = type.color
          break
        }
        random -= type.weight
      }
      
      const brightness = 0.6 + Math.random() * 0.4
      cols.push(
        selectedColor.r * brightness,
        selectedColor.g * brightness,
        selectedColor.b * brightness
      )
      
      const magnitude = Math.pow(Math.random(), 2)
      scls.push(0.12 + magnitude * 0.5)
      twinks.push(0.4 + Math.random() * 1.8)
    }
    
    return { 
      positions: new Float32Array(pos), 
      colors: new Float32Array(cols), 
      scales: new Float32Array(scls),
      twinkles: new Float32Array(twinks)
    }
  }, [])
  
  React.useEffect(() => {
    if (!meshRef.current) return
    
    const dummy = new THREE.Object3D()
    const geometry = meshRef.current.geometry
    
    for (let i = 0; i < count; i++) {
      dummy.position.fromArray(positions, i * 3)
      dummy.scale.setScalar(scales[i])
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true
    
    geometry.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(colors, 3))
    geometry.setAttribute('instanceTwinkle', new THREE.InstancedBufferAttribute(twinkles, 1))
  }, [positions, colors, scales, twinkles, count])
  
  useFrame((state) => {
    if (!meshRef.current) return
    
    const geometry = meshRef.current.geometry
    const twinkleAttr = geometry.getAttribute('instanceTwinkle')
    
    if (!twinkleAttr || !twinkleAttr.array) return
    
    for (let i = 0; i < count; i += 60) {
      const twinkleSpeed = twinkleAttr.array[i]
      const twinkle = Math.sin(state.clock.elapsedTime * twinkleSpeed + i) * 0.5 + 0.5
      
      const dummy = new THREE.Object3D()
      meshRef.current.getMatrixAt(i, dummy.matrix)
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale)
      
      const baseScale = scales[i]
      dummy.scale.setScalar(baseScale * (0.65 + twinkle * 0.35))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true
  })
  
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.07, 6, 6]} />
      <meshBasicMaterial
        vertexColors
        transparent
        opacity={0.92}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </instancedMesh>
  )
})

// ============================================================================
// ANNEAUX PLANÉTAIRES OPTIMISÉS
// ============================================================================

export const AnimatedPlanetaryRings = React.memo(({ position = [0, 0, 0], scale = 1 }: any) => {
  const ringsGroup = useRef<THREE.Group>(null!)
  
  const ringConfigs = useMemo(() => [
    { 
      innerRadius: 20 * scale, 
      outerRadius: 24 * scale, 
      color: '#00dddd', 
      emissive: '#00aaaa', 
      speed: 0.0006,
      particles: 600,
      opacity: 0.22,
      segments: 96
    },
    { 
      innerRadius: 26 * scale, 
      outerRadius: 30 * scale, 
      color: '#dd00dd', 
      emissive: '#aa00aa', 
      speed: 0.0005,
      particles: 800,
      opacity: 0.18,
      segments: 96
    },
    { 
      innerRadius: 32 * scale, 
      outerRadius: 36 * scale, 
      color: '#dddd00', 
      emissive: '#aaaa00', 
      speed: 0.0003,
      particles: 1000,
      opacity: 0.15,
      segments: 96
    },
  ], [scale])
  
  useFrame((state) => {
    if (!ringsGroup.current) return
    
    ringsGroup.current.rotation.y += 0.001
    
    ringsGroup.current.children.forEach((child, i) => {
      const config = ringConfigs[i]
      if (!config) return
      
      child.rotation.z += config.speed
      
      const wave = Math.sin(state.clock.elapsedTime * 0.25 + i * 0.4) * 0.025
      child.scale.setScalar(1 + wave)
      
      const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
      if (material && material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.9 + Math.sin(state.clock.elapsedTime * 0.4 + i) * 0.25
      }
    })
  })
  
  return (
    <group ref={ringsGroup} position={position}>
      {ringConfigs.map((config, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * Math.PI / 6]}>
          <torusGeometry 
            args={[
              (config.innerRadius + config.outerRadius) / 2, 
              (config.outerRadius - config.innerRadius) / 2, 
              24, 
              config.segments
            ]} 
          />
          <meshStandardMaterial
            color={config.color}
            emissive={config.emissive}
            emissiveIntensity={1}
            transparent
            opacity={config.opacity}
            roughness={0.15}
            metalness={0.7}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      
      {ringConfigs.map((config, ringIndex) => (
        <RingParticles key={`particles-${ringIndex}`} config={config} ringIndex={ringIndex} />
      ))}
    </group>
  )
})

const RingParticles = React.memo(({ config, ringIndex }: any) => {
  const particlesRef = useRef<THREE.Points>(null!)
  
  const { positions, colors, sizes } = useMemo(() => {
    const pos = []
    const cols = []
    const szs = []
    
    const color = new THREE.Color(config.color)
    
    for (let i = 0; i < config.particles; i++) {
      const angle = (i / config.particles) * Math.PI * 2
      const radius = config.innerRadius + Math.random() * (config.outerRadius - config.innerRadius)
      const height = (Math.random() - 0.5) * 0.25
      
      pos.push(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      )
      
      const brightness = 0.5 + Math.random() * 0.5
      cols.push(color.r * brightness, color.g * brightness, color.b * brightness)
      szs.push(0.15 + Math.random() * 0.25)
    }
    
    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(cols),
      sizes: new Float32Array(szs)
    }
  }, [config])
  
  useFrame((state) => {
    if (!particlesRef.current) return
    
    const rotation = state.clock.elapsedTime * config.speed * 1.8
    particlesRef.current.rotation.y = rotation + ringIndex * 0.4
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={config.particles} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={config.particles} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={config.particles} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
})

// ============================================================================
// VOLUMETRIC NEBULA BACKGROUND
// ============================================================================

export const VolumetricNebula = React.memo(() => {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (!meshRef.current?.material) return
    
    const material = meshRef.current.material as any
    material.uniforms.time.value = state.clock.elapsedTime
    material.uniforms.cameraPos.value.copy(state.camera.position)
    
    meshRef.current.rotation.z += 0.00003
  })
  
  return (
    <mesh ref={meshRef} position={[0, 0, -90]} scale={220}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <volumetricNebulaMaterial
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  )
})

// ============================================================================
// DUST CLOUDS OPTIMISÉS
// ============================================================================

export const CosmicDustClouds = React.memo(() => {
  const count = 3500
  const pointsRef = useRef<THREE.Points>(null!)
  
  const { positions, colors, sizes } = useMemo(() => {
    const pos = []
    const cols = []
    const szs = []
    
    const palette = [
      new THREE.Color('#3a1a3a'),
      new THREE.Color('#1a2a3a'),
      new THREE.Color('#2a1a2a'),
    ]
    
    for (let i = 0; i < count; i++) {
      const clusterX = (Math.random() - 0.5) * 250
      const clusterY = (Math.random() - 0.5) * 80
      const clusterZ = (Math.random() - 0.5) * 250
      
      pos.push(
        clusterX + (Math.random() - 0.5) * 35,
        clusterY + (Math.random() - 0.5) * 18,
        clusterZ + (Math.random() - 0.5) * 35
      )
      
      const color = palette[Math.floor(Math.random() * palette.length)]
      cols.push(color.r, color.g, color.b)
      szs.push(0.8 + Math.random() * 2.5)
    }
    
    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(cols),
      sizes: new Float32Array(szs)
    }
  }, [])
  
  useFrame((state) => {
    if (!pointsRef.current) return
    
    pointsRef.current.rotation.y += 0.00012
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.015) * 0.04
  })
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={1.2}
        vertexColors
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
})

// ============================================================================
// ENVIRONNEMENT COMPLET OPTIMISÉ AMD
// ============================================================================

export const SpaceEnvironmentAAA = React.memo(() => {
  return (
    <>
      <VolumetricNebula />
      <HDRStarfield />
      <CosmicDustClouds />
      <AnimatedPlanetaryRings position={[0, 0, 0]} scale={1} />
      <fog attach="fog" args={['#000000', 40, 450]} />
    </>
  )
})

export default SpaceEnvironmentAAA
