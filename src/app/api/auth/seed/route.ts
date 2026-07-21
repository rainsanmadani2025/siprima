import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'
import { hashPassword } from '@/lib/auth'

export async function GET() {
  try {
    // Cek apakah user sudah ada
    const existingUsers = await db.user.count()

    if (existingUsers > 0) {
      return NextResponse.json({
        message: 'User sudah ada di database',
        count: existingUsers,
      })
    }

    // Buat user demo untuk setiap role
    const users = [
      {
        username: 'admin',
        password: 'admin123',
        name: 'Administrator',
        email: 'admin@ra-insanmadani.sch.id',
        role: UserRole.ADMIN,
      },
      {
        username: 'kepsek',
        password: 'kepsek123',
        name: 'Ibu Kepala Sekolah',
        email: 'kepsek@ra-insanmadani.sch.id',
        role: UserRole.KEPSEK,
      },
      {
        username: 'guru',
        password: 'guru123',
        name: 'Ibu Guru',
        email: 'guru@ra-insanmadani.sch.id',
        role: UserRole.GURU,
      },
      {
        username: 'ortu',
        password: 'ortu123',
        name: 'Bapak/Ibu Orang Tua',
        email: 'ortu@gmail.com',
        role: UserRole.ORTU,
      },
    ]

    // Insert semua user dengan password yang sudah di-hash
    const createdUsers = await Promise.all(
      users.map(async (user) => db.user.create({
        data: { ...user, password: await hashPassword(user.password) }
      }))
    )

    return NextResponse.json({
      message: 'User demo berhasil dibuat',
      users: createdUsers.map(u => ({
        username: u.username,
        name: u.name,
        role: u.role,
      })),
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat membuat user demo' },
      { status: 500 }
    )
  }
}
