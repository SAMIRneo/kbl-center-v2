'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, MeshDistortMaterial, Sphere } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useRef, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scroll, Feather, BookOpen, Edit3 } from 'lucide-react'

// ═══════════════════════════════════════════════════════════
// BACKGROUND : MAGMA + ALPHABETS HAUTE QUALITÉ
// ═══════════════════════════════════════════════════════════

function MagmaBlob({ position }: { position: [number, number, number] }) {
  const blobRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!blobRef.current) return
    const t = state.clock.elapsedTime
    blobRef.current.rotation.x = Math.sin(t * 0.3 + position[0]) * 0.5
    blobRef.current.rotation.y = t * 0.2 + position[1]
    blobRef.current.rotation.z = Math.cos(t * 0.25 + position[2]) * 0.3
  })

  return (
    <mesh ref={blobRef} position={position}>
      <sphereGeometry args={[3, 64, 64]} />
      <MeshDistortMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={0.8}
        metalness={0.9}
        roughness={0.1}
        distort={0.8}
        speed={2.5}
      />
    </mesh>
  )
}

function MagmaParticles() {
  const count = 400
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30
      ),
      speed: 0.2 + Math.random() * 1.0,
      scale: 0.05 + Math.random() * 0.2,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime

    particles.forEach((particle, i) => {
      const matrix = new THREE.Matrix4()
      const offsetX = Math.sin(time * particle.speed + particle.phase) * 4
      const offsetY = Math.cos(time * particle.speed * 0.7 + particle.phase) * 4
      const offsetZ = Math.sin(time * particle.speed * 0.5 + particle.phase) * 3
      
      matrix.setPosition(
        particle.position.x + offsetX,
        particle.position.y + offsetY,
        particle.position.z + offsetZ
      )
      matrix.scale(new THREE.Vector3(particle.scale, particle.scale, particle.scale))
      meshRef.current.setMatrixAt(i, matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial 
        color="#000000" 
        emissive="#ffffff" 
        emissiveIntensity={0.5}
        transparent
        opacity={0.7}
      />
    </instancedMesh>
  )
}

function FloatingAlphabets() {
  const alphabets = useMemo(() => {
    return [
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ',
      'אבגדהוזחטיכלמנסעפצקרשת',
      'ابتثجحخدذرزسشصضطظعغفقكلمنهوي',
      'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ',
      '道德經天地人和陰陽五行八卦',
      'ॐ अ आ इ ई उ ऊ ए ऐ ओ औ',
      'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊ',
    ]
  }, [])

  const chars = useMemo(() => {
    return Array.from({ length: 100 }, () => {
      const alphabet = alphabets[Math.floor(Math.random() * alphabets.length)]
      const char = alphabet[Math.floor(Math.random() * alphabet.length)]
      return {
        char,
        position: [
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 30,
        ] as [number, number, number],
        speed: 0.5 + Math.random() * 1.5,
      }
    })
  }, [alphabets])

  return (
    <group>
      {chars.map((item, i) => (
        <FloatingChar key={i} {...item} />
      ))}
    </group>
  )
}

function FloatingChar({ char, position, speed }: { char: string; position: [number, number, number]; speed: number }) {
  const ref = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * speed) * 2
    ref.current.rotation.y = t * 0.3
  })

  return (
    <group ref={ref} position={position}>
      <mesh>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial
          transparent
          opacity={0.4 + Math.random() * 0.4}
        >
          <canvasTexture
            attach="map"
            image={(() => {
              const canvas = document.createElement('canvas')
              canvas.width = 128
              canvas.height = 128
              const ctx = canvas.getContext('2d')!
              ctx.fillStyle = '#ffffff'
              ctx.font = 'bold 80px serif'
              ctx.textAlign = 'center'
              ctx.textBaseline = 'middle'
              ctx.fillText(char, 64, 64)
              return canvas
            })()}
          />
        </meshBasicMaterial>
      </mesh>
    </group>
  )
}

function MagmaWaves() {
  const wavesRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!wavesRef.current) return
    wavesRef.current.rotation.z = state.clock.elapsedTime * 0.08
  })

  return (
    <group ref={wavesRef}>
      {Array.from({ length: 12 }).map((_, i) => {
        const radius = 20 + i * 3
        return (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius, 0.08, 16, 100]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.4 - i * 0.03}
              transparent
              opacity={0.25 - i * 0.015}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function EnvironmentBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 75 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    >
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 15, 60]} />
      
      <ambientLight intensity={0.3} />
      <pointLight position={[15, 15, 15]} intensity={4} color="#ffffff" />
      <pointLight position={[-15, -15, 15]} intensity={3} color="#888888" />
      <pointLight position={[0, 0, -15]} intensity={3} color="#ffffff" />

      <MagmaBlob position={[-12, 8, -10]} />
      <MagmaBlob position={[12, -8, -10]} />
      <MagmaBlob position={[0, 12, -15]} />
      <MagmaBlob position={[-10, -10, -8]} />
      <MagmaBlob position={[10, 10, -12]} />

      <MagmaParticles />
      <FloatingAlphabets />
      <MagmaWaves />

      <Sphere args={[35, 64, 64]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.08}
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </Sphere>

      <EffectComposer>
        <Bloom intensity={2.5} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette offset={0.2} darkness={0.6} />
      </EffectComposer>

      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.2}
        enableDamping
        dampingFactor={0.03}
      />
    </Canvas>
  )
}

// ═══════════════════════════════════════════════════════════
// FENÊTRE CENTRALE : PARCHEMIN GNOSIS
// ═══════════════════════════════════════════════════════════

interface Article {
  id: number
  title: string
  content: string
  date: string
  category: string
}

function GnosisWindow() {
  const [articles] = useState<Article[]>([
    {
      id: 1,
      title: 'The Nature of Consciousness',
      content:
        'Consciousness is not a product of the brain, but rather the fundamental fabric of reality itself. The brain acts as a filter, reducing infinite awareness into a localized experience.\n\nThrough meditation and contemplation, one can expand beyond the limitations of the physical vessel and touch the infinite. This is the first step on the path to true gnosis.\n\nThe ancient mystery schools understood this truth. Their initiates underwent rigorous training to awaken dormant faculties of perception. What modern science dismisses as mysticism, they knew as direct experience.',
      date: '2025-12-01',
      category: 'Philosophy',
    },
    {
      id: 2,
      title: 'Hermetic Principles Applied',
      content:
        'As above, so below. The macrocosm reflects the microcosm. By understanding the universal laws, we gain mastery over our internal world and external reality.\n\nThe principle of correspondence teaches that patterns repeat at every scale. What manifests in the cosmos also manifests in the atom, in society, and within the human psyche.\n\nTo change the outer world, one must first master the inner. This is the secret of the alchemists—true transmutation begins within.',
      date: '2025-11-28',
      category: 'Hermeticism',
    },
    {
      id: 3,
      title: 'Quantum Mysticism',
      content:
        'The observer effect in quantum mechanics suggests consciousness collapses wave functions. Ancient mystics knew this truth: reality responds to awareness.\n\nWhat physicists call "quantum entanglement," the mystics called "unity consciousness." Separation is an illusion. All things are interconnected in a vast web of consciousness.\n\nThe double-slit experiment proves that observation affects reality. Meditation is the art of becoming the perfect observer.',
      date: '2025-11-15',
      category: 'Science',
    },
    {
      id: 4,
      title: 'Sacred Geometry & Creation',
      content:
        'The universe is constructed on geometric principles. The flower of life, Metatron\'s cube, the golden ratio—these are not mere mathematical curiosities but blueprints of creation itself.\n\nEvery atom, every galaxy follows these patterns. DNA spirals in the golden ratio. Crystals form perfect geometric structures. Nature speaks the language of sacred geometry.\n\nTo understand these patterns is to understand the mind of the Creator.',
      date: '2025-11-01',
      category: 'Sacred Geometry',
    },
  ])

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(articles[0])

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#1a1410] via-[#2a1f18] to-[#1a1410] relative overflow-hidden rounded-2xl shadow-[0_0_200px_rgba(212,165,116,0.6),0_0_100px_rgba(255,255,255,0.3)] border-4 border-amber-700/60">
      {/* Texture parchemin */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Bords déchirés */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#2a1f18] to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#2a1f18] to-transparent" />
        <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-[#2a1f18] to-transparent" />
        <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-[#2a1f18] to-transparent" />
      </div>

      {/* Header centré */}
      <div className="relative z-10 p-6 border-b-2 border-amber-900/40 flex items-center justify-center">
        <div className="flex items-center gap-4">
          <Scroll className="w-10 h-10 text-amber-600" />
          <div className="text-center">
            <h1 className="text-4xl font-serif text-amber-600 tracking-wide">GNOSIS</h1>
            <p className="text-amber-800 text-sm italic mt-1">Sacred Knowledge Repository</p>
          </div>
        </div>

        <button className="absolute right-6 flex items-center gap-2 px-5 py-3 bg-amber-900/30 hover:bg-amber-900/50 border-2 border-amber-700/50 rounded-lg text-amber-600 font-serif font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(212,165,116,0.4)]">
          <Feather className="w-5 h-5" />
          New Article
        </button>
      </div>

      {/* Layout centré */}
      <div className="relative z-10 flex h-[calc(100%-100px)]">
        {/* Sidebar articles */}
        <div className="w-80 border-r-2 border-amber-900/40 p-6 overflow-y-auto custom-scrollbar">
          <h2 className="text-amber-600 font-serif text-lg mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Archives
          </h2>

          <div className="space-y-3">
            {articles.map((article) => (
              <motion.div
                key={article.id}
                whileHover={{ x: 6, scale: 1.01 }}
                onClick={() => setSelectedArticle(article)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedArticle?.id === article.id
                    ? 'bg-amber-900/50 border-2 border-amber-700 shadow-[0_0_15px_rgba(212,165,116,0.3)]'
                    : 'bg-amber-900/20 border-2 border-amber-900/30 hover:bg-amber-900/35 hover:border-amber-700/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono text-amber-800 bg-amber-900/40 px-2 py-1 rounded-full border border-amber-700/30">
                    {article.category}
                  </span>
                  <span className="text-xs text-amber-700 font-mono">{article.date}</span>
                </div>
                <h3 className="text-amber-600 font-serif text-sm font-bold leading-snug">
                  {article.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contenu article - CENTRÉ */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            {selectedArticle && (
              <motion.div
                key={selectedArticle.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-full max-w-3xl"
              >
                {/* Header article */}
                <div className="mb-8 pb-6 border-b-2 border-amber-900/40 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-sm font-mono text-amber-800 bg-amber-900/40 px-4 py-2 rounded-full border border-amber-700/30">
                      {selectedArticle.category}
                    </span>
                    <span className="text-sm text-amber-700 font-mono">{selectedArticle.date}</span>
                  </div>
                  <h1 className="text-4xl font-serif text-amber-600 leading-tight">
                    {selectedArticle.title}
                  </h1>
                </div>

                {/* Contenu */}
                <div className="prose prose-invert prose-amber max-w-none">
                  <p className="text-amber-100 leading-relaxed text-lg font-serif whitespace-pre-line text-center">
                    {selectedArticle.content}
                  </p>

                  {/* Ornement */}
                  <div className="flex justify-center my-10">
                    <div className="flex items-center gap-4 text-amber-800">
                      <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-800 to-amber-800" />
                      <span className="text-3xl">✦</span>
                      <div className="w-24 h-px bg-gradient-to-l from-transparent via-amber-800 to-amber-800" />
                    </div>
                  </div>
                </div>

                {/* Actions centrées */}
                <div className="flex justify-center gap-4 mt-8">
                  <button className="flex items-center gap-2 px-5 py-3 bg-amber-900/30 hover:bg-amber-900/50 border-2 border-amber-700/50 rounded-lg text-amber-600 font-serif font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(212,165,116,0.3)]">
                    <Edit3 className="w-5 h-5" />
                    Edit Article
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(42, 31, 24, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #92400e, #d4a574);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #d4a574, #92400e);
        }
      `}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════

export default function GnosisDevicePage() {
  return (
    <div className="w-full h-screen relative overflow-hidden">
      <EnvironmentBackground />
      <div className="fixed inset-0 z-10 flex items-center justify-center p-12">
        <div className="w-[75%] h-[85%]">
          <GnosisWindow />
        </div>
      </div>
    </div>
  )
}
