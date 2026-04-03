import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const isRead = searchParams.get('isRead')
    const type = searchParams.get('type')

    const where: any = {}
    if (userId) where.userId = userId
    if (isRead !== null) where.isRead = isRead === 'true'
    if (type) where.type = type

    const notifications = await db.notification.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      notifications: notifications.map(notif => ({
        id: notif.id,
        userId: notif.userId,
        userName: notif.user.name,
        userRole: notif.user.role,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        isRead: notif.isRead,
        createdAt: notif.createdAt
      }))
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids, isRead } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      )
    }

    await db.notification.updateMany({
      where: {
        id: {
          in: ids
        }
      },
      data: {
        isRead: isRead !== undefined ? isRead : true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Notifications updated successfully'
    })
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update notifications' },
      { status: 500 }
    )
  }
}
