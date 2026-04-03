import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/students/[id] - Get a specific student
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    const student = await db.student.findUnique({
      where: { id },
      include: {
        parent: true,
        class: true
      }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const studentWithParsedData = {
      ...student,
      healthData: student.healthData ? JSON.parse(student.healthData) : null,
      immunization: student.immunization ? JSON.parse(student.immunization) : []
    }

    return NextResponse.json({ student: studentWithParsedData })
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json(
      { error: 'Failed to fetch student data' },
      { status: 500 }
    )
  }
}
