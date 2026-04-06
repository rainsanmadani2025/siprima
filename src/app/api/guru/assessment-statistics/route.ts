import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const semester = searchParams.get('semester')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID tidak ditemukan' },
        { status: 400 }
      )
    }

    if (!semester) {
      return NextResponse.json(
        { success: false, error: 'Parameter semester diperlukan' },
        { status: 400 }
      )
    }

    // Get teacher ID from user ID
    const teacher = await db.teacher.findUnique({
      where: { userId }
    })

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: 'Guru tidak ditemukan' },
        { status: 404 }
      )
    }

    // Get all students for this teacher's classes
    const students = await db.student.findMany({
      where: {
        class: {
          teacherId: teacher.id
        }
      },
      include: {
        assessments: {
          where: {
            semester: semester
          }
        }
      }
    })

    const totalStudents = students.length
    const assessedStudents = students.filter(s => s.assessments.length > 0).length
    const progress = totalStudents > 0 ? Math.round((assessedStudents / totalStudents) * 100) + '%' : '0%'

    // Calculate average score
    let allScores: string[] = []
    let anecdotalNotesCount = 0
    let documentationCount = 0
    const scoreCounts = { BB: 0, MB: 0, BSH: 0, BSB: 0 }

    students.forEach(student => {
      student.assessments.forEach(assessment => {
        if (assessment.score) {
          allScores.push(assessment.score)
          if (scoreCounts[assessment.score as keyof typeof scoreCounts] !== undefined) {
            scoreCounts[assessment.score as keyof typeof scoreCounts]++
          }
        }
        if (assessment.notes) anecdotalNotesCount++
        if (assessment.documentation) documentationCount++
      })
    })

    // Calculate average score
    let averageScore = '-'
    if (allScores.length > 0) {
      const scoreValues = { BB: 1, MB: 2, BSH: 3, BSB: 4 }
      const total = allScores.reduce((sum, score) => sum + (scoreValues[score as keyof typeof scoreValues] || 0), 0)
      const avg = total / allScores.length

      if (avg >= 3.5) averageScore = 'BSB'
      else if (avg >= 2.5) averageScore = 'BSH'
      else if (avg >= 1.5) averageScore = 'MB'
      else averageScore = 'BB'
    }

    const data = {
      totalStudents,
      assessedStudents,
      progress,
      averageScore,
      anecdotalNotesCount,
      documentationCount,
      scoreCounts
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching assessment statistics:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil statistik penilaian' },
      { status: 500 }
    )
  }
}
