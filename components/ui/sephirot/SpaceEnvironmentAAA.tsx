// @ts-nocheck
'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'

// ============================================================================
// VOLUMETRIC NEBULA SHADER
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
// SHADER ANNEAUX HOLOGRAPHIQUES
// ============================================================================

const HolographicRingMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color('#00ffff'),
    opacity: 0.6,
    thickness: 0.5,
    speed: 1.0,
  },
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float time;
    uniform vec3 color;
    uniform float opacity;
    uniform float thickness;
    uniform float speed;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    void main() {
      float angle = atan(vPosition.z, vPosition.x);
      float radius = length(vPosition.xz);
      
      float scanline = sin((angle + time * speed) * 30.0) * 0.5 + 0.5;
      scanline = pow(scanline, 3.0);
      
      float n = noise(vUv * 50.0 + time * 0.5);
      
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.0);
      
      float dataStream = step(0.95, fract((angle + time * speed * 2.0) * 15.0 + n));
      float circuit = step(0.98, sin((vUv.x + time * 0.3) * 80.0)) * step(0.97, cos((vUv.y - time * 0.2) * 60.0));
      
      vec3 finalColor = color;
      finalColor += vec3(scanline) * 0.5;
      finalColor += vec3(dataStream) * color * 2.0;
      finalColor += vec3(circuit) * vec3(1.0, 1.0, 0.5);
      
      float alpha = fresnel * opacity;
      alpha += scanline * 0.3;
      alpha += dataStream * 0.4;
      alpha *= thickness;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
)

extend({ HolographicRingMaterial })

// ============================================================================
// HDR STARFIELD
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
// ANNEAUX HOLOGRAPHIQUES DÉSYNCHRONISÉS
// ============================================================================

export const HolographicRings = React.memo(({ position = [0, 0, 0], scale = 1 }: any) => {
  const ring1Ref = useRef<THREE.Group>(null!)
  const ring2Ref = useRef<THREE.Group>(null!)
  const ring3Ref = useRef<THREE.Group>(null!)
  
  const ringConfigs = useMemo(() => [
    { 
      radius: 22 * scale, 
      thickness: 0.08,
      color: '#00ffff', 
      speed: 0.8,
      opacity: 0.65,
      segments: 256,
      rotationSpeed: 0.003,
      tiltX: 0.2,
      tiltZ: 0.1
    },
    { 
      radius: 28 * scale, 
      thickness: 0.1,
      color: '#ff00ff', 
      speed: 0.6,
      opacity: 0.55,
      segments: 256,
      rotationSpeed: -0.002,
      tiltX: -0.15,
      tiltZ: 0.3
    },
    { 
      radius: 34 * scale, 
      thickness: 0.12,
      color: '#ffff00', 
      speed: 0.4,
      opacity: 0.45,
      segments: 256,
      rotationSpeed: 0.0015,
      tiltX: 0.25,
      tiltZ: -0.2
    },
  ], [scale])
  
  useFrame((state) => {
    const refs = [ring1Ref, ring2Ref, ring3Ref]
    
    refs.forEach((ref, i) => {
      if (!ref.current) return
      
      const config = ringConfigs[i]
      
      // Rotation désynchronisée autour de Y (orbite)
      ref.current.rotation.y += config.rotationSpeed
      
      // Rotation propre du mesh (texture holographique)
      if (ref.current.children[0]) {
        ref.current.children[0].rotation.z += config.speed * 0.001
      }
      
      // Oscillation subtile
      const wave = Math.sin(state.clock.elapsedTime * 0.3 + i * 0.5) * 0.02
      ref.current.scale.setScalar(1 + wave)
      
      // Update shader uniforms
      const material = (ref.current.children[0] as THREE.Mesh)?.material as any
      if (material?.uniforms) {
        material.uniforms.time.value = state.clock.elapsedTime
      }
    })
  })
  
  return (
    <group position={position}>
      {/* Anneau 1 - Cyan */}
      <group 
        ref={ring1Ref} 
        rotation={[Math.PI / 2 + ringConfigs[0].tiltX, 0, ringConfigs[0].tiltZ]}
      >
        <mesh>
          <torusGeometry args={[ringConfigs[0].radius, ringConfigs[0].thickness, 8, ringConfigs[0].segments]} />
          <holographicRingMaterial
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            color={ringConfigs[0].color}
            opacity={ringConfigs[0].opacity}
            thickness={1.0}
            speed={ringConfigs[0].speed}
          />
        </mesh>
      </group>
      
      {/* Anneau 2 - Magenta */}
      <group 
        ref={ring2Ref} 
        rotation={[Math.PI / 2 + ringConfigs[1].tiltX, 0, ringConfigs[1].tiltZ]}
      >
        <mesh>
          <torusGeometry args={[ringConfigs[1].radius, ringConfigs[1].thickness, 8, ringConfigs[1].segments]} />
          <holographicRingMaterial
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            color={ringConfigs[1].color}
            opacity={ringConfigs[1].opacity}
            thickness={1.0}
            speed={ringConfigs[1].speed}
          />
        </mesh>
      </group>
      
      {/* Anneau 3 - Jaune */}
      <group 
        ref={ring3Ref} 
        rotation={[Math.PI / 2 + ringConfigs[2].tiltX, 0, ringConfigs[2].tiltZ]}
      >
        <mesh>
          <torusGeometry args={[ringConfigs[2].radius, ringConfigs[2].thickness, 8, ringConfigs[2].segments]} />
          <holographicRingMaterial
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            color={ringConfigs[2].color}
            opacity={ringConfigs[2].opacity}
            thickness={1.0}
            speed={ringConfigs[2].speed}
          />
        </mesh>
      </group>
    </group>
  )
})

// ============================================================================
// TROU NOIR DIVIN
// ============================================================================

export const DivineBlackHole = React.memo(() => {
  const diskRef = useRef<THREE.Mesh>(null!)
  const lensRef = useRef<THREE.Mesh>(null!)
  const jetRef = useRef<THREE.Points>(null!)
  
  // Particules du disque d'accrétion
  const diskParticles = useMemo(() => {
    const count = 2000
    const positions = []
    const colors = []
    const sizes = []
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 6 + Math.random() * 8
      const height = (Math.random() - 0.5) * 0.5
      
      positions.push(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      )
      
      const temp = radius / 14
      colors.push(
        1.0,
        0.3 + temp * 0.7,
        temp * 0.5
      )
      
      sizes.push(0.2 + Math.random() * 0.4)
    }
    
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      sizes: new Float32Array(sizes),
      count
    }
  }, [])
  
  useFrame((state) => {
    const t = state.clock.elapsedTime
    
    // Rotation du disque d'accrétion
    if (diskRef.current) {
      diskRef.current.rotation.y += 0.015
    }
    
    // Pulsation de la lentille gravitationnelle
    if (lensRef.current) {
      const pulse = 1 + Math.sin(t * 0.8) * 0.08
      lensRef.current.scale.setScalar(pulse)
    }
  })
  
  return (
    <group position={[-65, -30, -90]}>
      {/* Singularité noire */}
      <Sphere args={[3.5, 64, 64]}>
        <meshStandardMaterial
          color="#000000"
          metalness={1}
          roughness={0}
          emissive="#000000"
        />
      </Sphere>
      
      {/* Lentille gravitationnelle */}
      <Sphere ref={lensRef} args={[5.5, 64, 64]}>
        <meshStandardMaterial
          color="#1a0a3a"
          emissive="#3730a3"
          emissiveIntensity={0.5}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          roughness={0}
        />
      </Sphere>
      
      {/* Disque d'accrétion (particules) */}
      <points ref={diskRef} rotation={[Math.PI / 2.2, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            count={diskParticles.count} 
            array={diskParticles.positions} 
            itemSize={3} 
          />
          <bufferAttribute 
            attach="attributes-color" 
            count={diskParticles.count} 
            array={diskParticles.colors} 
            itemSize={3} 
          />
          <bufferAttribute 
            attach="attributes-size" 
            count={diskParticles.count} 
            array={diskParticles.sizes} 
            itemSize={1} 
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      
      {/* Anneau principal du disque */}
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[10, 0.8, 16, 128]} />
        <meshStandardMaterial
          color="#ff4500"
          emissive="#ff6b35"
          emissiveIntensity={1.8}
          transparent
          opacity={0.4}
          roughness={0.2}
          metalness={0.8}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
})

// ============================================================================
// SUPERNOVA EXPLOSIVE
// ============================================================================

export const ExplodingSupernova = React.memo(() => {
  const coreRef = useRef<THREE.Mesh>(null!)
  const layer1Ref = useRef<THREE.Mesh>(null!)
  const layer2Ref = useRef<THREE.Mesh>(null!)
  const layer3Ref = useRef<THREE.Mesh>(null!)
  const debrisRef = useRef<THREE.Points>(null!)
  
  const debris = useMemo(() => {
    const count = 1500
    const positions = []
    const colors = []
    const sizes = []
    const velocities = []
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const speed = 0.5 + Math.random() * 1.5
      
      positions.push(0, 0, 0)
      
      velocities.push(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.sin(phi) * Math.sin(theta) * speed,
        Math.cos(phi) * speed
      )
      
      const temp = Math.random()
      if (temp > 0.7) {
        colors.push(1.0, 1.0, 0.9) // Blanc chaud
      } else if (temp > 0.4) {
        colors.push(1.0, 0.5, 0.1) // Orange
      } else {
        colors.push(1.0, 0.2, 0.0) // Rouge
      }
      
      sizes.push(0.3 + Math.random() * 0.8)
    }
    
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      sizes: new Float32Array(sizes),
      velocities,
      count
    }
  }, [])
  
  useFrame((state) => {
    const t = state.clock.elapsedTime
    
    // Pulsation du noyau
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 2) * 0.15
      coreRef.current.scale.setScalar(pulse)
      
      const material = coreRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = 3 + Math.sin(t * 3) * 0.8
    }
    
    // Expansion des couches
    if (layer1Ref.current) {
      const expand1 = 1 + Math.sin(t * 0.5) * 0.3
      layer1Ref.current.scale.setScalar(expand1)
      layer1Ref.current.rotation.z += 0.002
    }
    
    if (layer2Ref.current) {
      const expand2 = 1 + Math.sin(t * 0.4 + 0.5) * 0.4
      layer2Ref.current.scale.setScalar(expand2)
      layer2Ref.current.rotation.z -= 0.003
    }
    
    if (layer3Ref.current) {
      const expand3 = 1 + Math.sin(t * 0.3 + 1) * 0.5
      layer3Ref.current.scale.setScalar(expand3)
      layer3Ref.current.rotation.z += 0.001
    }
    
    // Animation des débris
    if (debrisRef.current) {
      const positions = debrisRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < debris.count; i++) {
        const expansion = (Math.sin(t * 0.2) + 1) * 3
        positions[i * 3] = debris.velocities[i * 3] * expansion
        positions[i * 3 + 1] = debris.velocities[i * 3 + 1] * expansion
        positions[i * 3 + 2] = debris.velocities[i * 3 + 2] * expansion
      }
      
      debrisRef.current.geometry.attributes.position.needsUpdate = true
      debrisRef.current.rotation.y += 0.001
    }
  })
  
  return (
    <group position={[70, 35, -100]}>
      {/* Noyau ultra-brillant */}
      <Sphere ref={coreRef} args={[2, 32, 32]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffff99"
          emissiveIntensity={3.5}
          roughness={0}
          metalness={1}
        />
      </Sphere>
      
      {/* Couche 1 - Plasma blanc */}
      <Sphere ref={layer1Ref} args={[3.5, 32, 32]}>
        <meshStandardMaterial
          color="#fff9e6"
          emissive="#ffffcc"
          emissiveIntensity={2.2}
          transparent
          opacity={0.5}
          side={THREE.BackSide}
          roughness={0}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Couche 2 - Orange incandescent */}
      <Sphere ref={layer2Ref} args={[5.5, 32, 32]}>
        <meshStandardMaterial
          color="#ffcc66"
          emissive="#ff9933"
          emissiveIntensity={1.8}
          transparent
          opacity={0.4}
          side={THREE.BackSide}
          roughness={0}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Couche 3 - Rouge extérieur */}
      <Sphere ref={layer3Ref} args={[8, 32, 32]}>
        <meshStandardMaterial
          color="#ff6633"
          emissive="#ff3300"
          emissiveIntensity={1.3}
          transparent
          opacity={0.25}
          side={THREE.BackSide}
          roughness={0}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Débris éjectés */}
      <points ref={debrisRef}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            count={debris.count} 
            array={debris.positions} 
            itemSize={3} 
          />
          <bufferAttribute 
            attach="attributes-color" 
            count={debris.count} 
            array={debris.colors} 
            itemSize={3} 
          />
          <bufferAttribute 
            attach="attributes-size" 
            count={debris.count} 
            array={debris.sizes} 
            itemSize={1} 
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          vertexColors
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  )
})

// ============================================================================
// ASTEROÏDES
// ============================================================================

export const AsteroidField = React.memo(() => {
  const count = 150
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  
  const { positions, rotations, scales } = useMemo(() => {
    const pos = []
    const rots = []
    const scls = []
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 80 + Math.random() * 180
      const height = (Math.random() - 0.5) * 60
      
      pos.push(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      )
      
      rots.push(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      
      scls.push(0.3 + Math.random() * 1.2)
    }
    
    return {
      positions: new Float32Array(pos),
      rotations: new Float32Array(rots),
      scales: new Float32Array(scls)
    }
  }, [])
  
  React.useEffect(() => {
    if (!meshRef.current) return
    
    const dummy = new THREE.Object3D()
    
    for (let i = 0; i < count; i++) {
      dummy.position.fromArray(positions, i * 3)
      dummy.rotation.set(rotations[i * 3], rotations[i * 3 + 1], rotations[i * 3 + 2])
      dummy.scale.setScalar(scales[i])
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [positions, rotations, scales])
  
  useFrame(() => {
    if (!meshRef.current) return
    
    for (let i = 0; i < count; i += 10) {
      const dummy = new THREE.Object3D()
      meshRef.current.getMatrixAt(i, dummy.matrix)
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale)
      
      dummy.rotation.x += 0.001
      dummy.rotation.y += 0.002
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true
  })
  
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#4a4a4a"
        roughness={0.9}
        metalness={0.3}
        emissive="#1a1a1a"
        emissiveIntensity={0.2}
      />
    </instancedMesh>
  )
})

// ============================================================================
// RAYONS COSMIQUES
// ============================================================================

export const CosmicRays = React.memo(() => {
  const count = 30
  const linesRef = useRef<THREE.Group>(null!)
  
  const lines = useMemo(() => {
    const result = []
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const distance = 60 + Math.random() * 100
      
      const start = new THREE.Vector3(
        Math.cos(angle) * distance,
        (Math.random() - 0.5) * 50,
        Math.sin(angle) * distance
      )
      
      const end = start.clone().multiplyScalar(2.5)
      
      result.push({
        start,
        end,
        color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
        width: 0.5 + Math.random() * 1.5,
        speed: 0.5 + Math.random()
      })
    }
    
    return result
  }, [])
  
  useFrame((state) => {
    if (!linesRef.current) return
    
    linesRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Line) {
        const material = child.material as THREE.LineBasicMaterial
        const line = lines[i]
        material.opacity = 0.2 + Math.sin(state.clock.elapsedTime * line.speed + i) * 0.15
      }
    })
  })
  
  return (
    <group ref={linesRef}>
      {lines.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...line.start.toArray(), ...line.end.toArray()])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={line.color}
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
            linewidth={line.width}
          />
        </line>
      ))}
    </group>
  )
})

// ============================================================================
// VOLUMETRIC NEBULA
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
// DUST CLOUDS
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
// ENVIRONNEMENT COMPLET
// ============================================================================

export const SpaceEnvironmentAAA = React.memo(() => {
  return (
    <>
      <VolumetricNebula />
      <HDRStarfield />
      <CosmicDustClouds />
      <HolographicRings position={[0, 0, 0]} scale={1} />
      <AsteroidField />
      <CosmicRays />
      <DivineBlackHole />
      <ExplodingSupernova />
      <fog attach="fog" args={['#000000', 40, 450]} />
    </>
  )
})

export default SpaceEnvironmentAAA
