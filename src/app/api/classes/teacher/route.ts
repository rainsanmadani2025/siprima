import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/classes/teacher?userId=xxx - Get classes for a specific teacher
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      )
    }

    // Get teacherId from userId
    const teacher = await db.teacher.findUnique({
      where: {
        userId: userId
      },
      select: {
        id: true,
        user: {
          select: {
            name: true
          }
        }
      }
    })

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: 'Teacher not found' },
        { status: 404 }
      )
    }

    // Get all classes (for table)
    const allClasses = await db.class.findMany({
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

    // Get teacher's classes (for statistics)
    const teacherClasses = await db.class.findMany({
      where: {
        teacherId: teacher.id
      },
      include: {
        _count: {
          select: {
            students: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      teacherId: teacher.id,
      teacherName: teacher.user.name,
      allClasses: allClasses.map(cls => ({
        id: cls.id,
        name: cls.name,
        ageGroup: cls.ageGroup,
        capacity: cls.capacity,
        teacherId: cls.teacherId,
        teacherName: cls.teacher?.user.name || null,
        studentCount: cls._count.students,
        isMyClass: cls.teacherId === teacher.id
      })),
      teacherClasses: teacherClasses.map(cls => ({
        id: cls.id,
        name: cls.name,
        ageGroup: cls.ageGroup,
        capacity: cls.capacity,
        studentCount: cls._count.students
      }))
    })
  } catch (error) {
    console.error('Error fetching teacher classes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch teacher classes' },
      { status: 500 }
    )
  }
}
