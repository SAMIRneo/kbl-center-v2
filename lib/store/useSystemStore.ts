import { create } from 'zustand'

interface SystemMetrics {
  cpuUsage: number
  memoryUsage: number
  networkLatency: number
  activeConnections: number
  aiModelsLoaded: number
  lastUpdate: number
}

interface ActivityLog {
  id: string
  timestamp: number
  type: 'info' | 'warning' | 'success' | 'error'
  module: string
  message: string
}

interface SystemState {
  isActive: boolean
  currentModule: string
  systemStatus: 'idle' | 'processing' | 'alert' | 'success'
  marketSentiment: 'bullish' | 'bearish' | 'neutral'
  metrics: SystemMetrics
  activityLogs: ActivityLog[]
  setActive: (active: boolean) => void
  setCurrentModule: (module: string) => void
  setSystemStatus: (status: 'idle' | 'processing' | 'alert' | 'success') => void
  setMarketSentiment: (sentiment: 'bullish' | 'bearish' | 'neutral') => void
  updateMetrics: (metrics: Partial<SystemMetrics>) => void
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void
  simulateActivity: () => void
}

export const useSystemStore = create<SystemState>((set, get) => ({
  isActive: true,
  currentModule: 'home',
  systemStatus: 'idle',
  marketSentiment: 'neutral',
  metrics: {
    cpuUsage: 0,
    memoryUsage: 0,
    networkLatency: 12,
    activeConnections: 0,
    aiModelsLoaded: 0,
    lastUpdate: Date.now(),
  },
  activityLogs: [],
  
  setActive: (active) => set({ isActive: active }),
  
  setCurrentModule: (module) => {
    set({ currentModule: module })
    get().addActivityLog({
      type: 'info',
      module: 'system',
      message: `Module ${module} activated`,
    })
  },

  setSystemStatus: (status) => set({ systemStatus: status }),

  setMarketSentiment: (sentiment) => set({ marketSentiment: sentiment }),
  
  updateMetrics: (newMetrics) => 
    set((state) => ({
      metrics: { ...state.metrics, ...newMetrics, lastUpdate: Date.now() },
    })),
  
  addActivityLog: (log) => 
    set((state) => ({
      activityLogs: [
        {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          ...log,
        },
        ...state.activityLogs.slice(0, 99),
      ],
    })),
  
  simulateActivity: () => {
    const state = get()
    set({
      metrics: {
        ...state.metrics,
        cpuUsage: Math.random() * 40 + 20,
        memoryUsage: Math.random() * 30 + 40,
        networkLatency: Math.random() * 10 + 8,
        activeConnections: Math.floor(Math.random() * 50 + 20),
        lastUpdate: Date.now(),
      },
    })
  },
}))
