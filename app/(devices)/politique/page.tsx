'use client'

import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Float, Sphere, MeshDistortMaterial, Html } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useRef, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, AlertCircle, TrendingUp, Zap, Eye, Shield, ChevronRight } from 'lucide-react'

// ═══════════════════════════════════════════════════════════
// PARTIE 1 : GLOBE INTERACTIF 3D (HAUT - 50vh)
// ═══════════════════════════════════════════════════════════

// Point d'intérêt sur le globe
interface HotspotProps {
  position: [number, number, number]
  color: string
  label: string
  intensity: number
}

function Hotspot({ position, color, label, intensity }: HotspotProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.scale.setScalar(1 + Math.sin(t * 2 + position[0]) * 0.3)
  })

  return (
    <group position={position}>
      <Float speed={2} floatIntensity={1}>
        <mesh
          ref={meshRef}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={intensity * 3}
          />
        </mesh>

        {/* Aura */}
        <Sphere args={[0.3, 16, 16]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={intensity}
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </Sphere>

        {/* Label on hover */}
        {hovered && (
          <Html position={[0, 0.5, 0]} center>
            <div className="bg-black/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20 whitespace-nowrap">
              <p className="text-white text-xs font-mono font-bold">{label}</p>
            </div>
          </Html>
        )}
      </Float>

      {/* Rayon vertical */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 4, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity * 2}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  )
}

// Globe principal
function InteractiveGlobe() {
  const globeRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!globeRef.current) return
    globeRef.current.rotation.y += 0.001
  })

  // Points d'intérêt (coordonnées sphériques converties)
  const hotspots = useMemo(() => {
    return [
      { lat: 40.7128, lon: -74.006, label: 'New York', color: '#ff0044', intensity: 1.0 },
      { lat: 51.5074, lon: -0.1278, label: 'London', color: '#ff8800', intensity: 0.8 },
      { lat: 35.6762, lon: 139.6503, label: 'Tokyo', color: '#00ff88', intensity: 0.9 },
      { lat: 48.8566, lon: 2.3522, label: 'Paris', color: '#0088ff', intensity: 0.7 },
      { lat: 55.7558, lon: 37.6173, label: 'Moscow', color: '#ff00ff', intensity: 0.85 },
      { lat: 39.9042, lon: 116.4074, label: 'Beijing', color: '#ffff00', intensity: 0.95 },
      { lat: -33.8688, lon: 151.2093, label: 'Sydney', color: '#00ffff', intensity: 0.6 },
      { lat: 19.4326, lon: -99.1332, label: 'Mexico City', color: '#ff4488', intensity: 0.75 },
    ].map(({ lat, lon, label, color, intensity }) => {
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lon + 180) * (Math.PI / 180)
      const radius = 5.2
      
      return {
        position: [
          -(radius * Math.sin(phi) * Math.cos(theta)),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta),
        ] as [number, number, number],
        label,
        color,
        intensity,
      }
    })
  }, [])

  return (
    <group>
      {/* Globe terrestre */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[5, 64, 64]} />
        <MeshDistortMaterial
          color="#1a1a2e"
          emissive="#0f0f1e"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.2}
          distort={0.1}
          speed={1}
        />
      </mesh>

      {/* Grille géographique */}
      <mesh>
        <sphereGeometry args={[5.05, 32, 32]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Hotspots */}
      {hotspots.map((hotspot, i) => (
        <Hotspot key={i} {...hotspot} />
      ))}

      {/* Atmosphère */}
      <Sphere args={[5.5, 64, 64]}>
        <meshStandardMaterial
          color="#0088ff"
          emissive="#0088ff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  )
}

// Artefacts flottants
function FloatingArtifacts() {
  const count = 30
  
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        const radius = 10 + Math.random() * 5
        const height = (Math.random() - 0.5) * 10
        
        return (
          <Float key={i} speed={1 + Math.random()} floatIntensity={2}>
            <mesh position={[Math.cos(angle) * radius, height, Math.sin(angle) * radius]}>
              <octahedronGeometry args={[0.3, 0]} />
              <meshStandardMaterial
                color="#00ff88"
                emissive="#00ff88"
                emissiveIntensity={2}
                transparent
                opacity={0.6}
              />
            </mesh>
          </Float>
        )
      })}
    </group>
  )
}

// ═══════════════════════════════════════════════════════════
// PARTIE 2 : FEED D'ARTICLES (BAS - 50vh)
// ═══════════════════════════════════════════════════════════

interface Article {
  id: number
  title: string
  summary: string
  category: 'critical' | 'high' | 'medium' | 'low'
  source: string
  time: string
  tags: string[]
}

function ArticlesFeed() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const articles: Article[] = [
    {
      id: 1,
      title: 'Global Economic Summit Reveals Shocking Realignment',
      summary: 'Major powers announce unprecedented cooperation on digital currencies and trade regulations.',
      category: 'critical',
      source: 'Reuters',
      time: '2h ago',
      tags: ['Economy', 'G20', 'Finance'],
    },
    {
      id: 2,
      title: 'Cyber Security Breach Affects Multiple Government Agencies',
      summary: 'Advanced persistent threat detected across infrastructure networks in several countries.',
      category: 'critical',
      source: 'CyberNews',
      time: '3h ago',
      tags: ['Security', 'Cyber', 'Government'],
    },
    {
      id: 3,
      title: 'New Climate Accord Signed by 150 Nations',
      summary: 'Historic agreement sets ambitious targets for carbon reduction and renewable energy adoption.',
      category: 'high',
      source: 'UN Press',
      time: '5h ago',
      tags: ['Climate', 'Environment', 'Policy'],
    },
    {
      id: 4,
      title: 'Tech Giants Face Antitrust Investigation',
      summary: 'Regulatory bodies launch coordinated probe into monopolistic practices.',
      category: 'high',
      source: 'TechCrunch',
      time: '6h ago',
      tags: ['Tech', 'Law', 'Business'],
    },
    {
      id: 5,
      title: 'Diplomatic Tensions Ease in Southeast Asia',
      summary: 'Regional leaders reach consensus on maritime boundary disputes.',
      category: 'medium',
      source: 'AP',
      time: '8h ago',
      tags: ['Diplomacy', 'Asia', 'Peace'],
    },
    {
      id: 6,
      title: 'Space Agency Announces Mars Colony Timeline',
      summary: 'Ambitious plan for permanent settlement by 2040 unveiled with private sector partners.',
      category: 'medium',
      source: 'Space.com',
      time: '12h ago',
      tags: ['Space', 'Science', 'Innovation'],
    },
    {
      id: 7,
      title: 'Currency Markets Show Unusual Volatility',
      summary: 'Traders monitor central bank signals amid shifting monetary policy landscape.',
      category: 'low',
      source: 'Bloomberg',
      time: '1d ago',
      tags: ['Finance', 'Markets', 'Currency'],
    },
    {
      id: 8,
      title: 'AI Regulation Framework Proposed by Ethics Committee',
      summary: 'New guidelines aim to balance innovation with safety and transparency.',
      category: 'low',
      source: 'MIT Review',
      time: '1d ago',
      tags: ['AI', 'Ethics', 'Regulation'],
    },
  ]

  const categoryConfig = {
    critical: { color: '#ff0044', icon: AlertCircle, label: 'Critical' },
    high: { color: '#ff8800', icon: TrendingUp, label: 'High' },
    medium: { color: '#ffff00', icon: Eye, label: 'Medium' },
    low: { color: '#00ff88', icon: Shield, label: 'Low' },
  }

  const filteredArticles =
    selectedCategory === 'all'
      ? articles
      : articles.filter((a) => a.category === selectedCategory)

  return (
    <div className="w-full h-full bg-[#0d0d0d] rounded-xl border-2 border-purple-500/30 overflow-hidden">
      {/* HEADER */}
      <div className="h-14 bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-b-2 border-purple-500/30 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-purple-400" />
          <span className="text-purple-400 font-mono font-bold text-sm">GLOBAL INTELLIGENCE FEED</span>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded font-mono text-xs transition-all ${
              selectedCategory === 'all'
                ? 'bg-purple-500 text-black font-bold'
                : 'bg-purple-900/20 text-purple-400 hover:bg-purple-900/40'
            }`}
          >
            ALL
          </button>
          {Object.entries(categoryConfig).map(([key, { color, label }]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3 py-1 rounded font-mono text-xs transition-all ${
                selectedCategory === key
                  ? `bg-[${color}] text-black font-bold`
                  : 'bg-purple-900/20 text-purple-400 hover:bg-purple-900/40'
              }`}
              style={selectedCategory === key ? { backgroundColor: color } : {}}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* FEED D'ARTICLES */}
      <div className="h-[calc(100%-56px)] overflow-y-auto p-6 space-y-4 scroll-smooth">
        <AnimatePresence mode="popLayout">
          {filteredArticles.map((article) => {
            const config = categoryConfig[article.category]
            const Icon = config.icon

            return (
              <motion.div
                key={article.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className="relative group cursor-pointer"
              >
                {/* Barre de couleur */}
                <div
                  className="absolute left-0 top-0 h-full w-1 rounded-l"
                  style={{ backgroundColor: config.color }}
                />

                {/* Carte article */}
                <div className="ml-4 p-4 bg-purple-900/10 hover:bg-purple-900/20 border border-purple-500/30 hover:border-purple-500/50 rounded-lg transition-all">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" style={{ color: config.color }} />
                      <span
                        className="text-xs font-mono font-bold uppercase"
                        style={{ color: config.color }}
                      >
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-purple-600">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{article.time}</span>
                    </div>
                  </div>

                  {/* Titre */}
                  <h3 className="text-purple-200 font-bold text-base mb-2 group-hover:text-purple-100 transition-colors">
                    {article.title}
                  </h3>

                  {/* Résumé */}
                  <p className="text-purple-400 text-sm mb-3">{article.summary}</p>

                  {/* Tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {article.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-purple-900/30 text-purple-400 text-xs font-mono rounded border border-purple-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Arrow indicator */}
                  <motion.div
                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-5 h-5 text-purple-400" />
                  </motion.div>
                </div>

                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${config.color}15 0%, transparent 70%)`,
                    filter: 'blur(20px)',
                  }}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        div::-webkit-scrollbar-thumb {
          background: #a855f7;
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL : ASSEMBLAGE
// ═══════════════════════════════════════════════════════════

export default function PolitiqueDevicePage() {
  return (
    <div className="w-full h-screen bg-black flex flex-col">
      {/* ═══ PARTIE 1 : GLOBE INTERACTIF 3D (HAUT) ═══ */}
      <div className="w-full h-[50vh] relative">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
        >
          <color attach="background" args={['#000000']} />
          <fog attach="fog" args={['#000000', 20, 40]} />

          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#00ff88" />
          <pointLight position={[-10, -10, 10]} intensity={2} color="#ff0044" />
          <spotLight position={[0, 20, 0]} angle={0.5} intensity={2} color="#a855f7" />

          <InteractiveGlobe />
          <FloatingArtifacts />

          <EffectComposer multisampling={4}>
            <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
            <ChromaticAberration offset={[0.002, 0.002]} />
          </EffectComposer>

          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            autoRotate
            autoRotateSpeed={0.3}
            maxDistance={25}
            minDistance={10}
            enablePan={false}
            makeDefault
          />
        </Canvas>

        {/* Dégradé */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
      </div>

      {/* ═══ PARTIE 2 : FEED D'ARTICLES (BAS) ═══ */}
      <div className="w-full h-[50vh] p-8">
        <ArticlesFeed />
      </div>
    </div>
  )
}
