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

    const prosems = await db.prosem.findMany({
      where,
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true
              }
            }
          }
        }
      },
      orderBy: [
        { tahunAjaran: 'desc' },
        { semester: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      prosems: prosems.map(prosem => ({
        id: prosem.id,
        teacherId: prosem.teacherId,
        teacher: {
          id: prosem.teacher.id,
          name: prosem.teacher.user.name,
          nuptk: prosem.teacher.nuptk
        },
        tahunAjaran: prosem.tahunAjaran,
        semester: prosem.semester,
        mingguan: typeof prosem.mingguan === 'string' ? JSON.parse(prosem.mingguan) : prosem.mingguan,
        createdAt: prosem.createdAt,
        updatedAt: prosem.updatedAt
      }))
    })
  } catch (error) {
    console.error('Error fetching PROSEM list:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil daftar PROSEM' },
      { status: 500 }
    )
  }
}
