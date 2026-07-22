import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const semester = searchParams.get('semester')
    const academicYear = searchParams.get('academicYear')

    // Cari parent berdasarkan userId
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

    // Fallback jika userId tidak ditemukan
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
      return NextResponse.json({
        success: true,
        children: [],
        availablePeriods: []
      })
    }

    const childIds = parent.children.map(c => c.id)

    if (childIds.length === 0) {
      return NextResponse.json({
        success: true,
        children: parent.children.map(c => ({
          id: c.id,
          name: c.name,
          nis: c.nis,
          className: c.class?.name || null,
          aspects: {}
        })),
        availablePeriods: []
      })
    }

    // Build where clause for assessments
    const assessmentWhere: any = {
      studentId: { in: childIds }
    }
    if (semester) assessmentWhere.semester = semester
    if (academicYear) assessmentWhere.academicYear = academicYear

    // Fetch all assessments for this parent's children
    const assessments = await db.studentAssessment.findMany({
      where: assessmentWhere,
      include: {
        teacher: {
          include: {
            user: { select: { name: true } }
          }
        }
      },
      orderBy: { date: 'desc' }
    })

    // Get available periods (all, regardless of filter)
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

    // Group assessments by child then by aspect
    const childrenWithAspects = parent.children.map(child => {
      const childAssessments = assessments.filter(a => a.studentId === child.id)

      // Group by aspect
      const aspectsMap: Record<string, {
        latestScore: string
        totalAssessments: number
        assessments: Array<{
          id: string
          date: string
          score: string
          notes: string
          observation: string
          documentation: string | null
          teacherName: string
        }>
      }> = {}

      childAssessments.forEach(a => {
        const aspectKey = a.aspect
        if (!aspectsMap[aspectKey]) {
          aspectsMap[aspectKey] = {
            latestScore: '',
            totalAssessments: 0,
            assessments: []
          }
        }
        aspectsMap[aspectKey].totalAssessments++
        aspectsMap[aspectKey].assessments.push({
          id: a.id,
          date: a.date,
          score: a.score,
          notes: a.notes || '',
          observation: a.observation || '',
          documentation: a.documentation,
          teacherName: a.teacher?.user?.name || 'Guru'
        })
        // Keep the latest score (first in desc order)
        if (!aspectsMap[aspectKey].latestScore) {
          aspectsMap[aspectKey].latestScore = a.score
        }
      })

      return {
        id: child.id,
        name: child.name,
        nis: child.nis,
        className: child.class?.name || null,
        aspects: aspectsMap
      }
    })

    return NextResponse.json({
      success: true,
      children: childrenWithAspects,
      availablePeriods: uniquePeriods
    })
  } catch (error) {
    console.error('Error fetching parent assessments:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal memuat data penilaian' },
      { status: 500 }
    )
  }
}