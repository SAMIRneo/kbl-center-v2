'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Environment, Sphere } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles, Send, Code2, Settings, ChevronRight, Zap } from 'lucide-react'

// ═══════════════════════════════════════════════════════════
// PARTIE 1 : MAINS DE MICHEL-ANGE TECH (HAUT - 50vh)
// ═══════════════════════════════════════════════════════════

// Main gauche (Humain)
function LeftHand() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.x = -5 + Math.sin(t * 0.5) * 0.3
  })

  return (
    <Float speed={1.5} floatIntensity={0.5}>
      <group ref={groupRef} position={[-5, 0, 0]} rotation={[0, 0.3, 0]}>
        {/* Paume */}
        <mesh>
          <boxGeometry args={[2, 3, 0.5]} />
          <meshStandardMaterial
            color="#8b7355"
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>

        {/* Index pointé */}
        <group position={[0.5, 1.5, 0]}>
          <mesh position={[0.3, 0.8, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 1.6, 16]} />
            <meshStandardMaterial
              color="#8b7355"
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
          {/* Bout du doigt */}
          <mesh position={[0.3, 1.7, 0]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial
              color="#8b7355"
              emissive="#ff8844"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>

        {/* Particules organiques */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const radius = 3
          return (
            <Float key={i} speed={2} floatIntensity={1}>
              <mesh position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial
                  color="#ff8844"
                  emissive="#ff8844"
                  emissiveIntensity={2}
                />
              </mesh>
            </Float>
          )
        })}
      </group>
    </Float>
  )
}

// Main droite (IA)
function RightHand() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.x = 5 - Math.sin(t * 0.5) * 0.3
  })

  return (
    <Float speed={1.5} floatIntensity={0.5}>
      <group ref={groupRef} position={[5, 0, 0]} rotation={[0, -0.3, 0]}>
        {/* Paume tech */}
        <mesh>
          <boxGeometry args={[2, 3, 0.5]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={1}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Index pointé tech */}
        <group position={[-0.5, 1.5, 0]}>
          <mesh position={[-0.3, 0.8, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 1.6, 16]} />
            <meshStandardMaterial
              color="#00ff88"
              emissive="#00ff88"
              emissiveIntensity={1.5}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {/* Bout du doigt brillant */}
          <mesh position={[-0.3, 1.7, 0]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={3}
            />
          </mesh>
        </group>

        {/* Circuit imprimé sur la main */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} position={[0, -1 + i * 0.5, 0.3]}>
            <boxGeometry args={[1.8, 0.05, 0.05]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={2}
            />
          </mesh>
        ))}

        {/* Particules tech */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const radius = 3
          return (
            <Float key={i} speed={2} floatIntensity={1}>
              <mesh position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}>
                <octahedronGeometry args={[0.2, 0]} />
                <meshStandardMaterial
                  color="#00ffff"
                  emissive="#00ffff"
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

// Étincelle au centre
function Spark() {
  const sparkRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!sparkRef.current) return
    const t = state.clock.elapsedTime
    sparkRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.3)
  })

  return (
    <mesh ref={sparkRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={5}
      />
    </mesh>
  )
}

// Grille tech de fond
function TechGrid() {
  return (
    <group>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={`h-${i}`} position={[0, -10 + i, -20]}>
          <boxGeometry args={[40, 0.05, 0.05]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={0.5}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={`v-${i}`} position={[-10 + i, 0, -20]}>
          <boxGeometry args={[0.05, 40, 0.05]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={0.5}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

// ═══════════════════════════════════════════════════════════
// PARTIE 2 : INTERFACE IA (BAS - 50vh)
// ═══════════════════════════════════════════════════════════

function IAInterface() {
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you today?' },
  ])
  const [input, setInput] = useState('')

  const models = [
    { id: 'gpt-4', name: 'GPT-4', type: 'Private API', icon: '🔒' },
    { id: 'claude', name: 'Claude 3', type: 'Private API', icon: '🔒' },
    { id: 'qwen', name: 'Qwen 2.5', type: 'Open Source', icon: '🌐' },
    { id: 'llama', name: 'Llama 3', type: 'Open Source', icon: '🌐' },
    { id: 'mistral', name: 'Mistral', type: 'Open Source', icon: '🌐' },
  ]

  const scripts = [
    { name: 'Hermetic Trading', desc: 'Alchemical market analysis', icon: '⚗️' },
    { name: 'Kabbalistic Predictor', desc: 'Sephirotic pattern recognition', icon: '🔯' },
    { name: 'Quantum Signals', desc: 'Entangled price movements', icon: '⚛️' },
    { name: 'Sacred Geometry', desc: 'Fibonacci + Golden ratio', icon: '📐' },
  ]

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { role: 'user', content: input }])
      setInput('')
      // Simuler une réponse
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Processing your request...' },
        ])
      }, 500)
    }
  }

  return (
    <div className="w-full h-full flex gap-4">
      {/* SIDEBAR GAUCHE : Choix modèle */}
      <div className="w-80 bg-[#0d0d0d] rounded-xl border-2 border-cyan-500/30 p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-6 h-6 text-cyan-400" />
          <h2 className="text-cyan-400 font-mono font-bold text-lg">AI Models</h2>
        </div>

        <div className="space-y-3">
          {models.map((model) => (
            <motion.button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-4 rounded-lg border transition-all ${
                selectedModel === model.id
                  ? 'bg-cyan-500/20 border-cyan-500 shadow-[0_0_20px_rgba(0,255,255,0.3)]'
                  : 'bg-cyan-900/10 border-cyan-500/30 hover:border-cyan-500/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-cyan-400 font-mono font-bold text-sm">
                  {model.icon} {model.name}
                </span>
                {selectedModel === model.id && (
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                )}
              </div>
              <span className="text-cyan-600 text-xs font-mono">{model.type}</span>
            </motion.button>
          ))}
        </div>

        <div className="mt-8 p-4 bg-cyan-900/10 rounded-lg border border-cyan-500/30">
          <div className="text-cyan-400 text-xs font-mono mb-2">USAGE</div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cyan-600">Tokens:</span>
              <span className="text-cyan-400">12.4K / 100K</span>
            </div>
            <div className="w-full h-1 bg-cyan-900/30 rounded-full overflow-hidden">
              <div className="w-[12%] h-full bg-cyan-500" />
            </div>
          </div>
        </div>
      </div>

      {/* CENTRE : Chat */}
      <div className="flex-1 bg-[#0d0d0d] rounded-xl border-2 border-cyan-500/30 flex flex-col">
        {/* Header */}
        <div className="h-14 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-b-2 border-cyan-500/30 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400 font-mono font-bold text-sm">QUANTUM AI CHAT</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-cyan-400 text-xs font-mono">CONNECTED</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-4 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-cyan-500/20 border border-cyan-500/50'
                    : 'bg-cyan-900/20 border border-cyan-500/30'
                }`}
              >
                <p className="text-cyan-300 font-mono text-sm">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 bg-cyan-900/10 border-t border-cyan-500/20">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask the AI anything..."
              className="flex-1 bg-transparent text-cyan-400 font-mono outline-none placeholder-cyan-600/50 text-sm"
            />
            <button
              onClick={handleSend}
              className="p-3 bg-cyan-500 hover:bg-cyan-400 rounded-lg transition-colors"
            >
              <Send className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* SIDEBAR DROITE : Scripts */}
      <div className="w-80 bg-[#0d0d0d] rounded-xl border-2 border-cyan-500/30 p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <Code2 className="w-6 h-6 text-cyan-400" />
          <h2 className="text-cyan-400 font-mono font-bold text-lg">Esoteric Scripts</h2>
        </div>

        <div className="space-y-3">
          {scripts.map((script, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-lg bg-cyan-900/10 border border-cyan-500/30 hover:border-cyan-500/50 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{script.icon}</span>
                  <span className="text-cyan-400 font-mono font-bold text-sm">{script.name}</span>
                </div>
                <Settings className="w-4 h-4 text-cyan-600" />
              </div>
              <p className="text-cyan-600 text-xs font-mono">{script.desc}</p>
            </motion.div>
          ))}
        </div>

        <button className="w-full mt-6 p-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500 rounded-lg text-cyan-400 font-mono font-bold text-sm transition-all flex items-center justify-center gap-2">
          <Zap className="w-4 h-4" />
          Create New Script
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL : ASSEMBLAGE
// ═══════════════════════════════════════════════════════════

export default function IADevicePage() {
  return (
    <div className="w-full h-screen bg-black flex flex-col">
      {/* ═══ PARTIE 1 : MAINS MICHEL-ANGE TECH (HAUT) ═══ */}
      <div className="w-full h-[50vh] relative">
        <Canvas
          camera={{ position: [0, 0, 20], fov: 60 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
        >
          <color attach="background" args={['#000000']} />
          <fog attach="fog" args={['#000000', 25, 50]} />

          <ambientLight intensity={0.3} />
          <pointLight position={[-10, 0, 5]} intensity={3} color="#ff8844" />
          <pointLight position={[10, 0, 5]} intensity={3} color="#00ffff" />
          <spotLight position={[0, 10, 10]} angle={0.5} intensity={2} color="#ffffff" />

          <Environment preset="studio" />
          <TechGrid />
          <LeftHand />
          <RightHand />
          <Spark />

          <EffectComposer multisampling={4}>
            <Bloom intensity={2.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
            <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={3} />
          </EffectComposer>

          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            maxDistance={30}
            minDistance={12}
            enablePan={false}
            makeDefault
          />
        </Canvas>

        {/* Dégradé */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
      </div>

      {/* ═══ PARTIE 2 : INTERFACE IA (BAS) ═══ */}
      <div className="w-full h-[50vh] p-8">
        <IAInterface />
      </div>
    </div>
  )
}
