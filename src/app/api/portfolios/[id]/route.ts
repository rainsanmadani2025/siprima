import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Ambil portfolio by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const portfolio = await db.portfolio.findUnique({
      where: { id: params.id },
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

    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: 'Portfolio tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, portfolio })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil portfolio' },
      { status: 500 }
    )
  }
}

// PUT - Update portfolio
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { studentId, title, type, description, fileUrl, videoUrl, date } = body

    const portfolio = await db.portfolio.update({
      where: { id: params.id },
      data: {
        studentId: studentId || undefined,
        title: title || undefined,
        type: type || undefined,
        description: description || undefined,
        fileUrl: fileUrl || undefined,
        videoUrl: videoUrl || undefined,
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

    return NextResponse.json({ success: true, portfolio })
  } catch (error) {
    console.error('Error updating portfolio:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengupdate portfolio' },
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

    return NextResponse.json({ success: true, message: 'Portfolio berhasil dihapus' })
  } catch (error) {
    console.error('Error deleting portfolio:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus portfolio' },
      { status: 500 }
    )
  }
}
