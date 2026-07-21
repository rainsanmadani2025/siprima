import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const SCORE_VALUES: Record<string, number> = { BB: 1, MB: 2, BSH: 3, BSB: 4 }

function getDominantScore(scores: string[]): string {
  if (scores.length === 0) return '-'
  const total = scores.reduce((sum, s) => sum + (SCORE_VALUES[s] || 0), 0)
  const avg = total / scores.length
  if (avg >= 3.5) return 'BSB'
  if (avg >= 2.5) return 'BSH'
  if (avg >= 1.5) return 'MB'
  return 'BB'
}

function getScoreColor(score: string): string {
  switch (score) {
    case 'BSB': return 'bg-blue-600'
    case 'BSH': return 'bg-green-600'
    case 'MB': return 'bg-orange-600'
    case 'BB': return 'bg-red-600'
    default: return 'bg-gray-600'
  }
}

function formatAspectLabel(aspect: string): string {
  return aspect
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getCurrentSemester(): string {
  const now = new Date()
  const month = now.getMonth() + 1
  return month >= 7 ? 'Ganjil' : 'Genap'
}

function getCurrentAcademicYear(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  if (month >= 7) {
    return `${year}/${year + 1}`
  }
  return `${year - 1}/${year}`
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    let semester = searchParams.get('semester') || getCurrentSemester()
    let academicYear = searchParams.get('academicYear') || getCurrentAcademicYear()

    // 1. Total active students
    const totalStudents = await db.student.count({
      where: { status: 'aktif' }
    })

    // 2. Try to find assessments for the selected semester
    let assessments = await db.studentAssessment.findMany({
      where: { semester, academicYear },
      include: {
        student: { select: { id: true, name: true, nis: true, class: { select: { id: true, name: true, ageGroup: true, teacherId: true } } } },
        teacher: { include: { user: { select: { name: true } } } }
      }
    })

    // 3. Fallback: jika tidak ada data, cari semester terakhir yang ada datanya
    if (assessments.length === 0) {
      const latestAssessment = await db.studentAssessment.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { semester: true, academicYear: true }
      })

      if (latestAssessment) {
        semester = latestAssessment.semester
        academicYear = latestAssessment.academicYear

        assessments = await db.studentAssessment.findMany({
          where: { semester, academicYear },
          include: {
            student: { select: { id: true, name: true, nis: true, class: { select: { id: true, name: true, ageGroup: true, teacherId: true } } } },
            teacher: { include: { user: { select: { name: true } } } }
          }
        })
      }
    }

    // 4. Unique assessed students
    const assessedStudentIds = new Set(assessments.map(a => a.studentId))
    const assessedCount = assessedStudentIds.size

    // 5. Calculate overall stats
    let anecdotalCount = 0
    let documentationCount = 0
    const allScores: string[] = []

    assessments.forEach(a => {
      if (a.score) allScores.push(a.score)
      if (a.observation && a.observation.trim() !== '') anecdotalCount++
      if (a.documentation && a.documentation.trim() !== '') documentationCount++
    })

    const completionPercent = totalStudents > 0 ? Math.round((assessedCount / totalStudents) * 100) : 0
    const averageScore = getDominantScore(allScores)

    // 6. Get unique aspects from database (dynamic)
    const uniqueAspects = [...new Set(assessments.map(a => a.aspect).filter(Boolean))]

    const aspectStats = uniqueAspects.map(aspect => {
      const aspectAssessments = assessments.filter(a => a.aspect === aspect)
      const scores = aspectAssessments.map(a => a.score).filter(Boolean)
      const assessedInAspect = new Set(aspectAssessments.map(a => a.studentId)).size
      const percent = totalStudents > 0 ? Math.round((assessedInAspect / totalStudents) * 100) : 0
      const dominant = getDominantScore(scores)

      const distribution: Record<string, number> = { BB: 0, MB: 0, BSH: 0, BSB: 0 }
      scores.forEach(s => { if (distribution[s] !== undefined) distribution[s]++ })

      return {
        aspect,
        label: formatAspectLabel(aspect),
        percent,
        dominant,
        color: getScoreColor(dominant),
        distribution,
        totalAssessments: aspectAssessments.length,
        assessedStudents: assessedInAspect
      }
    })

    // 7. Per-teacher assessment status
    const teachers = await db.teacher.findMany({
      include: {
        user: { select: { name: true } },
        classes: {
          include: {
            students: {
              where: { status: 'aktif' },
              select: { id: true }
            }
          }
        }
      }
    })

    const teacherStats = teachers.map(teacher => {
      const allStudentIds = teacher.classes.flatMap(c => c.students.map(s => s.id))
      const classNames = teacher.classes.map(c => c.name).join(', ')

      const teacherAssessments = assessments.filter(a => a.teacherId === teacher.id)
      const assessedStudentsByTeacher = new Set(teacherAssessments.map(a => a.studentId))
      const teacherScores = teacherAssessments.map(a => a.score).filter(Boolean)
      const teacherAvg = getDominantScore(teacherScores)

      const progress = allStudentIds.length > 0
        ? Math.round((assessedStudentsByTeacher.size / allStudentIds.length) * 100)
        : 0

      let status: 'selesai' | 'proses' | 'tertinggal' = 'tertinggal'
      if (progress >= 100) status = 'selesai'
      else if (progress >= 50) status = 'proses'

      return {
        teacherId: teacher.id,
        teacherName: teacher.user.name,
        classNames,
        totalStudents: allStudentIds.length,
        assessedStudents: assessedStudentsByTeacher.size,
        averageScore: teacherAvg,
        status,
        progress,
      }
    })

    // 8. Per-class data for motorik & bahasa tab
    const classes = await db.class.findMany({
      include: {
        students: {
          where: { status: 'aktif' },
          select: { id: true }
        }
      }
    })

    const classStats = classes.map(cls => {
      const studentIds = cls.students.map(s => s.id)
      const classAssessments = assessments.filter(a => studentIds.includes(a.studentId))

      return {
        classId: cls.id,
        className: cls.name,
        ageGroup: cls.ageGroup,
        totalStudents: cls.students.length,
        fisikMotorik: {
          dominant: getDominantScore(classAssessments.filter(a => a.aspect.includes('motorik') || a.aspect.includes('jasmani')).map(a => a.score).filter(Boolean)),
          assessedCount: new Set(classAssessments.filter(a => a.aspect.includes('motorik') || a.aspect.includes('jasmani')).map(a => a.studentId)).size
        },
        bahasa: {
          dominant: getDominantScore(classAssessments.filter(a => a.aspect.includes('bahasa')).map(a => a.score).filter(Boolean)),
          assessedCount: new Set(classAssessments.filter(a => a.aspect.includes('bahasa')).map(a => a.studentId)).size
        }
      }
    })

    // 9. Student-level social-emotional data (cari aspek yang relevan)
    const sosialKeywords = ['sosial', 'emosional', 'jati_diri']
    const sosialAspects = uniqueAspects.filter(a => sosialKeywords.some(k => a.includes(k)))

    const students = await db.student.findMany({
      where: { status: 'aktif' },
      include: {
        class: { select: { id: true, name: true } },
        assessments: {
          where: { semester, academicYear, aspect: { in: sosialAspects.length > 0 ? sosialAspects : uniqueAspects } }
        }
      },
      orderBy: { name: 'asc' }
    })

    const studentSosialEmosional = students.map(student => {
      const scores = student.assessments.map(a => a.score).filter(Boolean)
      return {
        studentId: student.id,
        studentName: student.name,
        className: student.class?.name || '-',
        dominant: getDominantScore(scores),
        assessmentCount: student.assessments.length
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalStudents,
          assessedStudents: assessedCount,
          completionPercent,
          averageScore,
          anecdotalCount,
          documentationCount,
          semester,
          academicYear
        },
        aspectStats,
        teacherStats,
        classStats,
        studentSosialEmosional
      }
    })
  } catch (error) {
    console.error('Error fetching kepsek assessment data:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data penilaian' },
      { status: 500 }
    )
  }
}