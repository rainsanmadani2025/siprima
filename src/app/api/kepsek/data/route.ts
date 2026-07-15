import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const kepsekUser = await db.user.findFirst({
      where: { role: 'KEPSEK' },
      include: {
        teacher: {
          select: { nuptk: true }
        }
      }
    })

    if (!kepsekUser) {
      return NextResponse.json({
        success: false,
        error: 'Kepala Sekolah tidak ditemukan'
      })
    }

    return NextResponse.json({
      success: true,
      kepsek: {
        name: kepsekUser.name,
        nuptk: kepsekUser.teacher?.nuptk || null
      }
    })
  } catch (error: any) {
    console.error('Error fetching kepsek data:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data Kepala Sekolah' },
      { status: 500 }
    )
  }
}