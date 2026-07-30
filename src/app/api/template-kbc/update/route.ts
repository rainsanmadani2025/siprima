import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Template ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const template = await db.rPPTemplateKBC.update({
      where: { id },
      data: {
        nama: body.nama,
        tema: body.tema,
        subtema: body.subtema,
        kelompokUsia: body.kelompokUsia,
        status: body.status,
        fase: body.fase,
        semester: body.semester,
        capaianPembelajaran: body.capaianPembelajaran || '',
        tujuanPembelajaran: body.tujuanPembelajaran || '',
        nilaiCinta: body.nilaiCinta ? JSON.stringify(body.nilaiCinta) : '{}',
        dimensiKelulusan: body.dimensiKelulusan ? JSON.stringify(body.dimensiKelulusan) : '{}',
        pemahamanBermakna: body.pemahamanBermakna || '',
        pertanyaanPemantik: body.pertanyaanPemantik || '',
        saranaMediaBahan: body.saranaMediaBahan ? JSON.stringify(body.saranaMediaBahan) : '{}',
        langkahPembelajaran: body.langkahPembelajaran ? JSON.stringify(body.langkahPembelajaran) : '{}',
        asesmen: body.asesmen || '',
        tindakLanjut: body.tindakLanjut || '',
        refleksiGuru: body.refleksiGuru || '',
      },
    })

    return NextResponse.json({
      success: true,
      template,
    })
  } catch (error: any) {
    console.error('Error updating KBC template:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}