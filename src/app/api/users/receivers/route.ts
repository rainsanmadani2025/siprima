import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get('role')
    const userId = searchParams.get('userId')

    if (!role) {
      return NextResponse.json(
        { success: false, error: 'Parameter role diperlukan' },
        { status: 400 }
      )
    }

    let receivers: Array<{ id: string; name: string; role: string }> = []

    if (role === 'GURU') {
      // Untuk GURU: dapatkan ORTU, KEPSEK, ADMIN, dan GURU lain (kecuali diri sendiri)

      // 1. Get Teacher ID from User ID
      const teacher = userId ? await db.teacher.findUnique({
        where: { userId }
      }) : null

      const teacherId = teacher?.id

      // 2. Get all parents (ORTU)
      const parents = await db.parent.findMany({
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              role: true
            }
          }
        }
      })

      parents.forEach(parent => {
        receivers.push({
          id: parent.user.id,
          name: parent.user.name,
          role: parent.user.role
        })
      })

      // 3. Get all kepsek (users with role KEPSEK) - hanya yang belum ada di receivers
      const kepsekUsers = await db.user.findMany({
        where: {
          role: 'KEPSEK',
          isActive: true,
          id: {
            notIn: receivers.map(r => r.id)
          }
        },
        select: {
          id: true,
          name: true,
          role: true
        }
      })

      kepsekUsers.forEach(k => {
        receivers.push({
          id: k.id,
          name: k.name,
          role: k.role
        })
      })

      // 4. Get all admins - hanya yang belum ada di receivers
      const admins = await db.user.findMany({
        where: {
          role: 'ADMIN',
          isActive: true,
          id: {
            notIn: receivers.map(r => r.id)
          }
        },
        select: {
          id: true,
          name: true,
          role: true
        }
      })

      admins.forEach(admin => {
        receivers.push({
          id: admin.id,
          name: admin.name,
          role: admin.role
        })
      })

      // 5. Get other teachers (kecuali diri sendiri) - hanya yang belum ada di receivers
      const teachers = await db.teacher.findMany({
        where: teacherId ? {
          id: { not: teacherId },
          user: {
            id: {
              notIn: receivers.map(r => r.id)
            }
          }
        } : {
          user: {
            id: {
              notIn: receivers.map(r => r.id)
            }
          }
        },
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              role: true
            }
          }
        }
      })

      teachers.forEach(t => {
        receivers.push({
          id: t.user.id,
          name: t.user.name,
          role: t.user.role
        })
      })

    } else if (role === 'ORTU') {
      // Untuk ORTU: dapatkan GURU, KEPSEK, ADMIN, dan ORTU lain (kecuali diri sendiri)

      // 1. Get Parent ID from User ID
      const parent = userId ? await db.parent.findUnique({
        where: { userId }
      }) : null

      const parentId = parent?.id

      // 2. Get all teachers
      const teachers = await db.teacher.findMany({
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              role: true
            }
          }
        }
      })

      teachers.forEach(t => {
        receivers.push({
          id: t.user.id,
          name: t.user.name,
          role: t.user.role
        })
      })

      // 3. Get all kepsek (users with role KEPSEK) - hanya yang belum ada di receivers
      const kepsekUsers = await db.user.findMany({
        where: {
          role: 'KEPSEK',
          isActive: true,
          id: {
            notIn: receivers.map(r => r.id)
          }
        },
        select: {
          id: true,
          name: true,
          role: true
        }
      })

      kepsekUsers.forEach(k => {
        receivers.push({
          id: k.id,
          name: k.name,
          role: k.role
        })
      })

      // 4. Get all admins - hanya yang belum ada di receivers
      const admins = await db.user.findMany({
        where: {
          role: 'ADMIN',
          isActive: true,
          id: {
            notIn: receivers.map(r => r.id)
          }
        },
        select: {
          id: true,
          name: true,
          role: true
        }
      })

      admins.forEach(admin => {
        receivers.push({
          id: admin.id,
          name: admin.name,
          role: admin.role
        })
      })

      // 5. Get other parents (kecuali diri sendiri) - hanya yang belum ada di receivers
      const parents = await db.parent.findMany({
        where: parentId ? {
          id: { not: parentId },
          user: {
            id: {
              notIn: receivers.map(r => r.id)
            }
          }
        } : {
          user: {
            id: {
              notIn: receivers.map(r => r.id)
            }
          }
        },
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              role: true
            }
          }
        }
      })

      parents.forEach(p => {
        receivers.push({
          id: p.user.id,
          name: p.user.name,
          role: p.user.role
        })
      })

    } else if (role === 'KEPSEK') {
      // Untuk KEPSEK: dapatkan GURU, ORTU, ADMIN

      // 1. Get all teachers
      const teachers = await db.teacher.findMany({
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              role: true
            }
          }
        }
      })

      teachers.forEach(t => {
        receivers.push({
          id: t.user.id,
          name: t.user.name,
          role: t.user.role
        })
      })

      // 2. Get all parents - hanya yang belum ada di receivers
      const parents = await db.parent.findMany({
        where: {
          user: {
            id: {
              notIn: receivers.map(r => r.id)
            }
          }
        },
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              role: true
            }
          }
        }
      })

      parents.forEach(p => {
        receivers.push({
          id: p.user.id,
          name: p.user.name,
          role: p.user.role
        })
      })

      // 3. Get all admins - hanya yang belum ada di receivers
      const admins = await db.user.findMany({
        where: {
          role: 'ADMIN',
          isActive: true,
          id: {
            notIn: receivers.map(r => r.id)
          }
        },
        select: {
          id: true,
          name: true,
          role: true
        }
      })

      admins.forEach(admin => {
        receivers.push({
          id: admin.id,
          name: admin.name,
          role: admin.role
        })
      })

    } else if (role === 'ADMIN') {
      // Untuk ADMIN: dapatkan semua user aktif (GURU, ORTU, KEPSEK)
      
      const users = await db.user.findMany({
        where: {
          isActive: true
        },
        select: {
          id: true,
          name: true,
          role: true
        }
      })

      users.forEach(user => {
        receivers.push({
          id: user.id,
          name: user.name,
          role: user.role
        })
      })
    }

    return NextResponse.json({
      success: true,
      receivers
    })
  } catch (error) {
    console.error('Error fetching receivers:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil daftar penerima pesan' },
      { status: 500 }
    )
  }
}
