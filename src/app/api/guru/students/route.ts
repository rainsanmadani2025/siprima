import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function findOrCreateParent(name: string) {
  if (!name || name.trim() === '') return null
  const trimmedName = name.trim()

  let parent = await db.parent.findFirst({
    where: { fatherName: trimmedName },
    include: { user: true }
  })
  if (parent) return parent

  parent = await db.parent.findFirst({
    where: { motherName: trimmedName },
    include: { user: true }
  })
  if (parent) return parent

  const allParents = await db.parent.findMany({ include: { user: true } })
  parent = allParents.find(p => p.user.name.toLowerCase() === trimmedName.toLowerCase())
  if (parent) return parent

  const newUser = await db.user.create({
    data: {
      username: `ortu_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      password: 'ortu_default_2024',
      name: trimmedName,
      role: 'ORTU',
      isActive: true
    }
  })
  const newParent = await db.parent.create({
    data: { userId: newUser.id, fatherName: trimmedName },
    include: { user: true }
  })
  return newParent
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nis, name, birthDate, gender, address, parentName, classId, status } = body
    if (!nis || !name || !birthDate || !gender || !parentName) {
      return NextResponse.json({ success: false, error: 'NIS, nama, tanggal lahir, jenis kelamin, dan nama orang tua wajib diisi' }, { status: 400 })
    }
    const existingNis = await db.student.findUnique({ where: { nis } })
    if (existingNis) {
      return NextResponse.json({ success: false, error: 'NIS sudah terdaftar' }, { status: 400 })
    }
    const parent = await findOrCreateParent(parentName)
    if (!parent) {
      return NextResponse.json({ success: false, error: 'Gagal menemukan atau membuat data orang tua' }, { status: 400 })
    }
    const student = await db.student.create({
      data: { nis, name, birthDate, gender, address, parentId: parent.id, classId: classId || null, status: status || 'aktif' },
      include: { parent: true, class: true }
    })
    return NextResponse.json({
      success: true,
      student: {
        id: student.id, name: student.name, nis: student.nis, birthDate: student.birthDate,
        gender: student.gender, address: student.address,
        parentName: student.parent?.fatherName || student.parent?.motherName || '',
        classId: student.classId, className: student.class?.name || '', classAgeGroup: student.class?.ageGroup || '',
        status: student.status
      }
    })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json({ success: false, error: 'Gagal menambah siswa' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, nis, name, birthDate, gender, address, parentName, classId, status } = body
    if (!id) return NextResponse.json({ success: false, error: 'ID siswa diperlukan' }, { status: 400 })
    const existingStudent = await db.student.findUnique({ where: { id } })
    if (!existingStudent) return NextResponse.json({ success: false, error: 'Siswa tidak ditemukan' }, { status: 404 })
    if (nis && nis !== existingStudent.nis) {
      const dup = await db.student.findUnique({ where: { nis } })
      if (dup) return NextResponse.json({ success: false, error: 'NIS sudah terdaftar' }, { status: 400 })
    }
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (nis !== undefined) updateData.nis = nis
    if (birthDate !== undefined) updateData.birthDate = birthDate
    if (gender !== undefined) updateData.gender = gender
    if (address !== undefined) updateData.address = address
    if (classId !== undefined) updateData.classId = classId || null
    if (status !== undefined) updateData.status = status
    if (parentName !== undefined && parentName.trim() !== '') {
      const parent = await findOrCreateParent(parentName)
      if (parent) updateData.parentId = parent.id
    }
    const student = await db.student.update({
      where: { id }, data: updateData,
      include: { parent: true, class: true }
    })
    return NextResponse.json({
      success: true,
      student: {
        id: student.id, name: student.name, nis: student.nis, birthDate: student.birthDate,
        gender: student.gender, address: student.address,
        parentName: student.parent?.fatherName || student.parent?.motherName || '',
        classId: student.classId, className: student.class?.name || '', classAgeGroup: student.class?.ageGroup || '',
        status: student.status
      }
    })
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json({ success: false, error: 'Gagal memperbarui siswa' }, { status: 500 })
  }
}
