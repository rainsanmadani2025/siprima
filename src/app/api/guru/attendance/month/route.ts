import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const month = searchParams.get('month') // Format: YYYY-MM
    const userId = searchParams.get('userId')

    if (!month) {
      return NextResponse.json(
        { success: false, error: 'Parameter month diperlukan' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID tidak ditemukan' },
        { status: 400 }
      )
    }

    // Get teacher ID from user ID
    const teacher = await db.teacher.findUnique({
      where: { userId }
    })

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: 'Guru tidak ditemukan' },
        { status: 404 }
      )
    }

    // Get all attendance for this teacher's students in the selected month
    const attendances = await db.studentAttendance.findMany({
      where: {
        date: {
          startsWith: month
        }
      },
      include: {
        student: {
          include: {
            class: true
          }
        }
      }
    })

    // Filter only students that belong to this teacher's class
    const filteredAttendances = attendances.filter(attendance => 
      attendance.student.class?.teacherId === teacher.id
    )

    return NextResponse.json({
      success: true,
      attendance: filteredAttendances.map(a => ({
        id: a.id,
        studentId: a.studentId,
        date: a.date,
        status: a.status,
        notes: a.notes,
        checkIn: a.checkInTime,
        checkOut: a.checkOutTime,
        isHoliday: a.isHoliday
      }))
    })
  } catch (error: any) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data absensi' },
      { status: 500 }
    )
  }
}
