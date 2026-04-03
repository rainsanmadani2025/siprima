import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
        name: school.name,
        address: school.address,
        npsn: school.npsn
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
