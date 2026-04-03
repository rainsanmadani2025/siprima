import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const classes = await db.class.findMany({
      include: {
        teacher: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            students: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      classes: classes.map(cls => ({
        id: cls.id,
        name: cls.name,
        ageGroup: cls.ageGroup,
        capacity: cls.capacity,
        teacherId: cls.teacherId,
        teacherName: cls.teacher?.user.name || null,
        studentCount: cls._count.students
      }))
    })
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}
