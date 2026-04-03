import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/parents/[id] - Get parent by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const parent = await db.parent.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        children: {
          include: {
            class: true
          }
        }
      }
    })

    if (!parent) {
      return NextResponse.json(
        { success: false, error: 'Parent not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, parent })
  } catch (error) {
    console.error('Error fetching parent:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch parent data' },
      { status: 500 }
    )
  }
}

// PUT /api/parents/[id] - Update parent data
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      address,
      occupation,
      fatherName,
      fatherOccupation,
      fatherPhone,
      fatherEmail,
      motherName,
      motherOccupation,
      motherPhone,
      motherEmail
    } = body

    const updated = await db.parent.update({
      where: { id: params.id },
      data: {
        ...(address !== undefined && { address }),
        ...(occupation !== undefined && { occupation }),
        ...(fatherName !== undefined && { fatherName }),
        ...(fatherOccupation !== undefined && { fatherOccupation }),
        ...(fatherPhone !== undefined && { fatherPhone }),
        ...(fatherEmail !== undefined && { fatherEmail }),
        ...(motherName !== undefined && { motherName }),
        ...(motherOccupation !== undefined && { motherOccupation }),
        ...(motherPhone !== undefined && { motherPhone }),
        ...(motherEmail !== undefined && { motherEmail })
      },
      include: {
        user: true,
        children: {
          include: {
            class: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, parent: updated })
  } catch (error) {
    console.error('Error updating parent:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update parent data' },
      { status: 500 }
    )
  }
}
