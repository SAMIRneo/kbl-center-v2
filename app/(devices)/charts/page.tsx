'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Text, Billboard, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useRef, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react'

// ═══════════════════════════════════════════════════════════
// PARTIE 1 : ANIMATION 3D STONKS/DOWNS (HAUT - 50vh)
// ═══════════════════════════════════════════════════════════

// Nuage de données flottantes
function DataParticles() {
  const count = 500
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2
      const r = 15 + Math.random() * 20
      const h = (Math.random() - 0.5) * 30
      temp.push({
        position: new THREE.Vector3(
          Math.cos(t) * r,
          h,
          Math.sin(t) * r
        ),
        speed: 0.5 + Math.random() * 1.5,
        scale: 0.1 + Math.random() * 0.3,
      })
    }
    return temp
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime

    particles.forEach((particle, i) => {
      const matrix = new THREE.Matrix4()
      const y = particle.position.y + Math.sin(time * particle.speed + i) * 0.5
      matrix.setPosition(particle.position.x, y, particle.position.z)
      matrix.scale(new THREE.Vector3(particle.scale, particle.scale, particle.scale))
      meshRef.current.setMatrixAt(i, matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#00ff88"
        emissive="#00ff88"
        emissiveIntensity={2}
        transparent
        opacity={0.6}
      />
    </instancedMesh>
  )
}

// Flèche STONKS (montante) - CORRIGÉE
function StonksArrow() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.y = Math.sin(t * 0.8) * 2
    groupRef.current.rotation.y = t * 0.2
  })

  return (
    <Float speed={2} floatIntensity={1}>
      <group ref={groupRef} position={[-8, 0, 0]}>
        {/* Corps de la flèche */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[2, 12, 2]} />
          <meshStandardMaterial
            color="#00ff41"
            emissive="#00ff41"
            emissiveIntensity={3}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Pointe */}
        <mesh position={[0, 8, 0]}>
          <coneGeometry args={[3, 4, 4]} />
          <meshStandardMaterial
            color="#00ff41"
            emissive="#00ff41"
            emissiveIntensity={3}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Texte STONKS - BILLBOARD 2D */}
        <Billboard position={[0, -8, 0]}>
          <Text
            fontSize={1.5}
            color="#00ff41"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.1}
            outlineColor="#000000"
            fontWeight={900}
          >
            STONKS
          </Text>
        </Billboard>

        {/* Particules autour */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2
          const radius = 6
          return (
            <Float key={i} speed={2 + i * 0.1} floatIntensity={2}>
              <mesh position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial
                  color="#00ff88"
                  emissive="#00ff88"
                  emissiveIntensity={3}
                />
              </mesh>
            </Float>
          )
        })}
      </group>
    </Float>
  )
}

// Flèche DOWNS (descendante) - CORRIGÉE
function DownsArrow() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.y = -Math.sin(t * 0.8) * 2
    groupRef.current.rotation.y = -t * 0.2
  })

  return (
    <Float speed={2} floatIntensity={1}>
      <group ref={groupRef} position={[8, 0, 0]}>
        {/* Corps de la flèche */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[2, 12, 2]} />
          <meshStandardMaterial
            color="#ff0044"
            emissive="#ff0044"
            emissiveIntensity={3}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Pointe */}
        <mesh position={[0, -8, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[3, 4, 4]} />
          <meshStandardMaterial
            color="#ff0044"
            emissive="#ff0044"
            emissiveIntensity={3}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Texte DOWNS - BILLBOARD 2D */}
        <Billboard position={[0, 8, 0]}>
          <Text
            fontSize={1.5}
            color="#ff0044"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.1}
            outlineColor="#000000"
            fontWeight={900}
          >
            DOWNS
          </Text>
        </Billboard>

        {/* Particules autour */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2
          const radius = 6
          return (
            <Float key={i} speed={2 + i * 0.1} floatIntensity={2}>
              <mesh position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial
                  color="#ff4488"
                  emissive="#ff4488"
                  emissiveIntensity={3}
                />
              </mesh>
            </Float>
          )
        })}
      </group>
    </Float>
  )
}

// Lignes de données
function DataLines() {
  const linesRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!linesRef.current) return
    linesRef.current.rotation.y = state.clock.elapsedTime * 0.1
  })

  return (
    <group ref={linesRef}>
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2
        const radius = 25
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
            rotation={[0, -angle, 0]}
          >
            <boxGeometry args={[0.1, 40, 0.1]} />
            <meshStandardMaterial
              color="#0088ff"
              emissive="#0088ff"
              emissiveIntensity={1}
              transparent
              opacity={0.3}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// ═══════════════════════════════════════════════════════════
// PARTIE 2 : TRADINGVIEW-LIKE CHART (BAS - 50vh)
// ═══════════════════════════════════════════════════════════

function TradingViewChart() {
  const [timeframe, setTimeframe] = useState('1H')
  const [chartType, setChartType] = useState('candles')

  // Données fictives pour le graphique
  const candleData = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => {
      const base = 45000 + Math.random() * 5000
      return {
        time: i,
        open: base,
        high: base + Math.random() * 1000,
        low: base - Math.random() * 1000,
        close: base + (Math.random() - 0.5) * 1000,
        volume: Math.random() * 100,
      }
    })
  }, [])

  return (
    <div className="w-full h-full bg-[#0d0d0d] rounded-xl overflow-hidden shadow-[0_0_120px_rgba(0,255,136,0.3)] border-2 border-emerald-500/30">
      {/* HEADER */}
      <div className="h-14 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-b-2 border-emerald-500/30 flex items-center justify-between px-6">
        {/* Gauche : Boutons */}
        <div className="flex items-center gap-2">
          <button className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
          <button className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
          <button className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
        </div>

        {/* Centre : Titre */}
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 font-mono font-bold text-sm tracking-wider">
            BTC/USDT
          </span>
          <span className="text-emerald-300 text-sm font-mono">$48,247.82</span>
          <span className="text-emerald-400 text-xs font-mono">+2.34%</span>
        </div>

        {/* Droite : Timeframes */}
        <div className="flex items-center gap-2">
          {['1M', '5M', '15M', '1H', '4H', '1D'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded font-mono text-xs transition-all ${
                timeframe === tf
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'bg-emerald-900/20 text-emerald-400 hover:bg-emerald-900/40'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="h-12 bg-[#0d0d0d] border-b border-emerald-500/20 flex items-center justify-between px-6">
        {/* Type de chart */}
        <div className="flex items-center gap-2">
          {[
            { id: 'candles', icon: Activity, label: 'Candles' },
            { id: 'line', icon: TrendingUp, label: 'Line' },
            { id: 'area', icon: TrendingDown, label: 'Area' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setChartType(id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded font-mono text-xs transition-all ${
                chartType === id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : 'text-emerald-600 hover:text-emerald-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Indicateurs */}
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span>MA(7)</span>
          <span>MA(25)</span>
          <span>MA(99)</span>
          <span className="text-emerald-600">|</span>
          <span>RSI</span>
          <span>MACD</span>
          <span>VOL</span>
        </div>
      </div>

      {/* CHART AREA */}
      <div className="h-[calc(100%-104px)] relative">
        <svg className="w-full h-full">
          {/* Grille */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0,255,136,0.1)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Chandelier */}
          {candleData.map((candle, i) => {
            const x = 50 + i * 30
            const isGreen = candle.close > candle.open
            const color = isGreen ? '#00ff41' : '#ff0044'
            const bodyHeight = Math.abs(candle.close - candle.open) / 100
            const wickHigh = (candle.high - Math.max(candle.open, candle.close)) / 100
            const wickLow = (Math.min(candle.open, candle.close) - candle.low) / 100

            return (
              <g key={i}>
                {/* Wick */}
                <line
                  x1={x}
                  y1={200 - wickHigh - bodyHeight}
                  x2={x}
                  y2={200 + wickLow}
                  stroke={color}
                  strokeWidth="2"
                  opacity="0.6"
                />
                {/* Body */}
                <rect
                  x={x - 8}
                  y={isGreen ? 200 - bodyHeight : 200}
                  width="16"
                  height={bodyHeight}
                  fill={color}
                  opacity="0.9"
                />
              </g>
            )
          })}

          {/* Volume bars */}
          {candleData.map((candle, i) => {
            const x = 50 + i * 30
            const height = candle.volume * 2
            return (
              <rect
                key={`vol-${i}`}
                x={x - 8}
                y={400 - height}
                width="16"
                height={height}
                fill="#0088ff"
                opacity="0.3"
              />
            )
          })}
        </svg>

        {/* Axes de prix */}
        <div className="absolute right-0 top-0 h-full w-20 bg-[#0d0d0d]/90 border-l border-emerald-500/20 flex flex-col justify-between py-4 text-right pr-2">
          {['51000', '49500', '48000', '46500', '45000'].map((price) => (
            <div key={price} className="text-xs font-mono text-emerald-400">
              {price}
            </div>
          ))}
        </div>

        {/* Crosshair */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-px h-full bg-emerald-500/50 absolute left-1/2" />
          <div className="h-px w-full bg-emerald-500/50 absolute top-1/2" />
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL : ASSEMBLAGE
// ═══════════════════════════════════════════════════════════

export default function ChartsDevicePage() {
  return (
    <div className="w-full h-screen bg-black flex flex-col">
      {/* ═══ PARTIE 1 : ANIMATION 3D STONKS/DOWNS (HAUT) ═══ */}
      <div className="w-full h-[50vh] relative">
        <Canvas
          camera={{ position: [0, 0, 30], fov: 60 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
        >
          <color attach="background" args={['#000000']} />
          <fog attach="fog" args={['#000000', 30, 60]} />

          <ambientLight intensity={0.2} />
          <pointLight position={[-15, 0, 0]} intensity={3} color="#00ff41" />
          <pointLight position={[15, 0, 0]} intensity={3} color="#ff0044" />
          <spotLight position={[0, 20, 0]} angle={0.6} intensity={2} color="#0088ff" />

          <Environment preset="night" />
          <DataParticles />
          <DataLines />
          <StonksArrow />
          <DownsArrow />

          <EffectComposer multisampling={4}>
            <Bloom intensity={2} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
            <ChromaticAberration offset={[0.002, 0.002]} />
          </EffectComposer>

          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            autoRotate
            autoRotateSpeed={0.4}
            maxDistance={40}
            minDistance={15}
            enablePan={false}
            makeDefault
          />
        </Canvas>

        {/* Dégradé */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
      </div>

      {/* ═══ PARTIE 2 : TRADINGVIEW CHART (BAS) ═══ */}
      <div className="w-full h-[50vh] p-8 flex items-center justify-center">
        <div className="w-full max-w-7xl h-full">
          <TradingViewChart />
        </div>
      </div>
    </div>
  )
}
