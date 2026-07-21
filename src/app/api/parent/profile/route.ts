import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT /api/parent/profile - Update parent profile data
export async function PUT(request: Request) {
  try {
    const body = await request.json()

    if (!body.userId) {
      return NextResponse.json(
        { error: 'Parameter userId diperlukan' },
        { status: 400 }
      )
    }

    // Find parent by userId (linked from User table)
    const parent = await db.parent.findFirst({
      where: {
        userId: body.userId
      }
    })

    if (!parent) {
      return NextResponse.json(
        { error: 'Parent not found' },
        { status: 404 }
      )
    }

    const updatedParent = await db.parent.update({
      where: { id: parent.id },
      data: {
        fatherName: body.fatherName,
        fatherOccupation: body.fatherOccupation,
        fatherPhone: body.fatherPhone,
        fatherEmail: body.fatherEmail,
        motherName: body.motherName,
        motherOccupation: body.motherOccupation,
        motherPhone: body.motherPhone,
        motherEmail: body.motherEmail,
        address: body.address,
        occupation: body.occupation
      }
    })

    return NextResponse.json({ parent: updatedParent })
  } catch (error) {
    console.error('Error updating parent:', error)
    return NextResponse.json(
      { error: 'Failed to update parent data' },
      { status: 500 }
    )
  }
}

// GET /api/parent/profile?userId=xxx - Get parent profile
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Parameter userId diperlukan' },
        { status: 400 }
      )
    }

    // Find parent by userId (linked from User table)
    const parent = await db.parent.findFirst({
      where: {
        userId: userId
      }
    })

    if (!parent) {
      return NextResponse.json(
        { error: 'Parent not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ parent })
  } catch (error) {
    console.error('Error fetching parent:', error)
    return NextResponse.json(
      { error: 'Failed to fetch parent data' },
      { status: 500 }
    )
  }
}