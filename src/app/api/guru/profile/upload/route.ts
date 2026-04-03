import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { db } from '@/lib/db'

// POST - Upload profile photo
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'File tidak ditemukan' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID diperlukan' },
        { status: 400 }
      )
    }

    // Validate file type (only images)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Tipe file tidak didukung. Hanya gambar (JPEG, PNG, GIF, WebP) yang diizinkan' },
        { status: 400 }
      )
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'Ukuran file terlalu besar. Maksimal 2MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/\s+/g, '-').toLowerCase()
    const filename = `avatar-${userId}-${timestamp}.${originalName.split('.').pop()}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file to public/uploads/avatars
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars')
    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Update user's avatar in database
    const avatarPath = `/uploads/avatars/${filename}`
    await db.user.update({
      where: { id: userId },
      data: { avatar: avatarPath }
    })

    return NextResponse.json({
      success: true,
      message: 'Foto berhasil diupload',
      avatarUrl: avatarPath
    })
  } catch (error: any) {
    console.error('Error uploading photo:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengupload foto' },
      { status: 500 }
    )
  }
}
