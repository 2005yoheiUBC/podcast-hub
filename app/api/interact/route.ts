import { NextResponse } from 'next/server'
import { recordInteraction, type InteractionType } from '@/lib/recommender'
import { initDb } from '@/lib/db'

export async function POST(req: Request) {
  try {
    await initDb()
    const { articleId, category, type } = await req.json()
    if (!articleId || !category || !type) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    await recordInteraction(articleId, category, type as InteractionType)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
