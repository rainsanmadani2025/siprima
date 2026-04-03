import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT - Update portfolio
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, type, description, fileUrl, date } = body

    const portfolio = await db.portfolio.update({
      where: { id: params.id },
      data: {
        title: title || undefined,
        type: type || undefined,
        description: description || undefined,
        fileUrl: fileUrl || undefined,
        date: date || undefined
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            nis: true
          }
        }
      }
    })

    return NextResponse.json({ portfolio })
  } catch (error) {
    console.error('Error updating portfolio:', error)
    return NextResponse.json(
      { error: 'Gagal mengupdate portfolio' },
      { status: 500 }
    )
  }
}

// DELETE - Hapus portfolio
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.portfolio.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Portfolio berhasil dihapus' })
  } catch (error) {
    console.error('Error deleting portfolio:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus portfolio' },
      { status: 500 }
    )
  }
}
