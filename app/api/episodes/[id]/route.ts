import { NextResponse } from 'next/server'
import { sql, initDb } from '@/lib/db'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await initDb()
  const { id } = await params
  const body = await req.json()
  const { title, category, status, notes, source_url } = body

  if (title !== undefined) await sql`UPDATE episodes SET title = ${title}, updated_at = EXTRACT(EPOCH FROM NOW())::bigint WHERE id = ${id}`
  if (category !== undefined) await sql`UPDATE episodes SET category = ${category}, updated_at = EXTRACT(EPOCH FROM NOW())::bigint WHERE id = ${id}`
  if (status !== undefined) await sql`UPDATE episodes SET status = ${status}, updated_at = EXTRACT(EPOCH FROM NOW())::bigint WHERE id = ${id}`
  if (notes !== undefined) await sql`UPDATE episodes SET notes = ${notes}, updated_at = EXTRACT(EPOCH FROM NOW())::bigint WHERE id = ${id}`
  if (source_url !== undefined) await sql`UPDATE episodes SET source_url = ${source_url}, updated_at = EXTRACT(EPOCH FROM NOW())::bigint WHERE id = ${id}`

  const rows = await sql`SELECT * FROM episodes WHERE id = ${id}`
  return NextResponse.json(rows[0])
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await initDb()
  const { id } = await params
  await sql`DELETE FROM episodes WHERE id = ${id}`
  return NextResponse.json({ ok: true })
}
