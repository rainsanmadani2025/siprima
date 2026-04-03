import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get first Guru from Teacher table
    const guru = await db.teacher.findFirst({
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })

    if (!guru) {
      return NextResponse.json({
        success: false,
        error: 'Guru tidak ditemukan'
      })
    }

    return NextResponse.json({
      success: true,
      guru: {
        name: guru.user.name,
        nuptk: guru.nuptk || null
      }
    })
  } catch (error: any) {
    console.error('Error fetching guru data:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data Guru' },
      { status: 500 }
    )
  }
}
