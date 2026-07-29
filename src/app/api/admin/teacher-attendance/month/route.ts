import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const month = searchParams.get('month')
    const teacherId = searchParams.get('teacherId')

    if (!month) {
      return NextResponse.json(
        { success: false, error: 'Parameter month diperlukan' },
        { status: 400 }
      )
    }

    if (!teacherId) {
      return NextResponse.json(
        { success: false, error: 'Teacher ID diperlukan' },
        { status: 400 }
      )
    }

    const attendances = await db.teacherAttendance.findMany({
      where: {
        teacherId,
        date: {
          startsWith: month
        }
      }
    })

    return NextResponse.json({
      success: true,
      attendance: attendances.map(a => ({
        id: a.id,
        teacherId: a.teacherId,
        date: a.date,
        status: a.status,
        notes: a.notes,
        checkIn: a.checkInTime,
        checkOut: a.checkOutTime
      }))
    })
  } catch (error: any) {
    console.error('Error fetching teacher attendance:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data absensi guru' },
      { status: 500 }
    )
  }
}