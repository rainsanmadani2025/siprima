import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      tema, subtema, temaProjek, judulKegiatan, pokokBahasan,
      fase, kelompokUsia, semester, tahunAjaran, hari, jumlahPertemuan,
      kelas, guru, topikKBC, profilLulusan, tujuanKBC, tujuanProfilLulusan,
      tujuanPembelajaranMendalam, materiIntegrasiKBC, tujuanPembelajaran,
      kerangkaPembelajaran, kegiatanPembelajaran, rubrikPenilaian,
      namaSekolah, alamatSekolah, teacherId
    } = body

    if (!tema || !subtema || !temaProjek || !judulKegiatan) {
      return NextResponse.json(
        { success: false, error: 'Field wajib harus diisi: Tema, Subtema, Tema Projek, Judul Kegiatan' },
        { status: 400 }
      )
    }

    const tujuanProfilLulusanJson = typeof tujuanProfilLulusan === 'string' 
      ? tujuanProfilLulusan 
      : JSON.stringify(tujuanProfilLulusan || {})
    const kerangkaPembelajaranJson = typeof kerangkaPembelajaran === 'string'
      ? kerangkaPembelajaran
      : JSON.stringify(kerangkaPembelajaran || {})
    const kegiatanPembelajaranJson = typeof kegiatanPembelajaran === 'string'
      ? kegiatanPembelajaran
      : JSON.stringify(kegiatanPembelajaran || {})
    const rubrikPenilaianJson = typeof rubrikPenilaian === 'string'
      ? rubrikPenilaian
      : JSON.stringify(rubrikPenilaian || {})

    const whereClause: any = {
      tema,
      semester: semester || 'Ganjil',
      tahunAjaran: tahunAjaran || '2025/2026'
    }
    if (teacherId) {
      whereClause.teacherId = teacherId
    }

    const existingRPP = await db.rPP.findFirst({ where: whereClause })

    const rppData: any = {
      subtema, temaProjek, judulKegiatan,
      pokokBahasan: pokokBahasan || '',
      fase: fase || 'Fase Fondasi',
      kelompokUsia: kelompokUsia || 'Kelompok A (4-5 Tahun)',
      hari: hari || '',
      jumlahPertemuan: jumlahPertemuan || '8 JP',
      kelas: kelas || '',
      guru: guru || '',
      topikKBC: topikKBC || '',
      profilLulusan: profilLulusan || '',
      tujuanKBC: tujuanKBC || '',
      tujuanProfilLulusan: tujuanProfilLulusanJson,
      tujuanPembelajaranMendalam: tujuanPembelajaranMendalam || '',
      materiIntegrasiKBC: materiIntegrasiKBC || '',
      tujuanPembelajaran: tujuanPembelajaran || '',
      kerangkaPembelajaran: kerangkaPembelajaranJson,
      kegiatanPembelajaran: kegiatanPembelajaranJson,
      rubrikPenilaian: rubrikPenilaianJson,
      namaSekolah: namaSekolah || 'RA INSAN MADANI',
      alamatSekolah: alamatSekolah || ''
    }
    if (teacherId) {
      rppData.teacherId = teacherId
    }

    let rppId: string

    if (existingRPP) {
      const updatedRPP = await db.rPP.update({
        where: { id: existingRPP.id },
        data: rppData
      })
      rppId = updatedRPP.id
    } else {
      rppData.tema = tema
      rppData.semester = semester || 'Ganjil'
      rppData.tahunAjaran = tahunAjaran || '2025/2026'
      const newRPP = await db.rPP.create({ data: rppData })
      rppId = newRPP.id
    }

    return NextResponse.json({
      success: true,
      message: existingRPP ? 'RPP berhasil diperbarui' : 'RPP berhasil disimpan',
      id: rppId
    })
  } catch (error: any) {
    console.error('Error saving RPP:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menyimpan RPP' },
      { status: 500 }
    )
  }
}