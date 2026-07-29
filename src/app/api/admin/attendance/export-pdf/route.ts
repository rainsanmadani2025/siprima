import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { db } from '@/lib/db'

const fontSizes = {
  schoolName: 14,
  title: 11,
  subtitle: 10,
  section: 12,
  tableHeader: 8,
  tableContent: 7
}

const colors = {
  headerBg: rgb(0.7, 0.8, 0.95),
  oddRowBg: rgb(0.95, 0.95, 0.98),
  holidayBg: rgb(1.0, 0.92, 0.92),
  border: rgb(0.3, 0.3, 0.3),
  text: rgb(0, 0, 0)
}

const pageWidth = 841.89 // A4 Landscape
const pageHeight = 595.28
const margin = { left: 25, right: 25, top: 25, bottom: 25 }
const contentWidth = pageWidth - margin.left - margin.right

const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { classId, month } = body

    if (!classId || !month) {
      return NextResponse.json(
        { success: false, error: 'Class ID dan Bulan diperlukan' },
        { status: 400 }
      )
    }

    // Get class info
    const classData = await db.class.findUnique({
      where: { id: classId },
      include: {
        teacher: {
          include: { user: { select: { name: true } } }
        }
      }
    })

    if (!classData) {
      return NextResponse.json(
        { success: false, error: 'Kelas tidak ditemukan' },
        { status: 404 }
      )
    }

    // Get students
    const students = await db.student.findMany({
      where: { classId },
      orderBy: { name: 'asc' }
    })

    // Get attendance for all students in this class for the month
    const allAttendance = await db.studentAttendance.findMany({
      where: {
        date: { startsWith: month }
      },
      include: { student: true }
    })

    // Filter only students in this class
    const classAttendance = allAttendance.filter(a => a.student.classId === classId)

    // Get school info
    const school = await db.school.findFirst()

    const [yearNum, monthNum] = month.split('-').map(Number)
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate()

    // Generate day data
    const days: { day: number; dateStr: string; dayName: string; isWeekend: boolean; isHoliday: boolean }[] = []
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(yearNum, monthNum - 1, d)
      const dateStr = `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const dow = date.getDay()
      const isWeekend = dow === 0 || dow === 6

      const holidayRecord = classAttendance.find(a => a.date === dateStr && a.isHoliday)

      days.push({
        day: d,
        dateStr,
        dayName: dayNames[dow],
        isWeekend,
        isHoliday: !!holidayRecord
      })
    }

    // Build PDF
    const pdfDoc = await PDFDocument.create()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    // Calculate columns
    const colNo = 35
    const colName = 100
    const colNIS = 65
    const remainingWidth = contentWidth - colNo - colName - colNIS - 80
    const colDayWidth = remainingWidth / daysInMonth
    const colSummaryWidth = 16

    // Check if we need multiple pages
    const headerHeight = 90
    const subHeaderHeight = 22
    const rowHeight = 14
    const maxRowsPerPage = Math.floor((pageHeight - margin.top - margin.bottom - headerHeight - subHeaderHeight - 40) / rowHeight)
    const totalStudents = students.length
    const totalPages = Math.ceil(totalStudents / maxRowsPerPage)

    for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
      const page = pdfDoc.addPage([pageWidth, pageHeight])

      const startStudent = pageIdx * maxRowsPerPage
      const endStudent = Math.min(startStudent + maxRowsPerPage, totalStudents)
      const pageStudents = students.slice(startStudent, endStudent)

      // ===== HEADER =====
      let y = pageHeight - margin.top

      // School name
      if (school) {
        const schoolNameText = school.name.toUpperCase()
        const schoolNameWidth = fontBold.widthOfTextAtSize(schoolNameText, fontSizes.schoolName)
        await page.drawText(schoolNameText, {
          x: margin.left + (contentWidth - schoolNameWidth) / 2,
          y,
          size: fontSizes.schoolName,
          font: fontBold,
          color: colors.text
        })
        y -= 14
      }

      // Title
      const titleText = `REKAPITULASI ABSENSI SISWA`
      const titleWidth = fontBold.widthOfTextAtSize(titleText, fontSizes.title)
      await page.drawText(titleText, {
        x: margin.left + (contentWidth - titleWidth) / 2,
        y,
        size: fontSizes.title,
        font: fontBold,
        color: colors.text
      })
      y -= 12

      // Subtitle
      const subtitleText = `Kelas: ${classData.name} | Bulan: ${monthNames[monthNum - 1]} ${yearNum} | Wali Kelas: ${classData.teacher?.user.name || '-'}`
      await page.drawText(subtitleText, {
        x: margin.left + (contentWidth - font.widthOfTextAtSize(subtitleText, fontSizes.subtitle)) / 2,
        y,
        size: fontSizes.subtitle,
        font: font,
        color: colors.text
      })
      y -= 8

      // Underline
      page.drawLine({
        start: { x: margin.left, y },
        end: { x: margin.left + contentWidth, y },
        thickness: 1.5,
        color: colors.border
      })
      y -= 12

      // ===== TABLE HEADER =====
      const headerY = y
      let x = margin.left

      // No column
      page.drawRectangle({ x, y: y - rowHeight - 4, width: colNo, height: rowHeight + 4, color: colors.headerBg })
      page.drawRectangle({ x, y: y - rowHeight - 4, width: colNo, height: rowHeight + 4, borderColor: colors.border, borderWidth: 0.5 })
      await page.drawText('No.', { x: x + 2, y: y - rowHeight + 1, size: fontSizes.tableHeader, font: fontBold, color: colors.text })
      x += colNo

      // Name column
      page.drawRectangle({ x, y: y - rowHeight - 4, width: colName, height: rowHeight + 4, color: colors.headerBg })
      page.drawRectangle({ x, y: y - rowHeight - 4, width: colName, height: rowHeight + 4, borderColor: colors.border, borderWidth: 0.5 })
      await page.drawText('Nama Siswa', { x: x + 2, y: y - rowHeight + 1, size: fontSizes.tableHeader, font: fontBold, color: colors.text })
      x += colName

      // NIS column
      page.drawRectangle({ x, y: y - rowHeight - 4, width: colNIS, height: rowHeight + 4, color: colors.headerBg })
      page.drawRectangle({ x, y: y - rowHeight - 4, width: colNIS, height: rowHeight + 4, borderColor: colors.border, borderWidth: 0.5 })
      await page.drawText('NIS', { x: x + 2, y: y - rowHeight + 1, size: fontSizes.tableHeader, font: fontBold, color: colors.text })
      x += colNIS

      // Day columns
      for (const dayInfo of days) {
        const bgColor = dayInfo.isWeekend ? colors.holidayBg : colors.headerBg
        page.drawRectangle({ x, y: y - rowHeight - 4, width: colDayWidth, height: rowHeight + 4, color: bgColor })
        page.drawRectangle({ x, y: y - rowHeight - 4, width: colDayWidth, height: rowHeight + 4, borderColor: colors.border, borderWidth: 0.5 })
        const dayLabel = String(dayInfo.day)
        const dw = fontBold.widthOfTextAtSize(dayLabel, fontSizes.tableHeader)
        await page.drawText(dayLabel, { x: x + (colDayWidth - dw) / 2, y: y - rowHeight + 1, size: fontSizes.tableHeader, font: fontBold, color: colors.text })
        x += colDayWidth
      }

      // Summary columns: H, S, I, A
      const summaryLabels = ['H', 'S', 'I', 'A']
      for (const label of summaryLabels) {
        page.drawRectangle({ x, y: y - rowHeight - 4, width: colSummaryWidth, height: rowHeight + 4, color: colors.headerBg })
        page.drawRectangle({ x, y: y - rowHeight - 4, width: colSummaryWidth, height: rowHeight + 4, borderColor: colors.border, borderWidth: 0.5 })
        const lw = fontBold.widthOfTextAtSize(label, fontSizes.tableHeader)
        await page.drawText(label, { x: x + (colSummaryWidth - lw) / 2, y: y - rowHeight + 1, size: fontSizes.tableHeader, font: fontBold, color: colors.text })
        x += colSummaryWidth
      }

      y -= rowHeight + 4

      // ===== TABLE ROWS =====
      for (let si = 0; si < pageStudents.length; si++) {
        const student = pageStudents[si]
        const studentAttendance = classAttendance.filter(a => a.studentId === student.id)
        const rowY = y

        let hadirCount = 0, sakitCount = 0, izinCount = 0, alphaCount = 0

        const isRowOdd = si % 2 === 1
        const rowBg = isRowOdd ? colors.oddRowBg : rgb(1, 1, 1)

        x = margin.left

        // Row background
        page.drawRectangle({
          x: margin.left,
          y: rowY - rowHeight,
          width: contentWidth,
          height: rowHeight,
          color: rowBg
        })

        // No
        page.drawRectangle({ x, y: rowY - rowHeight, width: colNo, height: rowHeight, borderColor: colors.border, borderWidth: 0.5 })
        const noText = String(startStudent + si + 1)
        const noW = font.widthOfTextAtSize(noText, fontSizes.tableContent)
        await page.drawText(noText, { x: x + (colNo - noW) / 2, y: rowY - rowHeight + 3, size: fontSizes.tableContent, font, color: colors.text })
        x += colNo

        // Name
        page.drawRectangle({ x, y: rowY - rowHeight, width: colName, height: rowHeight, borderColor: colors.border, borderWidth: 0.5 })
        const nameText = student.name.length > 18 ? student.name.substring(0, 16) + '..' : student.name
        await page.drawText(nameText, { x: x + 2, y: rowY - rowHeight + 3, size: fontSizes.tableContent, font, color: colors.text })
        x += colName

        // NIS
        page.drawRectangle({ x, y: rowY - rowHeight, width: colNIS, height: rowHeight, borderColor: colors.border, borderWidth: 0.5 })
        await page.drawText(student.nis, { x: x + 2, y: rowY - rowHeight + 3, size: fontSizes.tableContent, font, color: colors.text })
        x += colNIS

        // Day columns
        for (const dayInfo of days) {
          const cellBg = dayInfo.isWeekend ? colors.holidayBg : (dayInfo.isHoliday ? colors.holidayBg : rowBg)
          page.drawRectangle({ x, y: rowY - rowHeight, width: colDayWidth, height: rowHeight, color: cellBg })
          page.drawRectangle({ x, y: rowY - rowHeight, width: colDayWidth, height: rowHeight, borderColor: colors.border, borderWidth: 0.5 })

          if (dayInfo.isWeekend) {
            const dashW = font.widthOfTextAtSize('-', 6)
            await page.drawText('-', { x: x + (colDayWidth - dashW) / 2, y: rowY - rowHeight + 3.5, size: 6, font, color: rgb(0.8, 0, 0) })
          } else if (dayInfo.isHoliday) {
            const lW = fontBold.widthOfTextAtSize('L', 6)
            await page.drawText('L', { x: x + (colDayWidth - lW) / 2, y: rowY - rowHeight + 3.5, size: 6, font: fontBold, color: rgb(0.8, 0, 0) })
          } else {
            const att = studentAttendance.find(a => a.date === dayInfo.dateStr)
            if (att && att.status) {
              let symbol = ''
              let color = colors.text
              switch (att.status) {
                case 'hadir':
                  symbol = 'H'
                  color = rgb(0, 0.5, 0)
                  hadirCount++
                  break
                case 'sakit':
                  symbol = 'S'
                  color = rgb(0, 0, 0.8)
                  sakitCount++
                  break
                case 'izin':
                  symbol = 'I'
                  color = rgb(0, 0, 0.8)
                  izinCount++
                  break
                case 'alpha':
                  symbol = 'A'
                  color = rgb(0.8, 0, 0)
                  alphaCount++
                  break
              }
              if (symbol) {
                const sW = fontBold.widthOfTextAtSize(symbol, 6)
                await page.drawText(symbol, { x: x + (colDayWidth - sW) / 2, y: rowY - rowHeight + 3.5, size: 6, font: fontBold, color })
              }
            }
          }
          x += colDayWidth
        }

        // Summary columns
        const summaryValues = [hadirCount, sakitCount, izinCount, alphaCount]
        for (const val of summaryValues) {
          page.drawRectangle({ x, y: rowY - rowHeight, width: colSummaryWidth, height: rowHeight, borderColor: colors.border, borderWidth: 0.5 })
          const valText = String(val)
          const vw = font.widthOfTextAtSize(valText, fontSizes.tableContent)
          await page.drawText(valText, { x: x + (colSummaryWidth - vw) / 2, y: rowY - rowHeight + 3, size: fontSizes.tableContent, font, color: colors.text })
          x += colSummaryWidth
        }

        y -= rowHeight
      }

      // Bottom border
      page.drawLine({
        start: { x: margin.left, y },
        end: { x: margin.left + contentWidth, y },
        thickness: 1.5,
        color: colors.border
      })

      // Page number
      if (totalPages > 1) {
        const pageText = `Halaman ${pageIdx + 1} dari ${totalPages}`
        const pw = font.widthOfTextAtSize(pageText, 8)
        await page.drawText(pageText, {
          x: margin.left + (contentWidth - pw) / 2,
          y: margin.bottom,
          size: 8,
          font,
          color: rgb(0.5, 0.5, 0.5)
        })
      }
    }

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save()

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="absensi-siswa.pdf"'
      }
    })
  } catch (error: any) {
    console.error('Error exporting attendance PDF:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengunduh file absensi' },
      { status: 500 }
    )
  }
}