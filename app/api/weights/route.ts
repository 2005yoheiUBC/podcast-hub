import { NextResponse } from 'next/server'
import { getCategoryWeights } from '@/lib/recommender'
import { initDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await initDb()
    return NextResponse.json(await getCategoryWeights())
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
