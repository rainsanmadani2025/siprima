import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  var parents = await db.parent.findMany({ include: { user: true } })
  var hasil = parents.map(function(p) {
    return { id: p.id, userName: p.user.name, fatherName: p.fatherName, motherName: p.motherName, fatherPhone: p.fatherPhone, motherPhone: p.motherPhone }
  })
  return NextResponse.json({ total: hasil.length, parents: hasil })
}