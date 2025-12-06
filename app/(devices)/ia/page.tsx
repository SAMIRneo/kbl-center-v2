'use client'

export default function IAPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">CHOKHMAH</h1>
          <p className="text-cyan-400 font-mono text-sm">[ WISDOM - INTELLIGENCE ARTIFICIELLE ]</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-2">Model Selection</h2>
            <p className="text-slate-400 text-sm">GPT-4, Claude, Gemini</p>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-2">Prompt Engineering</h2>
            <p className="text-slate-400 text-sm">Workspace avance</p>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-2">Predictions</h2>
            <p className="text-slate-400 text-sm">Analyse marche</p>
          </div>
        </div>
      </div>
    </div>
  )
}
