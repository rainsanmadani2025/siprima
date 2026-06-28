import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function findOrCreateParent(name: string) {
  if (!name || name.trim() === '') return null
  const trimmedName = name.trim()
  let parent = await db.parent.findFirst({ where: { fatherName: trimmedName }, include: { user: true } })
  if (parent) return parent
  parent = await db.parent.findFirst({ where: { motherName: trimmedName }, include: { user: true } })
  if (parent) return parent
  const allParents = await db.parent.findMany({ include: { user: true } })
  parent = allParents.find(p => p.user.name.toLowerCase() === trimmedName.toLowerCase())
  if (parent) return parent
  const newUser = await db.user.create({
    data: { username: `ortu_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, password: 'ortu_default_2024', name: trimmedName, role: 'ORTU', isActive: true }
  })
  return await db.parent.create({ data: { userId: newUser.id, fatherName: trimmedName }, include: { user: true } })
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const student = await db.student.findUnique({ where: { id }, include: { parent: { include: { user: true } }, class: true } })
    if (!student) return NextResponse.json({ success: false, error: 'Siswa tidak ditemukan' }, { status: 404 })
    let parsedHealthData = null, parsedImmunization = null
    try { parsedHealthData = student.healthData ? JSON.parse(student.healthData) : null } catch (e) { parsedHealthData = student.healthData }
    try { parsedImmunization = student.immunization ? JSON.parse(student.immunization) : null } catch (e) { parsedImmunization = student.immunization }
    return NextResponse.json({
      success: true, student: {
        id: student.id, name: student.name, nis: student.nis, birthDate: student.birthDate, gender: student.gender, address: student.address,
        parentId: student.parentId,
        parent: student.parent ? { id: student.parent.id, name: student.parent.fatherName || student.parent.motherName || student.parent.user.name, fatherName: student.parent.fatherName, motherName: student.parent.motherName } : null,
        classId: student.classId, class: student.class ? { id: student.class.id, name: student.class.name, ageGroup: student.class.ageGroup } : null,
        status: student.status, healthData: parsedHealthData, immunization: parsedImmunization, createdAt: student.createdAt
      }
    })
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json({ success: false, error: 'Gagal mengambil data siswa' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { nis, name, birthDate, gender, address, parentName, classId, status } = body
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
    if (classId !== undefined) updateData.classId = classId
    if (status !== undefined) updateData.status = status
    if (parentName !== undefined && parentName.trim() !== '') {
      const parent = await findOrCreateParent(parentName)
      if (parent) updateData.parentId = parent.id
    }
    const student = await db.student.update({ where: { id }, data: updateData, include: { parent: { include: { user: true } }, class: true } })
    return NextResponse.json({
      success: true, student: {
        id: student.id, name: student.name, nis: student.nis, birthDate: student.birthDate, gender: student.gender, address: student.address,
        parentId: student.parentId,
        parent: student.parent ? { id: student.parent.id, name: student.parent.fatherName || student.parent.motherName || student.parent.user.name } : null,
        classId: student.classId, class: student.class ? { id: student.class.id, name: student.class.name, ageGroup: student.class.ageGroup } : null,
        status: student.status, createdAt: student.createdAt
      }
    })
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json({ success: false, error: 'Failed to update student' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const existing = await db.student.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 })
    await db.student.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Student deleted successfully' })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete student' }, { status: 500 })
  }
}
