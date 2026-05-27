import { NextResponse } from 'next/server'
import { recordInteraction, type InteractionType } from '@/lib/recommender'
import { initDb } from '@/lib/db'

export async function POST(req: Request) {
  await initDb()
  const { articleId, category, type } = await req.json()
  if (!articleId || !category || !type) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  await recordInteraction(articleId, category, type as InteractionType)
  return NextResponse.json({ ok: true })
}
