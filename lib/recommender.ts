import { sql } from './db'
import type { Article } from './feeds'

export type InteractionType = 'save' | 'episode' | 'dismiss' | 'view'

const INTERACTION_DELTA: Record<InteractionType, number> = {
  episode: 4.0, save: 2.0, view: 0.3, dismiss: -1.5,
}

export async function getCategoryWeights(): Promise<Record<string, number>> {
  const rows = await sql<{ category: string; weight: number }>`SELECT category, weight FROM category_weights`
  return Object.fromEntries(rows.map((r) => [r.category, r.weight]))
}

export async function recordInteraction(articleId: string, category: string, type: InteractionType) {
  await sql`INSERT INTO interactions (article_id, type, category) VALUES (${articleId}, ${type}, ${category})`
  const delta = INTERACTION_DELTA[type]
  await sql`
    INSERT INTO category_weights (category, weight, updated_at)
    VALUES (${category}, GREATEST(0.1, 1.0 + ${delta}), EXTRACT(EPOCH FROM NOW())::bigint)
    ON CONFLICT (category) DO UPDATE SET
      weight = GREATEST(0.1, category_weights.weight + ${delta}),
      updated_at = EXTRACT(EPOCH FROM NOW())::bigint
  `
}

function recencyScore(publishedAt: number): number {
  return Math.exp(-(Date.now() - publishedAt) / (1000 * 60 * 60 * 36))
}

export async function scoreArticles(articles: Article[]): Promise<(Article & { score: number })[]> {
  const weights = await getCategoryWeights()
  const maxWeight = Math.max(...Object.values(weights), 1)
  return articles
    .map((a) => ({ ...a, score: ((weights[a.category] ?? 1) / maxWeight) * 0.65 + recencyScore(a.publishedAt) * 0.35 }))
    .sort((a, b) => b.score - a.score)
}

export async function getDismissedArticleIds(): Promise<Set<string>> {
  const rows = await sql<{ article_id: string }>`SELECT DISTINCT article_id FROM interactions WHERE type = 'dismiss'`
  return new Set(rows.map((r) => r.article_id))
}
