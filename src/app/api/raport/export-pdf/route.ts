import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

const scoreLabels: Record<string, string> = {
  BB: 'Belum Berkembang',
  MB: 'Mulai Berkembang',
  BSH: 'Berkembang Sesuai Harapan',
  BSB: 'Berkembang Sangat Baik'
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    if (currentLine.length + word.length + 1 > maxChars) {
      if (currentLine) {
        lines.push(currentLine)
      }
      currentLine = word
    } else {
      currentLine += (currentLine ? ' ' : '') + word
    }
  }
  if (currentLine) {
    lines.push(currentLine)
  }
  return lines
}

function justifyText(text: string, maxChars: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine: string[] = []
  let currentLength = 0

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const wordLen = word.length
    const spaceLen = 1

    if (currentLength + wordLen + (currentLine.length > 0 ? spaceLen : 0) > maxChars && currentLine.length > 0) {
      if (currentLine.length > 1) {
        const totalChars = currentLine.join('').length
        const spacesNeeded = maxChars - totalChars
        const baseSpaces = Math.floor(spacesNeeded / (currentLine.length - 1))
        const extraSpaces = spacesNeeded % (currentLine.length - 1)

        let result = currentLine[0]
        for (let j = 1; j < currentLine.length; j++) {
          const spaceCount = 1 + baseSpaces + (j <= extraSpaces ? 1 : 0)
          for (let k = 0; k < spaceCount; k++) {
            result += ' '
          }
          result += currentLine[j]
        }
        lines.push(result)
      } else {
        lines.push(currentLine.join(' '))
      }

      currentLine = [word]
      currentLength = wordLen
    } else {
      currentLine.push(word)
      currentLength += wordLen + (currentLine.length > 0 ? spaceLen : 0)
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine.join(' '))
  }

  return lines
}

async function createPDFBuffer(data: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()

  let page = pdfDoc.addPage([595, 842])

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const leftMargin = 70
  const rightMargin = 525
  const topMargin = 80
  const bottomMargin = 80

  let y = 842 - topMargin
  const lineHeight = 16

  const checkNewPage = (neededSpace: number = 0) => {
    if (y - neededSpace < bottomMargin) {
      page = pdfDoc.addPage([595, 842])
      y = 842 - topMargin
      return true
    }
    return false
  }

  const drawText = (text: string, x: number, yPos: number, size: number, fontObj: any, color: any = rgb(0, 0, 0)) => {
    page.drawText(text, { x, y: yPos, size, font: fontObj, color })
  }

  const drawLine = (lineY: number, thickness: number = 1, color: any = rgb(0.5, 0.5, 0.5)) => {
    page.drawLine({
      start: { x: leftMargin, y: lineY },
      end: { x: rightMargin, y: lineY },
      thickness,
      color
    })
  }

  drawText('LOGO KEMENTRIAN AGAMA', leftMargin, y, 10, fontBold)
  drawText('LOGO RA INSAN MADANI', rightMargin - 140, y, 10, fontBold)
  y -= 30

  drawLine(y)
  y -= 25

  const address = truncateText(data.schoolAddress || '', 32)

  const infoData = [
    { label: 'NAMA', value: `: ${data.studentName}`, x: leftMargin },
    { label: 'NIS/NISN', value: `: ${data.studentNis} / ${data.studentNisn}`, x: leftMargin },
    { label: 'Madrasah', value: `: ${data.schoolName}`, x: leftMargin },
    { label: 'Alamat', value: `: ${address}`, x: leftMargin },
    { label: 'Kelas', value: `: ${data.className}`, x: 330 },
    { label: 'Fase', value: `: Pondasi`, x: 330 },
    { label: 'Semester', value: `: ${data.semester}`, x: 330 },
    { label: 'Tahun Ajaran', value: `: ${data.academicYear}`, x: 330 },
  ]

  const startY = y
  infoData.slice(0, 4).forEach((item) => {
    drawText(`${item.label} ${item.value}`, item.x, y, 9, font)
    y -= 18
  })

  y = startY
  infoData.slice(4, 8).forEach((item) => {
    drawText(`${item.label} ${item.value}`, item.x, y, 9, font)
    y -= 18
  })
  y -= 25

  drawLine(y)
  y -= 25

  const aspects = [
    { key: 'agama_budi_pekerti', label: 'A. Nilai Agama dan Budi Pekerti' },
    { key: 'jati_diri', label: 'B. Jati Diri' },
    { key: 'literasi_sains', label: 'C. Dasar – Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa dan Seni' }
  ]

  const scores = ['BB', 'MB', 'BSH', 'BSB']

  aspects.forEach((aspect) => {
    checkNewPage(150)

    const assessment = data.assessments[aspect.key]

    drawText(aspect.label, leftMargin, y, 11, fontBold)
    y -= 20

    drawText('Penilaian', leftMargin, y, 9, font)
    y -= 15

    let radioX = leftMargin
    scores.forEach((score) => {
      const isSelected = assessment?.score === score

      page.drawEllipse({
        x: radioX + 5,
        y: y - 3,
        xScale: 5,
        yScale: 5,
        borderColor: rgb(0, 0, 0),
        color: rgb(1, 1, 1)
      })

      if (isSelected) {
        page.drawEllipse({
          x: radioX + 5,
          y: y - 3,
          xScale: 2.5,
          yScale: 2.5,
          color: rgb(0, 0, 0)
        })
      }

      drawText(score, radioX + 12, y - 6, 9, font)
      radioX += 55
    })

    y -= 25

    drawText('Catatan Perkembangan :', leftMargin, y, 9, fontBold)
    y -= 15

    const observation = assessment?.observation || ''

    if (observation) {
      const justifiedLines = justifyText(observation, 75)
      justifiedLines.forEach((line, index) => {
        if (index > 0 && index % 12 === 0) {
          checkNewPage(60)
        }
        drawText(line, leftMargin + 10, y, 9, font)
        y -= lineHeight
      })
    } else {
      drawText('.........................................................................................................', leftMargin + 10, y, 9, font, rgb(0.5, 0.5, 0.5))
      y -= lineHeight
    }

    y -= 25

    drawLine(y, 1, rgb(0.3, 0.3, 0.3))
    y -= 25
  })

  checkNewPage(100)
  drawText('Observasi Kegiatan : [Textarea - 3 baris]', leftMargin, y, 9, fontBold)
  y -= 15

  const obsKegiatan = data.assessments?.catatan_perkembangan?.observation || ''

  if (obsKegiatan) {
    const justifiedLines = justifyText(obsKegiatan, 75)
    justifiedLines.forEach((line, index) => {
      if (index > 0 && index % 12 === 0) {
        checkNewPage(60)
      }
      drawText(line, leftMargin + 10, y, 9, font)
      y -= lineHeight
    })
  } else {
    drawText('.........................................................................................................', leftMargin + 10, y, 9, font, rgb(0.5, 0.5, 0.5))
    y -= lineHeight
    drawText('.........................................................................................................', leftMargin + 10, y, 9, font, rgb(0.5, 0.5, 0.5))
    y -= lineHeight
    drawText('.........................................................................................................', leftMargin + 10, y, 9, font, rgb(0.5, 0.5, 0.5))
    y -= lineHeight
  }

  y -= 20
  drawLine(y, 1, rgb(0.3, 0.3, 0.3))
  y -= 25

  checkNewPage(100)
  drawText('Catatan Anekdot : [Textarea - 3 baris]', leftMargin, y, 9, fontBold)
  y -= 15

  const notes = data.assessments?.catatan_perkembangan?.notes || ''

  if (notes) {
    const justifiedLines = justifyText(notes, 75)
    justifiedLines.forEach((line, index) => {
      if (index > 0 && index % 12 === 0) {
        checkNewPage(60)
      }
      drawText(line, leftMargin + 10, y, 9, font)
      y -= lineHeight
    })
  } else {
    drawText('.........................................................................................................', leftMargin + 10, y, 9, font, rgb(0.5, 0.5, 0.5))
    y -= lineHeight
    drawText('.........................................................................................................', leftMargin + 10, y, 9, font, rgb(0.5, 0.5, 0.5))
    y -= lineHeight
    drawText('.........................................................................................................', leftMargin + 10, y, 9, font, rgb(0.5, 0.5, 0.5))
    y -= lineHeight
  }

  y -= 20
  drawLine(y, 1, rgb(0.3, 0.3, 0.3))
  y -= 25

  checkNewPage(70)
  drawText('Dokumentasi Foto : [Unggah Foto]', leftMargin, y, 9, fontBold)
  y -= 20

  drawText('Foto 1  Foto 2  Foto 3', leftMargin, y, 9, font)
  y -= 25

  drawLine(y, 1, rgb(0.3, 0.3, 0.3))
  y -= 25

  checkNewPage(90)
  drawText('Ketidakhadiran :', leftMargin, y, 11, fontBold)
  y -= 20

  drawText(`Sakit   ${data.attendance.sakit}   Hari`, leftMargin, y, 10, font)
  y -= 18
  drawText(`Izin    ${data.attendance.izin}    Hari`, leftMargin, y, 10, font)
  y -= 18
  drawText(`Alpa    ${data.attendance.alpa}    Hari`, leftMargin, y, 10, font)
  y -= 25

  drawLine(y, 1, rgb(0.3, 0.3, 0.3))
  y -= 25

  checkNewPage(90)
  drawText('Catatan Pendidik : [Textarea - 3 baris]', leftMargin, y, 9, fontBold)
  y -= 15

  const educatorNotes = data.educatorNotes || ''

  if (educatorNotes) {
    const justifiedLines = justifyText(educatorNotes, 75)
    justifiedLines.forEach((line, index) => {
      if (index > 0 && index % 12 === 0) {
        checkNewPage(60)
      }
      drawText(line, leftMargin + 10, y, 9, font)
      y -= lineHeight
    })
  } else {
    drawText('.........................................................................................................', leftMargin + 10, y, 9, font, rgb(0.5, 0.5, 0.5))
    y -= lineHeight
    drawText('.........................................................................................................', leftMargin + 10, y, 9, font, rgb(0.5, 0.5, 0.5))
    y -= lineHeight
    drawText('.........................................................................................................', leftMargin + 10, y, 9, font, rgb(0.5, 0.5, 0.5))
    y -= lineHeight
  }

  y -= 25
  drawLine(y, 1, rgb(0.3, 0.3, 0.3))
  y -= 40

  checkNewPage(120)

  drawText('Orang tua', leftMargin, y, 10, fontBold)
  drawText('Wali Kelas', rightMargin - 120, y, 10, fontBold)
  y -= 40

  page.drawLine({
    start: { x: leftMargin, y },
    end: { x: leftMargin + 120, y },
    thickness: 1,
    color: rgb(0, 0, 0)
  })

  page.drawLine({
    start: { x: rightMargin - 120, y },
    end: { x: rightMargin, y },
    thickness: 1,
    color: rgb(0, 0, 0)
  })

  y -= 50

  drawText('Mengetahui,', rightMargin - 120, y, 10, fontBold)
  y -= 15
  drawText('Kepala Sekolah', rightMargin - 120, y, 10, fontBold)
  y -= 40

  page.drawLine({
    start: { x: rightMargin - 120, y },
    end: { x: rightMargin, y },
    thickness: 1,
    color: rgb(0, 0, 0)
  })

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.studentName || !data.period) {
      return NextResponse.json(
        { success: false, error: 'Data siswa dan periode diperlukan' },
        { status: 400 }
      )
    }

    const pdfBytes = await createPDFBuffer(data)

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Raport-${data.studentName}-${data.periodLabel}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal membuat PDF' },
      { status: 500 }
    )
  }
}
