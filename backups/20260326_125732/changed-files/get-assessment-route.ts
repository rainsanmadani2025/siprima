import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const teacherId = searchParams.get('teacherId')
    const studentId = searchParams.get('studentId')
    const date = searchParams.get('date')

    if (!teacherId) {
      return NextResponse.json(
        { success: false, error: 'Teacher ID tidak ditemukan' },
        { status: 400 }
      )
    }

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student ID diperlukan' },
        { status: 400 }
      )
    }

    if (!date) {
      return NextResponse.json(
        { success: false, error: 'Parameter date diperlukan' },
        { status: 400 }
      )
    }

    // Get teacher ID from user ID
    const teacher = await db.teacher.findUnique({
      where: { userId: teacherId }
    })

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: 'Guru tidak ditemukan' },
        { status: 404 }
      )
    }

    // Get all assessments for the student and period
    const assessments = await db.studentAssessment.findMany({
      where: {
        studentId: studentId,
        teacherId: teacher.id,
        date: {
          startsWith: date
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Format the assessments
    const formattedAssessments = assessments.map(assessment => ({
      id: assessment.id,
      aspect: assessment.aspect,
      score: assessment.score,
      observation: assessment.observation,
      notes: assessment.notes,
      documentation: assessment.documentation
    }))

    console.log('[get-assessment] Student ID:', studentId, 'Date:', date)
    console.log('[get-assessment] Found assessments:', formattedAssessments.length)
    console.log('[get-assessment] Assessments:', JSON.stringify(formattedAssessments, null, 2))

    return NextResponse.json({
      success: true,
      assessments: formattedAssessments
    })
  } catch (error) {
    console.error('Error fetching assessments:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data penilaian' },
      { status: 500 }
    )
  }
}
