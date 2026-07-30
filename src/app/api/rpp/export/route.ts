import { NextRequest, NextResponse } from 'next/server'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from 'docx'
import { getCurrentAcademicYear } from '@/lib/semester-utils'
import { db } from '@/lib/db'
import { mapDbToKBC } from '@/lib/rpp-mapping'

// Parse JSON fields (form sends objects or stringified JSON)
const parseJSON = (field: any): any => {
  if (!field) return {}
  if (typeof field === 'string') {
    try { return JSON.parse(field) } catch { return {} }
  }
  return field
}

const NILAI_CINTA_LABELS: Record<string, string> = {
  cintaAllah: 'Cinta kepada Allah SWT',
  cintaRasulullah: 'Cinta kepada Rasulullah SAW',
  cintaDiriSendiri: 'Cinta kepada Diri Sendiri',
  cintaSesama: 'Cinta kepada Sesama',
  cintaLingkungan: 'Cinta kepada Lingkungan',
  cintaBangsaNegara: 'Cinta kepada Bangsa dan Negara',
}

const DIMENSI_LABELS: Record<string, string> = {
  keimananKetakwaan: 'Keimanan dan Ketakwaan',
  kewargaan: 'Kewargaan',
  penalaranKritis: 'Penalaran Kritis',
  kreativitas: 'Kreativitas',
  kolaborasi: 'Kolaborasi',
  kemandirian: 'Kemandirian',
  kesehatan: 'Kesehatan',
  komunikasi: 'Komunikasi',
}

const KEGIATAN_INTI_LABELS: Record<string, string> = {
  eksplorasi: 'a. Eksplorasi',
  bermain: 'b. Bermain',
  berkarya: 'c. Berkarya',
  refleksi: 'd. Refleksi Siswa',
}

const SARANA_LABELS: Record<string, string> = {
  sarana: 'Sarana',
  media: 'Media Pembelajaran',
  bahan: 'Bahan Pembelajaran',
}

// Helper: create a key-value row table
function createKeyValueTable(data: [string, string][]): Table {
  const rows = data.map(([key, value]) =>
    new TableRow({
      children: [
        new TableCell({
          width: { size: 35, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE, size: 0 },
            bottom: { style: BorderStyle.NONE, size: 0 },
            left: { style: BorderStyle.NONE, size: 0 },
            right: { style: BorderStyle.NONE, size: 0 },
          },
          children: [new Paragraph({ children: [new TextRun({ text: key, bold: true, size: 22 })] })],
        }),
        new TableCell({
          width: { size: 5, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE, size: 0 },
            bottom: { style: BorderStyle.NONE, size: 0 },
            left: { style: BorderStyle.NONE, size: 0 },
            right: { style: BorderStyle.NONE, size: 0 },
          },
          children: [new Paragraph({ children: [new TextRun({ text: ':', bold: true, size: 22 })] })],
        }),
        new TableCell({
          width: { size: 60, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE, size: 0 },
            bottom: { style: BorderStyle.NONE, size: 0 },
            left: { style: BorderStyle.NONE, size: 0 },
            right: { style: BorderStyle.NONE, size: 0 },
          },
          children: [new Paragraph({ children: [new TextRun({ text: value || '-', size: 22 })] })],
        }),
      ],
    })
  )

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
  })
}

// Helper: paragraph from text with line breaks
function textToParagraphs(text: string, indent: number = 0): Paragraph[] {
  if (!text || text.trim() === '') return [new Paragraph({ text: '-', size: 22 })]
  return text
    .split('\n')
    .filter((line) => line.trim())
    .map(
      (line) =>
        new Paragraph({
          spacing: { after: 80 },
          indent: indent > 0 ? { left: indent * 360 } : undefined,
          children: [new TextRun({ text: line, size: 22 })],
        })
    )
}

// Helper: create labeled sub-items from a JSON object
function createJsonSubItems(
  obj: Record<string, string>,
  labelMap: Record<string, string>,
  indent: number = 0
): Paragraph[] {
  const result: Paragraph[] = []
  const entries = Object.entries(obj).filter(([, v]) => v && v.trim() !== '')
  if (entries.length === 0) {
    result.push(new Paragraph({ text: '-', size: 22 }))
    return result
  }
  for (const [key, value] of entries) {
    const label = labelMap?.[key] || key
    result.push(
      new Paragraph({
        spacing: { before: 120, after: 40 },
        indent: indent > 0 ? { left: indent * 360 } : undefined,
        children: [new TextRun({ text: `${label}:`, bold: true, size: 22 })],
      })
    )
    result.push(...textToParagraphs(value, indent + 1))
  }
  return result
}

// Helper: create kegiatan inti sub-sections
function createKegiatanInti(kegiatanInti: any): Paragraph[] {
  const result: Paragraph[] = []
  if (!kegiatanInti || typeof kegiatanInti !== 'object') {
    result.push(new Paragraph({ text: '-', size: 22 }))
    return result
  }
  const entries = Object.entries(kegiatanInti).filter(
    ([, v]) => v && String(v).trim() !== ''
  )
  if (entries.length === 0) {
    result.push(new Paragraph({ text: '-', size: 22 }))
    return result
  }
  for (const [key, value] of entries) {
    const label = KEGIATAN_INTI_LABELS[key] || key
    result.push(
      new Paragraph({
        spacing: { before: 120, after: 40 },
        indent: { left: 360 },
        children: [new TextRun({ text: label, bold: true, size: 22 })],
      })
    )
    result.push(...textToParagraphs(String(value), 2))
  }
  return result
}

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()

    // If rppId is provided, fetch from DB and reverse-map to KBC fields
    let rppData = requestData
    if (requestData.rppId && !requestData.tema) {
      const dbRecord = await db.rPP.findUnique({ where: { id: requestData.rppId } })
      if (dbRecord) {
        rppData = mapDbToKBC(dbRecord)
      } else {
        return NextResponse.json({ success: false, error: 'RPP tidak ditemukan' }, { status: 404 })
      }
    }

    const nilaiCinta = parseJSON(rppData.nilaiCinta)
    const dimensiKelulusan = parseJSON(rppData.dimensiKelulusan)
    const saranaMediaBahan = parseJSON(rppData.saranaMediaBahan)
    const langkahPembelajaran = parseJSON(rppData.langkahPembelajaran)

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // HEADER
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 80 },
              children: [
                new TextRun({
                  text: rppData.namaSekolah || 'RA INSAN MADANI',
                  bold: true,
                  size: 32,
                }),
              ],
            }),
            rppData.alamatSekolah
              ? new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 80 },
                  children: [
                    new TextRun({
                      text: rppData.alamatSekolah,
                      size: 20,
                    }),
                  ],
                })
              : new Paragraph({ text: '' }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 60 },
              children: [
                new TextRun({
                  text: 'Rencana Pelaksanaan Pembelajaran',
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 120 },
              children: [
                new TextRun({
                  text: 'Kurikulum Berbasis Cinta (KBC)',
                  bold: true,
                  size: 24,
                }),
              ],
            }),

            // A. IDENTITAS PEMBELAJARAN
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
              children: [
                new TextRun({
                  text: 'A. Identitas Pembelajaran',
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            createKeyValueTable([
              ['Fase', rppData.fase || 'Fase Fondasi'],
              ['Kelompok Usia', rppData.kelompokUsia || '-'],
              ['Semester', rppData.semester || 'Ganjil'],
              ['Tahun Ajaran', rppData.tahunAjaran || getCurrentAcademicYear()],
              ['Hari', rppData.hari || '-'],
              ['Jumlah Pertemuan', rppData.jumlahPertemuan || '8 JP'],
              ['Kelas', rppData.kelas || '-'],
              ['Guru', rppData.guru || '-'],
            ]),

            // B. CAPAIAN PEMBELAJARAN
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 100 },
              children: [
                new TextRun({
                  text: 'B. Capaian Pembelajaran',
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            createKeyValueTable([
              ['Tema', rppData.tema || '-'],
              ['Subtema', rppData.subtema || '-'],
            ]),
            new Paragraph({ spacing: { before: 80 }, children: [] }),
            ...textToParagraphs(rppData.capaianPembelajaran || '-'),

            // C. TUJUAN PEMBELAJARAN
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 100 },
              children: [
                new TextRun({
                  text: 'C. Tujuan Pembelajaran',
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            ...textToParagraphs(rppData.tujuanPembelajaran || '-'),

            // D. 6 NILAI CINTA
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 100 },
              children: [
                new TextRun({
                  text: 'D. 6 Nilai Cinta',
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            ...createJsonSubItems(nilaiCinta, NILAI_CINTA_LABELS),

            // E. 8 DIMENSI KELULUSAN
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 100 },
              children: [
                new TextRun({
                  text: 'E. 8 Dimensi Kelulusan KBC Kemenag',
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            ...createJsonSubItems(dimensiKelulusan, DIMENSI_LABELS),

            // F. PEMAHAMAN BERMAKNA
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 100 },
              children: [
                new TextRun({
                  text: 'F. Pemahaman Bermakna',
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            ...textToParagraphs(rppData.pemahamanBermakna || '-'),

            // G. PERTANYAAN PEMANTIK
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 100 },
              children: [
                new TextRun({
                  text: 'G. Pertanyaan Pemantik',
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            ...textToParagraphs(rppData.pertanyaanPemantik || '-'),

            // H. SARANA, MEDIA, DAN BAHAN
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 100 },
              children: [
                new TextRun({
                  text: 'H. Sarana, Media, dan Bahan',
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            ...createJsonSubItems(saranaMediaBahan, SARANA_LABELS),

            // I. LANGKAH PEMBELAJARAN
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 100 },
              children: [
                new TextRun({
                  text: 'I. Langkah Pembelajaran',
                  bold: true,
                  size: 24,
                }),
              ],
            }),

            // 1. Penyambutan
            new Paragraph({
              spacing: { before: 160, after: 60 },
              children: [
                new TextRun({ text: '1. Penyambutan', bold: true, size: 22 }),
              ],
            }),
            ...textToParagraphs(langkahPembelajaran?.penyambutan || '-', 1),

            // 2. Pembukaan
            new Paragraph({
              spacing: { before: 160, after: 60 },
              children: [
                new TextRun({ text: '2. Pembukaan', bold: true, size: 22 }),
              ],
            }),
            ...textToParagraphs(langkahPembelajaran?.pembukaan || '-', 1),

            // 3. Kegiatan Inti
            new Paragraph({
              spacing: { before: 160, after: 60 },
              children: [
                new TextRun({ text: '3. Kegiatan Inti', bold: true, size: 22 }),
              ],
            }),
            ...createKegiatanInti(langkahPembelajaran?.kegiatanInti || {}),

            // 4. Penutup
            new Paragraph({
              spacing: { before: 160, after: 60 },
              children: [
                new TextRun({ text: '4. Penutup', bold: true, size: 22 }),
              ],
            }),
            ...textToParagraphs(langkahPembelajaran?.penutup || '-', 1),

            // J. ASESMEN
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 100 },
              children: [
                new TextRun({
                  text: 'J. Asesmen',
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            ...textToParagraphs(rppData.asesmen || '-'),

            // K. TINDAK LANJUT
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 100 },
              children: [
                new TextRun({
                  text: 'K. Tindak Lanjut',
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            ...textToParagraphs(rppData.tindakLanjut || '-'),

            // L. REFLEKSI GURU
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 100 },
              children: [
                new TextRun({
                  text: 'L. Refleksi Guru',
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            ...textToParagraphs(rppData.refleksiGuru || '-'),

            // FOOTER
            new Paragraph({ spacing: { before: 400 }, children: [] }),
            new Paragraph({
              children: [
                new TextRun({
                  text: '─'.repeat(60),
                  size: 18,
                  color: '999999',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 120 },
              children: [
                new TextRun({
                  text: 'Rencana Pelaksanaan Pembelajaran Kurikulum Berbasis Cinta (KBC)',
                  bold: true,
                  size: 18,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 40 },
              children: [
                new TextRun({
                  text: `${rppData.namaSekolah || 'RA INSAN MADANI'} - ${rppData.tema || ''} : ${rppData.subtema || ''} - ${rppData.semester || 'Ganjil'} ${rppData.tahunAjaran || getCurrentAcademicYear()}`,
                  bold: true,
                  size: 18,
                }),
              ],
            }),
          ],
        },
      ],
    })

    const buffer = await Packer.toBuffer(doc)

    const fileName = `RPP-KBC-${(rppData.tema || 'Baru').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.docx`

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error('Error exporting RPP KBC to Word:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengekspor RPP' },
      { status: 500 }
    )
  }
}