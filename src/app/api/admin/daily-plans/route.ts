import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all daily plans
export async function GET() {
  try {
    const plans = await db.dailyPlan.findMany({
      include: {
        teacher: {
          include: {
            user: true
          }
        },
        class: true
      },
      orderBy: { date: 'desc' }
    })

    const planList = plans.map(p => ({
      id: p.id,
      teacherId: p.teacherId,
      teacher: { id: p.teacher.id, name: p.teacher.user.name },
      classId: p.classId,
      class: { id: p.class.id, name: p.class.name },
      date: p.date,
      theme: p.theme,
      subTheme: p.subTheme,
      status: p.status,
      createdAt: p.createdAt
    }))

    return NextResponse.json({
      success: true,
      plans: planList
    })
  } catch (error) {
    console.error('Error fetching daily plans:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch daily plans'
    }, { status: 500 })
  }
}

// POST - Create new daily plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { teacherId, classId, date, theme, subTheme, goals, status } = body

    if (!teacherId || !classId || !date || !theme) {
      return NextResponse.json({
        success: false,
        error: 'Teacher, class, date, and theme are required'
      }, { status: 400 })
    }

    // Check if plan already exists for this teacher, class, and date
    const existingPlan = await db.dailyPlan.findUnique({
      where: {
        teacherId_classId_date: {
          teacherId,
          classId,
          date
        }
      }
    })

    if (existingPlan) {
      return NextResponse.json({
        success: false,
        error: 'A plan already exists for this teacher, class, and date'
      }, { status: 400 })
    }

    const plan = await db.dailyPlan.create({
      data: {
        teacherId,
        classId,
        date,
        theme,
        subTheme,
        goals,
        status: status || 'draft',
        activities: '[]',
        materials: '[]'
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
      error: 'Failed to create daily plan'
    }, { status: 500 })
  }
}
