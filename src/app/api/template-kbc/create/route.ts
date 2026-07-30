import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const template = await db.rPPTemplateKBC.create({
      data: {
        nama: body.nama,
        tema: body.tema,
        subtema: body.subtema,
        kelompokUsia: body.kelompokUsia,
        status: body.status || 'draft',
        fase: body.fase || 'Fase Fondasi',
        semester: body.semester || 'Ganjil',
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
    console.error('Error creating KBC template:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}