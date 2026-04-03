import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get Kepala Sekolah from User table with role KEPSEK
    const kepsekUser = await (db as any).$queryRawUnsafe(
      `SELECT u.id, u.name, t.nuptk
       FROM User u
       LEFT JOIN Teacher t ON u.id = t.userId
       WHERE u.role = 'KEPSEK'
       LIMIT 1`
    )

    if (!kepsekUser || kepsekUser.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Kepala Sekolah tidak ditemukan'
      })
    }

    const kepsek = kepsekUser[0]

    return NextResponse.json({
      success: true,
      kepsek: {
        name: kepsek.name,
        nuptk: kepsek.nuptk || null
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
