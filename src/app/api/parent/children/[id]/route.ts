import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT /api/parent/children/[id] - Update child data
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()

    // Parse health data and immunization data
    const healthData = body.healthData ? JSON.stringify(body.healthData) : undefined
    const immunizationData = body.immunization ? JSON.stringify(body.immunization) : undefined

    // Update student data
    const updatedStudent = await db.student.update({
      where: { id },
      data: {
        name: body.name,
        nis: body.nis,
        birthDate: body.birthDate,
        gender: body.gender,
        address: body.address,
        photo: body.photo,
        healthData,
        immunization: immunizationData
      }
    })

    return NextResponse.json({ student: updatedStudent })
  } catch (error) {
    console.error('Error updating child:', error)
    return NextResponse.json(
      { error: 'Failed to update child data' },
      { status: 500 }
    )
  }
}
