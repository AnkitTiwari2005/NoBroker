import React, { useEffect } from 'react'
import { Building2 } from 'lucide-react'

interface SplashProps { onDone: () => void }

export default function SplashScreen({ onDone }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2200)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div
      className="flex flex-col items-center justify-center text-white relative overflow-hidden"
      style={{ height: '100dvh', background: 'linear-gradient(160deg, #1E3A5F 0%, #152B47 100%)' }}
    >
      {/* Logo */}
      <div className="splash-logo flex flex-col items-center">
        <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(255,255,255,0.15)]">
          <Building2 size={52} className="text-white" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight">NoBroker</h1>
      </div>

      {/* Tagline */}
      <p className="splash-tagline text-white/60 text-lg mt-4 font-medium">
        Find. Connect. Move In.
      </p>

      {/* Progress bar */}
      <div className="absolute bottom-20 w-48 h-1 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white rounded-full splash-progress" />
      </div>
    </div>
  )
}
