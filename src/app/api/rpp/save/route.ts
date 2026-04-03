import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// RPP Save API - Using Prisma ORM

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Extract fields from body
    const {
      tema,
      subtema,
      temaProjek,
      judulKegiatan,
      pokokBahasan,
      fase,
      kelompokUsia,
      semester,
      tahunAjaran,
      hari,
      jumlahPertemuan,
      kelas,
      guru,
      topikKBC,
      profilLulusan,
      tujuanKBC,
      tujuanProfilLulusan,
      tujuanPembelajaranMendalam,
      materiIntegrasiKBC,
      tujuanPembelajaran,
      kerangkaPembelajaran,
      kegiatanPembelajaran,
      rubrikPenilaian,
      namaSekolah,
      alamatSekolah
    } = body

    // Validate required fields
    if (!tema || !subtema || !temaProjek || !judulKegiatan) {
      return NextResponse.json(
        { success: false, error: 'Field wajib harus diisi: Tema, Subtema, Tema Projek, Judul Kegiatan' },
        { status: 400 }
      )
    }

    // Convert complex objects to JSON strings for storage
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

    // Check if RPP with same tema, semester, and tahunAjaran already exists
    const existingRPP = await db.rPP.findFirst({
      where: {
        tema,
        semester: semester || 'Ganjil',
        tahunAjaran: tahunAjaran || '2025/2026'
      }
    })

    let rppId: string

    if (existingRPP) {
      // Update existing RPP
      const updatedRPP = await db.rPP.update({
        where: { id: existingRPP.id },
        data: {
          subtema,
          temaProjek,
          judulKegiatan,
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
      })
      rppId = updatedRPP.id
    } else {
      // Create new RPP
      const newRPP = await db.rPP.create({
        data: {
          tema,
          subtema,
          temaProjek,
          judulKegiatan,
          pokokBahasan: pokokBahasan || '',
          fase: fase || 'Fase Fondasi',
          kelompokUsia: kelompokUsia || 'Kelompok A (4-5 Tahun)',
          semester: semester || 'Ganjil',
          tahunAjaran: tahunAjaran || '2025/2026',
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
      })

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
