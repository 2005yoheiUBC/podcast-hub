'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function IntroPage() {
  const router = useRouter()
  const [leaving, setLeaving] = useState(false)

  const enter = () => {
    setLeaving(true)
    setTimeout(() => router.push('/feed'), 600)
  }

  useEffect(() => {
    const t = setTimeout(enter, 3400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center cursor-pointer overflow-hidden select-none"
      style={{ opacity: leaving ? 0 : 1, transition: 'opacity 0.6s ease' }}
      onClick={enter}
    >
      {/* Concentric rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[140, 240, 340, 440, 560].map((size) => (
          <div
            key={size}
            className="absolute rounded-full"
            style={{ width: size, height: size, border: '1px solid rgba(0,0,0,0.07)' }}
          />
        ))}

        {/* Radar sweep */}
        <div
          className="absolute rounded-full"
          style={{
            width: 560,
            height: 560,
            background: 'conic-gradient(from 0deg, rgba(0,0,0,0.06) 0deg, transparent 70deg)',
            animation: 'radar-spin 5s linear infinite',
          }}
        />

        {/* Center dot */}
        <div className="absolute w-2 h-2 rounded-full bg-black/20" />
      </div>

      {/* Wordmark */}
      <h1
        className="relative font-black text-black leading-none tracking-tighter"
        style={{
          fontSize: 'clamp(72px, 14vw, 130px)',
          animation: 'fade-in-up 0.9s ease forwards',
        }}
      >
        RADAR
      </h1>

      {/* Subtitle */}
      <p
        className="relative text-xs text-black/25 mt-5 tracking-[0.3em] uppercase"
        style={{ animation: 'fade-in-up 0.9s ease 0.25s both' }}
      >
        click anywhere to enter
      </p>
    </div>
  )
}
