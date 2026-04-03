import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID PROSEM diperlukan' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Update PROSEM
    const updatedProsem = await db.prosem.update({
      where: { id },
      data: {
        tahunAjaran: body.tahunAjaran,
        semester: body.semester,
        mingguan: JSON.stringify(body.mingguan || [])
      }
    })

    return NextResponse.json({
      success: true,
      message: 'PROSEM berhasil diupdate',
      prosem: updatedProsem
    })
  } catch (error: any) {
    console.error('Error updating PROSEM:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengupdate PROSEM' },
      { status: 500 }
    )
  }
}
