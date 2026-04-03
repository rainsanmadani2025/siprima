import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const semester = searchParams.get('semester')
    const tahunAjaran = searchParams.get('tahunAjaran')
    const search = searchParams.get('search')

    // Build SQL query
    let query = `
      SELECT id, tema, subtema, temaProjek, judulKegiatan, pokokBahasan,
             fase, kelompokUsia, semester, tahunAjaran, hari, jumlahPertemuan,
             kelas, guru, namaSekolah, alamatSekolah, createdAt, updatedAt
      FROM RPP
      WHERE 1=1
    `
    const params: any[] = []

    if (semester) {
      query += ' AND semester = ?'
      params.push(semester)
    }
    if (tahunAjaran) {
      query += ' AND tahunAjaran = ?'
      params.push(tahunAjaran)
    }
    if (search) {
      query += ' AND (tema LIKE ? OR subtema LIKE ? OR judulKegiatan LIKE ?)'
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    query += ' ORDER BY createdAt DESC'

    // Execute raw query
    const results = await (db as any).$queryRawUnsafe(query, ...params)

    // Convert BigInt to string if needed
    const rpps = results.map((r: any) => ({
      ...r,
      id: String(r.id)
    }))

    return NextResponse.json({
      success: true,
      rpps
    })
  } catch (error: any) {
    console.error('Error fetching RPP list:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil daftar RPP' },
      { status: 500 }
    )
  }
}
