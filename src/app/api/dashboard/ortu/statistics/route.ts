import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/dashboard/ortu/statistics - Get statistics for Ortu dashboard
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      )
    }

    // Get student data
    const student = await db.student.findUnique({
      where: {
        id: studentId
      },
      include: {
        class: true,
        parent: {
          include: {
            user: true
          }
        }
      }
    })

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      )
    }

    // Get current month's attendance
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM

    const monthAttendances = await db.studentAttendance.findMany({
      where: {
        studentId,
        date: {
          startsWith: currentMonth
        }
      }
    })

    const presentDays = monthAttendances.filter(a => a.status === 'hadir').length
    const totalDays = monthAttendances.length
    const attendanceRate = totalDays > 0
      ? ((presentDays / totalDays) * 100).toFixed(0)
      : '0'

    // Get latest assessment
    const latestAssessment = await db.studentAssessment.findFirst({
      where: {
        studentId
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Get portfolio count
    const portfolioCount = await db.portfolio.count({
      where: {
        studentId
      }
    })

    // Get latest portfolios (last 3)
    const latestPortfolios = await db.portfolio.findMany({
      where: {
        studentId
      },
      orderBy: {
        date: 'desc'
      },
      take: 3
    })

    // Get student report (raport)
    const currentSemester = 'ganjil' // This should be dynamic based on current date
    const currentYear = '2024/2025'

    const studentReport = await db.studentReport.findFirst({
      where: {
        studentId,
        semester: currentSemester,
        academicYear: currentYear
      }
    })

    // Get teacher name
    let teacherName = null
    if (student.classId) {
      const classData = await db.class.findUnique({
        where: {
          id: student.classId
        },
        include: {
          teacher: {
            include: {
              user: true
            }
          }
        }
      })
      teacherName = classData?.teacher?.user?.name || null
    }

    return NextResponse.json({
      success: true,
      data: {
        student: {
          id: student.id,
          name: student.name,
          nis: student.nis,
          class: student.class?.name || null,
          teacherName: teacherName || null
        },
        attendance: {
          rate: attendanceRate,
          present: presentDays,
          total: totalDays,
          month: currentMonth
        },
        latestAssessment: latestAssessment ? {
          aspect: latestAssessment.aspect,
          score: latestAssessment.score,
          date: latestAssessment.date
        } : null,
        portfolio: {
          count: portfolioCount,
          latest: latestPortfolios
        },
        report: studentReport ? {
          semester: studentReport.semester,
          academicYear: studentReport.academicYear,
          status: studentReport.status,
          generatedAt: studentReport.generatedAt
        } : null
      }
    })
  } catch (error) {
    console.error('Error fetching ortu statistics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
