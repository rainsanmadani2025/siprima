import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH /api/admin/students/[id]/health - Update health and immunization data
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 16 requirement)
    const { id } = await params

    const body = await request.json()
    const { healthData, immunization } = body

    // Validate student exists
    const student = await db.student.findUnique({
      where: { id }
    })

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Siswa tidak ditemukan' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {}

    // Add healthData if provided
    if (healthData !== undefined && healthData !== null) {
      // Ensure it's a valid object before stringifying
      if (typeof healthData === 'object') {
        updateData.healthData = JSON.stringify(healthData)
      } else {
        updateData.healthData = healthData
      }
    }

    // Add immunization if provided and not empty
    if (immunization !== undefined && immunization !== null) {
      if (Array.isArray(immunization) && immunization.length > 0) {
        updateData.immunization = JSON.stringify(immunization)
      } else if (Array.isArray(immunization) && immunization.length === 0) {
        updateData.immunization = null
      } else if (typeof immunization === 'string') {
        updateData.immunization = immunization
      }
    }

    // Update student with health and immunization data
    const updatedStudent = await db.student.update({
      where: { id },
      data: updateData,
      include: {
        parent: true,
        class: true
      }
    })

    // Parse JSON fields for response
    let parsedHealthData = null
    let parsedImmunization = []

    try {
      parsedHealthData = updatedStudent.healthData ? JSON.parse(updatedStudent.healthData) : null
    } catch (e) {
      parsedHealthData = updatedStudent.healthData
    }

    try {
      parsedImmunization = updatedStudent.immunization ? JSON.parse(updatedStudent.immunization) : []
    } catch (e) {
      parsedImmunization = updatedStudent.immunization || []
    }

    return NextResponse.json({
      success: true,
      message: 'Data kesehatan dan imunisasi berhasil diperbarui',
      student: {
        ...updatedStudent,
        healthData: parsedHealthData,
        immunization: parsedImmunization
      }
    })
  } catch (error) {
    console.error('Error updating health data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal memperbarui data kesehatan',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
