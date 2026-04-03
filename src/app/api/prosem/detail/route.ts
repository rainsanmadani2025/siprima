import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID wajib diisi' },
        { status: 400 }
      )
    }

    // Execute raw query
    const results = await (db as any).$queryRawUnsafe(
      'SELECT id, teacherId, tahunAjaran, semester, mingguan, createdAt, updatedAt FROM Prosem WHERE id = ?',
      id
    )

    if (!results || results.length === 0) {
      return NextResponse.json(
        { success: false, error: 'PROSEM tidak ditemukan' },
        { status: 404 }
      )
    }

    const prosem = {
      ...results[0],
      id: String(results[0].id),
      teacherId: String(results[0].teacherId)
    }

    return NextResponse.json({
      success: true,
      prosem
    })
  } catch (error: any) {
    console.error('Error fetching PROSEM detail:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil detail PROSEM' },
      { status: 500 }
    )
  }
}
