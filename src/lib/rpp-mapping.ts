// Reverse mapping: DB columns (old format) → KBC fields (new 12-section format)
// Used when reading saved RPP from database for export/display

export function mapDbToKBC(dbRecord: any) {
  const parseJSON = (field: any): any => {
    if (!field) return {}
    if (typeof field === 'string') {
      try { return JSON.parse(field) } catch { return {} }
    }
    return field
  }

  return {
    // A. Identitas
    fase: dbRecord.fase || 'Fase Fondasi',
    kelompokUsia: dbRecord.kelompokUsia || 'Kelompok A (4-5 Tahun)',
    semester: dbRecord.semester || 'Ganjil',
    tahunAjaran: dbRecord.tahunAjaran || '',
    hari: dbRecord.hari || '',
    jumlahPertemuan: dbRecord.jumlahPertemuan || '8 JP',
    kelas: dbRecord.kelas || '',
    guru: dbRecord.guru || '',

    // B. Capaian Pembelajaran
    tema: dbRecord.tema || '',
    subtema: dbRecord.subtema || '',
    capaianPembelajaran: dbRecord.temaProjek || '',

    // C. Tujuan Pembelajaran
    tujuanPembelajaran: dbRecord.tujuanPembelajaran || '',

    // D. 6 Nilai Cinta (was stored in tujuanKBC column)
    nilaiCinta: parseJSON(dbRecord.tujuanKBC),

    // E. 8 Dimensi Kelulusan (was stored in tujuanProfilLulusan column)
    dimensiKelulusan: parseJSON(dbRecord.tujuanProfilLulusan),

    // F. Pemahaman Bermakna (was stored in tujuanPembelajaranMendalam column)
    pemahamanBermakna: dbRecord.tujuanPembelajaranMendalam || '',

    // G. Pertanyaan Pemantik (was stored in materiIntegrasiKBC column)
    pertanyaanPemantik: dbRecord.materiIntegrasiKBC || '',

    // H. Sarana, Media, Bahan (was stored in kerangkaPembelajaran column)
    saranaMediaBahan: parseJSON(dbRecord.kerangkaPembelajaran),

    // I. Langkah Pembelajaran (was stored in kegiatanPembelajaran column)
    langkahPembelajaran: parseJSON(dbRecord.kegiatanPembelajaran),

    // J. Asesmen (was stored in rubrikPenilaian column)
    asesmen: typeof dbRecord.rubrikPenilaian === 'string'
      ? (() => { try { const p = JSON.parse(dbRecord.rubrikPenilaian); return p.asesmen || dbRecord.rubrikPenilaian || '' } catch { return dbRecord.rubrikPenilaian || '' } })()
      : (dbRecord.rubrikPenilaian?.asesmen || ''),

    // K. Tindak Lanjut (was stored in pokokBahasan column)
    tindakLanjut: dbRecord.pokokBahasan || '',

    // L. Refleksi Guru (was stored in judulKegiatan column)
    refleksiGuru: dbRecord.judulKegiatan || '',

    // School info
    namaSekolah: dbRecord.namaSekolah || 'RA INSAN MADANI',
    alamatSekolah: dbRecord.alamatSekolah || '',
  }
}