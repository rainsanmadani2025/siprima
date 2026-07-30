import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Template ID is required' },
        { status: 400 }
      )
    }

    const template = await db.rPPTemplateKBC.findUnique({
      where: { id },
    })

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      )
    }

    const response = {
      ...template,
      nilaiCinta: template.nilaiCinta ? JSON.parse(template.nilaiCinta) : {},
      dimensiKelulusan: template.dimensiKelulusan ? JSON.parse(template.dimensiKelulusan) : {},
      saranaMediaBahan: template.saranaMediaBahan ? JSON.parse(template.saranaMediaBahan) : {},
      langkahPembelajaran: template.langkahPembelajaran ? JSON.parse(template.langkahPembelajaran) : {},
    }

    return NextResponse.json({
      success: true,
      template: response,
    })
  } catch (error: any) {
    console.error('Error fetching KBC template detail:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}