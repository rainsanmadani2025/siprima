import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/dashboard/guru/statistics - Get statistics for Guru dashboard
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const classId = searchParams.get('classId')

    // Get students based on teacher's classes (like /api/students)
    let students: any[] = []
    let actualTeacherId: string | null = null

    if (userId) {
      // Find teacher by userId
      const teacher = await db.teacher.findFirst({
        where: { userId: userId },
        select: { id: true }
      })

      if (teacher) {
        actualTeacherId = teacher.id
        // Find all classes where this teacher is the homeroom teacher
        const teacherClasses = await db.class.findMany({
          where: { teacherId: teacher.id },
          select: { id: true }
        })

        if (teacherClasses.length > 0) {
          const classIds = teacherClasses.map(c => c.id)
          students = await db.student.findMany({
            where: {
              status: 'aktif',
              classId: { in: classIds }
            },
            include: {
              class: true
            }
          })
        }
      }
    } else if (classId) {
      // If specific classId provided (for admin testing), use it
      students = await db.student.findMany({
        where: {
          status: 'aktif',
          classId: classId
        },
        include: {
          class: true
        }
      })
    } else {
      // If no filter, get all active students (fallback)
      students = await db.student.findMany({
        where: {
          status: 'aktif'
        },
        include: {
          class: true
        }
      })
    }

    // Get today's attendance for these students
    const today = new Date().toISOString().split('T')[0]
    const studentIds = students.map(s => s.id)

    const todayAttendance = await db.studentAttendance.findMany({
      where: {
        studentId: {
          in: studentIds
        },
        date: today
      }
    })

    const presentCount = todayAttendance.filter(a => a.status === 'hadir').length
    const izinCount = todayAttendance.filter(a => a.status === 'izin').length
    const sakitCount = todayAttendance.filter(a => a.status === 'sakit').length
    const alphaCount = todayAttendance.filter(a => a.status === 'alpha').length

    // Get RPP data (from RPP table - the actual RPPs created by teacher)
    const allRPPs = await db.rPP.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get today's RPPH (Daily Plan)
    const todayRPPH = await db.dailyPlan.findFirst({
      where: {
        date: today,
        ...(actualTeacherId && { teacherId: actualTeacherId }),
        ...(classId && { classId })
      }
    })

    // Get student assessments for this month
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    const assessments = await db.studentAssessment.findMany({
      where: {
        studentId: {
          in: studentIds
        },
        date: {
          startsWith: currentMonth
        }
      },
      select: {
        studentId: true
      }
    })

    const assessedStudents = new Set(assessments.map(a => a.studentId)).size
    const assessmentProgress = students.length > 0
      ? ((assessedStudents / students.length) * 100).toFixed(0)
      : '0'

    return NextResponse.json({
      success: true,
      data: {
        students: {
          total: students.length,
          present: presentCount,
          izin: izinCount,
          sakit: sakitCount,
          alpha: alphaCount,
          attendanceRate: students.length > 0
            ? ((presentCount / students.length) * 100).toFixed(0)
            : '0'
        },
        rpp: {
          total: allRPPs.length,
          latest: allRPPs[0] || null,
          theme: allRPPs[0]?.tema || null,
          subTheme: allRPPs[0]?.subtema || null,
          createdAt: allRPPs[0]?.createdAt || null
        },
        rpph: {
          today: todayRPPH ? 'Selesai' : 'Belum',
          theme: todayRPPH?.theme || null,
          subTheme: todayRPPH?.subTheme || null,
          status: todayRPPH?.status || 'draft'
        },
        assessments: {
          progress: assessmentProgress,
          assessed: assessedStudents,
          total: students.length
        }
      }
    })
  } catch (error) {
    console.error('Error fetching guru statistics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
