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

export async function GET() {
  try {
    const students = await db.student.findMany({ include: { parent: { include: { user: true } }, class: true }, orderBy: { createdAt: 'desc' } })
    const studentList = students.map(s => ({
      id: s.id, name: s.name, nis: s.nis, birthDate: s.birthDate, gender: s.gender, address: s.address,
      parentId: s.parentId,
      parent: s.parent ? { id: s.parent.id, name: s.parent.fatherName || s.parent.motherName || s.parent.user.name } : null,
      classId: s.classId, class: s.class ? { id: s.class.id, name: s.class.name, ageGroup: s.class.ageGroup } : null,
      status: s.status, createdAt: s.createdAt
    }))
    return NextResponse.json({ success: true, students: studentList })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch students' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nis, name, birthDate, gender, address, parentName, classId, status } = body
    if (!nis || !name || !birthDate || !gender || !parentName) {
      return NextResponse.json({ success: false, error: 'NIS, nama, tanggal lahir, jenis kelamin, dan nama orang tua wajib diisi' }, { status: 400 })
    }
    const existingNis = await db.student.findUnique({ where: { nis } })
    if (existingNis) return NextResponse.json({ success: false, error: 'NIS sudah terdaftar' }, { status: 400 })
    const parent = await findOrCreateParent(parentName)
    if (!parent) return NextResponse.json({ success: false, error: 'Gagal menemukan atau membuat data orang tua' }, { status: 400 })
    const student = await db.student.create({
      data: { nis, name, birthDate, gender, address, parentId: parent.id, classId: classId || null, status: status || 'aktif' },
      include: { parent: { include: { user: true } }, class: true }
    })
    return NextResponse.json({
      success: true,
      student: {
        id: student.id, name: student.name, nis: student.nis, birthDate: student.birthDate, gender: student.gender, address: student.address,
        parentId: student.parentId,
        parent: student.parent ? { id: student.parent.id, name: student.parent.fatherName || student.parent.motherName || student.parent.user.name } : null,
        classId: student.classId, class: student.class ? { id: student.class.id, name: student.class.name, ageGroup: student.class.ageGroup } : null,
        status: student.status, createdAt: student.createdAt
      }
    })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json({ success: false, error: 'Failed to create student' }, { status: 500 })
  }
}
