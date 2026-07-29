import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const teachers = await db.teacher.findMany({
      include: {
        user: {
          select: { name: true }
        }
      },
      orderBy: {
        user: { name: 'asc' }
      }
    })

    const formattedTeachers = teachers.map(teacher => ({
      id: teacher.id,
      name: teacher.user.name,
      nuptk: teacher.nuptk,
      subjects: teacher.subjects
    }))

    return NextResponse.json({
      success: true,
      teachers: formattedTeachers
    })
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data guru' },
      { status: 500 }
    )
  }
}