import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Ambil semua portfolio atau filter berdasarkan siswa/tipe
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const studentId = searchParams.get('studentId')
    const type = searchParams.get('type') // karya/foto/video

    const where: any = {}

    if (studentId) {
      where.studentId = studentId
    }

    if (type) {
      where.type = type
    }

    const portfolios = await db.portfolio.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            nis: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json({ success: true, portfolios })
  } catch (error) {
    console.error('Error fetching portfolios:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil portfolio' },
      { status: 500 }
    )
  }
}

// POST - Buat portfolio baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, title, type, description, fileUrl, videoUrl, date } = body

    if (!studentId || !title || !type) {
      return NextResponse.json(
        { success: false, error: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    const portfolio = await db.portfolio.create({
      data: {
        studentId,
        title,
        type,
        description: description || null,
        fileUrl: fileUrl || null,
        videoUrl: videoUrl || null,
        date: date || new Date().toISOString().split('T')[0]
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            nis: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, portfolio }, { status: 201 })
  } catch (error) {
    console.error('Error creating portfolio:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal membuat portfolio' },
      { status: 500 }
    )
  }
}
