import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all users with optional role filter
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get('role')

    const where = role && role !== 'all' ? { role } : {}

    const users = await db.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      success: true,
      users
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch users'
    }, { status: 500 })
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, name, email, phone, role } = body

    // Validation
    if (!username || !password || !name || !role) {
      return NextResponse.json({
        success: false,
        error: 'Username, password, name, and role are required'
      }, { status: 400 })
    }

    // Check if username already exists
    const existingUser = await db.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'Username already exists'
      }, { status: 400 })
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await db.user.findUnique({
        where: { email }
      })

      if (existingEmail) {
        return NextResponse.json({
          success: false,
          error: 'Email already exists'
        }, { status: 400 })
      }
    }

    // Create user
    const user = await db.user.create({
      data: {
        username,
        password, // In production, this should be hashed!
        name,
        email,
        phone,
        role,
        isActive: true
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create user'
    }, { status: 500 })
  }
}
