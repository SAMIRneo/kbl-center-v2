'use client'

import { motion } from 'framer-motion'
import SephirotTree3D from '@/components/ui/sephirot/SephirotTree3D'
import { Activity, Cpu, Globe, ShieldCheck, Wifi } from 'lucide-react'

export default function Home() {
  return (
    <main className="relative w-full h-full overflow-hidden bg-black">
      
      {/* BACKGROUND 3D (L'Arbre) */}
      <div className="absolute inset-0 z-0">
        <SephirotTree3D />
      </div>

      {/* GRILLE DE FOND SUBTILE */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

      {/* HEADER UI */}
      <header className="absolute top-0 left-0 w-full z-20 p-8 flex justify-between items-start pointer-events-none">
        {/* Logo & Titre */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pointer-events-auto"
        >
          <h1 className="font-sans text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] select-none">
            KBL
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <div className="h-[2px] w-8 bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
            <p className="font-mono text-[10px] md:text-xs text-blue-400 tracking-[0.3em] uppercase">
              Sovereign Nexus v4.0
            </p>
          </div>
        </motion.div>

        {/* Status Panel (Droite) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden md:flex flex-col items-end gap-2 font-mono"
        >
          <div className="flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded backdrop-blur-md">
            <Wifi className="w-3 h-3 animate-pulse" />
            <span>LINK ESTABLISHED</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span>UPTIME: 99.9%</span>
            <span className="text-slate-600">|</span>
            <span>LATENCY: 12ms</span>
          </div>
        </motion.div>
      </header>

      {/* SIDEBAR GAUCHE (Menu Rapide) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute left-8 top-1/3 z-20 hidden md:flex flex-col gap-6 pointer-events-none"
      >
        {[
          { icon: Activity, label: 'MARKET DATA' },
          { icon: Cpu, label: 'AI NEURAL NET' },
          { icon: Globe, label: 'GLOBAL FEED' },
          { icon: ShieldCheck, label: 'SECURITY' },
        ].map((item, i) => (
          <div key={i} className="group flex items-center gap-4 pointer-events-auto cursor-pointer">
            <div className="p-2 rounded-lg border border-slate-800 bg-slate-950/50 text-slate-500 group-hover:text-blue-400 group-hover:border-blue-500/50 transition-all duration-300 shadow-[0_0_0_rgba(59,130,246,0)] group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <item.icon className="w-5 h-5" />
            </div>
            <span className="font-mono text-[10px] text-slate-500 tracking-widest opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              {item.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* FOOTER UI */}
      <div className="absolute bottom-0 left-0 w-full z-20 p-8 flex justify-between items-end pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col gap-1"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-blink" />
            <span className="font-mono text-[10px] text-slate-400 tracking-[0.2em] uppercase">
              Interactive Mode Active
            </span>
          </div>
          <p className="text-[10px] text-slate-600 max-w-xs leading-relaxed">
            Drag to explore the structure. Click on any node to access the terminal interface.
          </p>
        </motion.div>
        
        {/* Décoration technique coin bas droit */}
        <div className="hidden md:block">
          <svg width="100" height="100" viewBox="0 0 100 100" className="opacity-30">
            <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" className="animate-[spin_10s_linear_infinite]" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="white" strokeWidth="0.5" />
            <path d="M50 10 L50 90 M10 50 L90 50" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
      </div>
    </main>
  )
}
