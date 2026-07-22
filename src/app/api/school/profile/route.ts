import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Ambil data sekolah
export async function GET() {
  try {
    const school = await db.school.findFirst()

    if (!school) {
      return NextResponse.json(
        { success: false, error: 'School not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      school: {
        id: school.id,
        name: school.name,
        npsn: school.npsn,
        address: school.address,
        establishedYear: school.establishedYear,
        accreditation: school.accreditation,
        totalClasses: school.totalClasses,
        totalTeachers: school.totalTeachers,
        totalStudents: school.totalStudents,
        phone: school.phone,
        email: school.email,
        website: school.website
      }
    })
  } catch (error) {
    console.error('Error fetching school profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch school profile' },
      { status: 500 }
    )
  }
}

// PUT - Update data sekolah
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const school = await db.school.findFirst()
    if (!school) {
      return NextResponse.json(
        { success: false, error: 'Data sekolah belum ada' },
        { status: 404 }
      )
    }

    const updated = await db.school.update({
      where: { id: school.id },
      data: {
        name: body.name,
        npsn: body.npsn,
        address: body.address,
        establishedYear: body.establishedYear ? parseInt(body.establishedYear) : undefined,
        accreditation: body.accreditation,
        totalClasses: body.totalClasses ? parseInt(body.totalClasses) : undefined,
        totalTeachers: body.totalTeachers ? parseInt(body.totalTeachers) : undefined,
        totalStudents: body.totalStudents ? parseInt(body.totalStudents) : undefined,
        phone: body.phone || undefined,
        email: body.email || undefined,
        website: body.website || undefined
      }
    })

    return NextResponse.json({ success: true, school: updated })
  } catch (error) {
    console.error('Error updating school profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update school profile' },
      { status: 500 }
    )
  }
}