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
    const { title, content, category, eventDate, priority, targetAudience, createdBy, creatorRole } = body

    if (!title || !content || !category || !targetAudience) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    // Role check - hanya Kepala Sekolah dan Guru yang boleh buat pengumuman
    const role = (creatorRole || '').toUpperCase()
    if (role !== 'KEPSEK' && role !== 'GURU') {
      return NextResponse.json(
        { error: 'Hanya Kepala Sekolah dan Guru yang dapat membuat pengumuman' },
        { status: 403 }
      )
    }

    // Buat pengumuman
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

    // Buat notifikasi untuk semua user yang dituju
    const roleMap: Record<string, any> = {
      'all': { role: { in: ['KEPSEK', 'GURU', 'ORTU'] } },
      'kepsek': { role: 'KEPSEK' },
      'guru': { role: 'GURU' },
      'ortu': { role: 'ORTU' },
    }

    const userFilter = roleMap[targetAudience]
    if (userFilter) {
      const users = await db.user.findMany({
        where: {
          ...userFilter,
          isActive: true,
          ...(createdBy ? { id: { not: createdBy } } : {})
        },
        select: { id: true }
      })

      const priorityToType: Record<string, string> = {
        'urgent': 'alert',
        'important': 'warning',
        'normal': 'info'
      }

      if (users.length > 0) {
        await db.notification.createMany({
          data: users.map(user => ({
            userId: user.id,
            title: `Pengumuman: ${title}`,
            message: content.length > 200 ? content.substring(0, 200) + '...' : content,
            type: priorityToType[priority || 'normal'] || 'info'
          }))
        })
      }
    }

    return NextResponse.json({ announcement }, { status: 201 })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json(
      { error: 'Gagal membuat pengumuman' },
      { status: 500 }
    )
  }
}