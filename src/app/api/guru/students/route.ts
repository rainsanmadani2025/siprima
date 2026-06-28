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
    var parentRecord = await db.parent.findFirst({ where: { OR: [{ fatherName: parentId }, { motherName: parentId }] } })
    if (!parentRecord) {
      var userMatch = await db.user.findFirst({ where: { name: { contains: parentId } } })
      if (userMatch) { parentRecord = await db.parent.findFirst({ where: { userId: userMatch.id } }) }
    }
    if (!parentRecord) {
      return NextResponse.json({ success: false, error: 'Data orang tua tidak ditemukan' }, { status: 400 })
    }
    const student = await db.student.create({
      data: { nis, name, birthDate, gender, address: address || null, parentId: parentRecord.id, classId: classId || null, status: status || 'aktif' },
      include: { parent: { include: { user: true } }, class: true }
    })
    return NextResponse.json({ success: true, student: { id: student.id, name: student.name, nis: student.nis, birthDate: student.birthDate, gender: student.gender, address: student.address, parentId: student.parentId, parent: student.parent ? { id: student.parent.id, name: student.parent.user.name, fatherName: student.parent.fatherName, motherName: student.parent.motherName, fatherPhone: student.parent.fatherPhone, motherPhone: student.parent.motherPhone } : null, classId: student.classId, class: student.class ? { id: student.class.id, name: student.class.name, ageGroup: student.class.ageGroup } : null, status: student.status, createdAt: student.createdAt } })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json({ success: false, error: 'Gagal menambah siswa' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, nis, name, birthDate, gender, address, classId, status, parentName } = body
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID siswa diperlukan' }, { status: 400 })
    }
    var updateData: any = {}
    if (nis) {
      var cekNis = await db.student.findFirst({ where: { nis: nis, id: { not: id } } })
      if (cekNis) { return NextResponse.json({ success: false, error: 'NIS sudah dipakai siswa lain' }, { status: 400 }) }
      updateData.nis = nis
    }
    if (name) updateData.name = name
    if (birthDate) updateData.birthDate = birthDate
    if (gender) updateData.gender = gender
    if (address !== undefined) updateData.address = address || null
    if (classId !== undefined) updateData.classId = classId || null
    if (status) updateData.status = status
    if (parentName) {
      var parentRecord = await db.parent.findFirst({ where: { OR: [{ fatherName: parentName }, { motherName: parentName }] } })
      if (!parentRecord) {
        var userMatch = await db.user.findFirst({ where: { name: { contains: parentName } } })
        if (userMatch) { parentRecord = await db.parent.findFirst({ where: { userId: userMatch.id } }) }
      }
      if (parentRecord) {
        updateData.parentId = parentRecord.id
      }
    }
    var student = await db.student.update({ where: { id }, data: updateData, include: { parent: { include: { user: true } }, class: true } })
    return NextResponse.json({ success: true, student: { id: student.id, name: student.name, nis: student.nis, birthDate: student.birthDate, gender: student.gender, address: student.address, parentId: student.parentId, parent: student.parent ? { id: student.parent.id, name: student.parent.user.name, fatherName: student.parent.fatherName, motherName: student.parent.motherName, fatherPhone: student.parent.fatherPhone, motherPhone: student.parent.motherPhone } : null, classId: student.classId, class: student.class ? { id: student.class.id, name: student.class.name, ageGroup: student.class.ageGroup } : null, status: student.status, createdAt: student.createdAt } })
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json({ success: false, error: 'Gagal mengupdate siswa' }, { status: 500 })
  }
}