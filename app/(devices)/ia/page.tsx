'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Sparkles, Float, Sphere, Environment, Torus, MeshDistortMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette, DepthOfField } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { useRef, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Brain, Cpu, Sparkles as SparklesIcon, Zap, MessageSquare, Code, TrendingUp, Activity, Gauge, Clock, Send, Maximize2 } from 'lucide-react'

// --- NEURAL NETWORK ULTRA HD ---
function NeuralNetwork() {
  const nodesRef = useRef<THREE.Group>(null!)
  
  const nodes = useMemo(() => {
    const n: Array<{ position: [number, number, number]; size: number; speed: number; color: string }> = []
    const colors = ['#38bdf8', '#0ea5e9', '#06b6d4', '#22d3ee', '#67e8f9']
    
    for (let i = 0; i < 100; i++) {
      n.push({
        position: [
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 35,
          (Math.random() - 0.5) * 50
        ],
        size: 0.15 + Math.random() * 0.5,
        speed: 0.4 + Math.random() * 2.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
    return n
  }, [])

  useFrame((state) => {
    if (nodesRef.current) {
      nodesRef.current.rotation.y += 0.003
      nodesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.15
      
      nodesRef.current.children.forEach((child, i) => {
        child.position.y += Math.sin(state.clock.elapsedTime * nodes[i].speed + i) * 0.012
        child.rotation.y += 0.02
      })
    }
  })

  return (
    <group ref={nodesRef}>
      {nodes.map((node, i) => (
        <Float key={i} speed={node.speed} rotationIntensity={0.6} floatIntensity={1}>
          <Sphere args={[node.size, 32, 32]} position={node.position}>
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={3.5}
              transparent
              opacity={0.95}
              roughness={0}
              metalness={0.9}
            />
          </Sphere>
          
          {/* Anneaux multiples */}
          {[1.8, 2.2].map((mult, idx) => (
            <Torus 
              key={idx}
              args={[node.size * mult, node.size * 0.08, 16, 32]} 
              position={node.position} 
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
            >
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={2.5}
                transparent
                opacity={0.5}
              />
            </Torus>
          ))}
          
          {/* Aura triple */}
          {[2, 2.8, 3.5].map((mult, idx) => (
            <Sphere key={idx} args={[node.size * mult, 20, 20]} position={node.position}>
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={1.5 - idx * 0.3}
                transparent
                opacity={0.15 - idx * 0.03}
                side={THREE.BackSide}
              />
            </Sphere>
          ))}
        </Float>
      ))}
    </group>
  )
}

// --- PULSING CORE ULTRA ---
function PulsingCore() {
  const coreRef = useRef<THREE.Mesh>(null!)
  const ringRefs = useRef<THREE.Mesh[]>([])
  const distortRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    
    if (coreRef.current) {
      const scale = 2 + Math.sin(t * 2.5) * 0.5
      coreRef.current.scale.setScalar(scale)
      coreRef.current.rotation.y += 0.03
      coreRef.current.rotation.x += 0.015
    }
    
    if (distortRef.current) {
      distortRef.current.rotation.y -= 0.02
      distortRef.current.rotation.z += 0.01
    }
    
    ringRefs.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.z += 0.02 * (i + 1)
        ring.rotation.x += 0.012 * (i + 1)
        ring.rotation.y += 0.008
        const scale = 1 + Math.sin(t * 1.5 + i) * 0.15
        ring.scale.setScalar(scale)
      }
    })
  })

  return (
    <group>
      {/* Sphere distordue centrale */}
      <mesh ref={distortRef}>
        <Sphere args={[3, 64, 64]}>
          <MeshDistortMaterial
            color="#38bdf8"
            emissive="#0ea5e9"
            emissiveIntensity={3}
            distort={0.5}
            speed={3}
            roughness={0}
            metalness={1}
            transparent
            opacity={0.7}
          />
        </Sphere>
      </mesh>
      
      {/* Core wireframe */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[2.8, 4]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0ea5e9"
          emissiveIntensity={5}
          wireframe
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Anneaux multiples */}
      {[3.5, 4.5, 5.5, 6.5].map((radius, i) => (
        <mesh key={i} ref={el => { if (el) ringRefs.current[i] = el }}>
          <torusGeometry args={[radius, 0.2, 32, 64]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#06b6d4"
            emissiveIntensity={4 - i * 0.5}
            transparent
            opacity={0.7 - i * 0.12}
            roughness={0}
            metalness={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

// --- AI MODEL SELECTOR PREMIUM ---
function AIModelSelector({ selectedModel, onSelect }: any) {
  const models = [
    { 
      name: 'GPT-4', 
      icon: Brain, 
      color: '#10b981',
      gradient: 'from-emerald-500 via-green-500 to-emerald-600',
      description: 'OpenAI flagship model',
      stats: { speed: 95, accuracy: 98 }
    },
    { 
      name: 'Claude', 
      icon: Cpu, 
      color: '#8b5cf6',
      gradient: 'from-purple-500 via-violet-500 to-purple-600',
      description: 'Anthropic AI assistant',
      stats: { speed: 92, accuracy: 97 }
    },
    { 
      name: 'Gemini', 
      icon: SparklesIcon, 
      color: '#3b82f6',
      gradient: 'from-blue-500 via-indigo-500 to-blue-600',
      description: 'Google multimodal AI',
      stats: { speed: 90, accuracy: 96 }
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {models.map((model) => (
        <motion.div
          key={model.name}
          whileHover={{ scale: 1.05, y: -8 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(model.name)}
          className={`
            relative overflow-hidden rounded-3xl cursor-pointer
            backdrop-blur-2xl border-2 transition-all duration-500
            ${selectedModel === model.name 
              ? 'border-cyan-400 shadow-[0_0_60px_rgba(34,211,238,0.6)]' 
              : 'border-slate-700 hover:border-cyan-500'
            }
          `}
          style={{
            background: selectedModel === model.name 
              ? `linear-gradient(135deg, ${model.color}30, ${model.color}10)` 
              : 'rgba(15, 23, 42, 0.6)'
          }}
        >
          {/* Gradient animé */}
          <motion.div 
            className={`absolute inset-0 bg-gradient-to-br ${model.gradient} opacity-0 hover:opacity-20 transition-opacity duration-700`}
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          />
          
          <div className="relative p-6">
            <div className="flex items-center gap-4 mb-4">
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="p-4 rounded-2xl"
                style={{ 
                  background: `linear-gradient(135deg, ${model.color}70, ${model.color}40)`,
                  boxShadow: `0 0 40px ${model.color}60`
                }}
              >
                <model.icon className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-black text-white">{model.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{model.description}</p>
              </div>
            </div>
            
            {/* Stats bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Speed</span>
                  <span className="font-bold text-white">{model.stats.speed}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full bg-gradient-to-r ${model.gradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${model.stats.speed}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Accuracy</span>
                  <span className="font-bold text-white">{model.stats.accuracy}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full bg-gradient-to-r ${model.gradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${model.stats.accuracy}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {selectedModel === model.name && (
            <motion.div
              layoutId="activeModel"
              className="absolute inset-0 border-4 border-cyan-400 rounded-3xl pointer-events-none"
              style={{ boxShadow: '0 0 50px rgba(34, 211, 238, 0.7), inset 0 0 50px rgba(34, 211, 238, 0.1)' }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}

// --- CHAT INTERFACE ---
function ChatInterface() {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bienvenue dans CHOKHMAH. Je suis prêt à vous assister avec mes capacités avancées d\'IA.' }
  ])

  const sendMessage = () => {
    if (!prompt.trim()) return
    setMessages([...messages, 
      { role: 'user', content: prompt },
      { role: 'assistant', content: 'Analyse en cours...' }
    ])
    setPrompt('')
  }

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-2xl border-2 border-slate-700 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/20 border-2 border-cyan-500/50">
            <MessageSquare className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Chat Interface</h3>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm text-emerald-400 font-mono font-bold">ONLINE</span>
        </div>
      </div>
      
      <div className="h-[400px] overflow-y-auto space-y-4 mb-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`
              max-w-[80%] p-5 rounded-2xl
              ${msg.role === 'user' 
                ? 'bg-gradient-to-br from-cyan-600/50 to-blue-600/50 border-2 border-cyan-500/70' 
                : 'bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-2 border-slate-600/70'
              }
            `}>
              <p className="text-white">{msg.content}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Posez votre question..."
          className="flex-1 px-6 py-4 rounded-2xl bg-slate-800/80 border-2 border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={sendMessage}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-[0_0_40px_rgba(34,211,238,0.5)] hover:scale-105 transition-all"
        >
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

// --- MAIN COMPONENT ---
export default function IAPage() {
  const [selectedModel, setSelectedModel] = useState('GPT-4')

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* ANIMATION 3D PLEIN ÉCRAN EN HAUT */}
      <div className="w-full h-[500px] relative">
        <Canvas
          camera={{ position: [0, 0, 35], fov: 75 }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.5
          }}
        >
          <color attach="background" args={['#000000']} />
          <fog attach="fog" args={['#001a33', 45, 140]} />

          <ambientLight intensity={0.6} />
          <pointLight position={[25, 25, 25]} intensity={4} color="#38bdf8" />
          <pointLight position={[-25, -25, 25]} intensity={3} color="#0ea5e9" />
          <pointLight position={[0, 0, 25]} intensity={2.5} color="#22d3ee" />
          <spotLight position={[0, 30, 20]} intensity={3} angle={0.5} penumbra={0.5} color="#22d3ee" />

          <Stars radius={350} depth={120} count={20000} factor={9} saturation={1} fade speed={1} />
          
          <PulsingCore />
          <NeuralNetwork />
          <Sparkles count={600} scale={70} size={7} speed={0.6} opacity={0.7} color="#38bdf8" />
          
          <Environment preset="night" />

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
            maxDistance={60}
            minDistance={20}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
        
        {/* Header overlay sur l'animation */}
        <div className="absolute top-8 left-8 z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.15 }}
              transition={{ duration: 0.8 }}
              className="p-6 rounded-3xl bg-gradient-to-br from-cyan-600/50 to-blue-600/50 border-2 border-cyan-500/70 backdrop-blur-xl shadow-[0_0_60px_rgba(34,211,238,0.5)]"
            >
              <Brain className="w-14 h-14 text-cyan-200" />
            </motion.div>
            <div>
              <h1 className="text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(56,189,248,0.8)]">
                CHOKHMAH
              </h1>
              <p className="text-cyan-400 font-mono text-lg tracking-[0.3em] mt-2 uppercase drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
                [ Wisdom - Intelligence Artificielle ]
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CONTENU EN DESSOUS */}
      <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-black p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Model Selector */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AIModelSelector selectedModel={selectedModel} onSelect={setSelectedModel} />
          </motion.div>

          {/* Chat */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ChatInterface />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: 'Requêtes', value: '1,247', color: '#10b981', icon: TrendingUp },
              { label: 'Tokens', value: '847K', color: '#3b82f6', icon: Activity },
              { label: 'Précision', value: '98.7%', color: '#8b5cf6', icon: Gauge },
              { label: 'Latence', value: '12ms', color: '#06b6d4', icon: Clock },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-xl border-2 border-slate-700 hover:border-cyan-500"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">{stat.label}</span>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <p className="text-3xl font-black" style={{ color: stat.color }}>{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.6); border-radius: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.7); border-radius: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(34, 211, 238, 1); }
      `}</style>
    </div>
  )
}
