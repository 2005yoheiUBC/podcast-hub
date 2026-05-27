'use client'
import { useEffect, useState, useCallback } from 'react'
import ArticleCard, { type ArticleData } from '@/components/ArticleCard'
import WeightBar from '@/components/WeightBar'
import { RefreshCw, Loader2 } from 'lucide-react'

const CATEGORIES = ['All', 'Culture', 'Business', 'Finance', 'Startups']

export default function FeedPage() {
  const [articles, setArticles] = useState<ArticleData[]>([])
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async (cat: string, forceRefresh = false) => {
    const params = new URLSearchParams({ category: cat })
    if (forceRefresh) params.set('refresh', '1')
    const res = await fetch(`/api/feed?${params}`)
    return res.json() as Promise<ArticleData[]>
  }, [])

  useEffect(() => {
    setLoading(true)
    load(category).then((data) => { setArticles(data); setLoading(false) })
  }, [category, load])

  const handleRefresh = async () => {
    setRefreshing(true)
    const data = await load(category, true)
    setArticles(data)
    setRefreshing(false)
  }

  const handleDismiss = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="flex gap-6 max-w-6xl mx-auto px-6 pt-6">
      <aside className="w-52 shrink-0 space-y-4 sticky top-6 h-fit">
        <WeightBar />
      </aside>
      <main className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100"
          >
            {refreshing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <Loader2 size={24} className="animate-spin mr-2" />
            <span className="text-sm">Fetching latest articles…</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-24 text-gray-400 text-sm">No articles found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} onDismiss={handleDismiss} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
