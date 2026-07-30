import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentAcademicYear } from '@/lib/semester-utils'

// RPP Save API - Using Prisma ORM
// Maps new KBC frontend field names to existing database columns

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Extract new frontend field names
    const {
      tema,
      subtema,
      capaianPembelajaran,
      refleksiGuru,
      tindakLanjut,
      fase,
      kelompokUsia,
      semester,
      tahunAjaran,
      hari,
      jumlahPertemuan,
      kelas,
      guru,
      nilaiCinta,
      dimensiKelulusan,
      pemahamanBermakna,
      pertanyaanPemantik,
      tujuanPembelajaran,
      saranaMediaBahan,
      langkahPembelajaran,
      asesmen,
      namaSekolah,
      alamatSekolah
    } = body

    // Validate required fields
    if (!tema || !subtema) {
      return NextResponse.json(
        { success: false, error: 'Field wajib harus diisi: Tema dan Subtema' },
        { status: 400 }
      )
    }

    // Map new frontend fields to existing database columns
    // capaianPembelajaran → temaProjek column
    // refleksiGuru → judulKegiatan column
    // tindakLanjut → pokokBahasan column
    // nilaiCinta → tujuanKBC column (JSON string)
    // dimensiKelulusan → tujuanProfilLulusan column (JSON string)
    // pemahamanBermakna → tujuanPembelajaranMendalam column
    // pertanyaanPemantik → materiIntegrasiKBC column
    // saranaMediaBahan → kerangkaPembelajaran column (JSON string)
    // langkahPembelajaran → kegiatanPembelajaran column (JSON string)
    // asesmen → rubrikPenilaian column (JSON string)

    const tujuanKBCJson = typeof nilaiCinta === 'string'
      ? nilaiCinta
      : JSON.stringify(nilaiCinta || {})

    const tujuanProfilLulusanJson = typeof dimensiKelulusan === 'string'
      ? dimensiKelulusan
      : JSON.stringify(dimensiKelulusan || {})

    const kerangkaPembelajaranJson = typeof saranaMediaBahan === 'string'
      ? saranaMediaBahan
      : JSON.stringify(saranaMediaBahan || {})

    const kegiatanPembelajaranJson = typeof langkahPembelajaran === 'string'
      ? langkahPembelajaran
      : JSON.stringify(langkahPembelajaran || {})

    const rubrikPenilaianJson = typeof asesmen === 'string'
      ? asesmen
      : JSON.stringify({ asesmen: asesmen || '' })

    // Check if RPP with same tema, semester, and tahunAjaran already exists
    const existingRPP = await db.rPP.findFirst({
      where: {
        tema,
        semester: semester || 'Ganjil',
        tahunAjaran: tahunAjaran || getCurrentAcademicYear()
      }
    })

    let rppId: string

    const rppData = {
      subtema: subtema || '',
      temaProjek: capaianPembelajaran || '',
      judulKegiatan: refleksiGuru || '',
      pokokBahasan: tindakLanjut || '',
      fase: fase || 'Fase Fondasi',
      kelompokUsia: kelompokUsia || 'Kelompok A (4-5 Tahun)',
      hari: hari || '',
      jumlahPertemuan: jumlahPertemuan || '8 JP',
      kelas: kelas || '',
      guru: guru || '',
      topikKBC: '',
      profilLulusan: '',
      tujuanKBC: tujuanKBCJson,
      tujuanProfilLulusan: tujuanProfilLulusanJson,
      tujuanPembelajaranMendalam: pemahamanBermakna || '',
      materiIntegrasiKBC: pertanyaanPemantik || '',
      tujuanPembelajaran: tujuanPembelajaran || '',
      kerangkaPembelajaran: kerangkaPembelajaranJson,
      kegiatanPembelajaran: kegiatanPembelajaranJson,
      rubrikPenilaian: rubrikPenilaianJson,
      namaSekolah: namaSekolah || 'RA INSAN MADANI',
      alamatSekolah: alamatSekolah || ''
    }

    if (existingRPP) {
      // Update existing RPP
      const updatedRPP = await db.rPP.update({
        where: { id: existingRPP.id },
        data: rppData
      })
      rppId = updatedRPP.id
    } else {
      // Create new RPP
      const newRPP = await db.rPP.create({
        data: {
          tema,
          semester: semester || 'Ganjil',
          tahunAjaran: tahunAjaran || getCurrentAcademicYear(),
          ...rppData
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