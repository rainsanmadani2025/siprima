import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Ambil semua pengumuman
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const targetAudience = searchParams.get('targetAudience')

    const where: any = {}

    if (category) {
      where.category = category
    }

    if (targetAudience) {
      where.OR = [
        { targetAudience: 'all' },
        { targetAudience: targetAudience }
      ]
    }

    const announcements = await db.announcement.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ announcements })
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil pengumuman' },
      { status: 500 }
    )
  }
}

// POST - Buat pengumuman baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, category, eventDate, priority, targetAudience, createdBy } = body

    if (!title || !content || !category || !targetAudience) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    const announcement = await db.announcement.create({
      data: {
        title,
        content,
        category,
        eventDate: eventDate || null,
        priority: priority || 'normal',
        targetAudience,
        createdBy: createdBy || null
      }
    })

    return NextResponse.json({ announcement }, { status: 201 })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json(
      { error: 'Gagal membuat pengumuman' },
      { status: 500 }
    )
  }
}
