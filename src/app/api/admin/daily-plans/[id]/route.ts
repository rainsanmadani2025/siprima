import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH - Update daily plan
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { teacherId, classId, date, theme, subTheme, goals, status } = body

    const existingPlan = await db.dailyPlan.findUnique({
      where: { id: params.id }
    })

    if (!existingPlan) {
      return NextResponse.json({
        success: false,
        error: 'Daily plan not found'
      }, { status: 404 })
    }

    const updateData: any = {}
    if (theme !== undefined) updateData.theme = theme
    if (subTheme !== undefined) updateData.subTheme = subTheme
    if (goals !== undefined) updateData.goals = goals
    if (status !== undefined) updateData.status = status

    if (teacherId || classId || date) {
      const newTeacherId = teacherId || existingPlan.teacherId
      const newClassId = classId || existingPlan.classId
      const newDate = date || existingPlan.date

      // Check if new combination conflicts with existing plans
      const conflictingPlan = await db.dailyPlan.findUnique({
        where: {
          teacherId_classId_date: {
            teacherId: newTeacherId,
            classId: newClassId,
            date: newDate
          }
        }
      })

      if (conflictingPlan && conflictingPlan.id !== params.id) {
        return NextResponse.json({
          success: false,
          error: 'A plan already exists for this combination'
        }, { status: 400 })
      }

      if (teacherId) updateData.teacherId = teacherId
      if (classId) updateData.classId = classId
      if (date) updateData.date = date
    }

    const plan = await db.dailyPlan.update({
      where: { id: params.id },
      data: updateData,
      include: {
        teacher: {
          include: {
            user: true
          }
        },
        class: true
      }
    })

    return NextResponse.json({
      success: true,
      plan: {
        id: plan.id,
        teacherId: plan.teacherId,
        teacher: { id: plan.teacher.id, name: plan.teacher.user.name },
        classId: plan.classId,
        class: { id: plan.class.id, name: plan.class.name },
        date: plan.date,
        theme: plan.theme,
        subTheme: plan.subTheme,
        status: plan.status,
        createdAt: plan.createdAt
      }
    })
  } catch (error) {
    console.error('Error updating daily plan:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update daily plan'
    }, { status: 500 })
  }
}

// DELETE - Delete daily plan
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingPlan = await db.dailyPlan.findUnique({
      where: { id: params.id }
    })

    if (!existingPlan) {
      return NextResponse.json({
        success: false,
        error: 'Daily plan not found'
      }, { status: 404 })
    }

    await db.dailyPlan.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Daily plan deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting daily plan:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete daily plan'
    }, { status: 500 })
  }
}
