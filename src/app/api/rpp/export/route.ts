import { NextRequest, NextResponse } from 'next/server'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx'

export async function POST(request: NextRequest) {
  try {
    const rppData = await request.json()

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: rppData.namaSekolah || "RA INSAN MADANI",
                bold: true,
                size: 32
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Rencana Pelaksanaan Pembelajaran",
                bold: true,
                size: 28
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Kurikulum Berbasis Cinta (KBC)",
                bold: true,
                size: 24
              })
            ]
          }),
          new Paragraph({ text: "" }),

          // A. Identitas Pembelajaran
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "A. Identitas Pembelajaran", bold: true })]
          }),
          new Paragraph({ text: "" }),
          ...createKeyValueTable([
            ["Fase:", rppData.fase || "Fase Fondasi"],
            ["Kelompok Usia:", rppData.kelompokUsia || "Kelompok A (4-5 Tahun)"],
            ["Semester:", rppData.semester || "Ganjil"],
            ["Tahun Ajaran:", rppData.tahunAjaran || "2025/2026"],
            ["Hari:", rppData.hari || "-"],
            ["Jumlah Pertemuan:", rppData.jumlahPertemuan || "-"],
            ["Kelas:", rppData.kelas || "-"],
            ["Guru:", rppData.guru || "-"]
          ]),

          new Paragraph({ text: "" }),

          // B. Tema Projek
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "B. Tema Projek", bold: true })]
          }),
          new Paragraph({ text: "" }),
          ...createKeyValueTable([
            ["Tema:", rppData.tema || "-"],
            ["Subtema:", rppData.subtema || "-"],
            ["Tema Projek:", rppData.temaProjek || "-"],
            ["Judul Kegiatan:", rppData.judulKegiatan || "-"],
            ["Pokok Bahasan:", rppData.pokokBahasan || "-"]
          ]),

          new Paragraph({ text: "" }),

          // C. Topik KBC
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "C. Topik KBC", bold: true })]
          }),
          ...parseBulletPoints(rppData.topikKBC || "Cinta Diri dan Sesama"),

          // D. Profil Lulusan
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "D. Profil Lulusan", bold: true })]
          }),
          ...parseBulletPoints(rppData.profilLulusan || "Kesehatan\nKemandirian\nBernalar Kritis\nKreatif\nBerkarakter\nBeriman\nBertakwa"),

          new Paragraph({ text: "" }),

          // E. Tujuan KBC
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "E. Tujuan KBC", bold: true })]
          }),
          ...parseTextToParagraphs(rppData.tujuanKBC || "-"),

          new Paragraph({ text: "" }),

          // F. Tujuan Profil Lulusan
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "F. Tujuan Profil Lulusan", bold: true })]
          }),
          ...parseProfilLulusanGoals(rppData.tujuanProfilLulusan || {}),

          new Paragraph({ text: "" }),

          // G. Tujuan Pembelajaran Mendalam
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "G. Tujuan Pembelajaran Mendalam", bold: true })]
          }),
          ...parseKDMultiple(rppData.tujuanPembelajaranMendalam || ""),

          new Paragraph({ text: "" }),

          // H. Materi Integrasi KBC
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "H. Materi Integrasi KBC", bold: true })]
          }),
          ...parseTextToParagraphs(rppData.materiIntegrasiKBC || "-"),

          new Paragraph({ text: "" }),

          // I. Tujuan Pembelajaran
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "I. Tujuan Pembelajaran", bold: true })]
          }),
          ...parseTextToParagraphs(rppData.tujuanPembelajaran || "-"),

          new Paragraph({ text: "" }),

          // J. Kerangka Pembelajaran
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "J. Kerangka Pembelajaran", bold: true })]
          }),
          ...createKerangkaPembelajaran(rppData.kerangkaPembelajaran || {}),

          new Paragraph({ text: "" }),

          // K. Kegiatan Pembelajaran
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "K. Kegiatan Pembelajaran (Format Matriks 5 Tahap)", bold: true })]
          }),
          ...createKegiatanPembelajaran(rppData.kegiatanPembelajaran || {}),

          new Paragraph({ text: "" }),

          // Lampiran 1
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "Lampiran 1: Lembar Observasi", bold: true })]
          }),
          new Paragraph({ text: "*Berilah tanda (✓) sesuai hasil pengamatan perilaku dan sikap anak dalam kegiatan.*" }),
          new Paragraph({ text: "" }),
          createObservasiTable(),

          new Paragraph({ text: "" }),

          // Lampiran 2
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "Lampiran 2: Rubrik Penilaian Kinerja", bold: true })]
          }),
          new Paragraph({ text: "" }),
          createRubrikTable(),

          // Footer
          new Paragraph({ text: "" }),
          new Paragraph({ text: "─" }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Rencana Pelaksanaan Pembelajaran Kurikulum Berbasis Cinta (KBC)", bold: true })]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: `RA INSAN MADANI - ${rppData.semester || "Ganjil"} ${rppData.tahunAjaran || "2025/2026"}`, bold: true })]
          })
        ]
      }]
    })

    const buffer = await Packer.toBuffer(doc)

    const fileName = `RPP-KBC-${rppData.tema || "Baru"}-${new Date().toISOString().split('T')[0]}.docx`

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    })
  } catch (error) {
    console.error('Error exporting RPP:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengekspor RPP' },
      { status: 500 }
    )
  }
}

function createKeyValueTable(data: string[][]): Array<Table | Paragraph> {
  const rows = data.map(([key, value]) =>
    new TableRow({
      children: [
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: key, bold: true })] })]
        }),
        new TableCell({
          width: { size: 70, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ text: value })]
        })
      ]
    })
  )

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows
  })

  return [table, new Paragraph({ text: "" })]
}

function parseBulletPoints(text: string): Paragraph[] {
  const lines = text.split('\n').filter(line => line.trim())
  return lines.map(line =>
    new Paragraph({
      bullet: { level: 0 },
      children: [new TextRun({ text: line.replace(/^[•\-\*]\s*/, '') })]
    })
  )
}

function parseTextToParagraphs(text: string): Paragraph[] {
  const lines = text.split('\n').filter(line => line.trim())
  return lines.map(line =>
    new Paragraph({ text: line })
  )
}

function parseProfilLulusanGoals(goals: any): Array<Paragraph> {
  const result: Array<Paragraph> = []
  const defaultGoals = {
    Kesehatan: "Mengenal lingkungan sehat",
    Kemandirian: "Dapat merawat diri sendiri",
    BernalarKritis: "Memahami alasan perilaku",
    Kreatif: "Menciptakan aktivitas bermain",
    Berkarakter: "Menumbuhkan sikap hormat",
    Beriman: "Mengenal mesjid sebagai tempat ibadah",
    Bertakwa: "Mengenal dasar-dasar ibadah"
  }

  for (const [key, value] of Object.entries(goals)) {
    if (value) {
      result.push(new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun({ text: key, bold: true })]
      }))
      result.push(new Paragraph({ text: `• ${value}` }))
    }
  }

  return result
}

function parseKDMultiple(text: string): Paragraph[] {
  const lines = text.split('\n').filter(line => line.trim())
  return lines.map(line =>
    new Paragraph({
      children: [new TextRun({ text: line, bold: true })]
    })
  )
}

function createKerangkaPembelajaran(kerangka: any): Array<Paragraph> {
  const result: Array<Paragraph> = []

  // Praktek Pedagogik
  result.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text: "Praktek Pedagogik", bold: true })]
  }))
  result.push(...parseBulletPoints(kerangka.praktekPedagogik || "Main peran\nObservasi lapangan\nCerita bergambar\nPertanyaan terbuka\nPembelajaran berbasis proyek"))
  result.push(new Paragraph({ text: "" }))

  // Lingkungan Pembelajaran
  result.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text: "Lingkungan Pembelajaran", bold: true })]
  }))

  const lingkungan = kerangka.lingkunganPembelajaran || {}
  if (lingkungan.fisik) {
    result.push(new Paragraph({ children: [new TextRun({ text: "Fisik:", bold: true })] }))
    result.push(...parseBulletPoints(lingkungan.fisik || "Model mesjid mini\nGambar mesjid\nKarpet sholat\nAlat salat"))
  }
  if (lingkungan.sosial) {
    result.push(new Paragraph({ children: [new TextRun({ text: "Sosial:", bold: true })] }))
    result.push(...parseBulletPoints(lingkungan.sosial || "Kerja kelompok kecil\nInteraksi dengan pengurus masjid\nBermain bersama teman"))
  }
  if (lingkungan.psikologis) {
    result.push(new Paragraph({ children: [new TextRun({ text: "Psikologis:", bold: true })] }))
    result.push(...parseBulletPoints(lingkungan.psikologis || "Lingkungan nyaman\nPujian dan motivasi\nKreativitas anak didik"))
  }
  if (lingkungan.akademik) {
    result.push(new Paragraph({ children: [new TextRun({ text: "Akademik:", bold: true })] }))
    result.push(...parseBulletPoints(lingkungan.akademik || "Buku cerita tentang mesjid\nGambar-gambar ibadah\nVideo edukasi"))
  }
  result.push(new Paragraph({ text: "" }))

  // Kemitraan
  result.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text: "Kemitraan Pembelajaran", bold: true })]
  }))
  result.push(...parseBulletPoints(kerangka.kemitraanPembelajaran || "Orang tua\nPengurus masjid setempat\nTokoh agama"))
  result.push(new Paragraph({ text: "" }))

  // Pemanfaatan Digital
  result.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text: "Pemanfaatan Digital", bold: true })]
  }))
  result.push(...parseBulletPoints(kerangka.pemanfaatanDigital || "Video singkat tentang mesjid\nAplikasi edukasi anak tentang ibadah"))

  return result
}

function createKegiatanPembelajaran(kegiatan: any): Array<Paragraph> {
  const result: Array<Paragraph> = []

  // 1. Tahap Persiapan
  result.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text: "1. Tahap Persiapan", bold: true })]
  }))
  result.push(new Paragraph({ children: [new TextRun({ text: "Pemahaman Konsep:", bold: true })] }))
  result.push(...parseBulletPoints(kegiatan.persiapan?.pemahamanKonsep || "Membaca buku tentang tema\nMelihat video pendek\nDiskusi sederhana"))
  result.push(new Paragraph({ children: [new TextRun({ text: "Penyiapan Alat:", bold: true })] }))
  result.push(...parseBulletPoints(kegiatan.persiapan?.penyiapanAlat || "Mempersiapkan alat peraga\nMenyiapkan gambar-gambar\nMempersiapkan bahan"))
  result.push(new Paragraph({ children: [new TextRun({ text: "Alat & Bahan:", bold: true })] }))
  result.push(...parseBulletPoints(kegiatan.persiapan?.alatBahan || "Kertas warna\nGunting\nLem\nGambar\nStiker"))
  result.push(new Paragraph({ text: "" }))

  // 2. Tahap Pelaksanaan
  result.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text: "2. Tahap Pelaksanaan", bold: true })]
  }))
  result.push(new Paragraph({ children: [new TextRun({ text: "Orientasi/Pembukaan:", bold: true })] }))
  result.push(...parseBulletPoints(kegiatan.pelaksanaan?.orientasi || "Mengajak anak duduk melingkar\nMenanyakan pengalaman anak\nMemperkenalkan tema"))
  result.push(new Paragraph({ children: [new TextRun({ text: "Eksplorasi/Inti:", bold: true })] }))
  result.push(...parseBulletPoints(kegiatan.pelaksanaan?.eksplorasi || "Melihat model\nMengenal bagian-bagian\nMempraktikkan aktivitas"))
  result.push(new Paragraph({ children: [new TextRun({ text: "Diskusi/Bertanya:", bold: true })] }))
  result.push(...parseBulletPoints(kegiatan.pelaksanaan?.diskusi || "Membahas cara bersikap\nMengapa penting\nApa saja aktivitas"))
  result.push(new Paragraph({ children: [new TextRun({ text: "Kolaborasi:", bold: true })] }))
  result.push(...parseBulletPoints(kegiatan.pelaksanaan?.kolaborasi || "Bekerja kelompok\nBermain peran\nMembuat poster"))
  result.push(new Paragraph({ children: [new TextRun({ text: "Refleksi/Penutup:", bold: true })] }))
  result.push(...parseBulletPoints(kegiatan.pelaksanaan?.refleksi || "Anak menceritakan pengalaman\nMenanyakan yang dipelajari"))
  result.push(new Paragraph({ text: "" }))

  // 3. Tahap Pembuatan Karya
  result.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text: "3. Tahap Pembuatan Karya", bold: true })]
  }))
  result.push(new Paragraph({ children: [new TextRun({ text: "Proses:", bold: true })] }))
  result.push(...parseBulletPoints(kegiatan.pembuatanKarya?.proses || "Membuat gambar\nMewarnai\nMembuat karya"))
  result.push(new Paragraph({ children: [new TextRun({ text: "Hasil:", bold: true })] }))
  result.push(...parseBulletPoints(kegiatan.pembuatanKarya?.hasil || "Gambar yang diperkirakan\nKarya yang dibuat\nPoster"))
  result.push(new Paragraph({ text: "" }))

  // 4. Tahap Presentasi
  result.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text: "4. Tahap Presentasi", bold: true })]
  }))
  result.push(new Paragraph({ children: [new TextRun({ text: "Persiapan Presentasi:", bold: true })] }))
  result.push(...parseBulletPoints(kegiatan.presentasi?.persiapan || "Menyiapkan karya\nMembuat kalimat penjelasan"))
  result.push(new Paragraph({ children: [new TextRun({ text: "Pelaksanaan Presentasi:", bold: true })] }))
  result.push(...parseBulletPoints(kegiatan.presentasi?.pelaksanaan || "Menampilkan karya\nMenceritakan karya\nMenjawab pertanyaan"))
  result.push(new Paragraph({ text: "" }))

  // 5. Tahap Refleksi Akhir
  result.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text: "5. Tahap Refleksi Akhir", bold: true })]
  }))
  result.push(new Paragraph({ children: [new TextRun({ text: "Refleksi Guru:", bold: true })] }))
  result.push(...parseBulletPoints(kegiatan.refleksiAkhir?.refleksiGuru || "Menilai pemahaman anak\nMengamati sikap anak\nMenilai kreativitas"))
  result.push(new Paragraph({ children: [new TextRun({ text: "Refleksi Anak:", bold: true })] }))
  result.push(...parseBulletPoints(kegiatan.refleksiAkhir?.refleksiAnak || "Menceritakan yang disukai\nMenyampaikan hal baru\nMenyampaikan kesulitan"))

  return result
}

function createObservasiTable(): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "No", bold: true })] }),
          new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "Nama Siswa", bold: true })] }),
          new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "SB", bold: true })] }),
          new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "B", bold: true })] }),
          new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "C", bold: true })] }),
          new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "K", bold: true })] })
        ]
      }),
      ...Array(6).fill(null).map((_, i) =>
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: String(i + 1) })] }),
            new TableCell({ children: [new Paragraph({ text: "-" })] }),
            new TableCell({ children: [new Paragraph({ text: "" })] }),
            new TableCell({ children: [new Paragraph({ text: "" })] }),
            new TableCell({ children: [new Paragraph({ text: "" })] }),
            new TableCell({ children: [new Paragraph({ text: "" })] })
          ]
        })
      )
    ]
  })
}

function createRubrikTable(): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "Aspek Penilaian", bold: true })] }),
          new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "SB (Sangat Baik)", bold: true })] }),
          new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "B (Baik)", bold: true })] }),
          new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: "C (Cukup)", bold: true })] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: "Sikap dan Perilaku" })] }),
          new TableCell({ children: [new Paragraph({ text: "Menunjukkan sikap baik" })] }),
          new TableCell({ children: [new Paragraph({ text: "Mengikuti arahan" })] }),
          new TableCell({ children: [new Paragraph({ text: "Kadang mengikuti" })] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: "Kemampuan Kognitif" })] }),
          new TableCell({ children: [new Paragraph({ text: "Mampu menjelaskan" })] }),
          new TableCell({ children: [new Paragraph({ text: "Mengenal konsep" })] }),
          new TableCell({ children: [new Paragraph({ text: "Mengenal sebagian" })] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: "Keterampilan Motorik" })] }),
          new TableCell({ children: [new Paragraph({ text: "Melakukan dengan benar" })] }),
          new TableCell({ children: [new Paragraph({ text: "Melakukan dengan bantuan" })] }),
          new TableCell({ children: [new Paragraph({ text: "Menirukan sederhana" })] })
        ]
      })
    ]
  })
}
