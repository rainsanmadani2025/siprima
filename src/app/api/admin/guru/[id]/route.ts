import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import * as bcrypt from 'bcryptjs'

// PATCH - Update guru
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 16 requirement)
    const { id } = await params

    const body = await request.json()
    const { username, password, name, email, phone, nuptk, birthPlace, birthDate, gender, lastEducation, employmentStatus, address, subjects, isActive, avatar, classIds } = body

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
      include: { teacherProfile: true }
    })

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        error: 'Guru not found'
      }, { status: 404 })
    }

    // Update user
    const userUpdate: any = {}
    if (name !== undefined) userUpdate.name = name
    if (email !== undefined) userUpdate.email = email
    if (phone !== undefined) userUpdate.phone = phone
    if (isActive !== undefined) userUpdate.isActive = isActive
    if (avatar !== undefined) userUpdate.avatar = avatar
    if (password) {
      // Hash password before updating
      userUpdate.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: userUpdate
    })

    // Update or create teacher profile
    const teacherData: any = {}
    if (nuptk !== undefined) teacherData.nuptk = nuptk
    if (birthPlace !== undefined) teacherData.birthPlace = birthPlace
    if (birthDate !== undefined) teacherData.birthDate = birthDate
    if (gender !== undefined) teacherData.gender = gender
    if (lastEducation !== undefined) teacherData.lastEducation = lastEducation
    if (employmentStatus !== undefined) teacherData.employmentStatus = employmentStatus
    if (address !== undefined) teacherData.address = address
    if (subjects !== undefined) teacherData.subjects = subjects

    if (existingUser.teacherProfile) {
      await db.teacher.update({
        where: { userId: id },
        data: teacherData
      })
    } else {
      await db.teacher.create({
        data: {
          userId: id,
          ...teacherData,
          employmentStatus: teacherData.employmentStatus || 'tetap',
          subjects: teacherData.subjects || ''
        }
      })
    }

    // Handle class assignments (Wali Kelas)
    if (classIds !== undefined) {
      // First, remove this teacher from all classes
      await db.class.updateMany({
        where: { teacherId: existingUser.teacherProfile?.id },
        data: { teacherId: null }
      })

      // Then, assign the teacher to selected classes
      if (classIds.length > 0 && existingUser.teacherProfile) {
        await db.class.updateMany({
          where: { id: { in: classIds } },
          data: { teacherId: existingUser.teacherProfile.id }
        })
      }
    }

    // Fetch updated data
    const result = await db.user.findUnique({
      where: { id },
      include: { teacherProfile: true }
    })

    return NextResponse.json({
      success: true,
      guru: {
        id: result!.id,
        name: result!.name,
        username: result!.username,
        email: result!.email,
        phone: result!.phone,
        avatar: result!.avatar,
        nuptk: result!.teacherProfile?.nuptk,
        birthPlace: result!.teacherProfile?.birthPlace,
        birthDate: result!.teacherProfile?.birthDate,
        gender: result!.teacherProfile?.gender,
        lastEducation: result!.teacherProfile?.lastEducation,
        employmentStatus: result!.teacherProfile?.employmentStatus,
        address: result!.teacherProfile?.address,
        subjects: result!.teacherProfile?.subjects,
        isActive: result!.isActive,
        createdAt: result!.createdAt
      }
    })
  } catch (error) {
    console.error('Error updating guru:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update guru'
    }, { status: 500 })
  }
}

// DELETE - Delete guru
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 16 requirement)
    const { id } = await params

    const existingUser = await db.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        error: 'Guru not found'
      }, { status: 404 })
    }

    await db.user.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Guru deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting guru:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete guru'
    }, { status: 500 })
  }
}
