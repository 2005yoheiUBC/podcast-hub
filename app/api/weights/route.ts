import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCategoryWeights } from '@/lib/recommender'
import { initDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await initDb()
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ?? null
    return NextResponse.json(await getCategoryWeights(userId))
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
