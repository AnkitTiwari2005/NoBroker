import React, { useEffect } from 'react'

interface SplashProps { onDone: () => void }

export default function SplashScreen({ onDone }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2400)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div
      className="flex flex-col items-center justify-center relative overflow-hidden"
      style={{ height: '100dvh', background: 'linear-gradient(160deg, #1E3A5F 0%, #152B47 100%)' }}
    >
      {/* Decorative amber blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12), transparent)', transform: 'translate(35%, -35%)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent)', transform: 'translate(-35%, 35%)' }} />

      {/* Logo mark — no background, shows directly on navy */}
      <div className="splash-logo flex flex-col items-center">
        <img
          src="/logo-splash.png"
          alt="NoBroker"
          className="w-36 h-36 object-contain mb-2"
        />
        <p className="text-white/50 text-sm font-medium tracking-widest uppercase mt-4">
          Zero Brokerage · Real Homes
        </p>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-16 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full splash-progress" />
      </div>
    </div>
  )
}
