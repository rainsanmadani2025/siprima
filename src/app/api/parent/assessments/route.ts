import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const semester = searchParams.get('semester')
    const academicYear = searchParams.get('academicYear')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID diperlukan' },
        { status: 400 }
      )
    }

    // Find parent by userId
    const parent = await db.parent.findUnique({
      where: { userId }
    })

    if (!parent) {
      return NextResponse.json(
        { success: false, error: 'Data orang tua tidak ditemukan' },
        { status: 404 }
      )
    }

    // Get children with class info
    const children = await db.student.findMany({
      where: { parentId: parent.id },
      include: {
        class: {
          select: { name: true, ageGroup: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    if (children.length === 0) {
      return NextResponse.json({
        success: true,
        children: [],
        assessments: {}
      })
    }

    const childIds = children.map(c => c.id)

    // Build filter for assessments
    const where: any = {
      studentId: { in: childIds }
    }

    if (semester) {
      where.semester = semester
    }
    if (academicYear) {
      where.academicYear = academicYear
    }

    // Fetch all assessments for this parent's children
    const assessments = await db.studentAssessment.findMany({
      where,
      include: {
        student: {
          select: { id: true, name: true, nis: true }
        },
        teacher: {
          include: {
            user: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    // Group assessments by studentId, then by aspect
    const groupedByStudent: Record<string, Record<string, any[]>> = {}
    for (const assessment of assessments) {
      const sid = assessment.studentId
      if (!groupedByStudent[sid]) groupedByStudent[sid] = {}
      if (!groupedByStudent[sid][assessment.aspect]) groupedByStudent[sid][assessment.aspect] = []
      groupedByStudent[sid][assessment.aspect].push({
        id: assessment.id,
        date: assessment.date,
        score: assessment.score,
        notes: assessment.notes,
        observation: assessment.observation,
        documentation: assessment.documentation,
        teacherName: assessment.teacher.user.name
      })
    }

    // Build response per child
    const childrenWithAssessments = children.map(child => {
      const childAssessments = groupedByStudent[child.id] || {}

      // Calculate overall score per aspect (latest assessment score)
      const aspectSummary: Record<string, any> = {}
      for (const [aspect, items] of Object.entries(childAssessments)) {
        const latestItem = items[items.length - 1] // last item is latest due to orderBy date asc
        aspectSummary[aspect] = {
          latestScore: latestItem.score,
          totalAssessments: items.length,
          assessments: items
        }
      }

      return {
        id: child.id,
        name: child.name,
        nis: child.nis,
        className: child.class ? `${child.class.name} (${child.class.ageGroup})` : null,
        aspects: aspectSummary
      }
    })

    // Get available semesters & academic years from this parent's children
    const availablePeriods = await db.studentAssessment.findMany({
      where: { studentId: { in: childIds } },
      select: { semester: true, academicYear: true },
      distinct: ['semester', 'academicYear'],
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      children: childrenWithAssessments,
      availablePeriods: availablePeriods.map(p => ({
        semester: p.semester,
        academicYear: p.academicYear
      }))
    })
  } catch (error) {
    console.error('Error fetching parent assessments:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data penilaian' },
      { status: 500 }
    )
  }
}