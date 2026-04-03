import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const teacherId = searchParams.get('teacherId')
    const semester = searchParams.get('semester')
    const academicYear = searchParams.get('academicYear')
    const aspect = searchParams.get('aspect')

    const where: any = {}
    if (studentId) where.studentId = studentId
    if (teacherId) where.teacherId = teacherId
    if (semester) where.semester = semester
    if (academicYear) where.academicYear = academicYear
    if (aspect) where.aspect = aspect

    const assessments = await db.studentAssessment.findMany({
      where,
      include: {
        student: {
          select: {
            name: true,
            nis: true
          }
        },
        teacher: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      assessments: assessments.map(assessment => ({
        id: assessment.id,
        studentId: assessment.studentId,
        studentName: assessment.student.name,
        studentNis: assessment.student.nis,
        teacherId: assessment.teacherId,
        teacherName: assessment.teacher.user.name,
        date: assessment.date,
        aspect: assessment.aspect,
        score: assessment.score,
        notes: assessment.notes,
        observation: assessment.observation,
        documentation: assessment.documentation,
        semester: assessment.semester,
        academicYear: assessment.academicYear
      }))
    })
  } catch (error) {
    console.error('Error fetching student assessments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch student assessments' },
      { status: 500 }
    )
  }
}
