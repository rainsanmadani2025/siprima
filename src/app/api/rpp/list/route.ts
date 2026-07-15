import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const semester = searchParams.get('semester')
    const tahunAjaran = searchParams.get('tahunAjaran')
    const search = searchParams.get('search')
    const teacherId = searchParams.get('teacherId')

    const where: Prisma.RPPWhereInput = {}

    if (teacherId) {
      where.teacherId = teacherId
    }
    if (semester) {
      where.semester = semester
    }
    if (tahunAjaran) {
      where.tahunAjaran = tahunAjaran
    }
    if (search) {
      where.OR = [
        { tema: { contains: search, mode: 'insensitive' } },
        { subtema: { contains: search, mode: 'insensitive' } },
        { judulKegiatan: { contains: search, mode: 'insensitive' } }
      ]
    }

    const rpps = await db.rPP.findMany({
      where,
      select: {
        id: true, teacherId: true, tema: true, subtema: true,
        temaProjek: true, judulKegiatan: true, pokokBahasan: true,
        fase: true, kelompokUsia: true, semester: true, tahunAjaran: true,
        hari: true, jumlahPertemuan: true, kelas: true, guru: true,
        namaSekolah: true, alamatSekolah: true, createdAt: true, updatedAt: true,
        teacher: {
          select: {
            user: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const rppsWithTeacher = rpps.map((r: any) => ({
      ...r,
      teacherName: r.teacher?.user?.name || r.guru || '-'
    }))

    return NextResponse.json({ success: true, rpps: rppsWithTeacher })
  } catch (error: any) {
    console.error('Error fetching RPP list:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil daftar RPP' },
      { status: 500 }
    )
  }
}