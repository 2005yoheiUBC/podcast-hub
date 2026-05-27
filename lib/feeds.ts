import Parser from 'rss-parser'
import crypto from 'crypto'

const parser = new Parser({
  timeout: 8000,
  customFields: { item: [['media:content', 'mediaContent'], ['media:thumbnail', 'mediaThumbnail']] },
})

export interface Article {
  id: string
  title: string
  description: string
  url: string
  imageUrl: string | null
  source: string
  category: string
  publishedAt: number
  fetchedAt: number
}

interface FeedSource {
  url: string
  source: string
  category: string
}

const SOURCES: FeedSource[] = [
  // Culture
  { url: 'https://www.reddit.com/r/OutOfTheLoop/.rss', source: 'Reddit: OOTL', category: 'Culture' },
  { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge', category: 'Culture' },
  { url: 'https://feeds.feedburner.com/Mashable', source: 'Mashable', category: 'Culture' },
  // Business
  { url: 'https://fortune.com/feed/', source: 'Fortune', category: 'Business' },
  { url: 'https://www.fastcompany.com/rss', source: 'Fast Company', category: 'Business' },
  { url: 'https://feeds.inc.com/home/updates', source: 'Inc.', category: 'Business' },
  // Finance
  { url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', source: 'CNBC', category: 'Finance' },
  { url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml', source: 'WSJ Markets', category: 'Finance' },
  { url: 'https://www.investing.com/rss/news.rss', source: 'Investing.com', category: 'Finance' },
  // Startups
  { url: 'https://techcrunch.com/feed/', source: 'TechCrunch', category: 'Startups' },
  { url: 'https://news.ycombinator.com/rss', source: 'Hacker News', category: 'Startups' },
  { url: 'https://www.producthunt.com/feed', source: 'Product Hunt', category: 'Startups' },
  { url: 'https://www.technologyreview.com/feed/', source: 'MIT Tech Review', category: 'Startups' },
]

function makeId(url: string): string {
  return crypto.createHash('md5').update(url).digest('hex')
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim().slice(0, 300)
}

function extractImage(html: string): string | null {
  const m = html?.match(/<img[^>]+src=["']([^"']+)["']/)
  const url = m?.[1]
  if (!url || url.startsWith('data:') || url.length < 10) return null
  return url
}

function pickImage(item: Record<string, unknown>): string | null {
  return (
    (item.enclosure as { url?: string })?.url ||
    (item.mediaContent as { $?: { url?: string } })?.$?.url ||
    (item.mediaThumbnail as { $?: { url?: string } })?.$?.url ||
    extractImage(item['content:encoded'] as string || '') ||
    extractImage(item.content as string || '') ||
    null
  )
}

async function fetchFeed(source: FeedSource): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.url)
    const now = Date.now()
    return (feed.items || []).slice(0, 8).map((item) => ({
      id: makeId(item.link || item.guid || item.title || Math.random().toString()),
      title: item.title?.trim() || 'Untitled',
      description: stripHtml(item.contentSnippet || item.summary || item.content || ''),
      url: item.link || '',
      imageUrl: pickImage(item as unknown as Record<string, unknown>),
      source: source.source,
      category: source.category,
      publishedAt: item.pubDate ? new Date(item.pubDate).getTime() : now,
      fetchedAt: now,
    }))
  } catch {
    return []
  }
}

export async function fetchAllFeeds(): Promise<Article[]> {
  const results = await Promise.allSettled(SOURCES.map(fetchFeed))
  const articles: Article[] = []
  for (const r of results) {
    if (r.status === 'fulfilled') articles.push(...r.value)
  }
  return articles
}
