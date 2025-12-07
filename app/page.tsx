'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import SephirotTree3D from '@/components/ui/sephirot/SephirotTree3D'
import { Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    setIsMounted(true)
    setIsLoaded(true)
  }, [])

  return (
    <main className="relative w-full h-full overflow-hidden bg-black">
      
      {/* ULTRA ADVANCED BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{ 
            background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
            top: '20%', 
            left: '20%' 
          }}
          animate={{ 
            x: ['-10%', '10%', '-10%'],
            y: ['-10%', '10%', '-10%'],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute w-[700px] h-[700px] rounded-full blur-[150px]"
          style={{ 
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
            bottom: '20%', 
            right: '20%' 
          }}
          animate={{ 
            x: ['10%', '-10%', '10%'],
            y: ['10%', '-10%', '10%'],
            scale: [1.2, 1, 1.2]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ 
            background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)' 
          }}
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* 3D SEPHIROT TREE */}
      <div className="absolute inset-0 z-0">
        <SephirotTree3D />
      </div>

      {/* ULTRA ADVANCED GRID */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
        
        {/* Scanning lines */}
        <motion.div
          className="absolute w-full h-[3px]"
          style={{ 
            background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.8), transparent)',
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.9)'
          }}
          animate={{ y: ['0vh', '100vh'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute w-full h-[2px]"
          style={{ 
            background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.6), transparent)',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.8)'
          }}
          animate={{ y: ['100vh', '0vh'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear', delay: 2 }}
        />
        <motion.div
          className="absolute h-full w-[2px]"
          style={{ 
            background: 'linear-gradient(180deg, transparent, rgba(6, 182, 212, 0.6), transparent)',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.8)'
          }}
          animate={{ x: ['0vw', '100vw'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear', delay: 1 }}
        />
      </div>

      {/* PREMIUM FLOATING PARTICLES */}
      {isMounted && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => {
            const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4']
            const randomColor = colors[Math.floor(Math.random() * colors.length)]
            const size = Math.random() * 4 + 1
            const startX = Math.random() * 100
            const startY = Math.random() * 100
            const endX = Math.random() * 100
            const endY = Math.random() * 100
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  left: `${startX}%`,
                  top: `${startY}%`,
                  background: `linear-gradient(135deg, ${randomColor}, transparent)`,
                  boxShadow: `0 0 ${Math.random() * 20 + 10}px ${randomColor}cc`
                }}
                animate={{ 
                  left: [`${startX}%`, `${endX}%`],
                  top: [`${startY}%`, `${endY}%`],
                  opacity: [0, 1, 0.8, 0],
                  scale: [0, 1, 1.5, 0]
                }}
                transition={{ 
                  duration: Math.random() * 8 + 5, 
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: 'easeInOut'
                }}
              />
            )
          })}
        </div>
      )}

      {/* ========================================= */}
      {/* LOGO 3D "KBL MVP" + QUANTUM EDITION ONLY */}
      {/* ========================================= */}
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ opacity }}
        className="absolute top-8 left-8 z-30 pointer-events-auto"
      >
        <div className="relative group" style={{ perspective: '2000px' }}>
          {/* Outer glow */}
          <motion.div
            className="absolute -inset-6 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: 'radial-gradient(circle at center, rgba(59,130,246,0.5) 0%, rgba(139,92,246,0.4) 40%, transparent 70%)',
              filter: 'blur(30px)'
            }}
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Middle glow layer */}
          <motion.div
            className="absolute -inset-4 rounded-2xl opacity-80"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3), rgba(16,185,129,0.15))',
              filter: 'blur(20px)'
            }}
            animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />

          {/* Main 3D container */}
          <motion.div
            className="relative"
            whileHover={{ 
              scale: 1.05,
              rotateY: 8,
              rotateX: -3
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ 
              transformStyle: 'preserve-3d',
              transformOrigin: 'center center'
            }}
          >
            {/* Background card */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-blue-950/90 to-purple-950/95 backdrop-blur-2xl rounded-2xl border-2 border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)]" />

            {/* Content container */}
            <div className="relative px-8 py-5">
              {/* KBL MVP Text */}
              <div className="flex items-center gap-3">
                {/* KBL */}
                <motion.h1
                  className="font-black tracking-tighter select-none"
                  style={{
                    fontSize: '3.5rem',
                    background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 20%, #c7d2fe 40%, #a5b4fc 60%, #818cf8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 40px rgba(59, 130, 246, 0.8)) drop-shadow(0 8px 24px rgba(0, 0, 0, 1))',
                    transform: 'translateZ(40px)'
                  }}
                >
                  KBL
                </motion.h1>

                {/* MVP */}
                <motion.span
                  className="font-black tracking-tighter select-none"
                  style={{
                    fontSize: '3.5rem',
                    background: 'linear-gradient(135deg, #a78bfa 0%, #c084fc 30%, #d946ef 60%, #e879f9 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 40px rgba(168, 85, 247, 0.8)) drop-shadow(0 8px 24px rgba(0, 0, 0, 1))',
                    transform: 'translateZ(40px)'
                  }}
                >
                  MVP
                </motion.span>
              </div>

              {/* Quantum Edition */}
              <div className="flex items-center gap-3 mt-2">
                <motion.div
                  className="h-[2px] rounded-full"
                  style={{
                    width: '60px',
                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)'
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(59, 130, 246, 0.6)',
                      '0 0 20px rgba(139, 92, 246, 0.9)',
                      '0 0 10px rgba(6, 182, 212, 0.6)'
                    ],
                    width: ['60px', '80px', '60px']
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                <p className="font-mono text-[10px] text-blue-400 tracking-[0.35em] uppercase font-bold">
                  Quantum Edition
                </p>
              </div>
            </div>

            {/* 3D Shadow Layers */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-20 blur-[2px]" 
              style={{ 
                transform: 'translateZ(-15px)',
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                pointerEvents: 'none'
              }} 
            />
            <div 
              className="absolute inset-0 rounded-2xl opacity-10 blur-[4px]" 
              style={{ 
                transform: 'translateZ(-30px)',
                background: '#000000',
                pointerEvents: 'none'
              }} 
            />
          </motion.div>

          {/* Animated particles around logo */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: i % 2 === 0 ? '#3b82f6' : '#8b5cf6',
                boxShadow: `0 0 10px ${i % 2 === 0 ? '#3b82f6' : '#8b5cf6'}`,
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 3) * 30}%`
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.5, 0.8]
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* ENTRANCE ANIMATION */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute inset-0 z-50 bg-gradient-to-br from-black via-blue-950 to-black flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity }
                }}
              >
                <Sparkles className="w-20 h-20 text-blue-500" style={{ filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.8))' }} />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
