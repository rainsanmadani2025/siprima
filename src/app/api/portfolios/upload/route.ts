import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    console.log('Upload request received')
    const formData = await request.formData()
    const file = formData.get('file') as File

    console.log('File received:', file?.name, file?.type, file?.size)

    if (!file) {
      console.log('No file found in request')
      return NextResponse.json(
        { success: false, error: 'Tidak ada file yang diupload' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ]

    if (!allowedTypes.includes(file.type)) {
      console.log('Invalid file type:', file.type)
      return NextResponse.json(
        { success: false, error: 'Tipe file tidak didukung. Hanya gambar (JPEG, PNG, GIF, WebP) yang diizinkan' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      console.log('File too large:', file.size)
      return NextResponse.json(
        { success: false, error: 'Ukuran file terlalu besar. Maksimal 5MB' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'portfolio-uploads')
    if (!existsSync(uploadDir)) {
      console.log('Creating upload directory:', uploadDir)
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const ext = path.extname(file.name)
    const filename = `${timestamp}-${randomString}${ext}`

    console.log('Saving file:', filename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Return the file URL
    const fileUrl = `/portfolio-uploads/${filename}`

    console.log('File saved successfully:', fileUrl)

    return NextResponse.json({
      success: true,
      fileUrl,
      filename
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengupload file' },
      { status: 500 }
    )
  }
}
