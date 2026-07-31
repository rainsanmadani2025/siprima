import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ children: [], parent: null }, { status: 200 })
    }

    // Find parent by the logged-in user's userId
    const parent = await db.parent.findFirst({
      where: { userId },
      include: {
        children: {
          include: {
            class: true
          }
        }
      }
    })

    if (!parent) {
      return NextResponse.json({ children: [], parent: null }, { status: 200 })
    }

    // Parse JSON fields for children
    const childrenWithParsedData = parent.children.map(child => ({
      ...child,
      healthData: child.healthData ? JSON.parse(child.healthData) : null,
      immunization: child.immunization ? JSON.parse(child.immunization) : []
    }))

    return NextResponse.json({
      parent: {
        id: parent.id,
        fatherName: parent.fatherName,
        fatherOccupation: parent.fatherOccupation,
        fatherPhone: parent.fatherPhone,
        fatherEmail: parent.fatherEmail,
        motherName: parent.motherName,
        motherOccupation: parent.motherOccupation,
        motherPhone: parent.motherPhone,
        motherEmail: parent.motherEmail
      },
      children: childrenWithParsedData
    })
  } catch (error) {
    console.error('Error fetching children:', error)
    return NextResponse.json(
      { error: 'Failed to fetch children data' },
      { status: 500 }
    )
  }
}