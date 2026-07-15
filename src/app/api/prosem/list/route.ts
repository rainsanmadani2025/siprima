import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const semester = searchParams.get('semester')
    const tahunAjaran = searchParams.get('tahunAjaran')

    const teacher = await db.teacher.findFirst()

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: 'Teacher not found' },
        { status: 404 }
      )
    }

    const where: Prisma.ProsemWhereInput = {
      teacherId: teacher.id
    }

    if (semester) {
      where.semester = semester
    }
    if (tahunAjaran) {
      where.tahunAjaran = tahunAjaran
    }

    const prosems = await db.prosem.findMany({
      where,
      select: {
        id: true,
        teacherId: true,
        tahunAjaran: true,
        semester: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, prosems })
  } catch (error: any) {
    console.error('Error fetching PROSEM list:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil daftar PROSEM' },
      { status: 500 }
    )
  }
}