import { NextResponse } from 'next/server'
import { getSql, initDb } from '@/lib/db'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await initDb()
    const sql = getSql()
    const rows = await sql`SELECT * FROM episodes ORDER BY updated_at DESC`
    return NextResponse.json(rows)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await initDb()
    const sql = getSql()
    const body = await req.json()
    const { title, category = 'Other', status = 'idea', notes = '', sourceUrl = '', articleId = '' } = body
    if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 })
    const id = crypto.randomUUID()
    await sql`INSERT INTO episodes (id, title, category, status, notes, source_url, article_id) VALUES (${id}, ${title}, ${category}, ${status}, ${notes}, ${sourceUrl}, ${articleId})`
    const rows = await sql`SELECT * FROM episodes WHERE id = ${id}`
    return NextResponse.json(rows[0])
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
