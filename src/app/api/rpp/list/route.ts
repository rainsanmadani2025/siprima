import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const semester = searchParams.get('semester')
    const tahunAjaran = searchParams.get('tahunAjaran')
    const search = searchParams.get('search')

    const where: any = {}

    if (semester) {
      where.semester = semester
    }
    if (tahunAjaran) {
      where.tahunAjaran = tahunAjaran
    }
    if (search) {
      where.OR = [
        { tema: { contains: search } },
        { subtema: { contains: search } },
        { judulKegiatan: { contains: search } }
      ]
    }

    const rpps = await db.rPP.findMany({
      where,
      select: {
        id: true,
        tema: true,
        subtema: true,
        temaProjek: true,
        judulKegiatan: true,
        pokokBahasan: true,
        fase: true,
        kelompokUsia: true,
        semester: true,
        tahunAjaran: true,
        hari: true,
        jumlahPertemuan: true,
        kelas: true,
        guru: true,
        namaSekolah: true,
        alamatSekolah: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, rpps })
  } catch (error: any) {
    console.error('Error fetching RPP list:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil daftar RPP' },
      { status: 500 }
    )
  }
}