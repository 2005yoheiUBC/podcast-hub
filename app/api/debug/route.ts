import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const url = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL || 'NOT SET'
    const masked = url === 'NOT SET' ? 'NOT SET' : url.slice(0, 30) + '...'

    const { neon } = await import('@neondatabase/serverless')
    if (url === 'NOT SET') return NextResponse.json({ env: masked, error: 'no connection string' }, { status: 500 })

    const sql = neon(url)
    const rows = await sql`SELECT 1 as ok`
    return NextResponse.json({ env: masked, db: rows })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e), stack: e instanceof Error ? e.stack?.slice(0, 500) : '' }, { status: 500 })
  }
}
