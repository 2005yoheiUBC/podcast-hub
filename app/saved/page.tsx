'use client'
import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Episode {
  id: string
  title: string
  category: string
  status: string
  notes: string
  source_url: string
  created_at: number
}

const STATUS_LABELS: Record<string, string> = {
  idea: '💡 Idea', research: '🔍 Research', script: '✍️ Script',
  recording: '🎤 Recording', editing: '✂️ Editing', published: '✅ Published',
}

const CATEGORY_COLORS: Record<string, string> = {
  Culture: 'bg-pink-100 text-pink-700',
  Business: 'bg-blue-100 text-blue-700',
  Finance: 'bg-green-100 text-green-700',
  Startups: 'bg-orange-100 text-orange-700',
  Other: 'bg-gray-100 text-gray-600',
}

export default function SavedPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([])

  useEffect(() => {
    fetch('/api/episodes').then((r) => r.json()).then(setEpisodes)
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-6 pt-6">
      <h1 className="text-lg font-semibold text-gray-900 mb-6">All Episodes & Saved Ideas</h1>

      {episodes.length === 0 ? (
        <div className="text-center py-24 text-gray-400 text-sm">
          No episodes yet. Hit "Episode idea" on any article in the feed.
        </div>
      ) : (
        <div className="space-y-3">
          {episodes.map((ep) => (
            <div key={ep.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[ep.category] || CATEGORY_COLORS.Other}`}>
                      {ep.category}
                    </span>
                    <span className="text-xs text-gray-400">{STATUS_LABELS[ep.status] || ep.status}</span>
                    <span className="text-xs text-gray-300 ml-auto">
                      {formatDistanceToNow(new Date(Number(ep.created_at) * 1000), { addSuffix: true })}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{ep.title}</h3>
                  {ep.notes && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ep.notes}</p>
                  )}
                </div>
                {ep.source_url && (
                  <a
                    href={ep.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-blue-500 transition-colors shrink-0"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
