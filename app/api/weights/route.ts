import { NextResponse } from 'next/server'
import { getCategoryWeights } from '@/lib/recommender'
import { initDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  await initDb()
  return NextResponse.json(await getCategoryWeights())
}
