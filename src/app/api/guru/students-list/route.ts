import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID tidak ditemukan' },
        { status: 400 }
      )
    }

    // Get teacher ID from user ID
    const teacher = await db.teacher.findUnique({
      where: { userId }
    })

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: 'Guru tidak ditemukan' },
        { status: 404 }
      )
    }

    // Get all students for this teacher's classes
    const students = await db.student.findMany({
      where: {
        class: {
          teacherId: teacher.id
        }
      },
      include: {
        class: true,
        parent: true
      },
      orderBy: {
        name: 'asc'
      }
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
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data siswa' },
      { status: 500 }
    )
  }
}
