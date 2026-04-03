import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH - Update teacher attendance
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, notes, checkInTime, checkOutTime } = body

    const existingAttendance = await db.teacherAttendance.findUnique({
      where: { id: params.id }
    })

    if (!existingAttendance) {
      return NextResponse.json({
        success: false,
        error: 'Teacher attendance not found'
      }, { status: 404 })
    }

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (checkInTime !== undefined) updateData.checkInTime = checkInTime
    if (checkOutTime !== undefined) updateData.checkOutTime = checkOutTime

    const attendance = await db.teacherAttendance.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      attendance
    })
  } catch (error) {
    console.error('Error updating teacher attendance:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update teacher attendance'
    }, { status: 500 })
  }
}

// DELETE - Delete teacher attendance
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingAttendance = await db.teacherAttendance.findUnique({
      where: { id: params.id }
    })

    if (!existingAttendance) {
      return NextResponse.json({
        success: false,
        error: 'Teacher attendance not found'
      }, { status: 404 })
    }

    await db.teacherAttendance.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Teacher attendance deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting teacher attendance:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete teacher attendance'
    }, { status: 500 })
  }
}
