import { neon } from '@neondatabase/serverless'

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL!
export const sql = neon(connectionString)

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      url TEXT NOT NULL,
      image_url TEXT,
      source TEXT NOT NULL,
      category TEXT NOT NULL,
      published_at BIGINT NOT NULL,
      fetched_at BIGINT NOT NULL
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS interactions (
      id SERIAL PRIMARY KEY,
      article_id TEXT NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::bigint
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS category_weights (
      category TEXT PRIMARY KEY,
      weight REAL NOT NULL DEFAULT 1.0,
      updated_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::bigint
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS episodes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Other',
      status TEXT NOT NULL DEFAULT 'idea',
      notes TEXT,
      source_url TEXT,
      article_id TEXT,
      created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::bigint,
      updated_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::bigint
    )
  `
  const categories = ['Culture', 'Business', 'Finance', 'Startups', 'Other']
  for (const cat of categories) {
    await sql`INSERT INTO category_weights (category, weight) VALUES (${cat}, 1.0) ON CONFLICT DO NOTHING`
  }
}
