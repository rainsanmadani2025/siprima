import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reportId = searchParams.get('reportId')

    if (!reportId) {
      return NextResponse.json({ error: 'Report ID diperlukan' }, { status: 400 })
    }

    // Ambil data raport yang sudah dipublish
    const report = await db.studentReport.findUnique({
      where: { id: reportId },
      include: {
        student: {
          include: {
            class: true,
            parent: {
              include: {
                user: { select: { name: true } }
              }
            }
          }
        }
      }
    })

    if (!report) {
      return NextResponse.json({ error: 'Raport tidak ditemukan' }, { status: 404 })
    }

    if (report.status !== 'published') {
      return NextResponse.json({ error: 'Raport belum dipublikasikan' }, { status: 403 })
    }

    const student = report.student
    const parentName = student.parent?.user?.name || student.parent?.fatherName || ''

    // Ambil data sekolah
    const school = await db.school.findFirst()

    // Ambil data guru (teacher dari kelas siswa)
    const teacherData = student.class?.teacherId
      ? await db.teacher.findUnique({
          where: { id: student.class.teacherId },
          include: { user: { select: { name: true } } }
        })
      : null

    // Ambil data kepala sekolah
    const kepsekUser = await db.user.findFirst({
      where: { role: 'KEPSEK', isActive: true }
    })
    const kepsekTeacher = kepsekUser
      ? await db.teacher.findUnique({
          where: { userId: kepsekUser.id }
        })
      : null

    // Ambil raw assessment data untuk siswa ini (semester & tahun ajaran yang sama)
    const assessments = await db.studentAssessment.findMany({
      where: {
        studentId: student.id,
        semester: { equals: report.semester, mode: 'insensitive' },
        academicYear: report.academicYear
      },
      include: {
        teacher: {
          include: { user: { select: { name: true } } }
        }
      },
      orderBy: { date: 'desc' }
    })

    // Group assessments by aspect
    const groupedAssessments: Record<string, any> = {}
    assessments.forEach((a) => {
      // Simpan hanya assessment terbaru per aspek
      if (!groupedAssessments[a.aspect]) {
        groupedAssessments[a.aspect] = {
          aspect: a.aspect,
          score: a.score,
          notes: a.notes || '',
          observation: a.observation || '',
          documentation: a.documentation,
          date: a.date,
          teacherName: a.teacher?.user?.name || 'Guru'
        }
      }
    })

    // Ambil data absensi
    const attendanceRecords = await db.studentAttendance.findMany({
      where: {
        studentId: student.id
      }
    })
    const sakit = attendanceRecords.filter(a => a.status === 'sakit').length
    const izin = attendanceRecords.filter(a => a.status === 'izin').length
    const alpa = attendanceRecords.filter(a => a.status === 'alpha').length

    // Parse photos dari catatan_perkembangan
    let photos: string[] = []
    const catatanDoc = groupedAssessments['catatan_perkembangan']?.documentation
    if (catatanDoc) {
      try {
        const docParsed = JSON.parse(catatanDoc)
        if (Array.isArray(docParsed.photos)) {
          photos = docParsed.photos
        }
      } catch {}
    }

    // Build period label
    const semesterLabel = report.semester === 'ganjil' ? 'Ganjil' : 'Genap'

    const pdfPayload = {
      studentName: student.name,
      studentNis: student.nis,
      studentNisn: '',
      parentName,
      className: student.class?.name || '',
      period: semesterLabel,
      periodLabel: `Semester ${semesterLabel} ${report.academicYear}`,
      semester: semesterLabel,
      academicYear: report.academicYear,
      schoolName: school?.name || 'RA INSAN MADANI',
      schoolAddress: school?.address || '',
      teacherName: teacherData?.user?.name || 'Guru',
      teacherNip: teacherData?.nuptk || '',
      principalName: kepsekUser?.name || 'Kepala Sekolah',
      principalNip: kepsekTeacher?.nuptk || '',
      assessments: groupedAssessments,
      attendance: { sakit, izin, alpa },
      educatorNotes: report.teacherNotes || '',
      photos
    }

    return NextResponse.json({ success: true, data: pdfPayload })
  } catch (error) {
    console.error('Error fetching raport PDF data:', error)
    return NextResponse.json({ success: false, error: 'Gagal memuat data' }, { status: 500 })
  }
}