import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all kepsek (users with role KEPSEK)
export async function GET() {
  try {
    const kepsek = await db.user.findMany({
      where: { role: 'KEPSEK' },
      include: {
        teacherProfile: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform the data to include teacher profile information
    const kepsekList = kepsek.map(k => ({
      id: k.id,
      name: k.name,
      username: k.username,
      email: k.email,
      phone: k.phone,
      nuptk: k.teacherProfile?.nuptk,
      birthPlace: k.teacherProfile?.birthPlace,
      birthDate: k.teacherProfile?.birthDate,
      gender: k.teacherProfile?.gender,
      lastEducation: k.teacherProfile?.lastEducation,
      address: k.teacherProfile?.address,
      avatar: k.avatar,
      isActive: k.isActive,
      createdAt: k.createdAt
    }))

    return NextResponse.json({
      success: true,
      kepsek: kepsekList
    })
  } catch (error) {
    console.error('Error fetching kepsek:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch kepsek'
    }, { status: 500 })
  }
}

// POST - Create new kepsek
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, name, email, phone, nuptk, birthPlace, birthDate, gender, lastEducation, address, avatar } = body

    // Validation
    if (!username || !password || !name) {
      return NextResponse.json({
        success: false,
        error: 'Username, password, and name are required'
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

    // Create user with KEPSEK role
    const user = await db.user.create({
      data: {
        username,
        password, // In production, hash this!
        name,
        email,
        phone,
        role: 'KEPSEK',
        isActive: true,
        avatar,
        teacherProfile: {
          create: {
            nuptk,
            birthPlace,
            birthDate,
            gender,
            lastEducation,
            address,
            employmentStatus: 'tetap',
            subjects: ''
          }
        }
      },
      include: {
        teacherProfile: true
      }
    })

    return NextResponse.json({
      success: true,
      kepsek: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        nuptk: user.teacherProfile?.nuptk,
        birthPlace: user.teacherProfile?.birthPlace,
        birthDate: user.teacherProfile?.birthDate,
        gender: user.teacherProfile?.gender,
        lastEducation: user.teacherProfile?.lastEducation,
        address: user.teacherProfile?.address,
        avatar: user.avatar,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Error creating kepsek:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create kepsek'
    }, { status: 500 })
  }
}
