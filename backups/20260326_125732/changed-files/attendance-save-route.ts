import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { month, attendances } = body

    if (!month) {
      return NextResponse.json(
        { success: false, error: 'Parameter month diperlukan' },
        { status: 400 }
      )
    }

    if (!attendances || !Array.isArray(attendances)) {
      return NextResponse.json(
        { success: false, error: 'Data absensi tidak valid' },
        { status: 400 }
      )
    }

    // Save or update each attendance record
    const results = await Promise.all(
      attendances.map(async (attendance: { studentId: string; date: string; status: string; notes: string }) => {
        const { studentId, date, status, notes } = attendance

        // Check if attendance already exists
        const existing = await db.studentAttendance.findUnique({
          where: {
            studentId_date: {
              studentId,
              date
            }
          }
        })

        if (existing) {
          // Update existing
          return await db.studentAttendance.update({
            where: {
              studentId_date: {
                studentId,
                date
              }
            },
            data: {
              status,
              notes: notes || null
            }
          })
        } else {
          // Create new
          return await db.studentAttendance.create({
            data: {
              studentId,
              date,
              status,
              notes: notes || null
            }
          })
        }
      })
    )

    return NextResponse.json({
      success: true,
      message: 'Data absensi berhasil disimpan',
      count: results.length
    })
  } catch (error: any) {
    console.error('Error saving attendance:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menyimpan data absensi' },
      { status: 500 }
    )
  }
}
