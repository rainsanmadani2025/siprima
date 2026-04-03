import { NextResponse, NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Create fresh Prisma Client instance
const prisma = new PrismaClient()

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

    const template = await prisma.rPPTemplate.findUnique({
      where: { id }
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
  } catch (error: any) {
    console.error('Error fetching RPP template:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
