import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Get single attendance record by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const attendance = await db.studentAttendance.findUnique({
      where: {
        id: params.id
      },
      include: {
        student: {
          include: {
            parent: {
              include: {
                user: true
              }
            },
            class: true
          }
        }
      }
    })

    if (!attendance) {
      return NextResponse.json(
        { success: false, error: 'Attendance record not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: attendance })
  } catch (error) {
    console.error('Error fetching attendance record:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch attendance record' },
      { status: 500 }
    )
  }
}

// PUT - Update attendance record
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, notes, checkInTime, checkOutTime } = body

    // Validate status if provided
    if (status) {
      const validStatuses = ['hadir', 'izin', 'sakit', 'alpha']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, error: 'Invalid status. Must be: hadir, izin, sakit, or alpha' },
          { status: 400 }
        )
      }
    }

    const updated = await db.studentAttendance.update({
      where: {
        id: params.id
      },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes: notes || null }),
        ...(checkInTime !== undefined && { checkInTime: checkInTime || null }),
        ...(checkOutTime !== undefined && { checkOutTime: checkOutTime || null })
      },
      include: {
        student: true
      }
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Error updating attendance record:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update attendance record' },
      { status: 500 }
    )
  }
}

// DELETE - Delete attendance record
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.studentAttendance.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ success: true, message: 'Attendance record deleted successfully' })
  } catch (error) {
    console.error('Error deleting attendance record:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete attendance record' },
      { status: 500 }
    )
  }
}
