import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

// Police principale (UI)
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Police code/data (Chiffres, terminaux)
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KBL CENTER | Sovereign Digital Nexus',
  description: 'Central Hub for Crypto Intelligence, AI Prediction & Strategic Data.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} dark`}>
      <body className="bg-black">
        {/* Scanline Overlay pour effet écran */}
        <div className="fixed inset-0 z-50 pointer-events-none scanline opacity-20 mix-blend-overlay" />
        
        {children}
      </body>
    </html>
  )
}
