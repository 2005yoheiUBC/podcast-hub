'use client'
import { useEffect, useState } from 'react'

const COLORS: Record<string, string> = {
  Culture: 'bg-pink-400',
  Business: 'bg-blue-400',
  Finance: 'bg-green-400',
  Startups: 'bg-orange-400',
  Other: 'bg-gray-400',
}

export default function WeightBar() {
  const [weights, setWeights] = useState<Record<string, number>>({})

  useEffect(() => {
    fetch('/api/weights').then((r) => r.json()).then(setWeights)
  }, [])

  const max = Math.max(...Object.values(weights), 1)
  const entries = Object.entries(weights).sort((a, b) => b[1] - a[1])

  if (!entries.length) return null

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Your taste profile
      </p>
      <div className="space-y-2">
        {entries.map(([cat, w]) => (
          <div key={cat} className="flex items-center gap-2">
            <span className="text-xs text-gray-600 w-16 shrink-0">{cat}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all ${COLORS[cat] || 'bg-gray-400'}`}
                style={{ width: `${(w / max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-8 text-right">{w.toFixed(1)}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3">Updates as you save and dismiss articles.</p>
    </div>
  )
}
