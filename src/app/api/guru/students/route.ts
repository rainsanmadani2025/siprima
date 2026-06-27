import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST - Guru menambah siswa baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nis, name, birthDate, gender, address, parentId, classId, status } = body

    // Validasi field wajib
    if (!nis || !name || !birthDate || !gender || !parentId) {
      return NextResponse.json({
        success: false,
        error: 'NIS, nama, tanggal lahir, jenis kelamin, dan orang tua wajib diisi'
      }, { status: 400 })
    }

    // Cek duplikat NIS
    const existingNis = await db.student.findUnique({
      where: { nis }
    })

    if (existingNis) {
      return NextResponse.json({
        success: false,
        error: 'NIS sudah terdaftar'
      }, { status: 400 })
    }

    // Cek parent ada
    const parent = await db.parent.findUnique({
      where: { id: parentId }
    })

    if (!parent) {
      return NextResponse.json({
        success: false,
        error: 'Data orang tua tidak ditemukan'
      }, { status: 400 })
    }

    // Buat siswa baru
    const student = await db.student.create({
      data: {
        nis,
        name,
        birthDate,
        gender,
        address: address || null,
        parentId,
        classId: classId || null,
        status: status || 'aktif'
      },
      include: {
        parent: {
          include: {
            user: {
              select: { name: true, phone: true }
            }
          }
        },
        class: true
      }
    })

    return NextResponse.json({
      success: true,
      student
    })
  } catch (error: any) {
    console.error('Error creating student:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Gagal menambahkan siswa'
    }, { status: 500 })
  }
}
