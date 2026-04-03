import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { db } from '@/lib/db'

// Font size hierarchy
const fontSizes = {
  schoolName: 14,
  title: 11,
  subtitle: 10,
  section: 12,
  narrative: 9,
  tableHeader: 8,
  tableContent: 7
}

// Table colors
const colors = {
  headerBg: rgb(0.7, 0.8, 0.95),
  oddRowBg: rgb(0.95, 0.95, 0.98),
  border: rgb(0.3, 0.3, 0.3),
  text: rgb(0, 0, 0)
}

// Page settings
const pageWidth = 595.28
const pageHeight = 841.89
const margin = { left: 30, right: 30, top: 30, bottom: 30 }
const contentWidth = pageWidth - margin.left - margin.right

// Table column widths
const colWidths = [35, 65, 80, 80, 115, 140]  // Minggu, Tema, Sub Tema, Lingkup, Kegiatan, Indikator

function sanitizeText(text: any): string {
  if (!text) return ''
  if (typeof text !== 'string') text = String(text)
  return text
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/–/g, '-')
    .replace(/—/g, '-')
    .replace(/…/g, '...')
    .replace(/[\n\r\t]/g, ' ')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function getSanitizedTextWidth(text: string, font: any, fontSize: number) {
  const sanitized = sanitizeText(text)
  return font.widthOfTextAtSize(sanitized, fontSize)
}

function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  const sanitized = sanitizeText(text)
  const words = sanitized.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word
    const lineWidth = getSanitizedTextWidth(testLine, font, fontSize)

    if (lineWidth > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

export async function POST(request: NextRequest) {
  try {
    let prosemData: any = {}

    // Check if prosemId is provided
    const requestData = await request.json()

    if (requestData.prosemId) {
      // Fetch PROSEM from database
      const prosem = await db.prosem.findUnique({
        where: { id: requestData.prosemId },
        include: {
          teacher: {
            include: {
              user: true
            }
          }
        }
      })

      if (!prosem) {
        return NextResponse.json(
          { success: false, error: 'PROSEM tidak ditemukan' },
          { status: 404 }
        )
      }

      // Parse mingguan
      let mingguan = prosem.mingguan || []
      if (typeof mingguan === 'string') {
        mingguan = JSON.parse(mingguan)
      }

      // Get guru data for signature
      const guru = {
        name: prosem.teacher.user.name || '',
        nuptk: prosem.teacher.nuptk || ''
      }

      // Get kepsek data (get first admin/kepsek)
      const kepsekUser = await db.user.findFirst({
        where: {
          role: {
            in: ['ADMIN', 'KEPSEK']
          }
        }
      })

      const kepsek = kepsekUser ? {
        name: kepsekUser.name || '',
        nuptk: kepsekUser.teacherProfile?.nuptk || ''
      } : {
        name: '',
        nuptk: ''
      }

      prosemData = {
        ...prosem,
        mingguan,
        guru,
        kepsek
      }
    } else {
      // Use provided data directly
      prosemData = requestData
    }

    const pdfDoc = await PDFDocument.create()
    let page = pdfDoc.addPage([pageWidth, pageHeight])

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    let yPosition = pageHeight - margin.top

    // Draw header
    const centerX = pageWidth / 2

    // School name
    const schoolName = 'PROGRAM SEMESTER (PROMES)'
    const schoolNameWidth = getSanitizedTextWidth(schoolName, fontBold, fontSizes.schoolName)
    page.drawText(schoolName, {
      x: centerX - (schoolNameWidth / 2),
      y: yPosition,
      size: fontSizes.schoolName,
      font: fontBold,
      color: colors.text
    })
    yPosition -= fontSizes.schoolName + 5

    // Address/RA INSAN MADANI
    const address = 'RA INSAN MADANI'
    const addressWidth = getSanitizedTextWidth(address, font, fontSizes.title)
    page.drawText(address, {
      x: centerX - (addressWidth / 2),
      y: yPosition,
      size: fontSizes.title,
      font: fontBold,
      color: colors.text
    })
    yPosition -= fontSizes.title + 5

    // Year
    const year = `Tahun Ajaran ${prosemData.tahunAjaran || '2025/2026'}`
    const yearWidth = getSanitizedTextWidth(year, font, fontSizes.subtitle)
    page.drawText(year, {
      x: centerX - (yearWidth / 2),
      y: yPosition,
      size: fontSizes.subtitle,
      font: font,
      color: colors.text
    })
    yPosition -= fontSizes.subtitle + 10

    // Separator
    page.drawLine({
      start: { x: margin.left, y: yPosition },
      end: { x: pageWidth - margin.right, y: yPosition },
      thickness: 1,
      color: colors.border
    })
    yPosition -= 15

    // Title
    const title = `PROSEM SEMESTER ${(prosemData.semester || 'Ganjil').toUpperCase()}, TAHUN ${prosemData.tahunAjaran || '2025/2026'}`
    const titleWidth = getSanitizedTextWidth(title, fontBold, fontSizes.title)
    page.drawText(title, {
      x: centerX - (titleWidth / 2),
      y: yPosition,
      size: fontSizes.title,
      font: fontBold,
      color: colors.text
    })
    yPosition -= fontSizes.title + 30  // Tambah spasi antara judul dan tabel header

    // Parse mingguan (only if not already parsed)
    let mingguan = prosemData.mingguan || []
    if (typeof mingguan === 'string') {
      mingguan = JSON.parse(mingguan)
    }

    // Table headers
    const headers = ['Minggu', 'Tema', 'Sub Tema', 'Lingkup', 'Kegiatan', 'Indikator']
    const rowHeight = 23  // Kurangi tinggi baris agar lebih kompak

    // Draw header row
    let x = margin.left
    for (let i = 0; i < headers.length; i++) {
      const width = colWidths[i]

      page.drawRectangle({
        x: x,
        y: yPosition,
        width: width,
        height: rowHeight,
        borderColor: colors.border,
        borderWidth: 0.5,
        color: colors.headerBg
      })

      const headerText = headers[i]
      const headerWidth = getSanitizedTextWidth(headerText, fontBold, fontSizes.tableHeader)
      page.drawText(headerText, {
        x: x + (width - headerWidth) / 2,
        y: yPosition + (rowHeight - fontSizes.tableHeader) / 2 - 1,  // Sesuaikan posisi header
        size: fontSizes.tableHeader,
        font: fontBold,
        color: colors.text
      })

      x += width
    }

    yPosition -= rowHeight

    // Draw data rows
    for (let row = 0; row < mingguan.length; row++) {
      const minggu = mingguan[row]
      const isOdd = row % 2 === 0

      x = margin.left

      // Row background
      if (isOdd) {
        page.drawRectangle({
          x: margin.left,
          y: yPosition,
          width: colWidths.reduce((a, b) => a + b, 0),
          height: rowHeight,
          color: colors.oddRowBg
        })
      }

      // Draw cells
      const cellData = [
        { text: String(minggu.minggu || row + 1) },
        { text: minggu.tema || '' },
        { text: minggu.subTema || '' },
        { text: minggu.lingkupPerkembangan || '' },
        { text: minggu.kegiatanPembelajaran || '' },
        { text: minggu.indikator || '' }
      ]

      for (let col = 0; col < cellData.length; col++) {
        const width = colWidths[col]
        const { text } = cellData[col]

        // Cell border
        page.drawRectangle({
          x: x,
          y: yPosition,
          width: width,
          height: rowHeight,
          borderColor: colors.border,
          borderWidth: 0.5
        })

        // Draw text (wrapped if needed, all centered)
        const lines = wrapText(text, font, fontSizes.tableContent, width - 8)
        const lineHeight = fontSizes.tableContent + 1

        // All columns: first line starts at same Y position (top alignment)
        const startLineY = yPosition + rowHeight - 9

        lines.forEach((line, lineIndex) => {
          const lineWidth = getSanitizedTextWidth(line, font, fontSizes.tableContent)
          const textX = x + (width - lineWidth) / 2  // Center horizontally
          const lineY = startLineY - (lineIndex * lineHeight)

          page.drawText(line, {
            x: textX,
            y: lineY,
            size: fontSizes.tableContent,
            font: font,
            color: colors.text
          })
        })

        x += width
      }

      yPosition -= rowHeight
    }

    // Footer - Two Column Signature (langsung di bawah matriks)
    yPosition -= 10  // Jarak antara tabel dan tanda tangan

    const leftX = margin.left
    const rightX = pageWidth / 2 + 30
    const columnWidth = (pageWidth - margin.left - margin.right) / 2 - 30

    // Left Column - Kepala Sekolah
    page.drawText('Mengetahui,', {
      x: leftX + columnWidth / 2 - 20,
      y: yPosition,
      size: fontSizes.narrative,
      font: font,
      color: colors.text
    })

    page.drawText('Kepala Sekolah', {
      x: leftX + columnWidth / 2 - 25,
      y: yPosition - 12,
      size: fontSizes.narrative,
      font: fontBold,
      color: colors.text
    })

    const kepsekName = prosemData.kepsek?.name || '_______________________'
    const kepsekNuptk = prosemData.kepsek?.nuptk || '_______________________'

    // Tanda tangan (nama dalam kurung)
    page.drawText(`(${kepsekName})`, {
      x: leftX + columnWidth / 2 - getSanitizedTextWidth(`(${kepsekName})`, fontBold, fontSizes.narrative) / 2,
      y: yPosition - 75,  // Jarak untuk tanda tangan
      size: fontSizes.narrative,
      font: fontBold,
      color: colors.text
    })

    // NUPTK di bawah tanda tangan
    page.drawText(`NUPTK: ${kepsekNuptk}`, {
      x: leftX + columnWidth / 2 - getSanitizedTextWidth(`NUPTK: ${kepsekNuptk}`, font, fontSizes.narrative) / 2,
      y: yPosition - 90,  // NUPTK paling bawah
      size: fontSizes.narrative - 1,
      font: font,
      color: colors.text
    })

    // Right Column - Guru Kelas (tanpa tanggal)
    page.drawText('Guru Kelas', {
      x: rightX + columnWidth / 2 - 25,
      y: yPosition,
      size: fontSizes.narrative,
      font: fontBold,
      color: colors.text
    })

    const guruName = prosemData.guru?.name || '_______________________'
    const guruNuptk = prosemData.guru?.nuptk || '_______________________'

    // Tanda tangan (nama dalam kurung)
    page.drawText(`(${guruName})`, {
      x: rightX + columnWidth / 2 - getSanitizedTextWidth(`(${guruName})`, fontBold, fontSizes.narrative) / 2,
      y: yPosition - 75,  // Jarak untuk tanda tangan
      size: fontSizes.narrative,
      font: fontBold,
      color: colors.text
    })

    // NUPTK di bawah tanda tangan
    page.drawText(`NUPTK: ${guruNuptk}`, {
      x: rightX + columnWidth / 2 - getSanitizedTextWidth(`NUPTK: ${guruNuptk}`, font, fontSizes.narrative) / 2,
      y: yPosition - 90,  // NUPTK paling bawah
      size: fontSizes.narrative - 1,
      font: font,
      color: colors.text
    })

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="PROSEM-${prosemData.semester}-${prosemData.tahunAjaran}.pdf"`
      }
    })
  } catch (error: any) {
    console.error('Error exporting PROSEM to PDF:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengekspor PDF' },
      { status: 500 }
    )
  }
}
