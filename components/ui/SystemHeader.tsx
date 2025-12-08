'use client'

import { motion } from 'framer-motion'
import { Wifi, Cpu, Activity, HardDrive, Network } from 'lucide-react'
import { useSystemStore } from '@/lib/store/useSystemStore'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SystemHeader() {
  const { metrics, currentModule, isActive, systemStatus } = useSystemStore()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      useSystemStore.getState().simulateActivity()
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const getModuleColor = () => {
    const colors: Record<string, string> = {
      home: 'blue',
      ia: 'purple',
      terminal: 'green',
      politique: 'amber',
      communautes: 'pink',
      audiovisuel: 'cyan',
    }
    return colors[currentModule] || 'blue'
  }

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'processing': return '#8b5cf6'
      case 'alert': return '#ef4444'
      case 'success': return '#10b981'
      default: return '#3b82f6'
    }
  }

  const color = getModuleColor()

  return (
    <header className="fixed top-0 left-0 w-full z-50 pointer-events-none">
      <div className="p-4 md:p-6 flex justify-between items-start">
        {/* Module Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pointer-events-auto flex items-center gap-4"
        >
          <Link href="/" className="group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-xs font-mono text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
            >
              Home
            </motion.div>
          </Link>
          <span className="text-slate-700">/</span>
          <span className={`text-xs font-mono text-${color}-400 uppercase tracking-wider font-semibold`}>
            {currentModule}
          </span>
        </motion.div>

        {/* Status Panel Interactif */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden md:flex flex-col gap-2 pointer-events-auto"
        >
          {/* Status Principal */}
          <div className="flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded backdrop-blur-md">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Wifi className="w-3 h-3" />
            </motion.div>
            <span>LINK ESTABLISHED</span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 font-mono text-[9px]">
            <MetricCard 
              icon={<Cpu className="w-3 h-3" />}
              label="CPU"
              value={`${metrics.cpuUsage.toFixed(1)}%`}
              color={getStatusColor()}
            />
            <MetricCard 
              icon={<HardDrive className="w-3 h-3" />}
              label="MEM"
              value={`${metrics.memoryUsage.toFixed(1)}%`}
              color={getStatusColor()}
            />
            <MetricCard 
              icon={<Network className="w-3 h-3" />}
              label="LAT"
              value={`${metrics.networkLatency.toFixed(0)}ms`}
              color={getStatusColor()}
            />
            <MetricCard 
              icon={<Activity className="w-3 h-3" />}
              label="CONN"
              value={`${metrics.activeConnections}`}
              color={getStatusColor()}
            />
          </div>

          {/* Time Display */}
          <div className="text-[9px] text-slate-400 text-right font-mono border-t border-slate-800/50 pt-2">
            <div>{time.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' })}</div>
            <div className="text-slate-500">{time.toLocaleTimeString('en-US')}</div>
          </div>
        </motion.div>
      </div>
    </header>
  )
}

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-slate-950/60 border border-slate-800/50 rounded px-2 py-1.5 backdrop-blur-sm hover:border-blue-500/30 transition-colors"
      style={{
        borderColor: `${color}30`
      }}
    >
      <div className="flex items-center gap-1.5 mb-0.5" style={{ color }}>
        {icon}
        <span className="text-slate-500">{label}</span>
      </div>
      <div className="font-semibold" style={{ color }}>{value}</div>
    </motion.div>
  )
}
