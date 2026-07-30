import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tema = searchParams.get('tema') || ''
    const kelompokUsia = searchParams.get('kelompokUsia') || ''
    const status = searchParams.get('status') || 'published'

    const where: any = {}

    if (tema) {
      where.tema = { contains: tema }
    }
    if (kelompokUsia) {
      where.kelompokUsia = kelompokUsia
    }
    if (status && status !== 'all') {
      where.status = status
    }

    const templates = await db.rPPTemplateKBC.findMany({
      where,
      select: {
        id: true,
        nama: true,
        tema: true,
        subtema: true,
        kelompokUsia: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { tema: 'asc' },
        { kelompokUsia: 'asc' },
        { subtema: 'asc' },
      ],
    })

    return NextResponse.json({
      success: true,
      templates,
    })
  } catch (error: any) {
    console.error('Error fetching KBC template list:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}