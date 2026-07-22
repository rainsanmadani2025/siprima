import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const SCORE_VALUES: Record<string, number> = { BB: 1, MB: 2, BSH: 3, BSB: 4 }

function getDominantScore(scores: string[]): string {
  if (scores.length === 0) return '-'
  const total = scores.reduce((sum, s) => sum + (SCORE_VALUES[s] || 0), 0)
  const avg = total / scores.length
  if (avg >= 3.5) return 'BSB'
  if (avg >= 2.5) return 'BSH'
  if (avg >= 1.5) return 'MB'
  return 'BB'
}

function getPercentFromScores(scores: string[]): number {
  if (scores.length === 0) return 0
  const total = scores.reduce((sum, s) => sum + (SCORE_VALUES[s] || 0), 0)
  return Math.round((total / (scores.length * 4)) * 100)
}

function getCurrentSemester(): string {
  const now = new Date()
  const month = now.getMonth() + 1
  return month >= 7 ? 'Ganjil' : 'Genap'
}

function getCurrentAcademicYear(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  if (month >= 7) return `${year}/${year + 1}`
  return `${year - 1}/${year}`
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const semester = searchParams.get('semester') || getCurrentSemester()
    const academicYear = searchParams.get('academicYear') || getCurrentAcademicYear()

    // ===== 1. LAPORAN KEGIATAN SEKOLAH =====
    const activities = await db.schoolActivity.findMany({
      orderBy: { date: 'desc' }
    })

    // ===== 2. LAPORAN BULANAN GURU =====
    const teachers = await db.teacher.findMany({
      include: {
        user: { select: { name: true } },
        classes: { select: { name: true } }
      },
      orderBy: { user: { name: 'asc' } }
    })

    const teacherReports = await db.teacherReport.findMany()
    const reportMap: Record<string, typeof teacherReports[0]> = {}
    teacherReports.forEach(r => { reportMap[r.teacherId] = r })

    const monthNames = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    const now = new Date()
    const currentMonthName = monthNames[now.getMonth() + 1]
    const currentYear = now.getFullYear()

    // Count RPPH per teacher
    const rpphCounts = await db.dailyPlan.findMany({
      select: { teacherId: true, date: true }
    })
    const rpphMap: Record<string, number> = {}
    rpphCounts.forEach(r => { rpphMap[r.teacherId] = (rpphMap[r.teacherId] || 0) + 1 })

    // Working days estimate
    const uniqueDates = [...new Set(rpphCounts.map(r => r.date))]
    const totalWorkingDays = uniqueDates.length || 20

    // Count assessments per teacher
    const assessmentCounts = await db.studentAssessment.findMany({
      select: { teacherId: true }
    })
    const assessMap: Record<string, number> = {}
    assessmentCounts.forEach(a => { assessMap[a.teacherId] = (assessMap[a.teacherId] || 0) + 1 })

    // Attendance per teacher
    const teacherAttendance = await db.teacherAttendance.findMany({
      select: { teacherId: true, status: true }
    })
    const attendMap: Record<string, { hadir: number; total: number }> = {}
    teacherAttendance.forEach(a => {
      if (!attendMap[a.teacherId]) attendMap[a.teacherId] = { hadir: 0, total: 0 }
      attendMap[a.teacherId].total++
      if (a.status === 'hadir') attendMap[a.teacherId].hadir++
    })

    const teacherReportData = teachers.map(t => {
      const report = reportMap[t.id]
      const rpphCount = rpphMap[t.id] || 0
      const assessCount = assessMap[t.id] || 0
      const attend = attendMap[t.id] || { hadir: 0, total: totalWorkingDays }
      const attendPercent = attend.total > 0 ? Math.round((attend.hadir / attend.total) * 100) : 0

      let statusLabel = 'Belum Ada'
      let statusColor = 'bg-gray-500'
      if (report) {
        if (report.status === 'approved') { statusLabel = 'Disetujui'; statusColor = 'bg-green-600' }
        else if (report.status === 'submitted') { statusLabel = 'Menunggu Review'; statusColor = 'bg-yellow-600' }
        else { statusLabel = 'Draft'; statusColor = 'bg-yellow-600' }
      }

      return {
        teacherId: t.id,
        teacherName: t.user.name,
        rpphCount,
        totalRpph: totalWorkingDays,
        assessmentCount: assessCount,
        attendPercent,
        statusLabel,
        statusColor
      }
    })

    // ===== 3. LAPORAN PERKEMBANGAN SISWA =====
    const totalActiveStudents = await db.student.count({ where: { status: 'aktif' } })

    const studentReports = await db.studentReport.findMany({
      where: { semester, academicYear },
      include: {
        student: {
          select: {
            id: true, name: true,
            class: { select: { id: true, name: true } }
          }
        }
      },
      orderBy: { student: { name: 'asc' } }
    })

    const allAssessments = await db.studentAssessment.findMany({
      where: { semester, academicYear },
      select: { studentId: true, score: true }
    })

    const studentScores: Record<string, string[]> = {}
    allAssessments.forEach(a => {
      if (!studentScores[a.studentId]) studentScores[a.studentId] = []
      if (a.score) studentScores[a.studentId].push(a.score)
    })

    let bsbCount = 0, bshCount = 0, mbCount = 0, bbCount = 0
    const studentReportData = studentReports.map(sr => {
      const scores = studentScores[sr.student.id] || []
      const dominant = getDominantScore(scores)
      const percent = getPercentFromScores(scores)

      if (dominant === 'BSB') bsbCount++
      else if (dominant === 'BSH') bshCount++
      else if (dominant === 'MB') mbCount++
      else if (dominant === 'BB') bbCount++

      let reportStatusLabel = 'Draft'
      let reportStatusColor = 'bg-yellow-600'
      if (sr.status === 'generated') { reportStatusLabel = 'Selesai'; reportStatusColor = 'bg-green-600' }

      return {
        studentId: sr.student.id,
        studentName: sr.student.name,
        className: sr.student.class?.name || '-',
        percent,
        dominant,
        dominantColor: dominant === 'BSB' ? 'bg-green-600' : dominant === 'BSH' ? 'bg-blue-600' : dominant === 'MB' ? 'bg-yellow-600' : 'bg-red-600',
        reportStatusLabel,
        reportStatusColor
      }
    })

    const totalReports = studentReports.length

    return NextResponse.json({
      success: true,
      data: {
        kegiatan: activities,
        guruReport: teacherReportData,
        siswaReport: {
          summary: { totalReports, totalStudents: totalActiveStudents, bsbCount, bshCount, mbCount, bbCount },
          students: studentReportData
        },
        meta: { semester, academicYear, currentMonth: currentMonthName, currentYear }
      }
    })
  } catch (error) {
    console.error('Error fetching kepsek laporan data:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data laporan' },
      { status: 500 }
    )
  }
}