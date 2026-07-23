import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // Cari parent berdasarkan userId
    let parent
    if (userId) {
      parent = await db.parent.findUnique({
        where: { userId },
        include: {
          children: {
            include: { class: true },
            where: { status: 'aktif' }
          }
        }
      })
    }

    // Fallback
    if (!parent) {
      parent = await db.parent.findFirst({
        include: {
          children: {
            include: { class: true },
            where: { status: 'aktif' }
          }
        }
      })
    }

    if (!parent || parent.children.length === 0) {
      return NextResponse.json({ success: true, children: [], reports: [] })
    }

    const childIds = parent.children.map(c => c.id)

    // Ambil raport yang statusnya published untuk anak-anak ortu ini
    const reports = await db.studentReport.findMany({
      where: {
        studentId: { in: childIds },
        status: 'published'
      },
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
        generatedAt: 'desc'
      }
    })

    // Group reports by student
    const childrenWithReports = parent.children.map(child => {
      const childReports = reports.filter(r => r.studentId === child.id)
      return {
        id: child.id,
        name: child.name,
        nis: child.nis,
        className: child.class?.name || null,
        reports: childReports.map(r => ({
          id: r.id,
          semester: r.semester,
          academicYear: r.academicYear,
          assessments: r.assessments,
          teacherNotes: r.teacherNotes,
          parentSuggestion: r.parentSuggestion,
          activities: r.activities,
          status: r.status,
          generatedAt: r.generatedAt
        }))
      }
    })

    return NextResponse.json({
      success: true,
      children: childrenWithReports
    })
  } catch (error) {
    console.error('Error fetching parent reports:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal memuat data raport' },
      { status: 500 }
    )
  }
}