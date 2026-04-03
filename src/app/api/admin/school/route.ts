import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch school data
export async function GET() {
  try {
    const school = await db.school.findFirst()

    if (!school) {
      // Create default school if not exists
      const newSchool = await db.school.create({
        data: {
          name: "RA Insan Madani",
          npsn: "12345678",
          address: "Jl. Pendidikan No. 123, Kota Bandung, Jawa Barat",
          establishedYear: 2015,
          accreditation: "A",
          totalClasses: 8,
          totalTeachers: 24,
          totalStudents: 156
        }
      })
      return NextResponse.json({
        success: true,
        school: newSchool
      })
    }

    return NextResponse.json({
      success: true,
      school
    })
  } catch (error) {
    console.error('Error fetching school data:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch school data'
    }, { status: 500 })
  }
}

// PATCH - Update school data
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      npsn,
      address,
      establishedYear,
      accreditation,
      totalClasses,
      totalTeachers,
      totalStudents,
      phone,
      email,
      website
    } = body

    // Get existing school
    const existingSchool = await db.school.findFirst()

    if (!existingSchool) {
      return NextResponse.json({
        success: false,
        error: 'School not found'
      }, { status: 404 })
    }

    // Update school
    const updatedSchool = await db.school.update({
      where: { id: existingSchool.id },
      data: {
        name,
        npsn,
        address,
        establishedYear,
        accreditation,
        totalClasses,
        totalTeachers,
        totalStudents,
        phone,
        email,
        website
      }
    })

    return NextResponse.json({
      success: true,
      school: updatedSchool
    })
  } catch (error) {
    console.error('Error updating school data:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update school data'
    }, { status: 500 })
  }
}
