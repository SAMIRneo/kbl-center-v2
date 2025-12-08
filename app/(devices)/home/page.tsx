'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Float, Text, Billboard, Sphere, MeshDistortMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home as HomeIcon, Book, Sparkles, Eye, Infinity, Circle, Triangle, Hexagon, Star, Layers, ChevronRight, Scroll, Crown } from 'lucide-react'

// --- SACRED GEOMETRY PARTICLES ---
function SacredGeometryParticles() {
  const pointsRef = useRef<THREE.Points>(null!)
  const count = 2000
  
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 60
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radius * Math.cos(phi)
    }
    return pos
  })

  const [colors] = useState(() => {
    const cols = new Float32Array(count * 3)
    const purple = new THREE.Color('#8b5cf6')
    const blue = new THREE.Color('#3b82f6')
    const gold = new THREE.Color('#f59e0b')
    
    for (let i = 0; i < count; i++) {
      const rand = Math.random()
      const color = rand < 0.33 ? purple : rand < 0.66 ? blue : gold
      const brightness = 0.6 + Math.random() * 0.4
      
      cols[i * 3] = color.r * brightness
      cols[i * 3 + 1] = color.g * brightness
      cols[i * 3 + 2] = color.b * brightness
    }
    return cols
  })

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08
      pointsRef.current.rotation.x += delta * 0.03
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

// --- CENTRAL TREE OF LIFE SYMBOL ---
function TreeOfLifeCore() {
  const coreRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.003
      coreRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3
    }
  })

  return (
    <group ref={coreRef} position={[0, 0, -10]}>
      {/* Central Sphere - Kether */}
      <Sphere args={[1.8, 64, 64]}>
        <MeshDistortMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={2.5}
          distort={0.3}
          speed={1.5}
          roughness={0}
          metalness={1}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Inner Light */}
      <Sphere args={[2.2, 32, 32]}>
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={2}
          wireframe
          transparent
          opacity={0.5}
        />
      </Sphere>

      {/* Sacred Rings */}
      {[0, 1, 2, 3].map((i) => (
        <group key={i} rotation={[Math.PI / 4 * i, Math.PI / 3 * i, 0]}>
          <mesh>
            <torusGeometry args={[3 + i * 0.8, 0.08, 16, 64]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#8b5cf6' : '#3b82f6'}
              emissive={i % 2 === 0 ? '#8b5cf6' : '#3b82f6'}
              emissiveIntensity={2}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>
      ))}

      {/* Outer Protection Circle */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[6, 0.12, 16, 64]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={2.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Label */}
      <Billboard position={[0, 5, 0]}>
        <Text
          fontSize={0.7}
          color="#f59e0b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
          fontWeight={900}
        >
          TREE OF LIFE
        </Text>
      </Billboard>
    </group>
  )
}

// --- FLOATING GEOMETRIC SHAPES ---
function FloatingGeometry() {
  const groupRef = useRef<THREE.Group>(null!)
  
  const shapes = [
    { pos: [-12, 6, -12], geometry: 'octahedron', color: '#8b5cf6' },
    { pos: [12, 4, -14], geometry: 'icosahedron', color: '#3b82f6' },
    { pos: [-10, -4, -13], geometry: 'dodecahedron', color: '#f59e0b' },
    { pos: [10, -6, -11], geometry: 'tetrahedron', color: '#06b6d4' },
  ]

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((mesh, i) => {
        mesh.position.y += Math.sin(state.clock.elapsedTime + i * 1.5) * 0.008
        mesh.rotation.x += 0.003
        mesh.rotation.y += 0.005
        mesh.rotation.z += 0.002
      })
    }
  })

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <Float key={i} speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
          <mesh position={shape.pos as [number, number, number]}>
            {shape.geometry === 'octahedron' && <octahedronGeometry args={[1.2]} />}
            {shape.geometry === 'icosahedron' && <icosahedronGeometry args={[1.2]} />}
            {shape.geometry === 'dodecahedron' && <dodecahedronGeometry args={[1.2]} />}
            {shape.geometry === 'tetrahedron' && <tetrahedronGeometry args={[1.5]} />}
            <meshStandardMaterial
              color={shape.color}
              emissive={shape.color}
              emissiveIntensity={1.8}
              wireframe
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

// --- MYSTICAL FLOOR ---
function MysticalFloor() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -15, 0]}>
        <circleGeometry args={[80, 128]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#8b5cf6"
          emissiveIntensity={0.15}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Sacred Circle Pattern */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -14.9, 0]}>
          <ringGeometry args={[20 + i * 10, 20.5 + i * 10, 128]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={2}
            transparent
            opacity={0.4 - i * 0.08}
          />
        </mesh>
      ))}
    </>
  )
}

// --- MAIN COMPONENT ---
export default function HomePage() {
  const [activeSection, setActiveSection] = useState<string>('introduction')
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress((scrollY / maxScroll) * 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const sections = [
    {
      id: 'introduction',
      icon: Book,
      title: 'Introduction',
      content: `Le KBL CENTER V2 représente l'évolution ultime d'une plateforme ésotérique moderne. Basée sur la structure sacrée de l'Arbre de Vie (Sephirot), cette architecture incarne la fusion entre la sagesse ancestrale kabbalistique et les technologies quantiques de nouvelle génération.

Chaque Sephirah constitue un nœud de conscience, un dispositif fonctionnel qui matérialise un aspect spécifique de la connaissance universelle. Du Terminal de trading aux réseaux neuronaux d'IA, chaque module représente une facette de l'intelligence collective distribuée.`
    },
    {
      id: 'vision',
      icon: Eye,
      title: 'Vision & Mission',
      content: `Notre vision transcende le simple cadre technologique. Le KBL CENTER aspire à créer un nexus souverain où convergent finance décentralisée, intelligence artificielle, gouvernance DAO et création audiovisuelle.

La mission est triple :
• Démocratiser l'accès aux outils de trading algorithmique et d'analyse prédictive
• Établir une communauté autonome guidée par la transparence et la décentralisation
• Fusionner l'esthétique mystique avec l'innovation technologique de pointe`
    },
    {
      id: 'architecture',
      icon: Layers,
      title: 'Architecture Sephirotique',
      content: `L'Arbre de Sephirot structure l'ensemble du système en 10 sphères interconnectées :

**KETHER** (Couronne) - HOME : Point d'origine, whitepaper et documentation fondamentale
**CHOKMAH** (Sagesse) - TERMINAL : Trading algorithmique et données de marché temps réel
**BINAH** (Compréhension) - IA : Réseaux neuronaux et modèles ML prédictifs
**CHESED** (Miséricorde) - AUDIOVISUEL : Création média et visualisation de fréquences
**GEBURAH** (Force) - COMMUNAUTÉS : Hub social et analytics d'engagement
**TIPHERETH** (Beauté) - POLITIQUE : Gouvernance DAO et système de vote

Chaque Sephirah communique via le store Zustand global, créant un réseau de conscience distribuée.`
    },
    {
      id: 'technology',
      icon: Hexagon,
      title: 'Stack Technologique',
      content: `**Frontend Quantum**
• Next.js 16 (App Router) avec React 19.2 - Architecture SSR/SSG optimisée
• TypeScript 5 - Sûreté de type stricte et IntelliSense avancé
• Tailwind CSS 4.1 - Design system utility-first avec JIT compiler

**Visualisation 3D & Animations**
• Three.js 0.170 + React Three Fiber - Rendu WebGL haute performance
• Framer Motion 12 - Animations déclaratives et transitions fluides
• Post-processing N8AO - Ambient occlusion et effets visuels cinématiques

**State Management & Data**
• Zustand 4.4 - Store global minimaliste et performant
• Axios - Client HTTP pour APIs externes (Binance, CoinGecko)
• D3.js 7.9 - Manipulation et transformation de données complexes

**Intelligence Artificielle**
• Qwen 2.5 - LLM local pour analyse de marché
• CryptoMamba - Modèle spécialisé crypto-prédictif
• XGBoost - Algorithme de gradient boosting pour backtesting`
    },
    {
      id: 'modules',
      icon: Star,
      title: 'Modules Principaux',
      content: `**TERMINAL** - Centre de Contrôle Système
Tableau de bord de trading avec intégration Binance API, graphiques en chandelier temps réel, order book depth, métriques de marché 24h, et terminal de commandes interactif.

**IA** - Neural Networks Hub
Visualisation de réseaux de neurones, gestion de modèles ML (Qwen, CryptoMamba, XGBoost), flux de signaux de trading, backtesting automatisé, et monitoring GPU/VRAM.

**AUDIOVISUEL** - Centre Média Immersif
Visualiseur de fréquences audio (waveform & spectrum), médiathèque interactive, lecteur avec contrôles avancés, pipeline de production (Recording → Editing → Publishing).

**COMMUNAUTÉS** - Social Analytics Hub
Métriques d'engagement (posts, commentaires, likes), leaderboard des contributeurs, radar de santé communautaire, flux d'activité temps réel, statistiques de croissance.

**POLITIQUE** - Gouvernance Décentralisée
Système de propositions et votes on-chain, visualisation de la trésorerie (Treasury), tracking du quorum et de la participation, historique complet des décisions DAO.`
    },
    {
      id: 'philosophy',
      icon: Infinity,
      title: 'Philosophie Ésotérique',
      content: `Le KBL CENTER ne se limite pas à une application web. Il incarne une philosophie de souveraineté numérique inspirée par les principes kabbalistiques :

**L'Unité dans la Multiplicité** - Chaque module fonctionne de manière autonome tout en contribuant à l'harmonie globale du système.

**La Lumière et le Voile** - L'interface utilisateur révèle progressivement ses mystères, guidant l'initié vers une compréhension profonde des mécanismes sous-jacents.

**Les Chemins de Sagesse** - Les 22 sentiers reliant les Sephiroth représentent les transitions et animations entre modules, créant un voyage initiatique fluide.

**La Couronne Suprême** - Le HOME module (Kether) représente la source de toute connaissance, le point d'origine d'où émane l'architecture complète.`
    },
    {
      id: 'roadmap',
      icon: Crown,
      title: 'Roadmap Évolutive',
      content: `**Phase 1 - Genesis (Achevée)**
✓ Architecture Next.js 16 + TypeScript
✓ Visualisation 3D Sephirot Tree avec shaders custom
✓ Modules Terminal, IA, Audiovisuel, Communautés, Politique
✓ State management Zustand global
✓ Documentation complète et README professionnel

**Phase 2 - Expansion (Q1 2026)**
• Intégration WebSocket pour données de marché temps réel
• Déploiement de smart contracts DAO sur Ethereum/Polygon
• Système d'authentification Web3 (MetaMask, WalletConnect)
• API backend Node.js + PostgreSQL pour persistence

**Phase 3 - Quantum Leap (Q2-Q3 2026)**
• Modèles ML en production avec endpoints GPU
• Système de notifications push et alertes de trading
• Fonctionnalités de backtesting avancées avec replay historique
• Intégration de 4 Sephiroth supplémentaires (complétion de l'Arbre)

**Phase 4 - Sovereign Nexus (Q4 2026)**
• Infrastructure décentralisée IPFS + Filecoin
• Token économique KBL pour gouvernance et incentivisation
• Marketplace de stratégies de trading algorithmique
• SDK open-source pour développeurs tiers`
    },
    {
      id: 'conclusion',
      icon: Scroll,
      title: 'Conclusion',
      content: `Le KBL CENTER V2 transcende les frontières entre spiritualité et technologie. Il ne s'agit pas simplement d'un projet web, mais d'une vision incarnée : celle d'un espace digital souverain où la connaissance ancestrale rencontre l'innovation quantique.

Chaque ligne de code est imprégnée d'une intention : créer un système qui non seulement sert ses utilisateurs, mais les élève. Un système où la beauté esthétique renforce la fonctionnalité, où l'ésotérisme illumine la logique.

Ce whitepaper marque le commencement d'un voyage initiatique. Que vous soyez trader, développeur, artiste ou chercheur de vérité, le KBL CENTER vous invite à participer à cette alchimie digitale.

*Ad astra per aspera* - Vers les étoiles à travers les difficultés.

**SAMIRneo**
Architecte du Nexus Souverain
Quantum Edition - 2025`
    }
  ]

  const activeContent = sections.find(s => s.id === activeSection)

  return (
    <div className="relative w-full min-h-screen bg-black">
      
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-amber-500 z-50 origin-left"
        style={{ scaleX: scrollProgress / 100 }}
      />

      {/* === 3D ANIMATION SECTION === */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        <Canvas 
          camera={{ position: [0, 0, 35], fov: 55 }}
          style={{ width: '100%', height: '100%' }}
          gl={{ antialias: true, alpha: false }}
        >
          <color attach="background" args={['#000000']} />
          <fog attach="fog" args={['#000000', 35, 90]} />

          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={3} color="#8b5cf6" />
          <pointLight position={[-10, -10, 10]} intensity={3} color="#3b82f6" />
          <pointLight position={[0, 0, 15]} intensity={4} color="#f59e0b" />
          <spotLight position={[0, 25, 0]} intensity={2.5} angle={0.4} penumbra={0.5} color="#fbbf24" />

          <Stars radius={180} depth={60} count={8000} factor={5} saturation={0.3} fade speed={0.4} />
          
          <SacredGeometryParticles />
          <TreeOfLifeCore />
          <FloatingGeometry />
          <MysticalFloor />

          <EffectComposer>
            <Bloom intensity={1.8} luminanceThreshold={0.15} luminanceSmoothing={0.95} mipmapBlur />
            <ChromaticAberration offset={[0.0015, 0.0015]} />
          </EffectComposer>

          <OrbitControls 
            enableDamping 
            dampingFactor={0.05} 
            autoRotate 
            autoRotateSpeed={0.5}
            maxDistance={55}
            minDistance={18}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.6}
            minPolarAngle={Math.PI / 3.5}
          />
        </Canvas>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>

      {/* === CONTENT SECTION === */}
      <div className="relative w-full bg-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 -mt-8"
          >
            <div className="inline-flex items-center gap-4 px-8 py-4 rounded-3xl bg-black/90 backdrop-blur-xl border-2 border-purple-500/50 shadow-[0_0_60px_rgba(139,92,246,0.3)]">
              <HomeIcon className="w-10 h-10 text-purple-400" />
              <div className="text-left">
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
                  <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-amber-400 bg-clip-text text-transparent">
                    HOME
                  </span>
                </h1>
                <p className="text-purple-400 font-mono text-sm tracking-[0.3em] uppercase mt-1">
                  Whitepaper Sephirotique
                </p>
              </div>
            </div>
          </motion.div>

          {/* Main Layout */}
          <div className="grid md:grid-cols-[300px_1fr] gap-6">
            
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-20 h-fit"
            >
              <div className="bg-black/90 backdrop-blur-2xl border-2 border-purple-900/50 rounded-3xl p-6 shadow-[0_0_60px_rgba(139,92,246,0.2)]">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-purple-900/50">
                  <Layers className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Sommaire</h3>
                </div>
                
                <nav className="space-y-2">
                  {sections.map((section, i) => (
                    <motion.button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      whileHover={{ x: 6, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-purple-600/40 to-blue-600/40 border-2 border-purple-500 shadow-[0_0_30px_rgba(139,92,246,0.4)]'
                          : 'bg-purple-950/20 border-2 border-purple-900/30 hover:border-purple-500/50'
                      }`}
                    >
                      <section.icon className={`w-5 h-5 flex-shrink-0 ${
                        activeSection === section.id ? 'text-purple-300' : 'text-purple-500'
                      }`} />
                      <span className={`text-sm font-bold text-left ${
                        activeSection === section.id ? 'text-white' : 'text-slate-400'
                      }`}>
                        {section.title}
                      </span>
                      {activeSection === section.id && (
                        <ChevronRight className="w-4 h-4 ml-auto text-purple-300" />
                      )}
                    </motion.button>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {activeContent && (
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-black/90 backdrop-blur-2xl border-2 border-purple-900/50 rounded-3xl p-8 shadow-[0_0_60px_rgba(139,92,246,0.2)]"
                  >
                    {/* Section Header */}
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-purple-900/50">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg">
                        <activeContent.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-amber-400 bg-clip-text text-transparent">
                          {activeContent.title}
                        </h2>
                        <p className="text-sm text-slate-500 font-mono mt-1">
                          SECTION {sections.findIndex(s => s.id === activeSection) + 1} / {sections.length}
                        </p>
                      </div>
                    </div>

                    {/* Section Content */}
                    <div className="prose prose-invert max-w-none">
                      <div className="text-slate-300 leading-relaxed space-y-6 text-base whitespace-pre-line">
                        {activeContent.content}
                      </div>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex justify-between mt-12 pt-6 border-t border-purple-900/50">
                      <button
                        onClick={() => {
                          const currentIndex = sections.findIndex(s => s.id === activeSection)
                          if (currentIndex > 0) setActiveSection(sections[currentIndex - 1].id)
                        }}
                        disabled={sections.findIndex(s => s.id === activeSection) === 0}
                        className="px-6 py-3 rounded-xl bg-purple-950/40 border-2 border-purple-900/50 hover:border-purple-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold transition-all flex items-center gap-2"
                      >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                        Précédent
                      </button>
                      <button
                        onClick={() => {
                          const currentIndex = sections.findIndex(s => s.id === activeSection)
                          if (currentIndex < sections.length - 1) setActiveSection(sections[currentIndex + 1].id)
                        }}
                        disabled={sections.findIndex(s => s.id === activeSection) === sections.length - 1}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(139,92,246,0.4)]"
                      >
                        Suivant
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>

        </div>
      </div>

      <style jsx global>{`
        .prose h3 { 
          @apply text-2xl font-bold text-purple-300 mt-8 mb-4; 
        }
        .prose strong { 
          @apply text-blue-400 font-bold; 
        }
        .prose ul { 
          @apply space-y-2 ml-6; 
        }
        .prose li::marker { 
          @apply text-purple-400; 
        }
      `}</style>
    </div>
  )
}
