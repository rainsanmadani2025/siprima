import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// GET - Get admin profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      // Fallback: get first active admin
      const admin = await db.user.findFirst({
        where: { role: 'ADMIN', isActive: true }
      })

      if (!admin) {
        return NextResponse.json({
          success: false,
          error: 'Admin tidak ditemukan'
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: {
          id: admin.id,
          name: admin.name,
          username: admin.username,
          email: admin.email || '',
          phone: admin.phone || '',
          avatar: admin.avatar,
        }
      })
    }

    const admin = await db.user.findFirst({
      where: { id: userId, role: 'ADMIN' }
    })

    if (!admin) {
      return NextResponse.json({
        success: false,
        error: 'Admin tidak ditemukan'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: admin.id,
        name: admin.name,
        username: admin.username,
        email: admin.email || '',
        phone: admin.phone || '',
        avatar: admin.avatar,
      }
    })
  } catch (error) {
    console.error('Error fetching admin profile:', error)
    return NextResponse.json({
      success: false,
      error: 'Gagal memuat profil admin'
    }, { status: 500 })
  }
}

// PUT - Update admin profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, email, phone, password } = body

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID diperlukan'
      }, { status: 400 })
    }

    const admin = await db.user.findFirst({
      where: { id: userId, role: 'ADMIN' }
    })

    if (!admin) {
      return NextResponse.json({
        success: false,
        error: 'Admin tidak ditemukan'
      }, { status: 404 })
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone

    // Hash password if provided
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password.trim(), 10)
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: {
        id: updated.id,
        name: updated.name,
        username: updated.username,
        email: updated.email || '',
        phone: updated.phone || '',
        avatar: updated.avatar,
      }
    })
  } catch (error) {
    console.error('Error updating admin profile:', error)
    return NextResponse.json({
      success: false,
      error: 'Gagal memperbarui profil'
    }, { status: 500 })
  }
}