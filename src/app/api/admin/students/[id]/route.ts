import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Get single student with health data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 16 requirement)
    const { id } = await params

    const student = await db.student.findUnique({
      where: { id },
      include: {
        parent: {
          include: {
            user: true
          }
        },
        class: true
      }
    })

    if (!student) {
      return NextResponse.json({
        success: false,
        error: 'Siswa tidak ditemukan'
      }, { status: 404 })
    }

    // Parse JSON fields safely
    let parsedHealthData = null
    let parsedImmunization = null

    try {
      parsedHealthData = student.healthData ? JSON.parse(student.healthData) : null
    } catch (e) {
      parsedHealthData = student.healthData
    }

    try {
      parsedImmunization = student.immunization ? JSON.parse(student.immunization) : null
    } catch (e) {
      parsedImmunization = student.immunization
    }

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
        healthData: parsedHealthData,
        immunization: parsedImmunization,
        createdAt: student.createdAt
      }
    })
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json({
      success: false,
      error: 'Gagal mengambil data siswa'
    }, { status: 500 })
  }
}

// PATCH - Update student
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 16 requirement)
    const { id } = await params

    const body = await request.json()
    const { nis, name, birthDate, gender, address, parentId, classId, status } = body

    const existingStudent = await db.student.findUnique({
      where: { id }
    })

    if (!existingStudent) {
      return NextResponse.json({
        success: false,
        error: 'Student not found'
      }, { status: 404 })
    }

    if (nis && nis !== existingStudent.nis) {
      const duplicateNis = await db.student.findUnique({
        where: { nis }
      })

      if (duplicateNis) {
        return NextResponse.json({
          success: false,
          error: 'NIS already exists'
        }, { status: 400 })
      }
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (nis !== undefined) updateData.nis = nis
    if (birthDate !== undefined) updateData.birthDate = birthDate
    if (gender !== undefined) updateData.gender = gender
    if (address !== undefined) updateData.address = address
    if (parentId !== undefined) updateData.parentId = parentId
    if (classId !== undefined) updateData.classId = classId
    if (status !== undefined) updateData.status = status

    const student = await db.student.update({
      where: { id },
      data: updateData,
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
    console.error('Error updating student:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update student'
    }, { status: 500 })
  }
}

// DELETE - Delete student
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 16 requirement)
    const { id } = await params

    const existingStudent = await db.student.findUnique({
      where: { id }
    })

    if (!existingStudent) {
      return NextResponse.json({
        success: false,
        error: 'Student not found'
      }, { status: 404 })
    }

    await db.student.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete student'
    }, { status: 500 })
  }
}
