import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all parents with complete data
export async function GET() {
  try {
    const parents = await db.parent.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true
          }
        },
        children: {
          include: {
            class: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const parentList = parents.map(p => ({
      id: p.id,
      userId: p.userId,
      name: p.user.name,
      email: p.user.email,
      phone: p.user.phone,
      avatar: p.user.avatar,
      address: p.address,
      occupation: p.occupation,
      fatherName: p.fatherName,
      fatherOccupation: p.fatherOccupation,
      fatherPhone: p.fatherPhone,
      fatherEmail: p.fatherEmail,
      motherName: p.motherName,
      motherOccupation: p.motherOccupation,
      motherPhone: p.motherPhone,
      motherEmail: p.motherEmail,
      children: p.children.map(c => ({
        id: c.id,
        name: c.name,
        nis: c.nis,
        birthDate: c.birthDate,
        class: c.class ? { name: c.class.name } : null
      })),
      createdAt: p.createdAt
    }))

    return NextResponse.json({
      success: true,
      parents: parentList
    })
  } catch (error) {
    console.error('Error fetching parents:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch parents'
    }, { status: 500 })
  }
}