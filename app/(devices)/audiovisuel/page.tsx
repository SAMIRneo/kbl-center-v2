'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Sparkles, Float, Sphere, Environment, Torus, MeshDistortMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette, DepthOfField } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { useRef, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Music, Video, Image as ImageIcon, Upload, Play, Pause, Volume2, Film, BarChart3, Maximize2, Send } from 'lucide-react'

// --- AUDIO SPECTRUM 3D ULTRA ---
function AudioSpectrum() {
  const barsRef = useRef<THREE.Group>(null!)
  const [audioData] = useState(() => {
    const data: number[] = []
    for (let i = 0; i < 80; i++) {
      data.push(Math.random())
    }
    return data
  })

  useFrame((state) => {
    if (barsRef.current) {
      barsRef.current.children.forEach((child, i) => {
        const scale = 0.5 + Math.sin(state.clock.elapsedTime * 3 + i * 0.2) * 0.5
        child.scale.y = scale
        
        // Changement de couleur dynamique HSL
        const mesh = child as THREE.Mesh
        const material = mesh.material as THREE.MeshStandardMaterial
        const hue = (i / 80 + state.clock.elapsedTime * 0.05) % 1
        material.color.setHSL(hue * 0.15 + 0.08, 0.9, 0.6) // Golden range
        material.emissive.setHSL(hue * 0.15 + 0.08, 0.9, 0.5)
      })
      barsRef.current.rotation.y += 0.005
    }
  })

  return (
    <group ref={barsRef}>
      {audioData.map((_, i) => {
        const angle = (i / audioData.length) * Math.PI * 2
        const radius = 12
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius
            ]}
            rotation={[0, -angle, 0]}
          >
            <boxGeometry args={[0.5, 2.5, 0.5]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={3}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// --- FLOATING MEDIA GALLERY ULTRA ---
function MediaGallery() {
  const cardsRef = useRef<THREE.Group>(null!)

  const cards = useMemo(() => {
    const c: Array<{ 
      position: [number, number, number]; 
      rotation: [number, number, number];
      color: string;
    }> = []
    const colors = ['#fbbf24', '#f59e0b', '#fb923c', '#fdba74', '#fcd34d']
    
    for (let i = 0; i < 20; i++) {
      c.push({
        position: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 30
        ],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ],
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
    return c
  }, [])

  useFrame((state) => {
    if (cardsRef.current) {
      cardsRef.current.children.forEach((child, i) => {
        child.position.y += Math.sin(state.clock.elapsedTime + i) * 0.004
        child.rotation.y += 0.004
        child.rotation.x += 0.002
      })
    }
  })

  return (
    <group ref={cardsRef}>
      {cards.map((card, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
          <mesh position={card.position} rotation={card.rotation}>
            <planeGeometry args={[3, 2.2]} />
            <meshStandardMaterial
              color={card.color}
              emissive={card.color}
              emissiveIntensity={0.8}
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

// --- GOLDEN CORE ULTRA ---
function GoldenCore() {
  const coreRef = useRef<THREE.Mesh>(null!)
  const ringRefs = useRef<THREE.Mesh[]>([])
  const distortRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.015
      coreRef.current.rotation.z += 0.008
      const scale = 1.2 + Math.sin(t * 2) * 0.2
      coreRef.current.scale.setScalar(scale)
    }
    
    if (distortRef.current) {
      distortRef.current.rotation.y -= 0.01
      distortRef.current.rotation.x += 0.005
    }
    
    ringRefs.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.z += 0.015 * (i + 1)
        ring.rotation.y += 0.01
        const scale = 1 + Math.sin(t * 1.5 + i) * 0.12
        ring.scale.setScalar(scale)
      }
    })
  })

  return (
    <group>
      {/* Sphere distordue */}
      <mesh ref={distortRef}>
        <Sphere args={[3.5, 64, 64]}>
          <MeshDistortMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={3}
            distort={0.6}
            speed={3}
            roughness={0}
            metalness={1}
            transparent
            opacity={0.75}
          />
        </Sphere>
      </mesh>
      
      {/* Core wireframe */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[3, 4]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={5}
          wireframe
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Anneaux dorés */}
      {[4, 5, 6, 7].map((radius, i) => (
        <mesh key={i} ref={el => { if (el) ringRefs.current[i] = el }}>
          <torusGeometry args={[radius, 0.25, 32, 64]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={4 - i * 0.5}
            transparent
            opacity={0.7 - i * 0.1}
            roughness={0}
            metalness={0.95}
          />
        </mesh>
      ))}
    </group>
  )
}

// --- MEDIA TYPES ---
function MediaTypes() {
  const types = [
    { icon: Music, label: 'Audio', count: 247, color: '#fbbf24', gradient: 'from-yellow-500 via-amber-500 to-yellow-600' },
    { icon: Video, label: 'Vidéo', count: 89, color: '#f59e0b', gradient: 'from-orange-500 via-amber-600 to-orange-600' },
    { icon: ImageIcon, label: 'Images', count: 1203, color: '#fb923c', gradient: 'from-orange-400 via-amber-500 to-orange-500' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {types.map((type, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.08, y: -8 }}
          className={`
            relative p-6 rounded-3xl cursor-pointer overflow-hidden
            bg-gradient-to-br from-slate-900/80 to-slate-800/80
            backdrop-blur-2xl border-2 border-slate-700
            hover:border-yellow-500 transition-all duration-500
          `}
        >
          {/* Gradient animé */}
          <motion.div 
            className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 hover:opacity-20 transition-opacity duration-700`}
          />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className={`p-4 rounded-2xl bg-gradient-to-br ${type.gradient} shadow-[0_0_40px]`}
                style={{ boxShadow: `0 0 40px ${type.color}60` }}
              >
                <type.icon className="w-8 h-8 text-white" />
              </motion.div>
              <motion.span 
                whileHover={{ scale: 1.15 }}
                className="text-4xl font-black text-white"
              >
                {type.count}
              </motion.span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{type.label}</h3>
            <p className="text-sm text-slate-400">fichiers disponibles</p>
            
            {/* Progress bar animée */}
            <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${(type.count / 1500) * 100}%` }}
                transition={{ duration: 1.2, delay: i * 0.2 }}
                className={`h-full bg-gradient-to-r ${type.gradient}`}
                style={{ boxShadow: `0 0 15px ${type.color}` }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// --- UPLOAD ZONE ---
function UploadZone() {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false) }}
      className={`
        relative p-12 rounded-3xl border-2 border-dashed
        backdrop-blur-2xl transition-all duration-500
        ${isDragging 
          ? 'border-yellow-400 bg-yellow-500/20 scale-105 shadow-[0_0_60px_rgba(251,191,36,0.5)]' 
          : 'border-slate-600 bg-slate-900/60 hover:border-yellow-500'
        }
      `}
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div 
          animate={{ 
            scale: isDragging ? 1.2 : 1,
            rotate: isDragging ? 360 : 0
          }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-full bg-gradient-to-br from-yellow-600/40 to-orange-600/40 border-2 border-yellow-500/60 shadow-[0_0_50px_rgba(251,191,36,0.4)]"
        >
          <Upload className="w-16 h-16 text-yellow-300" />
        </motion.div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Glissez vos fichiers ici
          </h3>
          <p className="text-slate-300">
            Audio, vidéo, images • Max 100MB par fichier
          </p>
        </div>
        <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold text-lg transition-all duration-300 shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:shadow-[0_0_50px_rgba(251,191,36,0.7)] hover:scale-105">
          Parcourir les fichiers
        </button>
      </div>
    </div>
  )
}

// --- MEDIA PLAYER ---
function MediaPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(45)
  const [duration] = useState(180)
  const [volume, setVolume] = useState(75)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-2xl border-2 border-slate-700 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-yellow-500/20 border-2 border-yellow-500/50">
            <Film className="w-6 h-6 text-yellow-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Media Player</h3>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60">
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-emerald-400 font-mono font-bold">HD 1080p</span>
        </div>
      </div>

      {/* Visualizer Premium */}
      <div className="h-40 rounded-2xl bg-slate-950/70 border-2 border-slate-700 mb-6 overflow-hidden relative shadow-inner">
        <div className="absolute inset-0 flex items-end justify-around p-4 gap-1">
          {Array.from({ length: 80 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                height: isPlaying ? `${20 + Math.random() * 80}%` : '25%'
              }}
              transition={{
                duration: 0.25,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: i * 0.01
              }}
              className="flex-1 rounded-t-lg"
              style={{
                background: `linear-gradient(to top, #f59e0b, #fbbf24)`,
                boxShadow: '0 0 15px rgba(251, 191, 36, 0.5)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-6">
        <div 
          className="h-3 bg-slate-800 rounded-full overflow-hidden cursor-pointer hover:h-4 transition-all shadow-inner"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const percentage = x / rect.width
            setCurrentTime(Math.floor(duration * percentage))
          }}
        >
          <div 
            className="h-full bg-gradient-to-r from-yellow-600 to-orange-500"
            style={{ 
              width: `${(currentTime / duration) * 100}%`,
              boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)'
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-slate-300 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all">
            <Volume2 className="w-6 h-6 text-white" />
          </button>
          <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
              style={{ width: `${volume}%`, boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)' }}
            />
          </div>
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-8 rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 shadow-[0_0_40px_rgba(251,191,36,0.6)] hover:scale-110 active:scale-95"
        >
          {isPlaying ? (
            <Pause className="w-10 h-10 text-white" />
          ) : (
            <Play className="w-10 h-10 text-white ml-1" />
          )}
        </button>

        <div className="flex items-center gap-4">
          <button className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all">
            <Maximize2 className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

// --- MAIN COMPONENT ---
export default function AudiovisuelPage() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* ANIMATION 3D PLEIN ÉCRAN EN HAUT */}
      <div className="w-full h-[500px] relative">
        <Canvas
          camera={{ position: [0, 5, 35], fov: 75 }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.6
          }}
        >
          <color attach="background" args={['#000000']} />
          <fog attach="fog" args={['#1a0f05', 50, 150]} />

          <ambientLight intensity={0.6} />
          <pointLight position={[20, 20, 20]} intensity={4.5} color="#fbbf24" />
          <pointLight position={[-20, -20, 20]} intensity={3.5} color="#f59e0b" />
          <pointLight position={[0, -15, 15]} intensity={2.5} color="#fb923c" />
          <spotLight position={[0, 30, 0]} intensity={3.5} angle={0.5} penumbra={0.5} color="#fb923c" />

          <Stars radius={320} depth={120} count={18000} factor={9} saturation={1} fade speed={1} />
          
          <GoldenCore />
          <AudioSpectrum />
          <MediaGallery />
          <Sparkles count={550} scale={70} size={8} speed={0.6} opacity={0.7} color="#fbbf24" />
          
          <Environment preset="sunset" />

          <EffectComposer multisampling={8}>
            <Bloom intensity={2} luminanceThreshold={0.05} luminanceSmoothing={0.98} mipmapBlur />
            <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.003, 0.003]} />
            <DepthOfField focusDistance={0.01} focalLength={0.2} bokehScale={3} />
            <Vignette eskil={false} offset={0.15} darkness={0.6} />
          </EffectComposer>

          <OrbitControls
            enableDamping
            dampingFactor={0.02}
            autoRotate
            autoRotateSpeed={0.5}
            maxDistance={65}
            minDistance={22}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
        
        {/* Header overlay */}
        <div className="absolute top-8 left-8 z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.15 }}
              transition={{ duration: 0.8 }}
              className="p-6 rounded-3xl bg-gradient-to-br from-yellow-600/50 to-orange-600/50 border-2 border-yellow-500/70 backdrop-blur-xl shadow-[0_0_60px_rgba(251,191,36,0.5)]"
            >
              <Film className="w-14 h-14 text-yellow-200" />
            </motion.div>
            <div>
              <h1 className="text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(251,191,36,0.8)]">
                TIPHERET
              </h1>
              <p className="text-yellow-400 font-mono text-lg tracking-[0.3em] mt-2 uppercase drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">
                [ Beauty - Studio Audiovisuel ]
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CONTENU EN DESSOUS */}
      <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-black p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Media Types */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MediaTypes />
          </motion.div>

          {/* Grid Player + Upload */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <MediaPlayer />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <UploadZone />
            </motion.div>
          </div>

          {/* Recent Files */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">Fichiers Récents</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.08, y: -5 }}
                  className="aspect-video rounded-2xl bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-2 border-yellow-600/40 backdrop-blur-xl flex items-center justify-center cursor-pointer hover:border-yellow-400 transition-all group shadow-lg"
                >
                  <Play className="w-10 h-10 text-yellow-400 opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
