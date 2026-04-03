import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const semester = searchParams.get('semester')
    const tahunAjaran = searchParams.get('tahunAjaran')

    // Get teacher (first one for now)
    const teacher = await db.teacher.findFirst()

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: 'Teacher not found' },
        { status: 404 }
      )
    }

    // Build SQL query
    let query = `
      SELECT id, teacherId, tahunAjaran, semester, mingguan, createdAt, updatedAt
      FROM Prosem
      WHERE teacherId = ?
    `
    const params: any[] = [teacher.id]

    if (semester) {
      query += ' AND semester = ?'
      params.push(semester)
    }
    if (tahunAjaran) {
      query += ' AND tahunAjaran = ?'
      params.push(tahunAjaran)
    }

    query += ' ORDER BY createdAt DESC'

    // Execute raw query
    const results = await (db as any).$queryRawUnsafe(query, ...params)

    // Convert BigInt to string if needed
    const prosems = results.map((r: any) => ({
      ...r,
      id: String(r.id),
      teacherId: String(r.teacherId)
    }))

    return NextResponse.json({
      success: true,
      prosems
    })
  } catch (error: any) {
    console.error('Error fetching PROSEM list:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil daftar PROSEM' },
      { status: 500 }
    )
  }
}
