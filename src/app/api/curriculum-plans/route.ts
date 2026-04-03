import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'RPPM' or 'PROSEM'
    const semester = searchParams.get('semester')
    const academicYear = searchParams.get('academicYear')

    const where: any = {}
    if (type) where.type = type
    if (semester) where.semester = semester
    if (academicYear) where.academicYear = academicYear

    const curriculumPlans = await db.curriculumPlan.findMany({
      where,
      orderBy: [
        { academicYear: 'desc' },
        { semester: 'desc' },
        { week: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      plans: curriculumPlans.map(plan => ({
        id: plan.id,
        title: plan.title,
        type: plan.type,
        semester: plan.semester,
        academicYear: plan.academicYear,
        week: plan.week,
        theme: plan.theme,
        subThemes: plan.subThemes ? JSON.parse(plan.subThemes) : [],
        goals: plan.goals ? JSON.parse(plan.goals) : [],
        createdAt: plan.createdAt
      }))
    })
  } catch (error) {
    console.error('Error fetching curriculum plans:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch curriculum plans' },
      { status: 500 }
    )
  }
}
