import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Fixed: Now properly gets teacher.id from userId

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, aspect, score, observation, notes, semester, academicYear, teacherId, documentation, date } = body

    if (!studentId || !aspect || !score) {
      return NextResponse.json(
        { success: false, error: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    if (!teacherId) {
      return NextResponse.json(
        { success: false, error: 'Teacher ID tidak ditemukan' },
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

    console.log('[save-assessment] userId:', teacherId, 'teacher.id:', teacher.id)

    // Use provided date or generate from current date
    let assessmentDate = date
    if (!assessmentDate) {
      const now = new Date()
      assessmentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    }

    // Check if assessment already exists for this student, aspect, and date/month
    const existingAssessment = await db.studentAssessment.findFirst({
      where: {
        studentId,
        aspect,
        date: {
          startsWith: assessmentDate.substring(0, 7) // Match year-month
        }
      }
    })

    let assessment

    if (existingAssessment) {
      // Update existing assessment
      assessment = await db.studentAssessment.update({
        where: {
          id: existingAssessment.id
        },
        data: {
          score,
          notes: notes || '',
          observation: observation || '',
          documentation: documentation || null,
          semester,
          academicYear
        }
      })
    } else {
      // Create new assessment
      console.log('[save-assessment] Creating assessment with:', {
        studentId,
        teacherId: teacher.id,
        aspect,
        score,
        date: assessmentDate
      })
      assessment = await db.studentAssessment.create({
        data: {
          studentId,
          teacherId: teacher.id,
          aspect,
          score,
          notes: notes || '',
          observation: observation || '',
          documentation: documentation || null,
          date: assessmentDate,
          semester,
          academicYear
        }
      })
    }

    return NextResponse.json({
      success: true,
      assessment
    })
  } catch (error) {
    console.error('Error saving assessment:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menyimpan penilaian' },
      { status: 500 }
    )
  }
}
