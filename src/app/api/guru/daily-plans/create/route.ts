import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST - Create new daily plan for logged-in teacher
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, classId, date, theme, subTheme, goals, activities, materials, status } = body

    if (!userId || !classId || !date || !theme) {
      return NextResponse.json({
        success: false,
        error: 'User, class, date, and theme are required'
      }, { status: 400 })
    }

    // Get teacher ID from user ID
    const teacher = await db.teacher.findUnique({
      where: { userId }
    })

    if (!teacher) {
      return NextResponse.json({
        success: false,
        error: 'Teacher not found'
      }, { status: 404 })
    }

    // Check if plan already exists for this teacher, class, and date
    const existingPlan = await db.dailyPlan.findUnique({
      where: {
        teacherId_classId_date: {
          teacherId: teacher.id,
          classId,
          date
        }
      }
    })

    if (existingPlan) {
      return NextResponse.json({
        success: false,
        error: 'RPPH sudah ada untuk guru, kelas, dan tanggal ini'
      }, { status: 400 })
    }

    const plan = await db.dailyPlan.create({
      data: {
        teacherId: teacher.id,
        classId,
        date,
        theme,
        subTheme,
        goals,
        activities: activities ? JSON.stringify(activities) : '[]',
        materials: materials ? JSON.stringify(materials) : '[]',
        status: status || 'draft'
      },
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
    console.error('Error creating daily plan:', error)
    return NextResponse.json({
      success: false,
      error: 'Gagal membuat RPPH'
    }, { status: 500 })
  }
}
