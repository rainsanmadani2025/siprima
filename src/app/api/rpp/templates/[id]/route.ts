import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.rPPTemplate.findUnique({
      where: { id: params.id }
    })

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      template: {
        tema: template.tema,
        topikKBC: template.topikKBC,
        profilLulusan: template.profilLulusan,
        tujuanKBC: template.tujuanKBC,
        tujuanProfilLulusan: template.tujuanProfilLulusan ? JSON.parse(template.tujuanProfilLulusan) : {},
        tujuanPembelajaranMendalam: template.tujuanPembelajaranMendalam,
        materiIntegrasiKBC: template.materiIntegrasiKBC,
        tujuanPembelajaran: template.tujuanPembelajaran,
        kerangkaPembelajaran: template.kerangkaPembelajaran ? JSON.parse(template.kerangkaPembelajaran) : {},
        kegiatanPembelajaran: template.kegiatanPembelajaran ? JSON.parse(template.kegiatanPembelajaran) : {}
      }
    })
  } catch (error) {
    console.error('Error fetching RPP template:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch template' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
