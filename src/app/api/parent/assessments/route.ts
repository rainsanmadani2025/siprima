import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const semester = searchParams.get('semester')
    const academicYear = searchParams.get('academicYear')

    let parent
    if (userId) {
      parent = await db.parent.findUnique({
        where: { userId },
        include: {
          children: {
            include: { class: true },
            where: { status: 'aktif' }
          }
        }
      })
    }

    if (!parent) {
      parent = await db.parent.findFirst({
        include: {
          children: {
            include: { class: true },
            where: { status: 'aktif' }
          }
        }
      })
    }

    if (!parent) {
      return NextResponse.json({ success: true, children: [], availablePeriods: [] })
    }

    const childIds = parent.children.map(c => c.id)

    if (childIds.length === 0) {
      return NextResponse.json({
        success: true,
        children: parent.children.map(c => ({
          id: c.id, name: c.name, nis: c.nis,
          className: c.class?.name || null, aspects: {}
        })),
        availablePeriods: []
      })
    }

    const assessmentWhere: any = { studentId: { in: childIds } }
    if (semester) assessmentWhere.semester = semester
    if (academicYear) assessmentWhere.academicYear = academicYear

    const assessments = await db.studentAssessment.findMany({
      where: assessmentWhere,
      include: {
        teacher: {
          include: { user: { select: { name: true } } }
        }
      },
      orderBy: { date: 'desc' }
    })

    const allPeriods = await db.studentAssessment.findMany({
      where: { studentId: { in: childIds } },
      select: { semester: true, academicYear: true },
      distinct: ['semester', 'academicYear'],
      orderBy: { date: 'desc' }
    })

    const uniquePeriods = allPeriods.reduce((acc: any[], p) => {
      if (!acc.find(x => x.semester === p.semester && x.academicYear === p.academicYear)) {
        acc.push(p)
      }
      return acc
    }, [])

    const childrenWithAspects = parent.children.map(child => {
      const childAssessments = assessments.filter(a => a.studentId === child.id)
      const aspectsMap: Record<string, any> = {}

      childAssessments.forEach(a => {
        if (!aspectsMap[a.aspect]) {
          aspectsMap[a.aspect] = { latestScore: '', totalAssessments: 0, assessments: [] }
        }
        aspectsMap[a.aspect].totalAssessments++
        aspectsMap[a.aspect].assessments.push({
          id: a.id, date: a.date, score: a.score,
          notes: a.notes || '', observation: a.observation || '',
          documentation: a.documentation,
          teacherName: a.teacher?.user?.name || 'Guru'
        })
        if (!aspectsMap[a.aspect].latestScore) {
          aspectsMap[a.aspect].latestScore = a.score
        }
      })

      return {
        id: child.id, name: child.name, nis: child.nis,
        className: child.class?.name || null, aspects: aspectsMap
      }
    })

    return NextResponse.json({
      success: true,
      children: childrenWithAspects,
      availablePeriods: uniquePeriods
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: 'Gagal memuat data' }, { status: 500 })
  }
}