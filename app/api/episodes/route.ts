import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sql, initDb } from '@/lib/db'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await initDb()
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ?? null
    const rows = userId
      ? await sql`SELECT * FROM episodes WHERE user_id = ${userId} ORDER BY updated_at DESC`
      : await sql`SELECT * FROM episodes WHERE user_id IS NULL ORDER BY updated_at DESC`
    return NextResponse.json(rows)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await initDb()
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ?? null
    const { title, category = 'Other', status = 'idea', notes = '', sourceUrl = '', articleId = '' } = await req.json()
    if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 })
    const id = crypto.randomUUID()
    await sql`INSERT INTO episodes (id, title, category, status, notes, source_url, article_id, user_id) VALUES (${id}, ${title}, ${category}, ${status}, ${notes}, ${sourceUrl}, ${articleId}, ${userId})`
    const rows = await sql`SELECT * FROM episodes WHERE id = ${id}`
    return NextResponse.json(rows[0])
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
