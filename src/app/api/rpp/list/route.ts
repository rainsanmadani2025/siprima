import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function safeJsonParse(value: string | null | undefined, fallback: any = {}): any {
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID RPP diperlukan' },
        { status: 400 }
      )
    }

    const rpp = await db.rPP.findUnique({
      where: { id }
    })

    if (!rpp) {
      return NextResponse.json(
        { success: false, error: 'RPP tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      rpp: {
        ...rpp,
        tujuanProfilLulusan: safeJsonParse(rpp.tujuanProfilLulusan),
        kerangkaPembelajaran: safeJsonParse(rpp.kerangkaPembelajaran),
        kegiatanPembelajaran: safeJsonParse(rpp.kegiatanPembelajaran),
        rubrikPenilaian: safeJsonParse(rpp.rubrikPenilaian)
      }
    })
  } catch (error: any) {
    console.error('Error fetching RPP detail:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil detail RPP' },
      { status: 500 }
    )
  }
}