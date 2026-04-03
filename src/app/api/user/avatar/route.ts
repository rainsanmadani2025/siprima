import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Get user avatar
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

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        avatar: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      avatar: user.avatar
    })
  } catch (error: any) {
    console.error('Error fetching user avatar:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil avatar' },
      { status: 500 }
    )
  }
}
