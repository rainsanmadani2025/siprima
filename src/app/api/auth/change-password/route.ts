import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { comparePassword, hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { userId, oldPassword, newPassword } = await request.json()

    if (!userId || !oldPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password baru minimal 6 karakter' },
        { status: 400 }
      )
    }

    // Cari user di database
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    // Verifikasi password lama
    const isValid = await comparePassword(oldPassword, user.password)

    // Auto-migration: jika password lama masih plain text
    if (!isValid && !user.password.startsWith('$2')) {
      if (oldPassword === user.password) {
        const hashed = await hashPassword(newPassword)
        await db.user.update({
          where: { id: userId },
          data: { password: hashed }
        })
        return NextResponse.json({ message: 'Password berhasil diubah' })
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Password lama salah' },
        { status: 401 }
      )
    }

    // Simpan password baru yang sudah di-hash
    const hashedPassword = await hashPassword(newPassword)
    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ message: 'Password berhasil diubah' })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}