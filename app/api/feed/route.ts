import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { fetchAllFeeds, type Article } from '@/lib/feeds'
import { scoreArticles, getDismissedArticleIds } from '@/lib/recommender'
import { sql, initDb } from '@/lib/db'

export const dynamic = 'force-dynamic'
const CACHE_TTL_MS = 15 * 60 * 1000

export async function GET(req: Request) {
  try {
    await initDb()
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ?? null

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || 'All'
    const refresh = searchParams.get('refresh') === '1'

    const latest = await sql<{ t: number }>`SELECT MAX(fetched_at) as t FROM articles`
    const lastFetch = latest[0]?.t ?? null
    const stale = !lastFetch || Date.now() - Number(lastFetch) > CACHE_TTL_MS

    if (stale || refresh) {
      const fresh = await fetchAllFeeds()
      for (const a of fresh) {
        await sql`
          INSERT INTO articles (id, title, description, url, image_url, source, category, published_at, fetched_at)
          VALUES (${a.id}, ${a.title}, ${a.description}, ${a.url}, ${a.imageUrl}, ${a.source}, ${a.category}, ${a.publishedAt}, ${a.fetchedAt})
          ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, image_url = COALESCE(articles.image_url, EXCLUDED.image_url), fetched_at = EXCLUDED.fetched_at
        `
      }
    }

    const dismissed = await getDismissedArticleIds(userId)
    const rows = await sql<Article>`
      SELECT id, title, description, url, image_url as "imageUrl", source, category,
             published_at as "publishedAt", fetched_at as "fetchedAt"
      FROM articles ORDER BY published_at DESC LIMIT 200
    `
    const filtered = rows.filter((a) => !dismissed.has(a.id))
    const scored = await scoreArticles(filtered, userId)
    const result = category === 'All' ? scored : scored.filter((a) => a.category === category)
    return NextResponse.json(result.slice(0, 60))
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
