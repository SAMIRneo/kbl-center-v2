'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Text, Billboard, MeshDistortMaterial, Sphere, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useRef, useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Terminal as TerminalIcon, ChevronRight, X, Minus, Maximize2 } from 'lucide-react'

// ═══════════════════════════════════════════════════════════
// PARTIE 1 : ANIMATION 3D (HAUT - 50vh)
// ═══════════════════════════════════════════════════════════

function MatrixRain() {
  const groupRef = useRef<THREE.Group>(null!)
  const count = 80

  const streams = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: (Math.random() - 0.5) * 100,
      z: (Math.random() - 0.5) * 100,
      speed: 0.5 + Math.random() * 1,
      length: 10 + Math.random() * 15,
      offset: Math.random() * 50,
    }))
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      child.position.y -= streams[i].speed * delta * 10
      if (child.position.y < -30) {
        child.position.y = 30 + streams[i].offset
      }
    })
  })

  const chars = ['0', '1', 'א', 'ב', 'ג', '☿', '✦', '◬', '⟁']

  return (
    <group ref={groupRef}>
      {streams.map((stream, i) => (
        <group key={i} position={[stream.x, 30 + stream.offset, stream.z]}>
          {Array.from({ length: Math.floor(stream.length) }).map((_, j) => (
            <Billboard key={j} position={[0, -j * 1.5, 0]}>
              <Text
                fontSize={0.6}
                color={j === 0 ? '#00ff41' : `rgba(0, 255, 65, ${1 - j / stream.length})`}
                outlineWidth={0.02}
                outlineColor="#000000"
              >
                {chars[Math.floor(Math.random() * chars.length)]}
              </Text>
            </Billboard>
          ))}
        </group>
      ))}
    </group>
  )
}

function TechNode() {
  const coreRef = useRef<THREE.Group>(null!)
  const orbitalsRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (!coreRef.current) return
    const t = state.clock.elapsedTime
    coreRef.current.rotation.y = t * 0.3
    coreRef.current.rotation.x = Math.sin(t * 0.2) * 0.3
    
    if (orbitalsRef.current) {
      orbitalsRef.current.rotation.y = t * 0.5
      orbitalsRef.current.rotation.z = t * 0.2
    }
  })

  return (
    <group position={[0, 0, -10]}>
      <Float speed={1.5} floatIntensity={0.5}>
        <group ref={coreRef}>
          <Sphere args={[1.5, 64, 64]}>
            <MeshDistortMaterial
              color="#00ff41"
              emissive="#00ff41"
              emissiveIntensity={2}
              metalness={0.9}
              roughness={0.1}
              distort={0.3}
              speed={2}
            />
          </Sphere>

          {[0, 1, 2].map((i) => (
            <mesh key={i} rotation={[Math.PI / 2, 0, (Math.PI / 3) * i]}>
              <torusGeometry args={[2 + i * 0.5, 0.05, 16, 100]} />
              <meshStandardMaterial
                color="#00ff41"
                emissive="#00ff41"
                emissiveIntensity={2.5}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}

          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2
            const radius = 2
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius
            return (
              <Float key={i} speed={2 + i * 0.2} floatIntensity={0.8}>
                <mesh position={[x, 0, z]}>
                  <sphereGeometry args={[0.1, 16, 16]} />
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

      <group ref={orbitalsRef}>
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i / 5) * Math.PI * 2
          const radius = 5
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          return (
            <Float key={i} speed={1.5 + i * 0.3} floatIntensity={1.5}>
              <group position={[x, 0, z]}>
                <Sphere args={[0.3, 32, 32]}>
                  <meshStandardMaterial
                    color="#00ff88"
                    emissive="#00ff88"
                    emissiveIntensity={2.5}
                  />
                </Sphere>
              </group>
            </Float>
          )
        })}
      </group>

      {['☿', '◬', '✦', '⟁'].map((symbol, i) => {
        const angle = (i / 4) * Math.PI * 2
        const radius = 8
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        return (
          <Float key={i} speed={1 + i * 0.2} floatIntensity={2}>
            <Billboard position={[x, 0, z]}>
              <Text fontSize={1.5} color="#00ff41" outlineWidth={0.1} outlineColor="#000000" fontWeight={900}>
                {symbol}
              </Text>
            </Billboard>
          </Float>
        )
      })}

      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} rotation={[0, (Math.PI / 3) * i, 0]}>
          <boxGeometry args={[0.05, 8, 0.05]} />
          <meshStandardMaterial color="#00ff41" emissive="#00ff41" emissiveIntensity={2} transparent opacity={0.6} />
        </mesh>
      ))}

      <Billboard position={[0, 5, 0]}>
        <Text fontSize={1.2} color="#00ff41" outlineWidth={0.1} outlineColor="#000000" fontWeight={900}>
          ◬ NEXUS TERMINAL ◭
        </Text>
      </Billboard>
    </group>
  )
}

// ═══════════════════════════════════════════════════════════
// PARTIE 2 : TERMINAL DANS UNE FENÊTRE (BAS - 50vh)
// ═══════════════════════════════════════════════════════════

function TerminalWindow() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<Array<{ type: 'input' | 'output' | 'error'; text: string }>>([
    { type: 'output', text: '> System initialized...' },
    { type: 'output', text: '> Quantum network connected' },
    { type: 'output', text: '' },
    { type: 'output', text: 'Type "help" for commands' },
    { type: 'output', text: '' },
  ])
  const terminalRef = useRef<HTMLDivElement>(null)

  const commands: Record<string, () => string[]> = {
    help: () => [
      '',
      '═══════════════════════════════════════',
      '  AVAILABLE COMMANDS',
      '═══════════════════════════════════════',
      '  help      - Display commands',
      '  status    - System status',
      '  market    - Market data',
      '  ai        - AI predictions',
      '  wallet    - Wallet info',
      '  clear     - Clear screen',
      '═══════════════════════════════════════',
      '',
    ],
    status: () => [
      '',
      '  STATUS: ✓ ONLINE',
      `  LATENCY: ${12 + Math.floor(Math.random() * 8)}ms`,
      `  PEERS: ${247 + Math.floor(Math.random() * 50)}`,
      '',
    ],
    market: () => [
      '',
      '  BTC/USD  $98,247  +2.34%',
      '  ETH/USD  $3,891   +1.87%',
      '  SOL/USD  $247     +4.21%',
      '',
    ],
    ai: () => [
      '',
      '> Analyzing patterns...',
      '',
      '  BTC 24h: ↗ BULLISH (78%)',
      '  ETH 24h: ↗ BULLISH (82%)',
      '',
    ],
    wallet: () => [
      '',
      '  STATUS: ✓ CONNECTED',
      '  ADDRESS: 0x742d...8f3a',
      '  BALANCE: 12.47 ETH',
      '',
    ],
    clear: () => {
      setHistory([])
      return []
    },
  }

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()
    setHistory((prev) => [...prev, { type: 'input', text: `$ ${cmd}` }])

    if (trimmedCmd === 'clear') {
      commands.clear()
      return
    }

    if (commands[trimmedCmd]) {
      const output = commands[trimmedCmd]()
      setHistory((prev) => [...prev, ...output.map((line) => ({ type: 'output' as const, text: line }))])
    } else if (trimmedCmd === '') {
      setHistory((prev) => [...prev, { type: 'output', text: '' }])
    } else {
      setHistory((prev) => [...prev, { type: 'error', text: `Command not found: ${cmd}` }, { type: 'output', text: '' }])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleCommand(input)
      setInput('')
    }
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  return (
    <div className="w-full h-full bg-[#1a1a1a] rounded-xl overflow-hidden shadow-[0_0_150px_rgba(0,255,65,0.4)] border-2 border-green-500/30">
      {/* HEADER DE FENÊTRE */}
      <div className="h-10 bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-b-2 border-green-500/30 flex items-center justify-between px-4">
        {/* Gauche : Boutons fenêtre */}
        <div className="flex items-center gap-2">
          <button className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
          <button className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
          <button className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
        </div>

        {/* Centre : Titre */}
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-mono font-bold text-sm tracking-wider">KBL TERMINAL</span>
        </div>

        {/* Droite : Indicateurs */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,65,1)]" />
          <span className="text-green-400 text-xs font-mono">ONLINE</span>
        </div>
      </div>

      {/* CORPS DU TERMINAL */}
      <div className="h-[calc(100%-40px)] flex flex-col bg-black/95">
        {/* Zone de sortie */}
        <div ref={terminalRef} className="flex-1 overflow-y-auto p-6 font-mono text-sm terminal-scroll">
          {history.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className={`mb-1 whitespace-pre ${
                entry.type === 'input' ? 'text-green-400 font-bold' : entry.type === 'error' ? 'text-red-400' : 'text-green-300'
              }`}
            >
              {entry.text}
            </motion.div>
          ))}
        </div>

        {/* Zone d'input */}
        <form onSubmit={handleSubmit} className="px-6 py-4 bg-green-900/10 border-t border-green-500/20">
          <div className="flex items-center gap-3">
            <ChevronRight className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-mono font-bold">$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-green-400 font-mono outline-none placeholder-green-600/50 text-sm"
              placeholder="enter command..."
              autoFocus
            />
          </div>
        </form>
      </div>

      <style jsx>{`
        .terminal-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .terminal-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        .terminal-scroll::-webkit-scrollbar-thumb {
          background: #00ff41;
          border-radius: 4px;
        }
        .terminal-scroll::-webkit-scrollbar-thumb:hover {
          background: #00cc33;
        }
      `}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL : ASSEMBLAGE DES 2 PARTIES
// ═══════════════════════════════════════════════════════════

export default function TerminalDevicePage() {
  return (
    <div className="w-full h-screen bg-black flex flex-col">
      {/* ═══ PARTIE 1 : ANIMATION 3D (HAUT) ═══ */}
      <div className="w-full h-[50vh] relative">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
          dpr={[1, 2]}
        >
          <color attach="background" args={['#000000']} />
          <fog attach="fog" args={['#000000', 20, 50]} />

          <ambientLight intensity={0.3} />
          <pointLight position={[0, 10, 10]} intensity={2} color="#00ff41" />
          <pointLight position={[-10, -10, 5]} intensity={1.5} color="#00ffff" />
          <spotLight position={[0, 20, 0]} angle={0.5} intensity={2} color="#00ff41" />

          <Environment preset="night" />
          <MatrixRain />
          <TechNode />

          <EffectComposer multisampling={4}>
            <Bloom intensity={1.8} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
            <ChromaticAberration offset={[0.002, 0.002]} />
            <Vignette offset={0.3} darkness={0.8} />
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

        {/* Dégradé de transition */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
      </div>

      {/* ═══ PARTIE 2 : TERMINAL DANS FENÊTRE (BAS) ═══ */}
      <div className="w-full h-[50vh] p-8 flex items-center justify-center">
        <div className="w-full max-w-6xl h-full">
          <TerminalWindow />
        </div>
      </div>
    </div>
  )
}
