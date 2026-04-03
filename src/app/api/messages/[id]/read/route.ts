import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT - Tandai pesan sudah dibaca
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messageId = params.id

    // Update pesan menjadi sudah dibaca
    const message = await db.message.update({
      where: { id: messageId },
      data: { isRead: true }
    })

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Error marking message as read:', error)
    return NextResponse.json(
      { error: 'Gagal menandai pesan' },
      { status: 500 }
    )
  }
}
