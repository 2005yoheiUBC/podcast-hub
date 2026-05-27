'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function IntroPage() {
  const router = useRouter()
  const [leaving, setLeaving] = useState(false)
  const calledRef = useRef(false)

  const enter = () => {
    if (calledRef.current) return
    calledRef.current = true
    setLeaving(true)
    setTimeout(() => router.push('/feed'), 550)
  }

  useEffect(() => {
    const timer = setTimeout(enter, 1800)
    const onWheel = () => enter()
    window.addEventListener('wheel', onWheel, { once: true, passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('wheel', onWheel)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden select-none cursor-pointer"
      style={{ opacity: leaving ? 0 : 1, transition: 'opacity 0.55s ease' }}
      onClick={enter}
    >
      {/* Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[140, 240, 340, 440, 560].map((size) => (
          <div key={size} className="absolute rounded-full"
            style={{ width: size, height: size, border: '1px solid rgba(0,0,0,0.07)' }} />
        ))}
        <div className="absolute rounded-full" style={{
          width: 560, height: 560,
          background: 'conic-gradient(from 0deg, rgba(0,0,0,0.06) 0deg, transparent 70deg)',
          animation: 'radar-spin 5s linear infinite',
        }} />
        <div className="absolute w-2 h-2 rounded-full bg-black/20" />
      </div>

      <h1
        className="relative font-display font-black text-black leading-none tracking-tighter"
        style={{ fontSize: 'clamp(72px, 14vw, 130px)', animation: 'fade-in-up 0.7s ease forwards' }}
      >
        RADAR
      </h1>
    </div>
  )
}
