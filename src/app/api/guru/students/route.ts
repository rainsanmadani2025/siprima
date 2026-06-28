import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nis, name, birthDate, gender, address, parentId, classId, status } = body
    if (!nis || !name || !birthDate || !gender || !parentId) {
      return NextResponse.json({ success: false, error: 'Field wajib: NIS, nama, tanggal lahir, jenis kelamin, orang tua' }, { status: 400 })
    }
    const existingNis = await db.student.findUnique({ where: { nis } })
    if (existingNis) {
      return NextResponse.json({ success: false, error: 'NIS sudah terdaftar' }, { status: 400 })
    }
    const existingParent = await db.parent.findUnique({ where: { id: parentId } })
    if (!existingParent) {
      return NextResponse.json({ success: false, error: 'Data orang tua tidak ditemukan' }, { status: 400 })
    }
    const student = await db.student.create({
      data: { nis, name, birthDate, gender, address: address || null, parentId, classId: classId || null, status: status || 'aktif' },
      include: { parent: { include: { user: true } }, class: true }
    })
    return NextResponse.json({
      success: true,
      student: {
        id: student.id, name: student.name, nis: student.nis, birthDate: student.birthDate,
        gender: student.gender, address: student.address, parentId: student.parentId,
        parent: student.parent ? {
          id: student.parent.id, name: student.parent.user.name,
          fatherName: student.parent.fatherName, motherName: student.parent.motherName,
          fatherPhone: student.parent.fatherPhone, motherPhone: student.parent.motherPhone
        } : null,
        classId: student.classId,
        class: student.class ? { id: student.class.id, name: student.class.name, ageGroup: student.class.ageGroup } : null,
        status: student.status, createdAt: student.createdAt
      }
    })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json({ success: false, error: 'Gagal menambah siswa' }, { status: 500 })
  }
}