import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all parents
export async function GET() {
  try {
    const parents = await db.parent.findMany({
      include: {
        user: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const parentList = parents.map(p => ({
      id: p.id,
      name: p.user.name,
      userId: p.userId
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
