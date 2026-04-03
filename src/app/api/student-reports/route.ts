import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Ambil semua raport atau filter berdasarkan siswa/semester/tahun ajaran
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const studentId = searchParams.get('studentId')
    const semester = searchParams.get('semester')
    const academicYear = searchParams.get('academicYear')

    const where: any = {}

    if (studentId) {
      where.studentId = studentId
    }

    if (semester) {
      where.semester = semester
    }

    if (academicYear) {
      where.academicYear = academicYear
    }

    const reports = await db.studentReport.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            nis: true,
            classId: true
          }
        }
      },
      orderBy: {
        generatedAt: 'desc'
      }
    })

    return NextResponse.json({ reports })
  } catch (error) {
    console.error('Error fetching student reports:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil raport' },
      { status: 500 }
    )
  }
}

// POST - Buat raport baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      studentId,
      semester,
      academicYear,
      assessments,
      teacherNotes,
      parentSuggestion,
      activities,
      status
    } = body

    if (!studentId || !semester || !academicYear) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    const report = await db.studentReport.create({
      data: {
        studentId,
        semester,
        academicYear,
        assessments: assessments ? JSON.stringify(assessments) : '{}',
        teacherNotes: teacherNotes || null,
        parentSuggestion: parentSuggestion || null,
        activities: activities ? JSON.stringify(activities) : '[]',
        status: status || 'draft',
        generatedAt: new Date()
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

    return NextResponse.json({ report }, { status: 201 })
  } catch (error) {
    console.error('Error creating student report:', error)
    return NextResponse.json(
      { error: 'Gagal membuat raport' },
      { status: 500 }
    )
  }
}
