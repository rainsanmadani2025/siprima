import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Get student attendance records
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const studentId = searchParams.get('studentId')
    const date = searchParams.get('date')
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    let whereClause: any = {}

    if (studentId) {
      whereClause.studentId = studentId
    }

    if (date) {
      whereClause.date = date
    } else if (month && year) {
      // Filter by month (format: YYYY-MM)
      whereClause.date = {
        startsWith: `${year}-${month}`
      }
    }

    const attendances = await db.studentAttendance.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            parent: {
              include: {
                user: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json({ success: true, data: attendances })
  } catch (error) {
    console.error('Error fetching student attendance:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch attendance records' },
      { status: 500 }
    )
  }
}

// POST - Create new attendance record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, date, status, notes, checkInTime, checkOutTime } = body

    // Validate required fields
    if (!studentId || !date || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: studentId, date, status' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['hadir', 'izin', 'sakit', 'alpha']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be: hadir, izin, sakit, or alpha' },
        { status: 400 }
      )
    }

    // Check if attendance record already exists
    const existing = await db.studentAttendance.findUnique({
      where: {
        studentId_date: {
          studentId,
          date
        }
      }
    })

    if (existing) {
      // Update existing record
      const updated = await db.studentAttendance.update({
        where: {
          studentId_date: {
            studentId,
            date
          }
        },
        data: {
          status,
          notes: notes || null,
          checkInTime: checkInTime || null,
          checkOutTime: checkOutTime || null
        },
        include: {
          student: true
        }
      })

      return NextResponse.json({ success: true, data: updated })
    }

    // Create new record
    const attendance = await db.studentAttendance.create({
      data: {
        studentId,
        date,
        status,
        notes: notes || null,
        checkInTime: checkInTime || null,
        checkOutTime: checkOutTime || null
      },
      include: {
        student: true
      }
    })

    return NextResponse.json({ success: true, data: attendance }, { status: 201 })
  } catch (error) {
    console.error('Error creating attendance record:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create attendance record' },
      { status: 500 }
    )
  }
}

// PUT - Bulk update attendance records for multiple students
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, attendances } = body

    // Validate required fields
    if (!date || !attendances || !Array.isArray(attendances)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: date, attendances (array)' },
        { status: 400 }
      )
    }

    const results = []

    for (const record of attendances) {
      const { studentId, status, notes } = record

      if (!studentId || !status) {
        continue
      }

      // Validate status
      const validStatuses = ['hadir', 'izin', 'sakit', 'alpha']
      if (!validStatuses.includes(status)) {
        continue
      }

      const existing = await db.studentAttendance.findUnique({
        where: {
          studentId_date: {
            studentId,
            date
          }
        }
      })

      let updated
      if (existing) {
        updated = await db.studentAttendance.update({
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
        updated = await db.studentAttendance.create({
          data: {
            studentId,
            date,
            status,
            notes: notes || null
          }
        })
      }

      results.push(updated)
    }

    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error('Error bulk updating attendance records:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update attendance records' },
      { status: 500 }
    )
  }
}
