import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { recordInteraction, type InteractionType } from '@/lib/recommender'
import { initDb } from '@/lib/db'

export async function POST(req: Request) {
  try {
    await initDb()
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ?? null
    const { articleId, category, type } = await req.json()
    if (!articleId || !category || !type) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    await recordInteraction(articleId, category, type as InteractionType, userId)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
