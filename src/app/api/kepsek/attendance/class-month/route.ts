import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const classId = searchParams.get('classId')
    const month = searchParams.get('month')

    if (!classId || !month) {
      return NextResponse.json(
        { success: false, error: 'Class ID dan Month diperlukan' },
        { status: 400 }
      )
    }

    const students = await db.student.findMany({
      where: { classId },
      orderBy: { name: 'asc' }
    })

    const studentIds = students.map(s => s.id)

    const attendances = await db.studentAttendance.findMany({
      where: {
        studentId: { in: studentIds },
        date: { startsWith: month }
      },
      orderBy: { date: 'asc' }
    })

    const formattedStudents = students.map(s => ({
      id: s.id,
      name: s.name,
      nis: s.nis
    }))

    const formattedAttendances = attendances.map(a => ({
      studentId: a.studentId,
      date: a.date,
      status: a.status,
      notes: a.notes,
      checkInTime: a.checkInTime,
      checkOutTime: a.checkOutTime,
      isHoliday: a.isHoliday
    }))

    return NextResponse.json({
      success: true,
      students: formattedStudents,
      attendances: formattedAttendances
    })
  } catch (error) {
    console.error('Error fetching class month attendance:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data absensi' },
      { status: 500 }
    )
  }
}