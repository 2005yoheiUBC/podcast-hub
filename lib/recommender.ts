import { sql } from './db'
import type { Article } from './feeds'

export type InteractionType = 'save' | 'episode' | 'dismiss' | 'view'

const INTERACTION_DELTA: Record<InteractionType, number> = {
  episode: 0.4, save: 0.2, view: 0.03, dismiss: -0.15,
}

const DEFAULT_CATEGORIES = ['Culture', 'Business', 'Finance', 'Startups', 'Other']

export async function getCategoryWeights(userId?: string | null): Promise<Record<string, number>> {
  if (!userId) {
    return Object.fromEntries(DEFAULT_CATEGORIES.map((c) => [c, 1.0]))
  }
  const rows = await sql<{ category: string; weight: number }>`
    SELECT category, weight FROM user_category_weights WHERE user_id = ${userId}
  `
  const weights = Object.fromEntries(DEFAULT_CATEGORIES.map((c) => [c, 1.0]))
  for (const r of rows) weights[r.category] = r.weight
  return weights
}

export async function recordInteraction(
  articleId: string,
  category: string,
  type: InteractionType,
  userId?: string | null,
) {
  if (!userId) return
  await sql`INSERT INTO interactions (article_id, type, category, user_id) VALUES (${articleId}, ${type}, ${category}, ${userId})`
  const delta = INTERACTION_DELTA[type]
  await sql`
    INSERT INTO user_category_weights (user_id, category, weight, updated_at)
    VALUES (${userId}, ${category}, GREATEST(0.6, LEAST(1.8, 1.0 + ${delta})), EXTRACT(EPOCH FROM NOW())::bigint)
    ON CONFLICT (user_id, category) DO UPDATE SET
      weight = GREATEST(0.6, LEAST(1.8, user_category_weights.weight + ${delta})),
      updated_at = EXTRACT(EPOCH FROM NOW())::bigint
  `
}

function recencyScore(publishedAt: number): number {
  return Math.exp(-(Date.now() - publishedAt) / (1000 * 60 * 60 * 36))
}

export async function scoreArticles(
  articles: Article[],
  userId?: string | null,
): Promise<(Article & { score: number })[]> {
  const weights = await getCategoryWeights(userId)
  const maxWeight = Math.max(...Object.values(weights), 1)
  return articles
    .map((a) => ({
      ...a,
      score: Math.sqrt((weights[a.category] ?? 1) / maxWeight) * 0.3 + recencyScore(a.publishedAt) * 0.7,
    }))
    .sort((a, b) => b.score - a.score)
}

export async function getDismissedArticleIds(userId?: string | null): Promise<Set<string>> {
  if (!userId) return new Set()
  const rows = await sql<{ article_id: string }>`
    SELECT DISTINCT article_id FROM interactions WHERE type = 'dismiss' AND user_id = ${userId}
  `
  return new Set(rows.map((r) => r.article_id))
}
