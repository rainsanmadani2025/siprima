import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  var students = await db.student.findMany({ include: { parent: { include: { user: true } }, class: true } })
  var s = students[0]
  return NextResponse.json({
    tabelMenampilkan: s.parent ? (s.parent.fatherName || s.parent.motherName || "-") : "-",
    parentNameField: s.parent ? s.parent.user.name : null,
    fatherName: s.parent ? s.parent.fatherName : null,
    motherName: s.parent ? s.parent.motherName : null,
    semuaKeyParent: s.parent ? Object.keys(s.parent) : []
  })
}