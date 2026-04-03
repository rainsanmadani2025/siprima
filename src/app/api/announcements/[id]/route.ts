import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT - Update pengumuman
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, content, category, eventDate, priority, targetAudience } = body

    const announcement = await db.announcement.update({
      where: { id: params.id },
      data: {
        title: title || undefined,
        content: content || undefined,
        category: category || undefined,
        eventDate: eventDate || undefined,
        priority: priority || undefined,
        targetAudience: targetAudience || undefined
      }
    })

    return NextResponse.json({ announcement })
  } catch (error) {
    console.error('Error updating announcement:', error)
    return NextResponse.json(
      { error: 'Gagal mengupdate pengumuman' },
      { status: 500 }
    )
  }
}

// DELETE - Hapus pengumuman
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.announcement.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Pengumuman berhasil dihapus' })
  } catch (error) {
    console.error('Error deleting announcement:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus pengumuman' },
      { status: 500 }
    )
  }
}
