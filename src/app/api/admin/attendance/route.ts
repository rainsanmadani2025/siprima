import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch attendance based on type
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'student'
    const date = searchParams.get('date')
    const status = searchParams.get('status')

    let attendance

    if (type === 'student') {
      const where: any = {}
      if (date) where.date = date
      if (status && status !== 'all') where.status = status

      attendance = await db.studentAttendance.findMany({
        where,
        include: {
          student: true
        },
        orderBy: { date: 'desc' }
      })

      const formatted = attendance.map(a => ({
        id: a.id,
        studentId: a.studentId,
        studentName: a.student.name,
        date: a.date,
        status: a.status,
        notes: a.notes,
        checkInTime: a.checkInTime,
        checkOutTime: a.checkOutTime
      }))

      return NextResponse.json({
        success: true,
        attendance: formatted
      })
    } else {
      const where: any = {}
      if (date) where.date = date
      if (status && status !== 'all') where.status = status

      attendance = await db.teacherAttendance.findMany({
        where,
        include: {
          teacher: {
            include: {
              user: true
            }
          }
        },
        orderBy: { date: 'desc' }
      })

      const formatted = attendance.map(a => ({
        id: a.id,
        teacherId: a.teacherId,
        teacherName: a.teacher.user.name,
        date: a.date,
        status: a.status,
        notes: a.notes,
        checkInTime: a.checkInTime,
        checkOutTime: a.checkOutTime
      }))

      return NextResponse.json({
        success: true,
        attendance: formatted
      })
    }
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch attendance'
    }, { status: 500 })
  }
}
