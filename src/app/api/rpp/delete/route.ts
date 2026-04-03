import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID RPP diperlukan' },
        { status: 400 }
      )
    }

    // Delete RPP
    await db.rPP.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'RPP berhasil dihapus'
    })
  } catch (error: any) {
    console.error('Error deleting RPP:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus RPP' },
      { status: 500 }
    )
  }
}
