import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    let rppData: any = {}

    // Check if rppId is provided
    const requestData = await request.json()

    if (requestData.rppId) {
      // Fetch RPP from database
      const rpp = await db.rPP.findUnique({
        where: { id: requestData.rppId }
      })

      if (!rpp) {
        return NextResponse.json(
          { success: false, error: 'RPP tidak ditemukan' },
          { status: 404 }
        )
      }

      // Parse JSON fields
      rppData = {
        ...rpp,
        tujuanProfilLulusan: rpp.tujuanProfilLulusan ? JSON.parse(rpp.tujuanProfilLulusan) : {},
        kerangkaPembelajaran: rpp.kerangkaPembelajaran ? JSON.parse(rpp.kerangkaPembelajaran) : {},
        kegiatanPembelajaran: rpp.kegiatanPembelajaran ? JSON.parse(rpp.kegiatanPembelajaran) : {},
        rubrikPenilaian: rpp.rubrikPenilaian ? JSON.parse(rpp.rubrikPenilaian) : {}
      }
    } else {
      // Use provided data directly
      rppData = requestData
    }

    const pdfDoc = await PDFDocument.create()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const pageWidth = 595.28
    const pageHeight = 841.89
    const margin = { left: 50, right: 50, top: 50, bottom: 50 }
    const contentWidth = pageWidth - margin.left - margin.right

    let pages = [pdfDoc.addPage([pageWidth, pageHeight])]
    let currentPageIndex = 0
    let yPos = pageHeight - margin.top

    // Simple function to get current page
    const getPage = () => pages[currentPageIndex]

    // Simple function to add new page
    const newPage = () => {
      const page = pdfDoc.addPage([pageWidth, pageHeight])
      pages.push(page)
      currentPageIndex++
      yPos = pageHeight - margin.top
      return page
    }

    // Check and add page if needed
    const ensureSpace = (needed: number, currentY?: number) => {
      const checkY = currentY !== undefined ? currentY : yPos
      if (checkY - needed < margin.bottom) {
        newPage()
        return true // New page was added
      }
      return false // No new page needed
    }

    // Simple text drawing
    const drawText = (text: string, x: number, y: number, size: number, isBold: boolean) => {
      getPage().drawText(text, {
        x,
        y,
        size,
        font: isBold ? fontBold : font,
        color: rgb(0, 0, 0)
      })
    }

    // Draw section header
    const drawSectionHeader = (title: string) => {
      ensureSpace(30)
      yPos -= 10
      drawText(title, margin.left, yPos, 12, true)
      yPos -= 8
      getPage().drawLine({
        start: { x: margin.left, y: yPos },
        end: { x: pageWidth - margin.right, y: yPos },
        thickness: 0.5,
        color: rgb(0.5, 0.5, 0.5)
      })
      yPos -= 12
    }

    // Draw subsection
    const drawSubsection = (title: string) => {
      ensureSpace(20)
      yPos -= 5
      drawText(title, margin.left, yPos, 10, true)
      yPos -= 8
    }

    // Draw sub-subsection - FIXED: More spacing after title
    const drawSubSubsection = (title: string) => {
      ensureSpace(18)
      yPos -= 3
      drawText(title, margin.left + 10, yPos, 9, true)
      yPos -= 8  // Reduced from 6 to 8 for more spacing
    }

    // Draw simple paragraph text
    const drawParagraph = (text: string, indent: number = 0) => {
      if (!text || text.trim() === '') {
        yPos -= 10
        return
      }

      // Only remove truly non-printable control characters, keep all UTF-8 text
      const cleanText = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
      const paragraphs = cleanText.split('\n\n')
      const fontSize = 9
      const lineHeight = 12

      paragraphs.forEach((para) => {
        if (!para.trim()) return

        ensureSpace(lineHeight * 2)

        const lines = para.split('\n')
        lines.forEach((line) => {
          if (!line.trim()) {
            yPos -= 5
            return
          }

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

    // Draw bullet points - Split text into sentences for better readability
    const drawBullets = (text: string, indent: number = 20) => {
      if (!text || text.trim() === '') {
        yPos -= 12
        return
      }

      // Only remove truly non-printable control characters, keep all UTF-8 text
      const cleanText = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')

      // Split text into sentences using sentence delimiters (. ! ?)
      // Keep the delimiter with the sentence
      const splitIntoSentences = (text: string): string[] => {
        const sentences: string[] = []
        let current = ''
        let i = 0

        while (i < text.length) {
          const char = text[i]

          // Check for sentence ending
          if (char === '.' || char === '!' || char === '?') {
            current += char
            i++

            // Skip any whitespace after the delimiter
            while (i < text.length && (text[i] === ' ' || text[i] === '\n' || text[i] === '\r')) {
              i++
            }

            // Add the sentence if it has content
            if (current.trim()) {
              sentences.push(current.trim())
            }
            current = ''
          } else {
            current += char
            i++
          }
        }

        // Add any remaining text
        if (current.trim()) {
          sentences.push(current.trim())
        }

        return sentences
      }

      // Also split by newlines and combine with sentence splitting
      const lines = cleanText.split('\n').filter(l => l.trim())
      const allSentences: string[] = []

      lines.forEach(line => {
        const sentences = splitIntoSentences(line)
        allSentences.push(...sentences)
      })

      const fontSize = 8
      const lineHeight = 11

      allSentences.forEach((sentence) => {
        ensureSpace(lineHeight)

        // Use hyphen (-) instead of bullet point (•)
        drawText('-', margin.left + indent, yPos, fontSize, false)

        // Draw text after hyphen
        const words = sentence.split(' ')
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

        // Add spacing between bullet items (not between wrapped lines of the same bullet)
        yPos -= 5
      })

      // Add extra spacing after all bullets
      yPos -= 3
    }

    // Draw key-value pairs - FIXED: Align colons vertically and wrap long values
    const drawPairs = (fields: [string, string][]) => {
      const colWidth = contentWidth / 2
      const fontSize = 9
      const lineHeight = 14

      // Calculate max label width for each column to align colons
      const leftColFields = fields.filter((_, idx) => idx % 2 === 0)
      const rightColFields = fields.filter((_, idx) => idx % 2 === 1)

      const getLabelWidth = (label: string) => fontBold.widthOfTextAtSize(label, fontSize)

      const maxLeftLabelWidth = Math.max(...leftColFields.map(f => getLabelWidth(f[0])))
      const maxRightLabelWidth = Math.max(...rightColFields.map(f => getLabelWidth(f[0])))

      // Add 5pt padding after label for better spacing
      const leftLabelWidth = Math.max(maxLeftLabelWidth, 60) + 5
      const rightLabelWidth = Math.max(maxRightLabelWidth, 60) + 5

      // Track Y positions separately for left and right columns
      let yPosLeft = yPos
      let yPosRight = yPos

      fields.forEach((field, idx) => {
        const isLeftCol = idx % 2 === 0
        const labelWidth = isLeftCol ? leftLabelWidth : rightLabelWidth
        const x = isLeftCol ? margin.left : margin.left + colWidth + 20
        const valueMaxWidth = (contentWidth / 2) - labelWidth - 10

        // Get current Y position
        let currentY = isLeftCol ? yPosLeft : yPosRight

        const pageAdded = ensureSpace(lineHeight * 2, currentY)
        if (pageAdded) {
          // Reset both Y positions to top of new page
          const newTop = pageHeight - margin.top
          yPosLeft = newTop
          yPosRight = newTop
          currentY = newTop
        }

        // Draw label (including colon) with consistent width
        drawText(field[0], x, currentY, fontSize, true)

        // Draw value after label width with text wrapping
        const value = field[1] || '-'

        // Calculate how many lines this value will take
        const words = value.split(' ')
        let currentLine = ''
        let linesDrawn = 0
        const firstLineY = currentY

        words.forEach((word) => {
          const testLine = currentLine + word + ' '
          const lineWidth = font.widthOfTextAtSize(testLine, fontSize)

          if (lineWidth > valueMaxWidth && currentLine) {
            // Need to wrap to next line
            drawText(currentLine.trim(), x + labelWidth, currentY - (linesDrawn * lineHeight), fontSize, false)
            linesDrawn++
            currentLine = word + ' '

            // Check if we need more space
            const newPageAdded = ensureSpace(lineHeight, currentY - (linesDrawn * lineHeight))
            if (newPageAdded) {
              const newTop = pageHeight - margin.top
              yPosLeft = newTop
              yPosRight = newTop
              // Redraw this line on new page
              currentY = newTop
              linesDrawn = 0
              // Redraw label
              drawText(field[0], x, currentY, fontSize, true)
            }
          } else {
            currentLine = testLine
          }
        })

        // Draw the last line
        if (currentLine.trim()) {
          drawText(currentLine.trim(), x + labelWidth, currentY - (linesDrawn * lineHeight), fontSize, false)
          linesDrawn++
        }

        currentY -= (linesDrawn > 0 ? (linesDrawn - 1) * lineHeight : 0) + lineHeight

        // Update the appropriate column's Y position
        if (isLeftCol) {
          yPosLeft = currentY
        } else {
          yPosRight = currentY
        }
      })

      // Set yPos to the lower of the two columns
      yPos = Math.min(yPosLeft, yPosRight)
      yPos -= 10
    }

    // === DRAW HEADER ===
    const schoolName = (rppData.namaSekolah || 'RA INSAN MADANI').replace(/[^\x20-\x7E]/g, '')
    const nameWidth = fontBold.widthOfTextAtSize(schoolName, 14)
    drawText(schoolName, (pageWidth - nameWidth) / 2, yPos, 14, true)
    yPos -= 20

    if (rppData.alamatSekolah) {
      const addr = rppData.alamatSekolah.replace(/[^\x20-\x7E]/g, '')
      const addrWidth = font.widthOfTextAtSize(addr, 8)
      drawText(addr, (pageWidth - addrWidth) / 2, yPos, 8, false)
      yPos -= 15
    }

    const title = 'Rencana Pelaksanaan Pembelajaran'
    const titleWidth = fontBold.widthOfTextAtSize(title, 11)
    drawText(title, (pageWidth - titleWidth) / 2, yPos, 11, true)
    yPos -= 15

    const subtitle = 'Kurikulum Berbasis Cinta (KBC)'
    const subWidth = font.widthOfTextAtSize(subtitle, 10)
    drawText(subtitle, (pageWidth - subWidth) / 2, yPos, 10, false)
    yPos -= 20

    getPage().drawLine({
      start: { x: margin.left, y: yPos },
      end: { x: pageWidth - margin.right, y: yPos },
      thickness: 1,
      color: rgb(0.3, 0.3, 0.3)
    })
    yPos -= 25

    // === SECTIONS ===

    // A. Identitas Pembelajaran
    drawSectionHeader('A. Identitas Pembelajaran')
    drawPairs([
      ['Fase:', rppData.fase || 'Fase Fondasi'],
      ['Kelompok Usia:', rppData.kelompokUsia || 'Kelompok A (4-5 Tahun)'],
      ['Semester:', rppData.semester || 'Ganjil'],
      ['Tahun Ajaran:', rppData.tahunAjaran || '2025/2026'],
      ['Hari:', rppData.hari || '-'],
      ['Jumlah Pertemuan:', rppData.jumlahPertemuan || '8 JP'],
      ['Kelas:', rppData.kelas || '-'],
      ['Guru:', rppData.guru || '-']
    ])

    // B. Tema Projek
    drawSectionHeader('B. Tema Projek')
    drawPairs([
      ['Tema:', rppData.tema || '-'],
      ['Subtema:', rppData.subtema || '-'],
      ['Tema Projek:', rppData.temaProjek || '-'],
      ['Judul Kegiatan:', rppData.judulKegiatan || '-'],
      ['Pokok Bahasan:', rppData.pokokBahasan || '-']
    ])

    // C. Topik KBC
    drawSectionHeader('C. Topik KBC')
    drawParagraph(rppData.topikKBC || 'Cinta Diri dan Sesama')

    // D. Profil Lulusan
    drawSectionHeader('D. Profil Lulusan')
    drawBullets(rppData.profilLulusan || 'Kesehatan\nKemandirian\nBernalar Kritis\nKreatif\nBerkarakter\nBeriman\nBertakwa', 0)

    // E. Tujuan KBC
    drawSectionHeader('E. Tujuan KBC')
    drawParagraph(rppData.tujuanKBC || '-')

    // F. Tujuan Profil Lulusan - Use splitIntoSentences() for list format
    drawSectionHeader('F. Tujuan Profil Lulusan')
    const categories = ['Kesehatan', 'Kemandirian', 'BernalarKritis', 'Kreatif', 'Berkarakter', 'Beriman', 'Bertakwa']
    const goals = rppData.tujuanProfilLulusan || {}
    const colWidth = contentWidth / 2

    // Split text into sentences using sentence delimiters (. ! ?)
    const splitIntoSentences = (text: string): string[] => {
      const sentences: string[] = []
      let current = ''
      let i = 0

      while (i < text.length) {
        const char = text[i]

        // Check for sentence ending
        if (char === '.' || char === '!' || char === '?') {
          current += char
          i++

          // Skip any whitespace after the delimiter
          while (i < text.length && (text[i] === ' ' || text[i] === '\n' || text[i] === '\r')) {
            i++
          }

          // Add the sentence if it has content
          if (current.trim()) {
            sentences.push(current.trim())
          }
          current = ''
        } else {
          current += char
          i++
        }
      }

      // Add any remaining text
      if (current.trim()) {
        sentences.push(current.trim())
      }

      return sentences
    }

    // Track Y positions separately for left and right columns
    let yPosLeft = yPos
    let yPosRight = yPos

    categories.forEach((cat, idx) => {
      const isLeftCol = idx % 2 === 0
      let currentY = isLeftCol ? yPosLeft : yPosRight
      const x = isLeftCol ? margin.left : margin.left + colWidth + 20

      const pageAdded = ensureSpace(40, currentY)
      if (pageAdded) {
        // Reset both Y positions to top of new page
        yPosLeft = pageHeight - margin.top
        yPosRight = pageHeight - margin.top
        currentY = pageHeight - margin.top
      }

      drawText(`${cat}:`, x, currentY, 10, true)
      currentY -= 10

      // Split text into sentences and draw as bullets (keeping all content)
      const text = goals[cat] || '-'
      const sentences = splitIntoSentences(text)
      const fontSize = 9
      const lineHeight = 11
      const textIndent = 10  // Indent untuk teks setelah bullet

      sentences.forEach((sentence) => {
        ensureSpace(lineHeight, currentY)

        // Use hyphen (-) as bullet
        drawText('-', x, currentY, fontSize, false)

        // Draw text after bullet with wrapping
        const words = sentence.split(' ')
        let currentLine = ''
        const maxWidth = colWidth - textIndent - 15

        words.forEach((word) => {
          const testLine = currentLine + word + ' '
          const lineWidth = font.widthOfTextAtSize(testLine, fontSize)

          if (lineWidth > maxWidth && currentLine.trim()) {
            const newPageAdded = ensureSpace(lineHeight, currentY)
            if (newPageAdded) {
              yPosLeft = pageHeight - margin.top
              yPosRight = pageHeight - margin.top
              currentY = pageHeight - margin.top
            }
            drawText(currentLine.trim(), x + textIndent, currentY, fontSize, false)
            currentY -= lineHeight
            currentLine = word + ' '
          } else {
            currentLine = testLine
          }
        })

        if (currentLine.trim()) {
          const newPageAdded = ensureSpace(lineHeight, currentY)
          if (newPageAdded) {
            yPosLeft = pageHeight - margin.top
            yPosRight = pageHeight - margin.top
            currentY = pageHeight - margin.top
          }
          drawText(currentLine.trim(), x + textIndent, currentY, fontSize, false)
          currentY -= lineHeight
        }

        // Add spacing between bullet items
        currentY -= 5
      })

      // Add spacing after all bullets for this category
      currentY -= 3

      // Update the appropriate column's Y position
      if (isLeftCol) {
        yPosLeft = currentY
      } else {
        yPosRight = currentY
      }
    })

    // Set yPos to the lower of the two columns
    yPos = Math.min(yPosLeft, yPosRight)

    // G. Tujuan Pembelajaran Mendalam
    drawSectionHeader('G. Tujuan Pembelajaran Mendalam (KD)')
    drawBullets(rppData.tujuanPembelajaranMendalam || '-', 0)

    // H. Materi Integrasi KBC
    drawSectionHeader('H. Materi Integrasi KBC')
    drawParagraph(rppData.materiIntegrasiKBC || '-')

    // I. Tujuan Pembelajaran
    drawSectionHeader('I. Tujuan Pembelajaran')
    drawParagraph(rppData.tujuanPembelajaran || '-')

    // J. Kerangka Pembelajaran
    drawSectionHeader('J. Kerangka Pembelajaran')
    const kerangka = rppData.kerangkaPembelajaran || {}

    // 1. Praktek Pedagogik
    drawSubsection('1. Praktek Pedagogik')
    yPos -= 5
    drawBullets(kerangka.praktekPedagogik || 'Main peran, Observasi lapangan')
    yPos -= 5

    // 2. Lingkungan Pembelajaran
    drawSubsection('2. Lingkungan Pembelajaran')
    yPos -= 5
    const lingkungan = kerangka.lingkunganPembelajaran || {}
    if (lingkungan.fisik) {
      drawSubSubsection('a. Fisik:')
      yPos -= 3
      drawBullets(lingkungan.fisik)
      yPos -= 3
    }
    if (lingkungan.sosial) {
      drawSubSubsection('b. Sosial:')
      yPos -= 3
      drawBullets(lingkungan.sosial)
      yPos -= 3
    }
    if (lingkungan.psikologis) {
      drawSubSubsection('c. Psikologis:')
      yPos -= 3
      drawBullets(lingkungan.psikologis)
      yPos -= 3
    }
    if (lingkungan.akademik) {
      drawSubSubsection('d. Akademik:')
      yPos -= 3
      drawBullets(lingkungan.akademik)
    }
    yPos -= 5

    // 3. Kemitraan Pembelajaran
    drawSubsection('3. Kemitraan Pembelajaran')
    yPos -= 5
    drawBullets(kerangka.kemitraanPembelajaran || 'Orang tua, Pengurus masjid')
    yPos -= 5

    // 4. Pemanfaatan Digital
    drawSubsection('4. Pemanfaatan Digital')
    yPos -= 5
    drawBullets(kerangka.pemanfaatanDigital || 'Video singkat, Aplikasi edukasi')

    // K. Kegiatan Pembelajaran - FIXED: Increased spacing between subsections
    drawSectionHeader('K. Kegiatan Pembelajaran')
    const kegiatan = rppData.kegiatanPembelajaran || {}

    // 1. Tahap Persiapan
    drawSubsection('1. Tahap Persiapan')
    yPos -= 5  // Extra spacing after subsection
    drawSubSubsection('a. Pemahaman Konsep:')
    yPos -= 3  // Extra spacing before bullets
    drawBullets(kegiatan.persiapan?.pemahamanKonsep || '-')
    yPos -= 3  // Extra spacing after sub-subsection
    drawSubSubsection('b. Penyiapan Alat:')
    yPos -= 3
    drawBullets(kegiatan.persiapan?.penyiapanAlat || '-')
    yPos -= 3
    drawSubSubsection('c. Alat & Bahan:')
    yPos -= 3
    drawBullets(kegiatan.persiapan?.alatBahan || '-')
    yPos -= 5  // Extra spacing before next subsection

    // 2. Tahap Pelaksanaan
    drawSubsection('2. Tahap Pelaksanaan')
    yPos -= 5
    drawSubSubsection('a. Orientasi:')
    yPos -= 3
    drawBullets(kegiatan.pelaksanaan?.orientasi || '-')
    yPos -= 3
    drawSubSubsection('b. Eksplorasi:')
    yPos -= 3
    drawBullets(kegiatan.pelaksanaan?.eksplorasi || '-')
    yPos -= 3
    drawSubSubsection('c. Diskusi:')
    yPos -= 3
    drawBullets(kegiatan.pelaksanaan?.diskusi || '-')
    yPos -= 3
    drawSubSubsection('d. Kolaborasi:')
    yPos -= 3
    drawBullets(kegiatan.pelaksanaan?.kolaborasi || '-')
    yPos -= 3
    drawSubSubsection('e. Refleksi:')
    yPos -= 3
    drawBullets(kegiatan.pelaksanaan?.refleksi || '-')
    yPos -= 5

    // 3. Tahap Pembuatan Karya
    drawSubsection('3. Tahap Pembuatan Karya')
    yPos -= 5
    drawSubSubsection('a. Proses:')
    yPos -= 3
    drawBullets(kegiatan.pembuatanKarya?.proses || '-')
    yPos -= 3
    drawSubSubsection('b. Hasil:')
    yPos -= 3
    drawBullets(kegiatan.pembuatanKarya?.hasil || '-')
    yPos -= 5

    // 4. Tahap Presentasi
    drawSubsection('4. Tahap Presentasi')
    yPos -= 5
    drawSubSubsection('a. Persiapan:')
    yPos -= 3
    drawBullets(kegiatan.presentasi?.persiapan || '-')
    yPos -= 3
    drawSubSubsection('b. Pelaksanaan:')
    yPos -= 3
    drawBullets(kegiatan.presentasi?.pelaksanaan || '-')
    yPos -= 5

    // 5. Tahap Refleksi Akhir
    drawSubsection('5. Tahap Refleksi Akhir')
    yPos -= 5
    drawSubSubsection('a. Refleksi Guru:')
    yPos -= 3
    drawBullets(kegiatan.refleksiAkhir?.refleksiGuru || '-')
    yPos -= 3
    drawSubSubsection('b. Refleksi Anak:')
    yPos -= 3
    drawBullets(kegiatan.refleksiAkhir?.refleksiAnak || '-')

    // L. Penilaian - Start on a new page to keep lembar observasi and rubrik penilaian together
    newPage()
    yPos = pageHeight - margin.top
    drawSectionHeader('L. Penilaian')

    // 1. Lembar Observasi
    drawSubsection('1. Lembar Observasi')

    const obsHeaders = ['No', 'NISN', 'Nama Siswa', 'BB', 'MB', 'BSH', 'BSB']
    const obsColWidths = [30, 80, 180, 51, 51, 51, 52]  // Total 495, proporsional dengan lebar halaman
    const rowHeight = 18

    ensureSpace(rowHeight * 12)

    let x = margin.left
    obsHeaders.forEach((h, i) => {
      getPage().drawRectangle({
        x, y: yPos, width: obsColWidths[i], height: rowHeight,
        borderColor: rgb(0.5, 0.5, 0.5), borderWidth: 0.5,
        color: rgb(0.9, 0.9, 0.95)
      })
      const w = fontBold.widthOfTextAtSize(h, 8)
      drawText(h, x + (obsColWidths[i] - w) / 2, yPos + (rowHeight - 8) / 2, 8, true)
      x += obsColWidths[i]
    })
    yPos -= rowHeight

    for (let row = 1; row <= 10; row++) {
      ensureSpace(rowHeight)
      x = margin.left

      // Draw background for even rows
      if (row % 2 === 0) {
        getPage().drawRectangle({
          x: margin.left, y: yPos,
          width: obsColWidths.reduce((a, b) => a + b, 0),
          height: rowHeight,
          color: rgb(0.97, 0.97, 0.98)
        })
      }

      // Draw all cell borders
      for (let col = 0; col < 7; col++) {
        getPage().drawRectangle({
          x, y: yPos, width: obsColWidths[col], height: rowHeight,
          borderColor: rgb(0.5, 0.5, 0.5), borderWidth: 0.5
        })

        // Draw content based on column
        if (col === 0) {
          // No column
          drawText(String(row), x + (obsColWidths[0] - font.widthOfTextAtSize(String(row), 8)) / 2, yPos + (rowHeight - 8) / 2, 8, false)
        }
        // NISN and Nama Siswa columns are left blank for manual filling
        // BB, MB, BSH, BSB columns are left blank for manual filling

        x += obsColWidths[col]
      }
      yPos -= rowHeight
    }

    yPos -= 15

    // 2. Rubrik Penilaian (Matriks KBC - Panca Cinta)
    drawSubsection('2. Rubrik Penilaian')
    // No extra spacing needed, header will be drawn right below title

    // Sesuaikan lebar kolom agar total sesuai dengan margin
    const rubrikColWidths = [95, 100, 100, 100, 100]
    const fontSize = 6.5
    const lineHeight = 8  // Dikurangi dari 8.5 agar lebih kompak
    const cellPadding = 2  // Dikurangi lagi agar lebih kompak
    const fixedRowHeight = 60  // Fixed height untuk semua baris agar konsisten

    // Data rubrik sesuai Panca Cinta
    const rubrikData = [
      {
        indikator: 'Cinta Allah',
        BB: 'Anak belum menunjukkan rasa cinta kepada Allah melalui perilaku sehari-hari',
        MB: 'Anak mulai menunjukkan rasa cinta kepada Allah namun masih perlu diingatkan',
        BSH: 'Anak mampu menunjukkan rasa cinta kepada Allah secara mandiri dalam kegiatan sehari-hari',
        BSB: 'Anak mampu menjadi contoh dalam menunjukkan rasa cinta kepada Allah dan berinisiatif dalam beribadah'
      },
      {
        indikator: 'Cinta Diri',
        BB: 'Anak belum mampu merawat diri sendiri dan membutuhkan bimbingan penuh',
        MB: 'Anak mulai mampu merawat diri namun masih perlu diingatkan',
        BSH: 'Anak mampu merawat diri sendiri secara mandiri',
        BSB: 'Anak mampu merawat diri sendiri dan menjadi contoh bagi teman lainnya'
      },
      {
        indikator: 'Cinta Sesama',
        BB: 'Anak belum menunjukkan sikap peduli terhadap teman dan membutuhkan bimbingan penuh',
        MB: 'Anak mulai menunjukkan sikap peduli terhadap teman namun masih perlu diingatkan',
        BSH: 'Anak mampu menunjukkan sikap peduli terhadap teman secara mandiri',
        BSB: 'Anak mampu menjadi contoh dalam menunjukkan sikap peduli dan berinisiatif membantu teman'
      },
      {
        indikator: 'Cinta Lingkungan',
        BB: 'Anak belum menunjukkan kepedulian terhadap lingkungan dan membutuhkan bimbingan penuh',
        MB: 'Anak mulai menunjukkan kepedulian terhadap lingkungan namun masih perlu diingatkan',
        BSH: 'Anak mampu menjaga lingkungan secara mandiri',
        BSB: 'Anak mampu menjadi contoh dalam menjaga lingkungan dan berinisiatif kegiatan lingkungan'
      },
      {
        indikator: 'Cinta Tanah Air',
        BB: 'Anak belum menunjukkan rasa cinta terhadap tanah air dan membutuhkan bimbingan penuh',
        MB: 'Anak mulai menunjukkan rasa cinta terhadap tanah air namun masih perlu diingatkan',
        BSH: 'Anak mampu menunjukkan rasa cinta terhadap tanah air secara mandiri',
        BSB: 'Anak mampu menjadi contoh dalam menunjukkan rasa cinta terhadap tanah air dan berinisiatif kegiatan kebangsaan'
      }
    ]

    // Function to calculate lines needed
    const countLines = (text: string, maxWidth: number): number => {
      if (!text || text.trim() === '') return 1
      const words = text.split(' ')
      let lines = 1
      let currentLine = ''

      words.forEach((word) => {
        const testLine = currentLine + word + ' '
        const lineWidth = font.widthOfTextAtSize(testLine, fontSize)
        if (lineWidth > maxWidth && currentLine.trim()) {
          lines++
          currentLine = word + ' '
        } else {
          currentLine = testLine
        }
      })
      return lines
    }

    // Calculate heights for all cells first
    const cellHeights = rubrikData.map(row => ({
      indikator: countLines(row.indikator, rubrikColWidths[0] - cellPadding * 2) * lineHeight + cellPadding * 2,
      BB: countLines(row.BB, rubrikColWidths[1] - cellPadding * 2) * lineHeight + cellPadding * 2,
      MB: countLines(row.MB, rubrikColWidths[2] - cellPadding * 2) * lineHeight + cellPadding * 2,
      BSH: countLines(row.BSH, rubrikColWidths[3] - cellPadding * 2) * lineHeight + cellPadding * 2,
      BSB: countLines(row.BSB, rubrikColWidths[4] - cellPadding * 2) * lineHeight + cellPadding * 2
    }))

    // Gunakan fixed row height untuk semua baris agar konsisten
    const headerHeight = 28  // Height header

    // Draw header
    let currentY = yPos
    x = margin.left
    const headerTexts = ['Indikator KBC\n(Panca Cinta)', 'BB', 'MB', 'BSH', 'BSB']
    const headerDescriptions = ['', 'Belum\nBerkembang', 'Mulai\nBerkembang', 'Berkembang\nSesuai Harapan', 'Berkembang\nSangat Baik']

    // Draw header cells - fix positioning: currentY is the TOP position
    const headerTop = currentY
    const headerBottom = currentY - headerHeight

    headerTexts.forEach((h, i) => {
      getPage().drawRectangle({
        x, y: headerBottom, width: rubrikColWidths[i], height: headerHeight,
        borderColor: rgb(0.5, 0.5, 0.5), borderWidth: 0.5,
        color: rgb(0.9, 0.9, 0.95)
      })

      // Draw text
      const lines = h.split('\n')
      let hy = headerTop - 9  // Start from top
      lines.forEach((line) => {
        const w = fontBold.widthOfTextAtSize(line, 7)
        drawText(line, x + (rubrikColWidths[i] - w) / 2, hy, 7, true)
        hy -= 9
      })

      if (headerDescriptions[i]) {
        const descLines = headerDescriptions[i].split('\n')
        descLines.forEach((descLine) => {
          const dw = font.widthOfTextAtSize(descLine, 6)
          drawText(descLine, x + (rubrikColWidths[i] - dw) / 2, hy, 6, false)
          hy -= 7
        })
      }
      x += rubrikColWidths[i]
    })

    // Move currentY to bottom of header
    currentY = headerBottom

    // Draw each row
    rubrikData.forEach((row, rowIdx) => {
      const rowHeight = fixedRowHeight  // Gunakan fixed height

      // Check for page break
      if (currentY - rowHeight < margin.bottom) {
        newPage()
        currentY = pageHeight - margin.top

        // Redraw header at top of new page
        x = margin.left
        const newHeaderTop = currentY
        const newHeaderBottom = currentY - headerHeight

        headerTexts.forEach((h, i) => {
          getPage().drawRectangle({
            x, y: newHeaderBottom, width: rubrikColWidths[i], height: headerHeight,
            borderColor: rgb(0.5, 0.5, 0.5), borderWidth: 0.5,
            color: rgb(0.9, 0.9, 0.95)
          })
          const lines = h.split('\n')
          let hy = newHeaderTop - 9
          lines.forEach((line) => {
            const w = fontBold.widthOfTextAtSize(line, 7)
            drawText(line, x + (rubrikColWidths[i] - w) / 2, hy, 7, true)
            hy -= 9
          })
          if (headerDescriptions[i]) {
            const descLines = headerDescriptions[i].split('\n')
            descLines.forEach((descLine) => {
              const dw = font.widthOfTextAtSize(descLine, 6)
              drawText(descLine, x + (rubrikColWidths[i] - dw) / 2, hy, 6, false)
              hy -= 7
            })
          }
          x += rubrikColWidths[i]
        })
        currentY = newHeaderBottom
      }

      // Draw cells and borders with manual positioning
      let cellX = margin.left
      const rowTop = currentY
      const rowBottom = currentY - rowHeight

      for (let col = 0; col < 5; col++) {
        const colWidth = rubrikColWidths[col]

        // Draw cell border - EXACT positioning
        getPage().drawRectangle({
          x: cellX, 
          y: rowBottom,  // Border bottom di posisi currentY - rowHeight
          width: colWidth, 
          height: rowHeight,
          borderColor: rgb(0.5, 0.5, 0.5), 
          borderWidth: 0.5
        })

        // Draw cell content
        let textY = rowTop - cellPadding - lineHeight
        const maxWidth = colWidth - cellPadding * 2
        const ratingKeys = ['indikator', 'BB', 'MB', 'BSH', 'BSB']
        const text = row[ratingKeys[col]] || ''

        if (text) {
          const words = text.split(' ')
          let currentLine = ''

          words.forEach((word) => {
            const testLine = currentLine + word + ' '
            const lineWidth = font.widthOfTextAtSize(testLine, fontSize)

            if (lineWidth > maxWidth && currentLine.trim()) {
              drawText(currentLine.trim(), cellX + cellPadding, textY, fontSize, false)
              textY -= lineHeight
              currentLine = word + ' '
            } else {
              currentLine = testLine
            }
          })

          if (currentLine.trim()) {
            drawText(currentLine.trim(), cellX + cellPadding, textY, fontSize, false)
          }
        }

        cellX += colWidth
      }

      // Move to next row
      currentY -= rowHeight
    })

    // Update yPos
    yPos = currentY

    // Add explanation section below table
    yPos -= 10
    ensureSpace(80)

    drawSubSubsection('Penjelasan Komponen Matrik:')
    yPos -= 5

    const explanations = [
      'Indikator KBC (Panca Cinta): Merupakan jabaran dari Cinta Allah, Cinta Diri, Cinta Sesama, Cinta Lingkungan, dan Cinta Tanah Air.',
      'BB (Belum Berkembang): Anak perlu bimbingan penuh.',
      'MB (Mulai Berkembang): Anak perlu diingatkan.',
      'BSH (Berkembang Sesuai Harapan): Anak mampu mandiri.',
      'BSB (Berkembang Sangat Baik): Anak mampu menjadi contoh/berinisiatif.'
    ]

    explanations.forEach((exp) => {
      const words = exp.split(' ')
      let currentLine = ''
      const lineWidth = contentWidth - 20

      words.forEach((word) => {
        const testLine = currentLine + word + ' '
        const testLineWidth = font.widthOfTextAtSize(testLine, 8)

        if (testLineWidth > lineWidth && currentLine) {
          drawText(currentLine.trim(), margin.left + 10, yPos, 8, false)
          yPos -= lineHeight
          currentLine = word + ' '
        } else {
          currentLine = testLine
        }
      })

      if (currentLine.trim()) {
        drawText(currentLine.trim(), margin.left + 10, yPos, 8, false)
        yPos -= lineHeight
      }
      yPos -= 4
    })

    // Footer - cek apakah perlu halaman baru atau bisa di halaman yang sama
    yPos -= 10
    if (!ensureSpace(40)) {
      // Masih ada ruang di halaman yang sama
      yPos -= 20
    }

    drawText('-'.repeat(70), margin.left, yPos, 8, false)
    yPos -= 15
    drawText('Rencana Pelaksanaan Pembelajaran Kurikulum Berbasis Cinta (KBC)', margin.left, yPos, 8, true)
    yPos -= 12
    drawText(`${rppData.namaSekolah || 'RA INSAN MADANI'} - ${rppData.semester || 'Ganjil'} ${rppData.tahunAjaran || '2025/2026'}`, margin.left, yPos, 8, true)

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="RPP-KBC-${rppData.tema || 'Baru'}-${new Date().toISOString().split('T')[0]}.pdf"`
      }
    })
  } catch (error: any) {
    console.error('Error exporting RPP to PDF:', error)
    return NextResponse.json({ success: false, error: 'Gagal mengekspor PDF' }, { status: 500 })
  }
}
// Build trigger
