'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import ArticleCard, { type ArticleData } from '@/components/ArticleCard'
import HeroCard from '@/components/HeroCard'
import WeightBar from '@/components/WeightBar'
import { getFinanceFallback } from '@/lib/fallback-images'
import { RefreshCw, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'

const CATEGORIES = ['All', 'Culture', 'Business', 'Finance', 'Startups']
const PAGE_SIZE = 9

function processImages(articles: ArticleData[]): ArticleData[] {
  const seen = new Set<string>()
  const financeFallbackUsed = new Set<string>()

  return articles.map((a) => {
    let imageUrl = a.imageUrl

    // Dedupe real images
    if (imageUrl) {
      if (seen.has(imageUrl)) {
        imageUrl = null
      } else {
        seen.add(imageUrl)
      }
    }

    // Finance: assign fallback (used when real image is absent or fails to load)
    if (a.category === 'Finance') {
      const fallback = getFinanceFallback(a.title, financeFallbackUsed)
      if (fallback && !imageUrl) return { ...a, imageUrl: fallback }
      return { ...a, imageUrl, fallbackImageUrl: fallback }
    }

    return { ...a, imageUrl }
  })
}

export default function FeedPage() {
  const [articles, setArticles] = useState<ArticleData[]>([])
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const gridRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async (cat: string, forceRefresh = false) => {
    const params = new URLSearchParams({ category: cat })
    if (forceRefresh) params.set('refresh', '1')
    const res = await fetch(`/api/feed?${params}`)
    return res.json() as Promise<ArticleData[]>
  }, [])

  useEffect(() => {
    setLoading(true)
    setPage(1)
    load(category).then((data) => { setArticles(processImages(data)); setLoading(false) })
  }, [category, load])

  const handleRefresh = async () => {
    setRefreshing(true)
    setPage(1)
    const data = await load(category, true)
    setArticles(processImages(data))
    setRefreshing(false)
  }

  const handleDismiss = (id: string) => setArticles((prev) => prev.filter((a) => a.id !== id))

  const goToPage = (p: number) => {
    setPage(p)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const hero = articles[0]
  const featured = articles.slice(1, 4)
  const rest = articles.slice(4)
  const totalPages = Math.ceil(rest.length / PAGE_SIZE)
  const pageArticles = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="flex gap-6 max-w-6xl mx-auto px-6 pt-6">
      <aside className="w-52 shrink-0 sticky top-20 h-fit">
        <WeightBar />
      </aside>

      <main className="flex-1 min-w-0 pb-12">
        {/* Filters */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  category === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {cat}
              </button>
            ))}
          </div>
          <button onClick={handleRefresh} disabled={refreshing}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100">
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
          <>
            {/* Hero */}
            {hero && <HeroCard article={hero} onDismiss={handleDismiss} />}

            {/* Featured row */}
            {featured.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {featured.map((a) => <ArticleCard key={a.id} article={a} onDismiss={handleDismiss} />)}
              </div>
            )}

            {/* More Stories */}
            {rest.length > 0 && (
              <>
                <div ref={gridRef} className="flex items-center gap-3 mt-10 mb-5 scroll-mt-24">
                  <h2 className="text-sm font-semibold text-gray-900 shrink-0">More Stories</h2>
                  <div className="flex-1 h-px bg-gray-200" />
                  {totalPages > 1 && (
                    <span className="text-xs text-gray-400 shrink-0">Page {page} of {totalPages}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {pageArticles.map((a) => <ArticleCard key={a.id} article={a} onDismiss={handleDismiss} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-8">
                    <button onClick={() => goToPage(page - 1)} disabled={page === 1}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      <ChevronLeft size={14} /> Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button key={p} onClick={() => goToPage(p)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          p === page ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                        }`}>
                        {p}
                      </button>
                    ))}

                    <button onClick={() => goToPage(page + 1)} disabled={page === totalPages}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
