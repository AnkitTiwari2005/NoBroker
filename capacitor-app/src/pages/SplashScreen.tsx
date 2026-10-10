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
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #F59E0B, transparent)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #F59E0B, transparent)', transform: 'translate(-30%, 30%)' }} />

      {/* Logo */}
      <div className="splash-logo flex flex-col items-center">
        <img
          src="/logo-icon.png"
          alt="NoBroker"
          className="w-28 h-28 mb-6 drop-shadow-2xl"
          style={{ filter: 'drop-shadow(0 0 40px rgba(245,158,11,0.4))' }}
        />
        <img
          src="/logo-text.png"
          alt="NoBroker"
          className="h-10 object-contain"
          style={{ filter: 'brightness(10)' }}
        />
      </div>

      {/* Tagline */}
      <p className="splash-tagline text-white/60 text-base mt-5 font-medium tracking-wide">
        Zero Brokerage · Real Homes
      </p>

      {/* Progress bar */}
      <div className="absolute bottom-16 w-48 h-1 bg-white/15 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full splash-progress" />
      </div>
    </div>
  )
}
