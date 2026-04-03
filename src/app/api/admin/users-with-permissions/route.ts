import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch users with permissions
export async function GET() {
  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        isActive: true
      }
    })

    // Default permissions based on role
    const usersWithPermissions = users.map(user => {
      let permissions = {
        manageUsers: false,
        manageSchool: false,
        manageStudents: false,
        manageTeachers: false,
        manageAnnouncements: false,
        manageAttendance: false
      }

      switch (user.role) {
        case 'ADMIN':
          permissions = {
            manageUsers: true,
            manageSchool: true,
            manageStudents: true,
            manageTeachers: true,
            manageAnnouncements: true,
            manageAttendance: true
          }
          break
        case 'KEPSEK':
          permissions = {
            manageUsers: false,
            manageSchool: true,
            manageStudents: true,
            manageTeachers: true,
            manageAnnouncements: true,
            manageAttendance: true
          }
          break
        case 'GURU':
          permissions = {
            manageUsers: false,
            manageSchool: false,
            manageStudents: false,
            manageTeachers: false,
            manageAnnouncements: true,
            manageAttendance: true
          }
          break
        case 'ORTU':
          permissions = {
            manageUsers: false,
            manageSchool: false,
            manageStudents: false,
            manageTeachers: false,
            manageAnnouncements: false,
            manageAttendance: false
          }
          break
      }

      return {
        ...user,
        permissions
      }
    })

    return NextResponse.json({
      success: true,
      users: usersWithPermissions
    })
  } catch (error) {
    console.error('Error fetching users with permissions:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch users with permissions'
    }, { status: 500 })
  }
}
