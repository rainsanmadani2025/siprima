import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { UserRole } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

// Create fresh Prisma Client instance for each request
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, role } = body

    console.log('Login attempt received:', { username, password: password?.length, role })

    // Validasi input
    if (!username || !password || !role) {
      return NextResponse.json(
        { message: 'Username, password, dan role harus diisi' },
        { status: 400 }
      )
    }

    // Validasi role
    const validRoles = ['admin', 'kepsek', 'guru', 'ortu']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { message: 'Role tidak valid' },
        { status: 400 }
      )
    }

    // Map role string ke enum
    const roleMap: Record<string, UserRole> = {
      admin: UserRole.ADMIN,
      kepsek: UserRole.KEPSEK,
      guru: UserRole.GURU,
      ortu: UserRole.ORTU,
    }

    const dbRole = roleMap[role]

    // Cari user di database
    console.log('Login attempt:', { username, role, dbRole })

    const user = await prisma.user.findUnique({
      where: {
        username: username,
        role: dbRole,
        isActive: true,
      },
    })

    console.log('User found:', !!user)

    if (!user) {
      return NextResponse.json(
        { message: 'Username atau password salah' },
        { status: 401 }
      )
    }

    // Validasi password dengan bcrypt
    console.log('Verifying password...')
    console.log('Password hash from DB:', user.password.substring(0, 20) + '...')
    console.log('Password entered length:', password.length)

    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log('Password valid:', isPasswordValid)

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Username atau password salah' },
        { status: 401 }
      )
    }

    // Login berhasil
    const cookieStore = await cookies()
    cookieStore.set('userId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    cookieStore.set('userRole', role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    cookieStore.set('userName', user.name, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json(
      {
        message: 'Login berhasil',
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: role,
          email: user.email,
        },
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
