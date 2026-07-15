import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, tahunAjaran, semester, mingguan } = body

    const teacher = await db.teacher.findFirst()

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: 'Teacher not found' },
        { status: 404 }
      )
    }

    if (!tahunAjaran || !semester || !mingguan) {
      return NextResponse.json(
        { success: false, error: 'Data tidak lengkap. Mohon isi semua field yang diperlukan.' },
        { status: 400 }
      )
    }

    const mingguanStr = typeof mingguan === 'string' ? mingguan : JSON.stringify(mingguan)

    let prosem

    if (id) {
      prosem = await db.prosem.update({
        where: { id },
        data: {
          tahunAjaran,
          semester,
          mingguan: mingguanStr
        }
      })
    } else {
      prosem = await db.prosem.create({
        data: {
          teacherId: teacher.id,
          tahunAjaran,
          semester,
          mingguan: mingguanStr
        }
      })
    }

    return NextResponse.json({ success: true, prosem })
  } catch (error: any) {
    console.error('Error saving PROSEM:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menyimpan PROSEM' },
      { status: 500 }
    )
  }
}