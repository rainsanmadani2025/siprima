import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function getTodayDate(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getCurrentMonth(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date') || getTodayDate()
    const month = searchParams.get('month') || getCurrentMonth()

    // ===== ABSENSI SISWA PER TANGGAL =====
    const classes = await db.class.findMany({
      include: {
        students: {
          where: { status: 'aktif' },
          select: { id: true, name: true }
        },
        teacher: {
          select: { user: { select: { name: true } } }
        }
      },
      orderBy: { name: 'asc' }
    })

    const studentAttendances = await db.studentAttendance.findMany({
      where: { date },
      select: {
        studentId: true,
        status: true
      }
    })

    const statusCountMap: Record<string, Record<string, number>> = {}
    studentAttendances.forEach(a => {
      if (!statusCountMap[a.studentId]) statusCountMap[a.studentId] = { hadir: 0, izin: 0, sakit: 0, alpha: 0 }
      if (statusCountMap[a.studentId][a.status] !== undefined) {
        statusCountMap[a.studentId][a.status]++
      }
    })

    const classAttendance = classes.map(cls => {
      const studentIds = cls.students.map(s => s.id)
      const totals = { hadir: 0, izin: 0, sakit: 0, alpha: 0 }
      let assessedCount = 0

      studentIds.forEach(sid => {
        if (statusCountMap[sid]) {
          assessedCount++
          totals.hadir += statusCountMap[sid].hadir
          totals.izin += statusCountMap[sid].izin
          totals.sakit += statusCountMap[sid].sakit
          totals.alpha += statusCountMap[sid].alpha
        }
      })

      const totalRecords = totals.hadir + totals.izin + totals.sakit + totals.alpha
      const percent = totalRecords > 0 ? Math.round((totals.hadir / totalRecords) * 100) : 0

      return {
        classId: cls.id,
        className: cls.name,
        ageGroup: cls.ageGroup,
        totalStudents: cls.students.length,
        hadir: totals.hadir,
        izin: totals.izin,
        sakit: totals.sakit,
        alpha: totals.alpha,
        assessedCount,
        percent,
        isComplete: assessedCount === cls.students.length && cls.students.length > 0
      }
    })

    // ===== ABSENSI GURU PER TANGGAL =====
    const teachers = await db.teacher.findMany({
      include: {
        user: { select: { name: true } },
        classes: { select: { name: true } }
      },
      orderBy: { user: { name: 'asc' } }
    })

    const teacherAttendances = await db.teacherAttendance.findMany({
      where: { date },
      select: {
        teacherId: true,
        status: true,
        checkInTime: true,
        checkOutTime: true,
        notes: true
      }
    })

    const taMap: Record<string, typeof teacherAttendances[0]> = {}
    teacherAttendances.forEach(ta => { taMap[ta.teacherId] = ta })

    const teacherDailyData = teachers.map(t => {
      const ta = taMap[t.id]
      return {
        teacherId: t.id,
        teacherName: t.user.name,
        classNames: t.classes.map(c => c.name).join(', '),
        status: ta?.status || '-',
        checkInTime: ta?.checkInTime || '-',
        checkOutTime: ta?.checkOutTime || '-',
        notes: ta?.notes || '',
        isHoliday: false
      }
    })

    // ===== SUMMARY =====
    const totalStudentRecords = studentAttendances.length
    const studentHadir = studentAttendances.filter(a => a.status === 'hadir').length
    const studentTotal = classes.reduce((sum, c) => sum + c.students.length, 0)
    const studentPercent = totalStudentRecords > 0 ? Math.round((studentHadir / totalStudentRecords) * 100) : 0

    const totalTeacherRecords = teacherAttendances.length
    const teacherHadir = teacherAttendances.filter(a => a.status === 'hadir').length
    const teacherTotal = teachers.length
    const teacherPercent = totalTeacherRecords > 0 ? Math.round((teacherHadir / totalTeacherRecords) * 100) : 0

    const izinStudents = studentAttendances.filter(a => a.status === 'izin').length
    const izinTeachers = teacherAttendances.filter(a => a.status === 'izin').length
    const sakitStudents = studentAttendances.filter(a => a.status === 'sakit').length
    const sakitTeachers = teacherAttendances.filter(a => a.status === 'sakit').length

    // ===== REKAP BULANAN SISWA =====
    const monthStart = `${month}-01`
    const [yearStr, monthStr] = month.split('-')
    const lastDay = new Date(Number(yearStr), Number(monthStr), 0).getDate()
    const monthEnd = `${month}-${String(lastDay).padStart(2, '0')}`

    const monthlyStudentAttendance = await db.studentAttendance.findMany({
      where: {
        date: { gte: monthStart, lte: monthEnd }
      },
      select: { studentId: true, status: true }
    })

    const studentMonthlyMap: Record<string, Record<string, number>> = {}
    monthlyStudentAttendance.forEach(a => {
      if (!studentMonthlyMap[a.studentId]) studentMonthlyMap[a.studentId] = { hadir: 0, izin: 0, sakit: 0, alpha: 0 }
      if (studentMonthlyMap[a.studentId][a.status] !== undefined) {
        studentMonthlyMap[a.studentId][a.status]++
      }
    })

    const monthlyStudentRecap = classes.map(cls => {
      const totals = { hadir: 0, izin: 0, sakit: 0, alpha: 0 }
      cls.students.forEach(s => {
        if (studentMonthlyMap[s.id]) {
          totals.hadir += studentMonthlyMap[s.id].hadir
          totals.izin += studentMonthlyMap[s.id].izin
          totals.sakit += studentMonthlyMap[s.id].sakit
          totals.alpha += studentMonthlyMap[s.id].alpha
        }
      })
      const totalRecords = totals.hadir + totals.izin + totals.sakit + totals.alpha
      const percent = totalRecords > 0 ? Math.round((totals.hadir / totalRecords) * 100) : 0

      return {
        classId: cls.id,
        className: cls.name,
        hadir: totals.hadir,
        izin: totals.izin,
        sakit: totals.sakit,
        alpha: totals.alpha,
        totalRecords,
        percent
      }
    })

    // ===== REKAP BULANAN GURU =====
    const monthlyTeacherAttendance = await db.teacherAttendance.findMany({
      where: {
        date: { gte: monthStart, lte: monthEnd }
      },
      select: { teacherId: true, status: true }
    })

    const teacherMonthlyMap: Record<string, Record<string, number>> = {}
    monthlyTeacherAttendance.forEach(a => {
      if (!teacherMonthlyMap[a.teacherId]) teacherMonthlyMap[a.teacherId] = { hadir: 0, izin: 0, sakit: 0, alpha: 0 }
      if (teacherMonthlyMap[a.teacherId][a.status] !== undefined) {
        teacherMonthlyMap[a.teacherId][a.status]++
      }
    })

    const monthlyTeacherRecap = teachers.map(t => {
      const totals = teacherMonthlyMap[t.id] || { hadir: 0, izin: 0, sakit: 0, alpha: 0 }
      const totalRecords = totals.hadir + totals.izin + totals.sakit + totals.alpha
      const percent = totalRecords > 0 ? Math.round((totals.hadir / totalRecords) * 100) : 0

      return {
        teacherId: t.id,
        teacherName: t.user.name,
        hadir: totals.hadir,
        izin: totals.izin,
        sakit: totals.sakit,
        alpha: totals.alpha,
        totalRecords,
        percent
      }
    })

    // ===== AVAILABLE DATES & MONTHS =====
    const allStudentDates = await db.studentAttendance.findMany({
      select: { date: true },
      distinct: ['date'],
      orderBy: { date: 'desc' },
      take: 30
    })
    const allTeacherDates = await db.teacherAttendance.findMany({
      select: { date: true },
      distinct: ['date'],
      orderBy: { date: 'desc' },
      take: 30
    })
    const allDates = [...new Set([
      ...allStudentDates.map(d => d.date),
      ...allTeacherDates.map(d => d.date)
    ])].sort().reverse()

    const allMonths = [...new Set(allDates.map(d => d.substring(0, 7)))].sort().reverse()

    return NextResponse.json({
      success: true,
      data: {
        date,
        month,
        summary: {
          studentPercent,
          studentHadir,
          studentTotal,
          teacherPercent,
          teacherHadir,
          teacherTotal,
          totalIzin: izinStudents + izinTeachers,
          izinStudents,
          izinTeachers,
          totalSakit: sakitStudents + sakitTeachers,
          sakitStudents,
          sakitTeachers
        },
        classAttendance,
        teacherDailyData,
        monthlyStudentRecap,
        monthlyTeacherRecap,
        availableDates: allDates,
        availableMonths: allMonths
      }
    })
  } catch (error) {
    console.error('Error fetching kepsek absensi data:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data absensi' },
      { status: 500 }
    )
  }
}