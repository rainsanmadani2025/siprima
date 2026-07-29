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
    const studentId = searchParams.get('studentId') || ''

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
          students: [],
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

    // Build student name map
    const studentMap: Record<string, string> = {}
    targetClass.students.forEach(s => {
      studentMap[s.id] = s.name
    })

    // Build students list for dropdown
    const studentsList = targetClass.students.map(s => ({
      id: s.id,
      name: s.name
    }))

    // Filter by student if specified
    const filteredStudentIds = studentId
      ? targetClass.students.filter(s => s.id === studentId).map(s => s.id)
      : targetClass.students.map(s => s.id)

    // Fetch attendance records
    const attendances = await db.studentAttendance.findMany({
      where: {
        studentId: { in: filteredStudentIds },
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

    // Generate last 12 months
    const availableMonths: string[] = []
    const now = new Date()
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      availableMonths.push(`${y}-${m}`)
    }

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
        students: studentsList,
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