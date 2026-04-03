import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH - Update student attendance
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, notes, checkInTime, checkOutTime } = body

    const existingAttendance = await db.studentAttendance.findUnique({
      where: { id: params.id }
    })

    if (!existingAttendance) {
      return NextResponse.json({
        success: false,
        error: 'Student attendance not found'
      }, { status: 404 })
    }

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (checkInTime !== undefined) updateData.checkInTime = checkInTime
    if (checkOutTime !== undefined) updateData.checkOutTime = checkOutTime

    const attendance = await db.studentAttendance.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      attendance
    })
  } catch (error) {
    console.error('Error updating student attendance:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update student attendance'
    }, { status: 500 })
  }
}

// DELETE - Delete student attendance
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingAttendance = await db.studentAttendance.findUnique({
      where: { id: params.id }
    })

    if (!existingAttendance) {
      return NextResponse.json({
        success: false,
        error: 'Student attendance not found'
      }, { status: 404 })
    }

    await db.studentAttendance.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Student attendance deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting student attendance:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete student attendance'
    }, { status: 500 })
  }
}
