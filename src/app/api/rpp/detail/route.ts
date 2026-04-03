import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

    // Fetch RPP from database
    const rpp = await db.rPP.findUnique({
      where: { id }
    })

    if (!rpp) {
      return NextResponse.json(
        { success: false, error: 'RPP tidak ditemukan' },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const rppData = {
      ...rpp,
      tujuanProfilLulusan: rpp.tujuanProfilLulusan ? JSON.parse(rpp.tujuanProfilLulusan) : {},
      kerangkaPembelajaran: rpp.kerangkaPembelajaran ? JSON.parse(rpp.kerangkaPembelajaran) : {},
      kegiatanPembelajaran: rpp.kegiatanPembelajaran ? JSON.parse(rpp.kegiatanPembelajaran) : {},
      rubrikPenilaian: rpp.rubrikPenilaian ? JSON.parse(rpp.rubrikPenilaian) : {}
    }

    return NextResponse.json({
      success: true,
      rpp: rppData
    })
  } catch (error: any) {
    console.error('Error fetching RPP detail:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil detail RPP' },
      { status: 500 }
    )
  }
}
