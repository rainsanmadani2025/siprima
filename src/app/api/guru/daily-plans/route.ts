import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get('teacherId')
    const classId = searchParams.get('classId')

    const where: any = {}
    if (teacherId) where.teacherId = teacherId
    if (classId) where.classId = classId

    const dailyPlans = await db.dailyPlan.findMany({
      where,
      include: {
        teacher: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        class: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      dailyPlans: dailyPlans.map(plan => ({
        id: plan.id,
        date: plan.date,
        theme: plan.theme,
        subTheme: plan.subTheme,
        status: plan.status,
        className: plan.class?.name || null,
        teacherName: plan.teacher?.user.name || null
      }))
    })
  } catch (error) {
    console.error('Error fetching daily plans:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch daily plans' },
      { status: 500 }
    )
  }
}
