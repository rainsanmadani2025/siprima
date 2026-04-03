import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Ambil semua pesan untuk user yang login
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID diperlukan' },
        { status: 400 }
      )
    }

    // Ambil pesan yang dikirim atau diterima oleh user
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            role: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil pesan' },
      { status: 500 }
    )
  }
}

// POST - Kirim pesan baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { senderId, receiverId, subject, content, parentId } = body

    if (!senderId || !receiverId || !content) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    // Buat pesan baru
    const message = await db.message.create({
      data: {
        senderId,
        receiverId,
        parentId: parentId || null,
        subject: subject || null,
        content,
        isRead: false
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            role: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json(
      { error: 'Gagal mengirim pesan' },
      { status: 500 }
    )
  }
}
