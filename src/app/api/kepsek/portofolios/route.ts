import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Ambil semua portfolio untuk kepsek (bisa filter per kelas dan tipe)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const classId = searchParams.get('classId')
    const type = searchParams.get('type') // karya/foto/video

    const where: any = {}

    if (classId) {
      where.student = {
        classId: classId
      }
    }

    if (type) {
      where.type = type
    }

    const portfolios = await db.portfolio.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            nis: true,
            class: {
              select: {
                id: true,
                name: true,
                ageGroup: true,
                teacher: {
                  select: {
                    id: true,
                    user: {
                      select: {
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Get all classes for filter dropdown
    const classes = await db.class.findMany({
      select: {
        id: true,
        name: true,
        ageGroup: true,
        teacher: {
          select: {
            id: true,
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

    return NextResponse.json({ success: true, portfolios, classes })
  } catch (error) {
    console.error('Error fetching kepsek portfolios:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data portofolio' },
      { status: 500 }
    )
  }
}