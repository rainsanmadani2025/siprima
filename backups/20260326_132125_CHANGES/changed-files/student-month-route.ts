import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const studentId = searchParams.get('studentId')
    const month = searchParams.get('month') // Format: YYYY-MM

    if (!studentId || !month) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Get attendance records for the month
    const attendance = await prisma.studentAttendance.findMany({
      where: {
        studentId,
        date: {
          startsWith: month // Matches all dates in the month (YYYY-MM-DD)
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      attendance
    })
  } catch (error) {
    console.error('Error fetching student attendance:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch attendance data' },
      { status: 500 }
    )
  }
}
