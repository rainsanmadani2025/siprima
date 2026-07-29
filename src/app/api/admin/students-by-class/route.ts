import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const classId = searchParams.get('classId')

    if (!classId) {
      return NextResponse.json(
        { success: false, error: 'Class ID diperlukan' },
        { status: 400 }
      )
    }

    const students = await db.student.findMany({
      where: { classId },
      include: {
        class: true,
        parent: true
      },
      orderBy: { name: 'asc' }
    })

    const formattedStudents = students.map(student => ({
      id: student.id,
      name: student.name,
      nis: student.nis,
      nisn: student.nisn,
      className: student.class.name,
      classId: student.class.id,
      parentName: student.parent?.fatherName || student.parent?.motherName || ''
    }))

    return NextResponse.json({
      success: true,
      students: formattedStudents
    })
  } catch (error) {
    console.error('Error fetching students by class:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data siswa' },
      { status: 500 }
    )
  }
}