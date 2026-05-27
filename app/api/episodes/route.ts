import { NextResponse } from 'next/server'
import { sql, initDb } from '@/lib/db'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function GET() {
  await initDb()
  const rows = await sql`SELECT * FROM episodes ORDER BY updated_at DESC`
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  await initDb()
  const body = await req.json()
  const { title, category = 'Other', status = 'idea', notes = '', sourceUrl = '', articleId = '' } = body
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 })

  const id = crypto.randomUUID()
  await sql`
    INSERT INTO episodes (id, title, category, status, notes, source_url, article_id)
    VALUES (${id}, ${title}, ${category}, ${status}, ${notes}, ${sourceUrl}, ${articleId})
  `
  const rows = await sql`SELECT * FROM episodes WHERE id = ${id}`
  return NextResponse.json(rows[0])
}
