import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
export async function GET() {
  var s = await db.student.findFirst({ include: { parent: { include: { user: true } }, class: true } })
  return NextResponse.json({ parentId: s.parentId, parentObject: { id: s.parent.id, fatherName: s.parent.fatherName, motherName: s.parent.motherName, userName: s.parent.user.name } })
}