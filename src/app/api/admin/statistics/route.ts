import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get user statistics
    const totalUsers = await db.user.count()

    const totalAdmins = await db.user.count({
      where: { role: 'ADMIN' }
    })

    const totalKepsek = await db.user.count({
      where: { role: 'KEPSEK' }
    })

    const totalTeachers = await db.user.count({
      where: { role: 'GURU' }
    })

    const totalParents = await db.user.count({
      where: { role: 'ORTU' }
    })

    const activeUsers = await db.user.count({
      where: { isActive: true }
    })

    const statistics = {
      totalUsers,
      totalAdmins,
      totalKepsek,
      totalTeachers,
      totalParents,
      activeUsers
    }

    return NextResponse.json({
      success: true,
      data: statistics
    })
  } catch (error) {
    console.error('Error fetching admin statistics:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch statistics'
    }, { status: 500 })
  }
}
