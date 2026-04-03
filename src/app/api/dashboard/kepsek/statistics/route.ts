import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/dashboard/kepsek/statistics - Get statistics for Kepsek dashboard
export async function GET() {
  try {
    // Get total students
    const totalStudents = await db.student.count({
      where: {
        status: 'aktif'
      }
    })

    // Get total teachers
    const totalTeachers = await db.teacher.count({
      where: {
        employmentStatus: 'tetap'
      }
    })

    const totalTeachersHonorer = await db.teacher.count({
      where: {
        employmentStatus: 'honorer'
      }
    })

    // Get total classes
    const totalClasses = await db.class.count()

    // Get classes by age group
    const classesA = await db.class.count({
      where: {
        ageGroup: 'A'
      }
    })

    const classesB = await db.class.count({
      where: {
        ageGroup: 'B'
      }
    })

    // Get today's attendance
    const today = new Date().toISOString().split('T')[0]

    const todayAttendance = await db.studentAttendance.findMany({
      where: {
        date: today
      }
    })

    const presentToday = todayAttendance.filter(a => a.status === 'hadir').length
    const totalPresent = presentToday
    const totalAbsent = todayAttendance.filter(a => a.status === 'izin' || a.status === 'sakit' || a.status === 'alpha').length

    const attendanceRate = totalStudents > 0
      ? ((totalPresent / totalStudents) * 100).toFixed(1)
      : '0'

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        totalTeachersHonorer,
        totalClasses,
        classesA,
        classesB,
        attendance: {
          rate: attendanceRate,
          present: totalPresent,
          absent: totalAbsent,
          total: totalStudents
        }
      }
    })
  } catch (error) {
    console.error('Error fetching kepsek statistics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
