import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH - Update announcement
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, content, category, targetAudience, eventDate, priority } = body

    const existingAnnouncement = await db.announcement.findUnique({
      where: { id: params.id }
    })

    if (!existingAnnouncement) {
      return NextResponse.json({
        success: false,
        error: 'Announcement not found'
      }, { status: 404 })
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (category !== undefined) updateData.category = category
    if (targetAudience !== undefined) updateData.targetAudience = targetAudience
    if (eventDate !== undefined) updateData.eventDate = eventDate
    if (priority !== undefined) updateData.priority = priority

    const announcement = await db.announcement.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      announcement
    })
  } catch (error) {
    console.error('Error updating announcement:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update announcement'
    }, { status: 500 })
  }
}

// DELETE - Delete announcement
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingAnnouncement = await db.announcement.findUnique({
      where: { id: params.id }
    })

    if (!existingAnnouncement) {
      return NextResponse.json({
        success: false,
        error: 'Announcement not found'
      }, { status: 404 })
    }

    await db.announcement.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Announcement deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting announcement:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete announcement'
    }, { status: 500 })
  }
}
