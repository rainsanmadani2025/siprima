import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/parent/children - Get children for the logged-in parent
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId diperlukan' },
        { status: 400 }
      )
    }

    // Cari parent berdasarkan userId yang login
    const parent = await db.parent.findUnique({
      where: { userId },
      include: {
        children: {
          include: {
            class: true
          },
          where: { status: 'aktif' }
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
        userId: parent.userId,
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