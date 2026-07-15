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

    const prosem = await db.prosem.findUnique({
      where: { id },
      select: {
        id: true,
        teacherId: true,
        tahunAjaran: true,
        semester: true,
        mingguan: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!prosem) {
      return NextResponse.json(
        { success: false, error: 'PROSEM tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, prosem })
  } catch (error: any) {
    console.error('Error fetching PROSEM detail:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil detail PROSEM' },
      { status: 500 }
    )
  }
}