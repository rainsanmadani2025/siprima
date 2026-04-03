import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Ambil daftar percakapan (group by user lain)
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

    // Ambil semua pesan user
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

    // Group pesan by conversation partner
    const conversationsMap = new Map()

    messages.forEach(msg => {
      const isSender = msg.senderId === userId
      const partnerId = isSender ? msg.receiverId : msg.senderId
      const partner = isSender ? msg.receiver : msg.sender

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          partnerId: partner.id,
          partnerName: partner.name,
          partnerRole: partner.role,
          partnerAvatar: partner.avatar,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount: 0
        })
      }

      // Hitung pesan belum dibaca (pesan yang diterima dan belum dibaca)
      if (!isSender && !msg.isRead) {
        const conv = conversationsMap.get(partnerId)
        conv.unreadCount++
      }
    })

    const conversations = Array.from(conversationsMap.values()).sort((a, b) =>
      new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    )

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil percakapan' },
      { status: 500 }
    )
  }
}
