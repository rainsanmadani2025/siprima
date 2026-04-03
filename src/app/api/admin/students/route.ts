import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all students
export async function GET() {
  try {
    const students = await db.student.findMany({
      include: {
        parent: {
          include: {
            user: true
          }
        },
        class: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const studentList = students.map(s => ({
      id: s.id,
      name: s.name,
      nis: s.nis,
      birthDate: s.birthDate,
      gender: s.gender,
      address: s.address,
      parentId: s.parentId,
      parent: s.parent ? { id: s.parent.id, name: s.parent.user.name } : null,
      classId: s.classId,
      class: s.class ? { id: s.class.id, name: s.class.name, ageGroup: s.class.ageGroup } : null,
      status: s.status,
      createdAt: s.createdAt
    }))

    return NextResponse.json({
      success: true,
      students: studentList
    })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch students'
    }, { status: 500 })
  }
}

// POST - Create new student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nis, name, birthDate, gender, address, parentId, classId, status } = body

    if (!nis || !name || !birthDate || !gender || !parentId) {
      return NextResponse.json({
        success: false,
        error: 'NIS, name, birth date, gender, and parent are required'
      }, { status: 400 })
    }

    // Check if NIS already exists
    const existingNis = await db.student.findUnique({
      where: { nis }
    })

    if (existingNis) {
      return NextResponse.json({
        success: false,
        error: 'NIS already exists'
      }, { status: 400 })
    }

    const student = await db.student.create({
      data: {
        nis,
        name,
        birthDate,
        gender,
        address,
        parentId,
        classId,
        status: status || 'aktif'
      },
      include: {
        parent: {
          include: {
            user: true
          }
        },
        class: true
      }
    })

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        nis: student.nis,
        birthDate: student.birthDate,
        gender: student.gender,
        address: student.address,
        parentId: student.parentId,
        parent: student.parent ? { id: student.parent.id, name: student.parent.user.name } : null,
        classId: student.classId,
        class: student.class ? { id: student.class.id, name: student.class.name, ageGroup: student.class.ageGroup } : null,
        status: student.status,
        createdAt: student.createdAt
      }
    })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create student'
    }, { status: 500 })
  }
}
