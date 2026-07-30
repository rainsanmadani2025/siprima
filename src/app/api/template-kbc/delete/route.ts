import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Template ID is required' },
        { status: 400 }
      )
    }

    await db.rPPTemplateKBC.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error: any) {
    console.error('Error deleting KBC template:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}