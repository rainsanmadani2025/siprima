import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const semester = searchParams.get('semester')
    const tahunAjaran = searchParams.get('tahunAjaran')

    const where: any = {}
    if (semester) where.semester = semester
    if (tahunAjaran) where.tahunAjaran = tahunAjaran

    const rpps = await db.rPP.findMany({
      where,
      orderBy: [
        { tahunAjaran: 'desc' },
        { semester: 'desc' },
        { tema: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      rpps: rpps.map(rpp => ({
        id: rpp.id,
        tema: rpp.tema,
        subtema: rpp.subtema,
        semester: rpp.semester,
        tahunAjaran: rpp.tahunAjaran,
        fase: rpp.fase,
        kelompokUsia: rpp.kelompokUsia,
        guru: rpp.guru,
        kelas: rpp.kelas,
        createdAt: rpp.createdAt,
        updatedAt: rpp.updatedAt
      }))
    })
  } catch (error) {
    console.error('Error fetching RPP list:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil daftar RPP' },
      { status: 500 }
    )
  }
}
