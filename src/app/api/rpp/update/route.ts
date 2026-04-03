import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID RPP diperlukan' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Update RPP
    const updatedRPP = await db.rPP.update({
      where: { id },
      data: {
        tema: body.tema,
        subtema: body.subtema,
        temaProjek: body.temaProjek,
        judulKegiatan: body.judulKegiatan,
        pokokBahasan: body.pokokBahasan,
        fase: body.fase,
        kelompokUsia: body.kelompokUsia,
        semester: body.semester,
        tahunAjaran: body.tahunAjaran,
        hari: body.hari,
        jumlahPertemuan: body.jumlahPertemuan,
        kelas: body.kelas,
        guru: body.guru,
        namaSekolah: body.namaSekolah,
        alamatSekolah: body.alamatSekolah,
        topikKBC: body.topikKBC,
        profilLulusan: body.profilLulusan,
        tujuanKBC: body.tujuanKBC,
        tujuanProfilLulusan: JSON.stringify(body.tujuanProfilLulusan || {}),
        tujuanPembelajaranMendalam: body.tujuanPembelajaranMendalam,
        materiIntegrasiKBC: body.materiIntegrasiKBC,
        tujuanPembelajaran: body.tujuanPembelajaran,
        kerangkaPembelajaran: JSON.stringify(body.kerangkaPembelajaran || {}),
        kegiatanPembelajaran: JSON.stringify(body.kegiatanPembelajaran || {}),
        rubrikPenilaian: JSON.stringify(body.rubrikPenilaian || {})
      }
    })

    return NextResponse.json({
      success: true,
      message: 'RPP berhasil diupdate',
      rpp: updatedRPP
    })
  } catch (error: any) {
    console.error('Error updating RPP:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengupdate RPP' },
      { status: 500 }
    )
  }
}
