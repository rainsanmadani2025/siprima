import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7)
    const year = searchParams.get('year') || new Date().getFullYear().toString()

    // Get all teachers with their data
    const teachers = await db.teacher.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            phone: true,
            isActive: true
          }
        },
        classes: {
          include: {
            _count: {
              select: {
                students: true
              }
            }
          }
        }
      }
    })

    // Get attendance data for the specified month
    const startDate = `${year}-${month}-01`
    const endDate = `${year}-${month}-31`

    const attendanceData = await db.teacherAttendance.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    // Group attendance by teacher
    const attendanceMap = new Map<string, { hadir: number, izin: number, sakit: number, alpha: number }>()
    attendanceData.forEach(att => {
      if (!attendanceMap.has(att.teacherId)) {
        attendanceMap.set(att.teacherId, { hadir: 0, izin: 0, sakit: 0, alpha: 0 })
      }
      const stats = attendanceMap.get(att.teacherId)!
      if (att.status === 'hadir') stats.hadir++
      else if (att.status === 'izin') stats.izin++
      else if (att.status === 'sakit') stats.sakit++
      else if (att.status === 'alpha') stats.alpha++
    })

    // Get today's attendance
    const today = new Date().toISOString().split('T')[0]
    const todayAttendance = await db.teacherAttendance.findMany({
      where: { date: today }
    })

    const todayAttendanceMap = new Map<string, string>()
    todayAttendance.forEach(att => {
      todayAttendanceMap.set(att.teacherId, att.status)
    })

    return NextResponse.json({
      success: true,
      teachers: teachers.map(teacher => {
        const stats = attendanceMap.get(teacher.id) || { hadir: 0, izin: 0, sakit: 0, alpha: 0 }
        const total = stats.hadir + stats.izin + stats.sakit + stats.alpha
        const percentage = total > 0 ? Math.round((stats.hadir / total) * 100) : 0

        return {
          id: teacher.id,
          userId: teacher.user.id,
          name: teacher.user.name,
          username: teacher.user.username,
          email: teacher.user.email,
          phone: teacher.user.phone,
          nuptk: teacher.nuptk,
          employmentStatus: teacher.employmentStatus,
          subjects: teacher.subjects,
          lastEducation: teacher.lastEducation,
          isActive: teacher.user.isActive,
          classes: teacher.classes.map(c => ({
            id: c.id,
            name: c.name,
            studentCount: c._count.students
          })),
          attendance: {
            hadir: stats.hadir,
            izin: stats.izin,
            sakit: stats.sakit,
            alpha: stats.alpha,
            percentage
          },
          todayAttendance: todayAttendanceMap.get(teacher.id) || null
        }
      })
    })
  } catch (error) {
    console.error('Error fetching teacher data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch teacher data' },
      { status: 500 }
    )
  }
}
