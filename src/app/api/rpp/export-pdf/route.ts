import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { getCurrentAcademicYear } from '@/lib/semester-utils'
import { db } from '@/lib/db'
import { mapDbToKBC } from '@/lib/rpp-mapping'
import fs from 'fs/promises'
import path from 'path'

async function loadLogo(pdfDoc: PDFDocument, filename: string, altFilenames?: string[]) {
  const candidates: string[] = [
    path.join(process.cwd(), 'upload', filename),
    path.join(process.cwd(), 'public', filename.toLowerCase().replace(/\s+/g, '-')),
  ]
  if (altFilenames) {
    for (const alt of altFilenames) {
      candidates.push(path.join(process.cwd(), 'upload', alt))
      candidates.push(path.join(process.cwd(), 'public', alt.toLowerCase().replace(/\s+/g, '-')))
    }
  }

  for (const filePath of candidates) {
    try {
      const bytes = await fs.readFile(filePath)
      try {
        const img = await pdfDoc.embedPng(bytes)
        console.log(`[RPP-PDF] Logo loaded (PNG): ${filePath}`)
        return img
      } catch {
        try {
          const img = await pdfDoc.embedJpg(bytes)
          console.log(`[RPP-PDF] Logo loaded (JPG): ${filePath}`)
          return img
        } catch {
          console.warn(`[RPP-PDF] File exists but not valid image: ${filePath}`)
        }
      }
    } catch {
      // File not found at this path, try next candidate
    }
  }
  console.error(`[RPP-PDF] All logo load attempts failed for: ${filename}`)
  return null
}

function calculateDimensions(originalWidth: number, originalHeight: number, targetSize: number) {
  const aspectRatio = originalWidth / originalHeight
  if (aspectRatio > 1) {
    return { width: targetSize, height: targetSize / aspectRatio }
  } else {
    return { width: targetSize * aspectRatio, height: targetSize }
  }
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

    // Fetch Kepala Sekolah info
    let kepsekName = 'Kepala Sekolah'
    let kepsekNuptk = ''
    try {
      const kepsekUser = await db.user.findFirst({
        where: { role: 'KEPSEK', isActive: true },
        include: { teacherProfile: { select: { nuptk: true } } }
      })
      if (kepsekUser) {
        kepsekName = kepsekUser.name || 'Kepala Sekolah'
        kepsekNuptk = kepsekUser.teacherProfile?.nuptk || ''
      }
    } catch (e) {
      console.warn('[RPP-PDF] Could not fetch kepsek:', e)
    }

    // Parse JSON fields (form sends stringified JSON)
    const parseJSON = (field: any): any => {
      if (!field) return {}
      if (typeof field === 'string') {
        try { return JSON.parse(field) } catch { return {} }
      }
      return field
    }

    const nilaiCinta = parseJSON(rppData.nilaiCinta)
    const dimensiKelulusan = parseJSON(rppData.dimensiKelulusan)
    const saranaMediaBahan = parseJSON(rppData.saranaMediaBahan)
    const langkahPembelajaran = parseJSON(rppData.langkahPembelajaran)

    // ============================================================
    // PDF SETUP
    // ============================================================
    const pdfDoc = await PDFDocument.create()
    // Load logos
    const kemenagLogo = await loadLogo(pdfDoc, 'Logo Kemenag.png', ['logo-kemenag.png'])
    const raLogo = await loadLogo(pdfDoc, 'LOGO RA.png', ['logo-ra.png'])
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const pageWidth = 595.28
    const pageHeight = 841.89
    const margin = { left: 50, right: 50, top: 60, bottom: 50 }
    const contentWidth = pageWidth - margin.left - margin.right

    let pages = [pdfDoc.addPage([pageWidth, pageHeight])]
    let currentPageIndex = 0
    let yPos = pageHeight - margin.top

    const getPage = () => pages[currentPageIndex]

    const newPage = () => {
      const page = pdfDoc.addPage([pageWidth, pageHeight])
      pages.push(page)
      currentPageIndex++
      yPos = pageHeight - margin.top
      return page
    }

    const ensureSpace = (needed: number, currentY?: number) => {
      const checkY = currentY !== undefined ? currentY : yPos
      if (checkY - needed < margin.bottom) {
        newPage()
        return true
      }
      return false
    }

    const drawText = (text: string, x: number, y: number, size: number, isBold: boolean) => {
      const clean = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
      if (!clean) return
      getPage().drawText(clean, {
        x, y, size,
        font: isBold ? fontBold : font,
        color: rgb(0, 0, 0)
      })
    }

    const drawSectionHeader = (title: string) => {
      ensureSpace(30)
      yPos -= 10
      drawText(title, margin.left, yPos, 12, true)
      yPos -= 8
      getPage().drawLine({
        start: { x: margin.left, y: yPos },
        end: { x: pageWidth - margin.right, y: yPos },
        thickness: 0.5, color: rgb(0.5, 0.5, 0.5)
      })
      yPos -= 12
    }

    const drawSubsection = (title: string) => {
      ensureSpace(20)
      yPos -= 5
      drawText(title, margin.left, yPos, 10, true)
      yPos -= 8
    }

    const drawSubSubsection = (title: string) => {
      ensureSpace(18)
      yPos -= 3
      drawText(title, margin.left + 10, yPos, 9, true)
      yPos -= 8
    }

    const drawParagraph = (text: string, indent: number = 0) => {
      if (!text || text.trim() === '') { yPos -= 10; return }
      const cleanText = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
      const paragraphs = cleanText.split('\n\n')
      const fontSize = 9
      const lineHeight = 12

      paragraphs.forEach((para) => {
        if (!para.trim()) return
        ensureSpace(lineHeight * 2)
        const lines = para.split('\n')
        lines.forEach((line) => {
          if (!line.trim()) { yPos -= 5; return }
          const words = line.split(' ')
          let currentLine = ''
          words.forEach((word) => {
            const testLine = currentLine + word + ' '
            const lineWidth = font.widthOfTextAtSize(testLine, fontSize)
            if (lineWidth > contentWidth - indent && currentLine) {
              ensureSpace(lineHeight)
              drawText(currentLine.trim(), margin.left + indent, yPos, fontSize, false)
              yPos -= lineHeight
              currentLine = word + ' '
            } else {
              currentLine = testLine
            }
          })
          if (currentLine.trim()) {
            ensureSpace(lineHeight)
            drawText(currentLine.trim(), margin.left + indent, yPos, fontSize, false)
            yPos -= lineHeight
          }
        })
        yPos -= 5
      })
    }

    const drawBullets = (text: string, indent: number = 20) => {
      if (!text || text.trim() === '') { yPos -= 12; return }
      const cleanText = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
      const lines = cleanText.split('\n').filter(l => l.trim())
      const fontSize = 8
      const lineHeight = 11

      lines.forEach((line) => {
        if (!line.trim()) return
        ensureSpace(lineHeight)
        drawText('-', margin.left + indent, yPos, fontSize, false)
        const words = line.split(' ')
        let currentLine = '  '
        const textIndent = indent + 10
        words.forEach((word) => {
          const testLine = currentLine + word + ' '
          const lineWidth = font.widthOfTextAtSize(testLine, fontSize)
          if (lineWidth > contentWidth - textIndent && currentLine.length > 2) {
            ensureSpace(lineHeight)
            drawText(currentLine.trim(), margin.left + textIndent, yPos, fontSize, false)
            yPos -= lineHeight
            currentLine = '  ' + word + ' '
          } else {
            currentLine = testLine
          }
        })
        if (currentLine.trim().length > 2) {
          ensureSpace(lineHeight)
          drawText(currentLine.trim(), margin.left + textIndent, yPos, fontSize, false)
          yPos -= lineHeight
        }
        yPos -= 5
      })
      yPos -= 3
    }

    const drawPairs = (fields: [string, string][]) => {
      const colWidth = contentWidth / 2
      const fontSize = 9
      const lineHeight = 14
      const leftColFields = fields.filter((_, idx) => idx % 2 === 0)
      const rightColFields = fields.filter((_, idx) => idx % 2 === 1)
      const getLabelWidth = (label: string) => fontBold.widthOfTextAtSize(label, fontSize)
      const maxLeftLabelWidth = Math.max(...leftColFields.map(f => getLabelWidth(f[0])))
      const maxRightLabelWidth = Math.max(...rightColFields.map(f => getLabelWidth(f[0])))
      const leftLabelWidth = Math.max(maxLeftLabelWidth, 60) + 5
      const rightLabelWidth = Math.max(maxRightLabelWidth, 60) + 5
      let yPosLeft = yPos
      let yPosRight = yPos

      fields.forEach((field, idx) => {
        const isLeftCol = idx % 2 === 0
        const labelWidth = isLeftCol ? leftLabelWidth : rightLabelWidth
        const x = isLeftCol ? margin.left : margin.left + colWidth + 20
        const valueMaxWidth = (contentWidth / 2) - labelWidth - 10
        let currentY = isLeftCol ? yPosLeft : yPosRight
        const pageAdded = ensureSpace(lineHeight * 2, currentY)
        if (pageAdded) {
          const newTop = pageHeight - margin.top
          yPosLeft = newTop
          yPosRight = newTop
          currentY = newTop
        }
        drawText(field[0], x, currentY, fontSize, true)
        const value = field[1] || '-'
        const words = value.split(' ')
        let currentLine = ''
        let linesDrawn = 0
        words.forEach((word) => {
          const testLine = currentLine + word + ' '
          const lineWidth = font.widthOfTextAtSize(testLine, fontSize)
          if (lineWidth > valueMaxWidth && currentLine) {
            drawText(currentLine.trim(), x + labelWidth, currentY - (linesDrawn * lineHeight), fontSize, false)
            linesDrawn++
            currentLine = word + ' '
            const newPageAdded = ensureSpace(lineHeight, currentY - (linesDrawn * lineHeight))
            if (newPageAdded) {
              const newTop = pageHeight - margin.top
              yPosLeft = newTop
              yPosRight = newTop
              currentY = newTop
              linesDrawn = 0
              drawText(field[0], x, currentY, fontSize, true)
            }
          } else {
            currentLine = testLine
          }
        })
        if (currentLine.trim()) {
          drawText(currentLine.trim(), x + labelWidth, currentY - (linesDrawn * lineHeight), fontSize, false)
          linesDrawn++
        }
        currentY -= (linesDrawn > 0 ? (linesDrawn - 1) * lineHeight : 0) + lineHeight
        if (isLeftCol) { yPosLeft = currentY } else { yPosRight = currentY }
      })
      yPos = Math.min(yPosLeft, yPosRight)
      yPos -= 10
    }

    // Helper: draw numbered items from JSON object
    const drawJsonItems = (obj: Record<string, string>, labelMap?: Record<string, string>, indent: number = 0) => {
      const entries = Object.entries(obj).filter(([, v]) => v && v.trim() !== '')
      if (entries.length === 0) { drawParagraph('-'); return }
      entries.forEach(([key, value]) => {
        const label = labelMap?.[key] || key
        ensureSpace(25)
        drawSubSubsection(`${label}:`)
        yPos -= 3
        drawParagraph(value, indent + 10)
      })
    }

    // ============================================================
    // HEADER WITH LOGOS
    // ============================================================
    const centerX = pageWidth / 2

    // Draw Kemenag logo (left)
    if (kemenagLogo) {
      const kemenagDims = calculateDimensions(kemenagLogo.width, kemenagLogo.height, 65)
      getPage().drawImage(kemenagLogo, {
        x: margin.left,
        y: yPos - 44,
        width: kemenagDims.width,
        height: kemenagDims.height
      })
    }

    // Draw RA logo (right)
    if (raLogo) {
      const raDims = calculateDimensions(raLogo.width, raLogo.height, 110)
      getPage().drawImage(raLogo, {
        x: pageWidth - margin.right - raDims.width,
        y: yPos - 66,
        width: raDims.width,
        height: raDims.height
      })
    }

    // Draw school name (center)
    const schoolName = (rppData.namaSekolah || 'RA INSAN MADANI').replace(/[^\x20-\x7E]/g, '')
    const nameWidth = fontBold.widthOfTextAtSize(schoolName, 14)
    drawText(schoolName, centerX - nameWidth / 2, yPos, 14, true)
    yPos -= 15

    if (rppData.alamatSekolah) {
      const addr = rppData.alamatSekolah.replace(/[^\x20-\x7E]/g, '')
      const addrWidth = font.widthOfTextAtSize(addr, 8)
      drawText(addr, centerX - addrWidth / 2, yPos, 8, false)
      yPos -= 25
    }

    const title = 'Rencana Pelaksanaan Pembelajaran'
    const titleWidth = fontBold.widthOfTextAtSize(title, 11)
    drawText(title, centerX - titleWidth / 2, yPos, 11, true)
    yPos -= 15

    const subtitle = 'Kurikulum Berbasis Cinta (KBC)'
    const subWidth = font.widthOfTextAtSize(subtitle, 10)
    drawText(subtitle, centerX - subWidth / 2, yPos, 10, false)
    yPos -= 30

    getPage().drawLine({
      start: { x: margin.left, y: yPos },
      end: { x: pageWidth - margin.right, y: yPos },
      thickness: 1, color: rgb(0.3, 0.3, 0.3)
    })
    yPos -= 25

    // ============================================================
    // A. IDENTITAS PEMBELAJARAN
    // ============================================================
    drawSectionHeader('A. Identitas Pembelajaran')
    drawPairs([
      ['Fase:', rppData.fase || 'Fase Fondasi'],
      ['Kelompok Usia:', rppData.kelompokUsia || '-'],
      ['Semester:', rppData.semester || 'Ganjil'],
      ['Tahun Ajaran:', rppData.tahunAjaran || getCurrentAcademicYear()],
      ['Hari:', rppData.hari || '-'],
      ['Jumlah Pertemuan:', rppData.jumlahPertemuan || '8 JP'],
      ['Kelas:', rppData.kelas || '-'],
      ['Guru:', rppData.guru || '-']
    ])

    // ============================================================
    // B. CAPAIAN PEMBELAJARAN
    // ============================================================
    drawSectionHeader('B. Capaian Pembelajaran')
    drawPairs([
      ['Tema:', rppData.tema || '-'],
      ['Subtema:', rppData.subtema || '-'],
    ])
    drawParagraph(rppData.capaianPembelajaran || '-')

    // ============================================================
    // C. TUJUAN PEMBELAJARAN
    // ============================================================
    drawSectionHeader('C. Tujuan Pembelajaran')
    drawParagraph(rppData.tujuanPembelajaran || '-')

    // ============================================================
    // D. 6 NILAI CINTA
    // ============================================================
    drawSectionHeader('D. 6 Nilai Cinta')
    const NILAI_CINTA_LABELS: Record<string, string> = {
      cintaAllah: 'Cinta kepada Allah SWT',
      cintaRasulullah: 'Cinta kepada Rasulullah SAW',
      cintaDiriSendiri: 'Cinta kepada Diri Sendiri',
      cintaSesama: 'Cinta kepada Sesama',
      cintaLingkungan: 'Cinta kepada Lingkungan',
      cintaBangsaNegara: 'Cinta kepada Bangsa dan Negara',
    }
    drawJsonItems(nilaiCinta, NILAI_CINTA_LABELS)

    // ============================================================
    // E. 8 DIMENSI KELULUSAN KBC KEMENAG
    // ============================================================
    drawSectionHeader('E. 8 Dimensi Kelulusan KBC Kemenag')
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
    drawJsonItems(dimensiKelulusan, DIMENSI_LABELS)

    // ============================================================
    // F. PEMAHAMAN BERMAKNA
    // ============================================================
    drawSectionHeader('F. Pemahaman Bermakna')
    drawParagraph(rppData.pemahamanBermakna || '-')

    // ============================================================
    // G. PERTANYAAN PEMANTIK
    // ============================================================
    drawSectionHeader('G. Pertanyaan Pemantik')
    drawParagraph(rppData.pertanyaanPemantik || '-')

    // ============================================================
    // H. SARANA, MEDIA, BAHAN
    // ============================================================
    drawSectionHeader('H. Sarana, Media, dan Bahan')
    const SARANA_LABELS: Record<string, string> = {
      sarana: 'Sarana',
      media: 'Media Pembelajaran',
      bahan: 'Bahan Pembelajaran',
    }
    yPos -= 5
    drawJsonItems(saranaMediaBahan, SARANA_LABELS)

    // ============================================================
    // I. LANGKAH PEMBELAJARAN
    // ============================================================
    drawSectionHeader('I. Langkah Pembelajaran')

    // 1. Penyambutan
    drawSubsection('1. Penyambutan')
    yPos -= 5
    drawParagraph(langkahPembelajaran.penyambutan || '-')
    yPos -= 5

    // 2. Pembukaan
    drawSubsection('2. Pembukaan')
    yPos -= 5
    drawParagraph(langkahPembelajaran.pembukaan || '-')
    yPos -= 5

    // 3. Kegiatan Inti
    drawSubsection('3. Kegiatan Inti')
    yPos -= 5
    const kegiatanInti = langkahPembelajaran.kegiatanInti || {}
    const KEGIATAN_LABELS: Record<string, string> = {
      eksplorasi: 'a. Eksplorasi',
      bermain: 'b. Bermain',
      berkarya: 'c. Berkarya',
      refleksi: 'd. Refleksi Siswa',
    }
    const kegiatanEntries = Object.entries(kegiatanInti).filter(([, v]) => v && String(v).trim() !== '')
    if (kegiatanEntries.length === 0) {
      drawParagraph('-', 10)
    } else {
      kegiatanEntries.forEach(([key, value]) => {
        drawSubSubsection(KEGIATAN_LABELS[key] || key)
        yPos -= 3
        drawParagraph(String(value), 20)
      })
    }
    yPos -= 5

    // 4. Penutup
    drawSubsection('4. Penutup')
    yPos -= 5
    drawParagraph(langkahPembelajaran.penutup || '-')

    // ============================================================
    // J. ASESMEN
    // ============================================================
    drawSectionHeader('J. Asesmen')
    drawParagraph(rppData.asesmen || '-')

    // ============================================================
    // K. TINDAK LANJUT
    // ============================================================
    drawSectionHeader('K. Tindak Lanjut')
    drawParagraph(rppData.tindakLanjut || '-')

    // ============================================================
    // L. REFLEKSI GURU
    // ============================================================
    drawSectionHeader('L. Refleksi Guru')
    drawParagraph(rppData.refleksiGuru || '-')

    // ============================================================
    // FOOTER WITH SIGNATURES
    // ============================================================
    yPos -= 10
    ensureSpace(120)

    // Thin separator line
    getPage().drawLine({
      start: { x: margin.left, y: yPos },
      end: { x: pageWidth - margin.right, y: yPos },
      thickness: 0.5, color: rgb(0.5, 0.5, 0.5)
    })
    yPos -= 8

    // Footer info text
    const footerInfo = `RPP KBC - ${rppData.namaSekolah || 'RA INSAN MADANI'} - ${rppData.tema || ''} : ${rppData.subtema || ''} - ${rppData.semester || 'Ganjil'} ${rppData.tahunAjaran || getCurrentAcademicYear()}`
    const cleanFooter = footerInfo.replace(/[^\x20-\x7E]/g, '')
    drawText(cleanFooter, margin.left, yPos, 7, false)
    yPos -= 25

    // Signature positions
    const kepsekX = margin.left
    const guruX = pageWidth - margin.right - 150
    const sigWidth = 150

    // "Kepala Sekolah" label (kiri)
    drawText('Mengetahui,', kepsekX, yPos, 9, false)
    yPos -= 12
    drawText('Kepala Sekolah,', kepsekX, yPos, 9, false)

    // "Guru Pembuat" label (kanan)
    const guruLabel = 'Guru Pembuat,'
    drawText(guruLabel, guruX, yPos, 9, false)

    // Space for signature (60px gap)
    yPos -= 60

    // Principal name (kiri)
    const cleanKepsek = kepsekName.replace(/[^\x20-\x7E]/g, '')
    drawText(cleanKepsek, kepsekX, yPos, 9, true)
    getPage().drawLine({
      start: { x: kepsekX, y: yPos - 3 },
      end: { x: kepsekX + sigWidth, y: yPos - 3 },
      thickness: 0.5, color: rgb(0, 0, 0)
    })

    // Teacher name (kanan)
    const teacherName = (rppData.guru || '................................').replace(/[^\x20-\x7E]/g, '')
    drawText(teacherName, guruX, yPos, 9, true)
    getPage().drawLine({
      start: { x: guruX, y: yPos - 3 },
      end: { x: guruX + sigWidth, y: yPos - 3 },
      thickness: 0.5, color: rgb(0, 0, 0)
    })

    // NUPTK below names
    yPos -= 13
    if (kepsekNuptk) {
      drawText(`NUPTK: ${kepsekNuptk}`, kepsekX, yPos, 7, false)
    }

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="RPP-KBC-${(rppData.tema || 'Baru').replace(/[^a-zA-Z0-9]/g, '_')}-${new Date().toISOString().split('T')[0]}.pdf"`
      }
    })
  } catch (error: any) {
    console.error('Error exporting RPP KBC to PDF:', error)
    return NextResponse.json({ success: false, error: 'Gagal mengekspor PDF: ' + (error.message || 'Unknown error') }, { status: 500 })
  }
}