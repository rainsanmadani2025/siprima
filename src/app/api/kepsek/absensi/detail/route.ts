import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function getCurrentMonth(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const classId = searchParams.get('classId') || ''
    const month = searchParams.get('month') || getCurrentMonth()

    // Get all classes for the dropdown
    const classes = await db.class.findMany({
      include: {
        students: {
          where: { status: 'aktif' },
          select: { id: true, name: true },
          orderBy: { name: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    })

    // Determine which class to use
    const targetClass = classId
      ? classes.find(c => c.id === classId)
      : classes[0]

    if (!targetClass) {
      return NextResponse.json({
        success: true,
        data: {
          classes: classes.map(c => ({ id: c.id, name: c.name, studentCount: c.students.length })),
          selectedClass: null,
          month,
          records: [],
          availableMonths: []
        }
      })
    }

    // Calculate month range
    const monthStart = `${month}-01`
    const [yearStr, monthStr] = month.split('-')
    const lastDay = new Date(Number(yearStr), Number(monthStr), 0).getDate()
    const monthEnd = `${month}-${String(lastDay).padStart(2, '0')}`

    // Fetch attendance records for all students in this class for the month
    const attendances = await db.studentAttendance.findMany({
      where: {
        studentId: { in: targetClass.students.map(s => s.id) },
        date: { gte: monthStart, lte: monthEnd }
      },
      select: {
        id: true,
        studentId: true,
        date: true,
        status: true,
        checkInTime: true,
        checkOutTime: true,
        notes: true,
        isHoliday: true
      },
      orderBy: [{ date: 'asc' }, { studentId: 'asc' }]
    })

    // Build student name map
    const studentMap: Record<string, string> = {}
    targetClass.students.forEach(s => {
      studentMap[s.id] = s.name
    })

    // Get available months from attendance data
    const allDates = await db.studentAttendance.findMany({
      where: {
        studentId: { in: targetClass.students.map(s => s.id) }
      },
      select: { date: true },
      distinct: ['date'],
      orderBy: { date: 'desc' }
    })
    const availableMonths = [...new Set(allDates.map(d => d.date.substring(0, 7)))].sort().reverse()

    // Format records
    const records = attendances.map(a => ({
      id: a.id,
      date: a.date,
      studentName: studentMap[a.studentId] || 'Unknown',
      studentId: a.studentId,
      status: a.status,
      checkInTime: a.checkInTime || '-',
      checkOutTime: a.checkOutTime || '-',
      notes: a.notes || '-',
      isHoliday: a.isHoliday
    }))

    return NextResponse.json({
      success: true,
      data: {
        classes: classes.map(c => ({ id: c.id, name: c.name, studentCount: c.students.length })),
        selectedClass: {
          id: targetClass.id,
          name: targetClass.name,
          studentCount: targetClass.students.length
        },
        month,
        records,
        availableMonths
      }
    })
  } catch (error) {
    console.error('Error fetching absensi detail:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil detail absensi' },
      { status: 500 }
    )
  }
}