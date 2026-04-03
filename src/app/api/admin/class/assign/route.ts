import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/admin/class/assign - Assign teacher to class
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { classId, teacherId } = body

    if (!classId || !teacherId) {
      return NextResponse.json({
        success: false,
        error: 'classId and teacherId are required'
      }, { status: 400 })
    }

    // Get teacher by userId (since teacherId passed is userId)
    const teacher = await db.teacher.findUnique({
      where: { userId: teacherId },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })

    if (!teacher) {
      return NextResponse.json({
        success: false,
        error: 'Teacher not found'
      }, { status: 404 })
    }

    // Get class details before update
    const classBefore = await db.class.findUnique({
      where: { id: classId },
      select: { name: true }
    })

    if (!classBefore) {
      return NextResponse.json({
        success: false,
        error: 'Class not found'
      }, { status: 404 })
    }

    // Update class with new teacher (using teacherId from Teacher table)
    const updatedClass = await db.class.update({
      where: { id: classId },
      data: { teacherId: teacher.id }
    })

    return NextResponse.json({
      success: true,
      className: classBefore.name,
      classId: updatedClass.id,
      teacherId: teacher.id,
      teacherName: teacher.user.name
    })
  } catch (error) {
    console.error('Error assigning teacher to class:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to assign teacher to class'
    }, { status: 500 })
  }
}
