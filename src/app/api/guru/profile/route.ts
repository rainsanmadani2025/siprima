import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Get teacher profile
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID tidak ditemukan' },
        { status: 400 }
      )
    }

    const teacher = await db.teacher.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true
          }
        }
      }
    })

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: 'Guru tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      teacher: {
        id: teacher.id,
        userId: teacher.userId,
        name: teacher.user.name,
        email: teacher.user.email,
        phone: teacher.user.phone,
        avatar: teacher.user.avatar,
        nuptk: teacher.nuptk,
        birthPlace: teacher.birthPlace,
        birthDate: teacher.birthDate,
        gender: teacher.gender,
        lastEducation: teacher.lastEducation,
        address: teacher.address,
        employmentStatus: teacher.employmentStatus,
        subjects: teacher.subjects
      }
    })
  } catch (error: any) {
    console.error('Error fetching teacher profile:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data Guru' },
      { status: 500 }
    )
  }
}

// PATCH - Update teacher profile (self-update by teacher)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, email, phone, nuptk, birthPlace, birthDate, lastEducation, address } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID diperlukan' },
        { status: 400 }
      )
    }

    // Check if teacher exists
    const teacher = await db.teacher.findUnique({
      where: { userId },
      include: { user: true }
    })

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: 'Guru tidak ditemukan' },
        { status: 404 }
      )
    }

    // Update User table
    const userUpdate: any = {}
    if (name !== undefined) userUpdate.name = name
    if (email !== undefined) userUpdate.email = email
    if (phone !== undefined) userUpdate.phone = phone

    if (Object.keys(userUpdate).length > 0) {
      await db.user.update({
        where: { id: userId },
        data: userUpdate
      })
    }

    // Update Teacher table
    const teacherUpdate: any = {}
    if (nuptk !== undefined) teacherUpdate.nuptk = nuptk
    if (birthPlace !== undefined) teacherUpdate.birthPlace = birthPlace
    if (birthDate !== undefined) teacherUpdate.birthDate = birthDate
    if (lastEducation !== undefined) teacherUpdate.lastEducation = lastEducation
    if (address !== undefined) teacherUpdate.address = address

    if (Object.keys(teacherUpdate).length > 0) {
      await db.teacher.update({
        where: { userId },
        data: teacherUpdate
      })
    }

    // Fetch updated data
    const updatedTeacher = await db.teacher.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      teacher: {
        id: updatedTeacher!.id,
        userId: updatedTeacher!.userId,
        name: updatedTeacher!.user.name,
        email: updatedTeacher!.user.email,
        phone: updatedTeacher!.user.phone,
        avatar: updatedTeacher!.user.avatar,
        nuptk: updatedTeacher!.nuptk,
        birthPlace: updatedTeacher!.birthPlace,
        birthDate: updatedTeacher!.birthDate,
        lastEducation: updatedTeacher!.lastEducation,
        address: updatedTeacher!.address
      }
    })
  } catch (error: any) {
    console.error('Error updating teacher profile:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui profil' },
      { status: 500 }
    )
  }
}
