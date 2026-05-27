'use client'
import { useState } from 'react'
import { Bookmark, Mic, X, ExternalLink, BookmarkCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export interface ArticleData {
  id: string
  title: string
  description: string
  url: string
  imageUrl: string | null
  source: string
  category: string
  publishedAt: number
  score: number
}

const CATEGORY_COLORS: Record<string, string> = {
  Culture: 'bg-pink-100 text-pink-700',
  Business: 'bg-blue-100 text-blue-700',
  Finance: 'bg-green-100 text-green-700',
  Startups: 'bg-orange-100 text-orange-700',
  Other: 'bg-gray-100 text-gray-600',
}

async function interact(articleId: string, category: string, type: string) {
  await fetch('/api/interact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ articleId, category, type }),
  })
}

export default function ArticleCard({
  article,
  onDismiss,
}: {
  article: ArticleData
  onDismiss: (id: string) => void
}) {
  const [saved, setSaved] = useState(false)
  const [asEpisode, setAsEpisode] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
  const catColor = CATEGORY_COLORS[article.category] || CATEGORY_COLORS.Other

  const handleSave = async () => {
    setSaved(!saved)
    await interact(article.id, article.category, saved ? 'view' : 'save')
  }

  const handleEpisode = async () => {
    if (asEpisode) return
    setAsEpisode(true)
    await interact(article.id, article.category, 'episode')
    await fetch('/api/episodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: article.title,
        category: article.category,
        sourceUrl: article.url,
        articleId: article.id,
      }),
    })
  }

  const handleDismiss = async () => {
    setDismissed(true)
    onDismiss(article.id)
    await interact(article.id, article.category, 'dismiss')
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all group">
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt=""
          className="w-full h-40 object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${catColor}`}>
            {article.category}
          </span>
          <span className="text-xs text-gray-400">{article.source}</span>
          <span className="text-xs text-gray-300 ml-auto">{timeAgo}</span>
        </div>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => interact(article.id, article.category, 'view')}
          className="block group/link"
        >
          <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1.5 group-hover/link:text-blue-600 line-clamp-2">
            {article.title}
            <ExternalLink size={10} className="inline ml-1 opacity-0 group-hover/link:opacity-50" />
          </h3>
        </a>

        {article.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{article.description}</p>
        )}

        <div className="flex items-center gap-1.5 pt-2 border-t border-gray-50">
          <button
            onClick={handleSave}
            title="Save"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              saved
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            {saved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
            {saved ? 'Saved' : 'Save'}
          </button>

          <button
            onClick={handleEpisode}
            title="Add to pipeline as episode idea"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              asEpisode
                ? 'bg-purple-50 text-purple-600'
                : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            <Mic size={13} />
            {asEpisode ? 'Added!' : 'Episode idea'}
          </button>

          <button
            onClick={handleDismiss}
            title="Not interested"
            className="ml-auto text-gray-300 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50"
          >
            <X size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
