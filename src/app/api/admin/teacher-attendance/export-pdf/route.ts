import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { db } from '@/lib/db'

const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { month, teacherId } = body

    if (!month || !teacherId) {
      return NextResponse.json(
        { success: false, error: 'Month dan Teacher ID diperlukan' },
        { status: 400 }
      )
    }

    const teacher = await db.teacher.findUnique({
      where: { id: teacherId },
      include: { user: { select: { name: true } } }
    })

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: 'Guru tidak ditemukan' },
        { status: 404 }
      )
    }

    const allTeachers = await db.teacher.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { user: { name: 'asc' } }
    })

    const allAttendance = await db.teacherAttendance.findMany({
      where: { date: { startsWith: month } },
      include: { teacher: { include: { user: { select: { name: true } } } } }
    })

    const school = await db.school.findFirst()

    const [yearNum, monthNum] = month.split('-').map(Number)
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate()

    const days: { day: number; dateStr: string; dayName: string; isWeekend: boolean }[] = []
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(yearNum, monthNum - 1, d)
      const dateStr = `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const dow = date.getDay()
      days.push({ day: d, dateStr, dayName: dayNames[dow], isWeekend: dow === 0 || dow === 6 })
    }

    const pdfDoc = await PDFDocument.create()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const pageWidth = 841.89
    const pageHeight = 595.28
    const margin = { left: 25, right: 25, top: 25, bottom: 25 }
    const contentWidth = pageWidth - margin.left - margin.right

    const colNo = 35
    const colName = 120
    const colNIP = 80
    const remainingWidth = contentWidth - colNo - colName - colNIP - 80
    const colDayWidth = remainingWidth / daysInMonth
    const colSummaryWidth = 16

    const headerHeight = 90
    const rowHeight = 14
    const maxRowsPerPage = Math.floor((pageHeight - margin.top - margin.bottom - headerHeight - 30 - 22) / rowHeight)
    const totalPages = Math.ceil(allTeachers.length / maxRowsPerPage)

    for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
      const page = pdfDoc.addPage([pageWidth, pageHeight])
      const startIdx = pageIdx * maxRowsPerPage
      const endIdx = Math.min(startIdx + maxRowsPerPage, allTeachers.length)
      const pageTeachers = allTeachers.slice(startIdx, endIdx)

      let y = pageHeight - margin.top

      if (school) {
        const text = school.name.toUpperCase()
        const tw = fontBold.widthOfTextAtSize(text, 14)
        await page.drawText(text, { x: margin.left + (contentWidth - tw) / 2, y, size: 14, font: fontBold, color: rgb(0, 0, 0) })
        y -= 14
      }

      const titleText = `REKAPITULASI ABSENSI GURU`
      const titleWidth = fontBold.widthOfTextAtSize(titleText, 11)
      await page.drawText(titleText, { x: margin.left + (contentWidth - titleWidth) / 2, y, size: 11, font: fontBold, color: rgb(0, 0, 0) })
      y -= 12

      const subtitleText = `Bulan: ${monthNames[monthNum - 1]} ${yearNum}`
      const stw = font.widthOfTextAtSize(subtitleText, 10)
      await page.drawText(subtitleText, { x: margin.left + (contentWidth - stw) / 2, y, size: 10, font, color: rgb(0, 0, 0) })
      y -= 8

      page.drawLine({ start: { x: margin.left, y }, end: { x: margin.left + contentWidth, y }, thickness: 1.5, color: rgb(0.3, 0.3, 0.3) })
      y -= 12

      const headerBg = rgb(0.7, 0.8, 0.95)
      const border = rgb(0.3, 0.3, 0.3)
      let x = margin.left

      const headers = [
        { label: 'No.', width: colNo },
        { label: 'Nama Guru', width: colName },
        { label: 'NUPTK', width: colNIP },
        ...days.map(d => ({ label: String(d.day), width: colDayWidth })),
        { label: 'H', width: colSummaryWidth },
        { label: 'S', width: colSummaryWidth },
        { label: 'I', width: colSummaryWidth },
        { label: 'A', width: colSummaryWidth }
      ]

      for (const h of headers) {
        const bg = (h.label === 'H' || h.label === 'S' || h.label === 'I' || h.label === 'A' ||
          days.find(dd => dd.day === parseInt(h.label) && dd.isWeekend)) ? rgb(1.0, 0.92, 0.92) : headerBg
        page.drawRectangle({ x, y: y - rowHeight - 4, width: h.width, height: rowHeight + 4, color: bg })
        page.drawRectangle({ x, y: y - rowHeight - 4, width: h.width, height: rowHeight + 4, borderColor: border, borderWidth: 0.5 })
        const lw = fontBold.widthOfTextAtSize(h.label, 8)
        await page.drawText(h.label, { x: x + (h.width - lw) / 2, y: y - rowHeight + 1, size: 8, font: fontBold, color: rgb(0, 0, 0) })
        x += h.width
      }
      y -= rowHeight + 4

      for (let ti = 0; ti < pageTeachers.length; ti++) {
        const t = pageTeachers[ti]
        const tAtt = allAttendance.filter(a => a.teacherId === t.id)
        let hadir = 0, sakit = 0, izin = 0, alpha = 0

        const rowBg = ti % 2 === 1 ? rgb(0.95, 0.95, 0.98) : rgb(1, 1, 1)
        page.drawRectangle({ x: margin.left, y: y - rowHeight, width: contentWidth, height: rowHeight, color: rowBg })

        x = margin.left

        page.drawRectangle({ x, y: y - rowHeight, width: colNo, height: rowHeight, borderColor: border, borderWidth: 0.5 })
        const noText = String(startIdx + ti + 1)
        const noW = font.widthOfTextAtSize(noText, 7)
        await page.drawText(noText, { x: x + (colNo - noW) / 2, y: y - rowHeight + 3, size: 7, font, color: rgb(0, 0, 0) })
        x += colNo

        page.drawRectangle({ x, y: y - rowHeight, width: colName, height: rowHeight, borderColor: border, borderWidth: 0.5 })
        const nameText = t.user.name.length > 20 ? t.user.name.substring(0, 18) + '..' : t.user.name
        await page.drawText(nameText, { x: x + 2, y: y - rowHeight + 3, size: 7, font, color: rgb(0, 0, 0) })
        x += colName

        page.drawRectangle({ x, y: y - rowHeight, width: colNIP, height: rowHeight, borderColor: border, borderWidth: 0.5 })
        await page.drawText(t.nuptk || '-', { x: x + 2, y: y - rowHeight + 3, size: 7, font, color: rgb(0, 0, 0) })
        x += colNIP

        for (const dayInfo of days) {
          const cellBg = dayInfo.isWeekend ? rgb(1.0, 0.92, 0.92) : rowBg
          page.drawRectangle({ x, y: y - rowHeight, width: colDayWidth, height: rowHeight, color: cellBg })
          page.drawRectangle({ x, y: y - rowHeight, width: colDayWidth, height: rowHeight, borderColor: border, borderWidth: 0.5 })

          if (dayInfo.isWeekend) {
            const dw = font.widthOfTextAtSize('-', 6)
            await page.drawText('-', { x: x + (colDayWidth - dw) / 2, y: y - rowHeight + 3.5, size: 6, font, color: rgb(0.8, 0, 0) })
          } else {
            const att = tAtt.find(a => a.date === dayInfo.dateStr)
            if (att && att.status) {
              let symbol = ''
              let color = rgb(0, 0, 0)
              switch (att.status) {
                case 'hadir': symbol = 'H'; color = rgb(0, 0.5, 0); hadir++; break
                case 'sakit': symbol = 'S'; color = rgb(0, 0, 0.8); sakit++; break
                case 'izin': symbol = 'I'; color = rgb(0, 0, 0.8); izin++; break
                case 'alpha': symbol = 'A'; color = rgb(0.8, 0, 0); alpha++; break
              }
              if (symbol) {
                const sw = fontBold.widthOfTextAtSize(symbol, 6)
                await page.drawText(symbol, { x: x + (colDayWidth - sw) / 2, y: y - rowHeight + 3.5, size: 6, font: fontBold, color })
              }
            }
          }
          x += colDayWidth
        }

        for (const val of [hadir, sakit, izin, alpha]) {
          page.drawRectangle({ x, y: y - rowHeight, width: colSummaryWidth, height: rowHeight, borderColor: border, borderWidth: 0.5 })
          const vt = String(val)
          const vw = font.widthOfTextAtSize(vt, 7)
          await page.drawText(vt, { x: x + (colSummaryWidth - vw) / 2, y: y - rowHeight + 3, size: 7, font, color: rgb(0, 0, 0) })
          x += colSummaryWidth
        }

        y -= rowHeight
      }

      page.drawLine({ start: { x: margin.left, y }, end: { x: margin.left + contentWidth, y }, thickness: 1.5, color: border })

      if (totalPages > 1) {
        const pt = `Halaman ${pageIdx + 1} dari ${totalPages}`
        const pw = font.widthOfTextAtSize(pt, 8)
        await page.drawText(pt, { x: margin.left + (contentWidth - pw) / 2, y: margin.bottom, size: 8, font, color: rgb(0.5, 0.5, 0.5) })
      }
    }

    const pdfBytes = await pdfDoc.save()
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="absensi-guru.pdf"'
      }
    })
  } catch (error: any) {
    console.error('Error exporting teacher attendance PDF:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengunduh file absensi guru' },
      { status: 500 }
    )
  }
}