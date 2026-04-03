import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID wajib diisi' },
        { status: 400 }
      )
    }

    await (db as any).$queryRawUnsafe(
      'DELETE FROM Prosem WHERE id = ?',
      id
    )

    return NextResponse.json({
      success: true,
      message: 'PROSEM berhasil dihapus'
    })
  } catch (error: any) {
    console.error('Error deleting PROSEM:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus PROSEM' },
      { status: 500 }
    )
  }
}
