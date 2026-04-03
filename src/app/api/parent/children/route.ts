import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/parent/children - Get all children for the current parent
export async function GET() {
  try {
    // For demo purposes, we'll return the first parent's children
    // In production, you would get the parent ID from the authenticated session
    const parent = await db.parent.findFirst({
      include: {
        children: {
          include: {
            class: true
          }
        }
      }
    })

    if (!parent) {
      return NextResponse.json({ children: [] }, { status: 200 })
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
