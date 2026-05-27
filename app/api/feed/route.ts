import { NextResponse } from 'next/server'
import { fetchAllFeeds } from '@/lib/feeds'
import { scoreArticles, getDismissedArticleIds } from '@/lib/recommender'
import { sql, initDb } from '@/lib/db'

export const dynamic = 'force-dynamic'
const CACHE_TTL_MS = 15 * 60 * 1000

export async function GET(req: Request) {
  await initDb()
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') || 'All'
  const refresh = searchParams.get('refresh') === '1'

  const { rows: latest } = await sql`SELECT MAX(fetched_at) as t FROM articles`
  const lastFetch = latest[0]?.t as number | null
  const stale = !lastFetch || Date.now() - lastFetch * 1000 > CACHE_TTL_MS

  if (stale || refresh) {
    const fresh = await fetchAllFeeds()
    for (const a of fresh) {
      await sql`
        INSERT INTO articles (id, title, description, url, image_url, source, category, published_at, fetched_at)
        VALUES (${a.id}, ${a.title}, ${a.description}, ${a.url}, ${a.imageUrl}, ${a.source}, ${a.category}, ${a.publishedAt}, ${a.fetchedAt})
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          fetched_at = EXCLUDED.fetched_at
      `
    }
  }

  const dismissed = await getDismissedArticleIds()

  const { rows } = await sql`
    SELECT id, title, description, url, image_url as "imageUrl", source, category,
           published_at as "publishedAt", fetched_at as "fetchedAt"
    FROM articles
    ORDER BY published_at DESC
    LIMIT 200
  `

  const filtered = rows.filter((a) => !dismissed.has(a.id)) as Parameters<typeof scoreArticles>[0]
  const scored = await scoreArticles(filtered)
  const result = category === 'All' ? scored : scored.filter((a) => a.category === category)

  return NextResponse.json(result.slice(0, 60))
}
