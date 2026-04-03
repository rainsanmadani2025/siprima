import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, month, attendances } = body

    if (!studentId || !month || !attendances) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Process each attendance record
    for (const record of attendances) {
      // Check if record exists
      const existing = await prisma.studentAttendance.findUnique({
        where: {
          studentId_date: {
            studentId: record.studentId,
            date: record.date
          }
        }
      })

      if (existing) {
        // Update existing record
        await prisma.studentAttendance.update({
          where: {
            studentId_date: {
              studentId: record.studentId,
              date: record.date
            }
          },
          data: {
            status: record.status,
            checkInTime: record.checkInTime || null,
            checkOutTime: record.checkOutTime || null,
            notes: record.notes || null
          }
        })
      } else {
        // Create new record
        await prisma.studentAttendance.create({
          data: {
            studentId: record.studentId,
            date: record.date,
            status: record.status,
            checkInTime: record.checkInTime || null,
            checkOutTime: record.checkOutTime || null,
            notes: record.notes || null
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Attendance saved successfully'
    })
  } catch (error) {
    console.error('Error saving student attendance:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save attendance data' },
      { status: 500 }
    )
  }
}
