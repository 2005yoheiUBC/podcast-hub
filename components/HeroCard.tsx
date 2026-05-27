'use client'
import { useState } from 'react'
import { Bookmark, Mic, X, ExternalLink, BookmarkCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { ArticleData } from './ArticleCard'

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

export default function HeroCard({ article, onDismiss }: { article: ArticleData; onDismiss: (id: string) => void }) {
  const [saved, setSaved] = useState(false)
  const [asEpisode, setAsEpisode] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const dark = !article.imageUrl
  const timeAgo = formatDistanceToNow(new Date(Number(article.publishedAt)), { addSuffix: true })
  const catColor = CATEGORY_COLORS[article.category] || CATEGORY_COLORS.Other

  const handleSave = async () => { setSaved(!saved); await interact(article.id, article.category, saved ? 'view' : 'save') }
  const handleEpisode = async () => {
    if (asEpisode) return
    setAsEpisode(true)
    await interact(article.id, article.category, 'episode')
    await fetch('/api/episodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: article.title, category: article.category, sourceUrl: article.url, articleId: article.id }),
    })
  }
  const handleDismiss = async () => { setDismissed(true); onDismiss(article.id); await interact(article.id, article.category, 'dismiss') }

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all hover:shadow-md ${dark ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100'}`}>
      <div className="flex min-h-[240px]">

        {/* Content */}
        <div className="flex-1 p-7 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${dark ? 'bg-white/10 text-white/60' : catColor}`}>
                {article.category}
              </span>
              <span className={`text-xs font-medium ${dark ? 'text-white/30' : 'text-gray-400'}`}>{article.source}</span>
              <span className={`text-xs ml-auto ${dark ? 'text-white/20' : 'text-gray-300'}`}>{timeAgo}</span>
            </div>

            <a href={article.url} target="_blank" rel="noopener noreferrer"
              onClick={() => interact(article.id, article.category, 'view')} className="group/link block">
              <h2 className={`font-serif text-[1.6rem] font-bold leading-snug mb-3 group-hover/link:opacity-70 transition-opacity ${dark ? 'text-white' : 'text-gray-900'}`}>
                {article.title}
                <ExternalLink size={13} className="inline ml-2 opacity-0 group-hover/link:opacity-40" />
              </h2>
            </a>

            {article.description && (
              <p className={`text-sm leading-relaxed line-clamp-3 ${dark ? 'text-white/40' : 'text-gray-500'}`}>
                {article.description}
              </p>
            )}
          </div>

          <div className={`flex items-center gap-1.5 pt-4 mt-5 border-t ${dark ? 'border-white/10' : 'border-gray-100'}`}>
            <button onClick={handleSave}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                saved
                  ? dark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                  : dark ? 'text-white/30 hover:text-blue-400 hover:bg-blue-500/10' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
              }`}>
              {saved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
              {saved ? 'Saved' : 'Save'}
            </button>
            <button onClick={handleEpisode}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                asEpisode
                  ? dark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600'
                  : dark ? 'text-white/30 hover:text-purple-400 hover:bg-purple-500/10' : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
              }`}>
              <Mic size={13} />
              {asEpisode ? 'Added!' : 'Episode idea'}
            </button>
            <button onClick={handleDismiss}
              className={`ml-auto p-1 rounded-lg transition-colors ${dark ? 'text-white/20 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:text-red-400 hover:bg-red-50'}`}>
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Image */}
        {article.imageUrl && (
          <div className="w-[42%] shrink-0 hidden sm:block">
            <img
              src={article.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
