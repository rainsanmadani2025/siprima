import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    const where: any = {}
    if (userId) {
      where.userId = userId
    }

    const parent = await db.parent.findFirst({
      where,
      include: {
        children: {
          include: { class: true }
        }
      }
    })

    if (!parent) {
      return NextResponse.json({ success: true, children: [] }, { status: 200 })
    }

    const childrenWithParsedData = parent.children.map(child => ({
      ...child,
      healthData: child.healthData ? JSON.parse(child.healthData) : null,
      immunization: child.immunization ? JSON.parse(child.immunization) : []
    }))

    return NextResponse.json({
      success: true,
      children: childrenWithParsedData.map(c => ({
        id: c.id,
        name: c.name,
        nis: c.nis,
        className: c.class?.name || '-'
      }))
    })
  } catch (error) {
    console.error('Error fetching children:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data anak' },
      { status: 500 }
    )
  }
}