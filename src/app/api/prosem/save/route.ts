import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, tahunAjaran, semester, mingguan } = body

    // Get teacher (first one for now)
    const teacher = await db.teacher.findFirst()

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: 'Teacher not found' },
        { status: 404 }
      )
    }

    // Validate required fields
    if (!tahunAjaran || !semester || !mingguan) {
      return NextResponse.json(
        { success: false, error: 'Data tidak lengkap. Mohon isi semua field yang diperlukan.' },
        { status: 400 }
      )
    }

    const mingguanStr = typeof mingguan === 'string' ? mingguan : JSON.stringify(mingguan)

    let prosem

    if (id) {
      // Update existing PROSEM
      await (db as any).$queryRawUnsafe(
        'UPDATE Prosem SET tahunAjaran = ?, semester = ?, mingguan = ?, updatedAt = ? WHERE id = ?',
        tahunAjaran, semester, mingguanStr, new Date(), id
      )

      // Get updated record
      const results = await (db as any).$queryRawUnsafe(
        'SELECT id, teacherId, tahunAjaran, semester, mingguan, createdAt, updatedAt FROM Prosem WHERE id = ?',
        id
      )
      prosem = {
        ...results[0],
        id: String(results[0].id),
        teacherId: String(results[0].teacherId)
      }
    } else {
      // Create new PROSEM
      const newId = crypto.randomUUID()
      const now = new Date()

      await (db as any).$queryRawUnsafe(
        'INSERT INTO Prosem (id, teacherId, tahunAjaran, semester, mingguan, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        newId, teacher.id, tahunAjaran, semester, mingguanStr, now, now
      )

      prosem = {
        id: newId,
        teacherId: teacher.id,
        tahunAjaran,
        semester,
        mingguan: mingguanStr,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      }
    }

    return NextResponse.json({
      success: true,
      prosem
    })
  } catch (error: any) {
    console.error('Error saving PROSEM:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menyimpan PROSEM' },
      { status: 500 }
    )
  }
}
