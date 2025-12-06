'use client'

export default function AudiovisuelPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">TIPHERET</h1>
          <p className="text-yellow-400 font-mono text-sm">[ BEAUTY - AUDIOVISUEL ]</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Audio Spectrum Analyzer</h2>
            <p className="text-slate-400 text-sm">Prochainement...</p>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">3D Gallery</h2>
            <p className="text-slate-400 text-sm">Prochainement...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
