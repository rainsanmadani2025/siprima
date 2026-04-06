import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fs from 'fs/promises'
import path from 'path'

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
  // Replace newlines with spaces to avoid encoding errors
  text = text.replace(/[\n\r]+/g, ' ')

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

function wrapTextForJustify(text: string, maxWidth: number): string[][] {
  // Replace newlines with spaces to avoid encoding errors
  text = text.replace(/[\n\r]+/g, ' ')

  const words = text.split(' ').filter(w => w.length > 0)
  const lines: string[][] = []
  let currentLine: string[] = []
  let currentLength = 0

  for (const word of words) {
    const wordLen = word.length
    const spaceLen = 1

    if (currentLength + wordLen + (currentLine.length > 0 ? spaceLen : 0) > maxWidth && currentLine.length > 0) {
      lines.push([...currentLine])
      currentLine = [word]
      currentLength = wordLen
    } else {
      currentLine.push(word)
      currentLength += wordLen + (currentLine.length > 0 ? spaceLen : 0)
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine)
  }

  return lines
}

function justifyText(text: string, maxChars: number): string[] {
  // Replace newlines with spaces to avoid encoding errors
  text = text.replace(/[\n\r]+/g, ' ')

  const words = text.split(' ').filter(w => w.length > 0)
  const lines: string[] = []
  let currentLine: string[] = []
  let currentLength = 0

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const wordLen = word.length
    const spaceLen = 1

    if (wordLen > maxChars) {
      if (currentLine.length > 0) {
        lines.push(currentLine.join(' '))
      }
      lines.push(word)
      currentLine = []
      currentLength = 0
      continue
    }

    if (currentLength + wordLen + (currentLine.length > 0 ? spaceLen : 0) > maxChars && currentLine.length > 0) {
      lines.push(currentLine.join(' '))
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

async function loadKemenagLogo(pdfDoc: PDFDocument) {
  try {
    const logoPath = path.join(process.cwd(), 'upload', 'Logo Kemenag.png')
    const logoImageBytes = await fs.readFile(logoPath)
    const logoImage = await pdfDoc.embedPng(logoImageBytes)
    return logoImage
  } catch (error) {
    console.warn('Failed to load Kemenag logo:', error)
    return null
  }
}

async function loadRALogo(pdfDoc: PDFDocument) {
  try {
    const logoPath = path.join(process.cwd(), 'upload', 'LOGO RA.png')
    const logoImageBytes = await fs.readFile(logoPath)
    const logoImage = await pdfDoc.embedPng(logoImageBytes)
    return logoImage
  } catch (error) {
    console.warn('Failed to load RA logo:', error)
    return null
  }
}

async function loadStudentPhoto(pdfDoc: PDFDocument, photoData: string) {
  try {
    let imageBytes: Uint8Array

    // Check if it's a base64 data URL
    if (photoData.startsWith('data:')) {
      // Extract the base64 part (after the comma)
      const base64Data = photoData.split(',')[1]
      imageBytes = Buffer.from(base64Data, 'base64')
    } else {
      // It's a file path
      const fullPath = path.join(process.cwd(), 'upload', photoData)
      imageBytes = await fs.readFile(fullPath)
    }

    // Detect image type and embed
    if (photoData.startsWith('data:image/png') || photoData.toLowerCase().endsWith('.png')) {
      return await pdfDoc.embedPng(imageBytes)
    } else if (photoData.startsWith('data:image/jpeg') || photoData.startsWith('data:image/jpg') || photoData.toLowerCase().match(/\.(jpg|jpeg)$/)) {
      return await pdfDoc.embedJpg(imageBytes)
    } else {
      // Try PNG first, then JPEG
      try {
        return await pdfDoc.embedPng(imageBytes)
      } catch {
        return await pdfDoc.embedJpg(imageBytes)
      }
    }
  } catch (error) {
    console.warn('Failed to load student photo:', error)
    return null
  }
}

// Calculate dimensions while maintaining aspect ratio
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  targetSize: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight

  if (aspectRatio > 1) {
    // Wider than tall
    return {
      width: targetSize,
      height: targetSize / aspectRatio
    }
  } else {
    // Taller than wide or square
    return {
      width: targetSize * aspectRatio,
      height: targetSize
    }
  }
}

function sanitizeText(text: string): string {
  // Remove or replace characters that can't be encoded in WinAnsi
  return text.replace(/[\n\r\t\x00-\x1F\x7F-\x9F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function createPDFBuffer(data: any): Promise<Uint8Array> {
  console.log('[createPDFBuffer] Starting PDF generation')
  console.log('[createPDFBuffer] Student:', data.studentName)
  console.log('[createPDFBuffer] Semester:', data.semester)

  // Convert assessments array to object if needed
  let assessments = data.assessments
  if (Array.isArray(assessments)) {
    console.log('[createPDFBuffer] Converting assessments array to object')
    assessments = {}
    data.assessments.forEach((a: any) => {
      assessments[a.aspect] = a
    })
  }

  // Update data with converted assessments
  data.assessments = assessments

  const pdfDoc = await PDFDocument.create()

  let page = pdfDoc.addPage([595, 842])

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Load logos
  const kemenagLogo = await loadKemenagLogo(pdfDoc)
  const raLogo = await loadRALogo(pdfDoc)

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

  // Draw Kemenag logo if available, otherwise draw text
  if (kemenagLogo) {
    const kemenagDims = calculateDimensions(kemenagLogo.width, kemenagLogo.height, 65)
    page.drawImage(kemenagLogo, {
      x: leftMargin,
      y: y - 20,
      width: kemenagDims.width,
      height: kemenagDims.height
    })
  } else {
    drawText('LOGO KEMENTRIAN AGAMA', leftMargin, y, 10, fontBold)
  }

  // Draw RA logo if available, otherwise draw text
  if (raLogo) {
    const raDims = calculateDimensions(raLogo.width, raLogo.height, 110)
    // Adjust y position to align with Kemenag logo (move down by 24px)
    page.drawImage(raLogo, {
      x: rightMargin - raDims.width,
      y: y - 44,
      width: raDims.width,
      height: raDims.height
    })
  } else {
    drawText('LOGO RA INSAN MADANI', rightMargin - 140, y, 10, fontBold)
  }

  // Draw title and subtitle in the center
  const centerX = 595 / 2
  const titleText = sanitizeText(data.schoolName || 'RA INSAN MADANI')
  const subtitleText = 'Laporan Perkembangan Anak'

  // Calculate center position for title - aligned with logos
  const titleWidth = fontBold.widthOfTextAtSize(titleText, 16)
  const titleX = centerX - titleWidth / 2
  drawText(titleText, titleX, y, 16, fontBold)

  // Calculate center position for subtitle
  const subtitleWidth = font.widthOfTextAtSize(subtitleText, 10)
  const subtitleX = centerX - subtitleWidth / 2
  drawText(subtitleText, subtitleX, y - 15, 10, font)

  y -= 40

  drawLine(y)
  y -= 25

  const address = sanitizeText(data.schoolAddress || '')
  const studentName = sanitizeText(data.studentName || '')
  const studentNis = sanitizeText(data.studentNis || '')
  const studentNisn = sanitizeText(data.studentNisn || '')
  const schoolName = sanitizeText(data.schoolName || '')
  const className = sanitizeText(data.className || '')

  const infoData = [
    { label: 'NAMA', value: `: ${studentName}`, x: leftMargin },
    { label: 'NIS/NISN', value: `: ${studentNis} / ${studentNisn}`, x: leftMargin },
    { label: 'Madrasah', value: `: ${schoolName}`, x: leftMargin },
    { label: 'Alamat', value: address, x: leftMargin, multiline: true },
    { label: 'Kelas', value: `: ${className}`, x: 330 },
    { label: 'Fase', value: `: Pondasi`, x: 330 },
    { label: 'Semester', value: `: ${data.semester || '-'}`, x: 330 },
    { label: 'Tahun Ajaran', value: `: ${data.academicYear || '-'}`, x: 330 },
  ]

  const startY = y

  // Draw left column (including address with wrapping)
  infoData.slice(0, 4).forEach((item) => {
    if (item.multiline && item.value) {
      // Wrap address to multiple lines (max 45 chars per line)
      const maxChars = 45
      const words = item.value.split(' ')
      let currentLine = ': '
      let lineCount = 0

      words.forEach((word, index) => {
        if (currentLine.length + word.length + 1 > maxChars) {
          drawText(`${item.label} ${currentLine}`, item.x, y, 9, font)
          y -= 18
          lineCount++
          currentLine = '  ' + word
          // Don't repeat label on wrapped lines
        } else {
          currentLine += (currentLine === ': ' ? '' : ' ') + word
        }

        // Draw remaining line
        if (index === words.length - 1 && currentLine.trim()) {
          const label = lineCount === 0 ? item.label : ''
          drawText(`${label} ${currentLine}`, item.x, y, 9, font)
          y -= 18
        }
      })
    } else {
      drawText(`${item.label} ${item.value}`, item.x, y, 9, font)
      y -= 18
    }
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
      const lines = wrapTextForJustify(observation, 75)
      const fontSize = 9
      const baseSpaceWidth = font.widthOfTextAtSize(' ', fontSize)
      const minSpaceMultiplier = 0.2 // Use 20% of normal space for extremely tight text

      lines.forEach((words, lineIndex) => {
        // Skip page break check for first line
        if (lineIndex > 0 && lineIndex % 12 === 0) {
          checkNewPage(60)
        }

        // Calculate total width of text (words + minimum spaces)
        let totalTextWidth = 0
        words.forEach(word => {
          totalTextWidth += font.widthOfTextAtSize(word, fontSize)
        })
        // Add minimum spaces between words
        if (words.length > 1) {
          totalTextWidth += (words.length - 1) * (baseSpaceWidth * minSpaceMultiplier)
        }

        const availableWidth = rightMargin - leftMargin - 10
        const isLastLine = lineIndex === lines.length - 1
        const isJustifiable = words.length > 1 && !isLastLine

        if (isJustifiable && totalTextWidth < availableWidth) {
          // Justify the line by distributing extra space between words
          const extraSpace = availableWidth - totalTextWidth
          const gapCount = words.length - 1
          const additionalSpacePerGap = extraSpace / gapCount

          let x = leftMargin + 10
          words.forEach((word, wordIndex) => {
            // Sanitize each word before drawing
            const sanitizedWord = sanitizeText(word)
            drawText(sanitizedWord, x, y, fontSize, font)
            x += font.widthOfTextAtSize(sanitizedWord, fontSize)

            // Add space after each word except the last
            if (wordIndex < words.length - 1) {
              // Use tighter base space + distributed extra space
              x += (baseSpaceWidth * minSpaceMultiplier) + additionalSpacePerGap
            }
          })
        } else {
          // Left align for single-word lines or the last line with normal spacing
          let x = leftMargin + 10
          words.forEach((word, wordIndex) => {
            // Sanitize each word before drawing
            const sanitizedWord = sanitizeText(word)
            if (wordIndex > 0) {
              x += baseSpaceWidth // Use normal space for non-justified lines
            }
            drawText(sanitizedWord, x, y, fontSize, font)
            x += font.widthOfTextAtSize(sanitizedWord, fontSize)
          })
        }

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
  drawText('Observasi Kegiatan :', leftMargin, y, 9, fontBold)
  y -= 15

  const catatanData = data.assessments?.catatan_perkembangan
  const obsKegiatan = sanitizeText(catatanData?.observation || '')

  console.log('[createPDFBuffer] catatan_perkembangan data:', catatanData ? 'exists' : 'not found')
  console.log('[createPDFBuffer] obsKegiatan length:', obsKegiatan.length)

  if (obsKegiatan) {
    const lines = wrapTextForJustify(obsKegiatan, 75)
    const fontSize = 9
    const baseSpaceWidth = font.widthOfTextAtSize(' ', fontSize)
    const minSpaceMultiplier = 0.2

    lines.forEach((words, lineIndex) => {
      if (lineIndex > 0 && lineIndex % 12 === 0) {
        checkNewPage(60)
      }

      let totalTextWidth = 0
      words.forEach(word => {
        totalTextWidth += font.widthOfTextAtSize(word, fontSize)
      })
      if (words.length > 1) {
        totalTextWidth += (words.length - 1) * (baseSpaceWidth * minSpaceMultiplier)
      }

      const availableWidth = rightMargin - leftMargin - 10
      const isLastLine = lineIndex === lines.length - 1
      const isJustifiable = words.length > 1 && !isLastLine

      if (isJustifiable && totalTextWidth < availableWidth) {
        const extraSpace = availableWidth - totalTextWidth
        const gapCount = words.length - 1
        const additionalSpacePerGap = extraSpace / gapCount

        let x = leftMargin + 10
        words.forEach((word, wordIndex) => {
          const sanitizedWord = sanitizeText(word)
          drawText(sanitizedWord, x, y, fontSize, font)
          x += font.widthOfTextAtSize(sanitizedWord, fontSize)

          if (wordIndex < words.length - 1) {
            x += (baseSpaceWidth * minSpaceMultiplier) + additionalSpacePerGap
          }
        })
      } else {
        let x = leftMargin + 10
        words.forEach((word, wordIndex) => {
          const sanitizedWord = sanitizeText(word)
          if (wordIndex > 0) {
            x += baseSpaceWidth
          }
          drawText(sanitizedWord, x, y, fontSize, font)
          x += font.widthOfTextAtSize(sanitizedWord, fontSize)
        })
      }

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
  drawText('Catatan Anekdot :', leftMargin, y, 9, fontBold)
  y -= 15

  const notes = sanitizeText(data.assessments?.catatan_perkembangan?.notes || '')

  if (notes) {
    const lines = wrapTextForJustify(notes, 75)
    const fontSize = 9
    const baseSpaceWidth = font.widthOfTextAtSize(' ', fontSize)
    const minSpaceMultiplier = 0.2

    lines.forEach((words, lineIndex) => {
      if (lineIndex > 0 && lineIndex % 12 === 0) {
        checkNewPage(60)
      }

      let totalTextWidth = 0
      words.forEach(word => {
        totalTextWidth += font.widthOfTextAtSize(word, fontSize)
      })
      if (words.length > 1) {
        totalTextWidth += (words.length - 1) * (baseSpaceWidth * minSpaceMultiplier)
      }

      const availableWidth = rightMargin - leftMargin - 10
      const isLastLine = lineIndex === lines.length - 1
      const isJustifiable = words.length > 1 && !isLastLine

      if (isJustifiable && totalTextWidth < availableWidth) {
        const extraSpace = availableWidth - totalTextWidth
        const gapCount = words.length - 1
        const additionalSpacePerGap = extraSpace / gapCount

        let x = leftMargin + 10
        words.forEach((word, wordIndex) => {
          const sanitizedWord = sanitizeText(word)
          drawText(sanitizedWord, x, y, fontSize, font)
          x += font.widthOfTextAtSize(sanitizedWord, fontSize)

          if (wordIndex < words.length - 1) {
            x += (baseSpaceWidth * minSpaceMultiplier) + additionalSpacePerGap
          }
        })
      } else {
        let x = leftMargin + 10
        words.forEach((word, wordIndex) => {
          const sanitizedWord = sanitizeText(word)
          if (wordIndex > 0) {
            x += baseSpaceWidth
          }
          drawText(sanitizedWord, x, y, fontSize, font)
          x += font.widthOfTextAtSize(sanitizedWord, fontSize)
        })
      }

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
  drawText('Dokumentasi Foto :', leftMargin, y, 9, fontBold)
  y -= 20

  // Display student photos if available
  const photos = data.photos || []
  console.log('[createPDFBuffer] Photos data:', photos)
  console.log('[createPDFBuffer] Photos length:', photos.length)

  if (photos.length > 0) {
    const photoSize = 120
    const photoGap = 15
    let photoX = leftMargin

    for (let i = 0; i < Math.min(photos.length, 3); i++) {
      console.log(`[createPDFBuffer] Loading photo ${i + 1}:`, photos[i])
      const photo = await loadStudentPhoto(pdfDoc, photos[i])
      if (photo) {
        const dims = calculateDimensions(photo.width, photo.height, photoSize)
        page.drawImage(photo, {
          x: photoX,
          y: y - dims.height,
          width: dims.width,
          height: dims.height
        })
      } else {
        // Draw placeholder if photo fails to load
        page.drawRectangle({
          x: photoX,
          y: y - photoSize,
          width: photoSize,
          height: photoSize,
          borderColor: rgb(0.5, 0.5, 0.5),
          borderWidth: 1
        })
        const placeholderText = `Foto ${i + 1}`
        const placeholderWidth = font.widthOfTextAtSize(placeholderText, 10)
        drawText(placeholderText, photoX + (photoSize - placeholderWidth) / 2, y - photoSize / 2, 10, font, rgb(0.5, 0.5, 0.5))
      }
      photoX += photoSize + photoGap
    }
  } else {
    // Draw placeholders if no photos
    const photoSize = 120
    const photoGap = 15
    let photoX = leftMargin
    for (let i = 0; i < 3; i++) {
      page.drawRectangle({
        x: photoX,
        y: y - photoSize,
        width: photoSize,
        height: photoSize,
        borderColor: rgb(0.5, 0.5, 0.5),
        borderWidth: 1
      })
      const placeholderText = `Foto ${i + 1}`
      const placeholderWidth = font.widthOfTextAtSize(placeholderText, 10)
      drawText(placeholderText, photoX + (photoSize - placeholderWidth) / 2, y - photoSize / 2, 10, font, rgb(0.5, 0.5, 0.5))
      photoX += photoSize + photoGap
    }
  }

  y -= 140
  y -= 25

  drawLine(y, 1, rgb(0.3, 0.3, 0.3))
  y -= 25

  checkNewPage(90)
  drawText('Ketidakhadiran :', leftMargin, y, 11, fontBold)
  y -= 20

  const attendance = data.attendance || { sakit: 0, izin: 0, alpa: 0 }

  drawText(`Sakit   ${attendance.sakit}   Hari`, leftMargin, y, 10, font)
  y -= 18
  drawText(`Izin    ${attendance.izin}    Hari`, leftMargin, y, 10, font)
  y -= 18
  drawText(`Alpa    ${attendance.alpa}    Hari`, leftMargin, y, 10, font)
  y -= 25

  drawLine(y, 1, rgb(0.3, 0.3, 0.3))
  y -= 25

  checkNewPage(90)
  drawText('Catatan Pendidik :', leftMargin, y, 9, fontBold)
  y -= 15

  const educatorNotes = sanitizeText(data.educatorNotes || '')

  if (educatorNotes) {
    const lines = wrapTextForJustify(educatorNotes, 75)
    const fontSize = 9
    const baseSpaceWidth = font.widthOfTextAtSize(' ', fontSize)
    const minSpaceMultiplier = 0.2

    lines.forEach((words, lineIndex) => {
      if (lineIndex > 0 && lineIndex % 12 === 0) {
        checkNewPage(60)
      }

      let totalTextWidth = 0
      words.forEach(word => {
        totalTextWidth += font.widthOfTextAtSize(word, fontSize)
      })
      if (words.length > 1) {
        totalTextWidth += (words.length - 1) * (baseSpaceWidth * minSpaceMultiplier)
      }

      const availableWidth = rightMargin - leftMargin - 10
      const isLastLine = lineIndex === lines.length - 1
      const isJustifiable = words.length > 1 && !isLastLine

      if (isJustifiable && totalTextWidth < availableWidth) {
        const extraSpace = availableWidth - totalTextWidth
        const gapCount = words.length - 1
        const additionalSpacePerGap = extraSpace / gapCount

        let x = leftMargin + 10
        words.forEach((word, wordIndex) => {
          const sanitizedWord = sanitizeText(word)
          drawText(sanitizedWord, x, y, fontSize, font)
          x += font.widthOfTextAtSize(sanitizedWord, fontSize)

          if (wordIndex < words.length - 1) {
            x += (baseSpaceWidth * minSpaceMultiplier) + additionalSpacePerGap
          }
        })
      } else {
        let x = leftMargin + 10
        words.forEach((word, wordIndex) => {
          const sanitizedWord = sanitizeText(word)
          if (wordIndex > 0) {
            x += baseSpaceWidth
          }
          drawText(sanitizedWord, x, y, fontSize, font)
          x += font.widthOfTextAtSize(sanitizedWord, fontSize)
        })
      }

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

  // Calculate positions for three signatures
  // Orang Tua (left), Kepala Sekolah (center - 1 paragraph below), Wali Kelas (right)
  const leftSignatureX = leftMargin
  const centerSignatureX = (leftMargin + rightMargin) / 2 - 60
  const rightSignatureX = rightMargin - 120
  const signatureWidth = 120

  // Draw labels for Orang Tua and Wali Kelas (same line)
  drawText('Orang Tua/Wali', leftSignatureX, y, 10, fontBold)
  drawText('Wali Kelas', rightSignatureX, y, 10, fontBold)

  // Draw Kepala Sekolah label 3 paragraphs (90px) below
  drawText('Kepala Sekolah', centerSignatureX, y - 90, 10, fontBold)

  // Move down 65px for names (larger gap between label and name)
  y -= 65

  // Draw parent name (Orang Tua) above signature line
  const parentName = sanitizeText(data.parentName || '')
  drawText(parentName || '................................', leftSignatureX, y, 10, fontBold)

  // Draw teacher name (Wali Kelas) above signature line
  const teacherName = sanitizeText(data.teacherName || 'Guru')
  drawText(teacherName, rightSignatureX, y, 10, fontBold)

  // Draw principal name (Kepala Sekolah) above signature line
  const principalName = sanitizeText(data.principalName || 'Kepala Sekolah')
  drawText(principalName, centerSignatureX, y - 90, 10, fontBold)

  // Move down 5px (tight gap) for signature lines
  y -= 5

  // Draw signature line for Wali Kelas
  page.drawLine({
    start: { x: rightSignatureX, y },
    end: { x: rightSignatureX + signatureWidth, y },
    thickness: 1,
    color: rgb(0, 0, 0)
  })

  // Draw signature line for Kepala Sekolah 3 paragraphs below
  page.drawLine({
    start: { x: centerSignatureX, y: y - 90 },
    end: { x: centerSignatureX + signatureWidth, y: y - 90 },
    thickness: 1,
    color: rgb(0, 0, 0)
  })

  // Move down 12px for NUPTK (below signature line)
  y -= 12

  // Draw teacher NUPTK (Wali Kelas)
  if (data.teacherNip) {
    drawText(`NUPTK : ${data.teacherNip}`, rightSignatureX, y, 8, font)
  }

  // Draw principal NUPTK (Kepala Sekolah - 3 paragraphs below)
  if (data.principalNip) {
    drawText(`NUPTK : ${data.principalNip}`, centerSignatureX, y - 90, 8, font)
  }

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    console.log('[export-pdf] Received data keys:', Object.keys(data))
    console.log('[export-pdf] Assessments type:', typeof data.assessments)
    console.log('[export-pdf] Assessments keys:', data.assessments ? Object.keys(data.assessments) : 'none')

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
        'Content-Disposition': `inline; filename="Raport-${data.studentName}-${data.periodLabel || data.period}.pdf"`,
      },
    })
  } catch (error) {
    console.error('[export-pdf] Error generating PDF:', error)
    console.error('[export-pdf] Error stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Gagal membuat PDF' },
      { status: 500 }
    )
  }
}
