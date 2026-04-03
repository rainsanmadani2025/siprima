import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/students - Get all students (for teachers and kepala sekolah)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const teacherId = searchParams.get('teacherId')

    // Build where clause
    let whereClause: any = {}

    if (classId) {
      whereClause.classId = classId
    } else if (teacherId) {
      // Get teacher by userId
      const teacher = await db.teacher.findUnique({
        where: { userId: teacherId },
        select: { id: true }
      })

      if (teacher) {
        // Find all classes where this teacher is the homeroom teacher
        const teacherClasses = await db.class.findMany({
          where: { teacherId: teacher.id },
          select: { id: true }
        })

        if (teacherClasses.length > 0) {
          const classIds = teacherClasses.map(c => c.id)
          whereClause.classId = {
            in: classIds
          }
        } else {
          // If teacher has no classes assigned, return empty list
          return NextResponse.json({ students: [] })
        }
      } else {
        // If teacher not found, return empty list
        return NextResponse.json({ students: [] })
      }
    }

    const students = await db.student.findMany({
      where: whereClause,
      include: {
        parent: true,
        class: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Parse JSON fields and convert gender
    const studentsWithParsedData = students.map(student => ({
      ...student,
      gender: student.gender === 'L' ? 'Laki-laki' : student.gender === 'P' ? 'Perempuan' : student.gender,
      classHistory: student.classHistory ? JSON.parse(student.classHistory) : null,
      healthData: student.healthData ? JSON.parse(student.healthData) : null,
      immunization: student.immunization ? JSON.parse(student.immunization) : []
    }))

    return NextResponse.json({ students: studentsWithParsedData })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students data' },
      { status: 500 }
    )
  }
}
