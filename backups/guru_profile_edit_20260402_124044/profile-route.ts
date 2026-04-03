import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID tidak ditemukan' },
        { status: 400 }
      )
    }

    const teacher = await db.teacher.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: 'Guru tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      teacher: {
        id: teacher.id,
        name: teacher.user.name,
        nuptk: teacher.nuptk
      }
    })
  } catch (error: any) {
    console.error('Error fetching teacher profile:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data Guru' },
      { status: 500 }
    )
  }
}
