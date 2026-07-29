import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const month = searchParams.get('month')
    const studentId = searchParams.get('studentId')

    if (!month) {
      return NextResponse.json(
        { success: false, error: 'Parameter month diperlukan' },
        { status: 400 }
      )
    }

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student ID diperlukan' },
        { status: 400 }
      )
    }

    const attendances = await db.studentAttendance.findMany({
      where: {
        studentId,
        date: {
          startsWith: month
        }
      }
    })

    return NextResponse.json({
      success: true,
      attendance: attendances.map(a => ({
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