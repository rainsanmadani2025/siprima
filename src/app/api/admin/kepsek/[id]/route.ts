import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH - Update kepsek
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 16 requirement)
    const { id } = await params

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID is required'
      }, { status: 400 })
    }

    const body = await request.json()
    const { username, password, name, email, phone, nuptk, birthPlace, birthDate, gender, lastEducation, address, isActive, avatar } = body

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
      include: { teacherProfile: true }
    })

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        error: 'Kepala sekolah not found'
      }, { status: 404 })
    }

    // Update user
    const userUpdate: any = {}
    if (name !== undefined) userUpdate.name = name
    if (email !== undefined) userUpdate.email = email
    if (phone !== undefined) userUpdate.phone = phone
    if (isActive !== undefined) userUpdate.isActive = isActive
    if (avatar !== undefined) userUpdate.avatar = avatar
    if (password) userUpdate.password = password

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
    if (address !== undefined) teacherData.address = address

    if (existingUser.teacherProfile) {
      await db.teacher.update({
        where: { userId: id },
        data: teacherData
      })
    } else {
      await db.teacher.create({
        data: {
          userId: id,
          nuptk,
          birthPlace,
          birthDate,
          gender,
          lastEducation,
          address,
          employmentStatus: 'tetap',
          subjects: ''
        }
      })
    }

    // Fetch updated data
    const result = await db.user.findUnique({
      where: { id },
      include: { teacherProfile: true }
    })

    return NextResponse.json({
      success: true,
      kepsek: {
        id: result!.id,
        name: result!.name,
        username: result!.username,
        email: result!.email,
        phone: result!.phone,
        nuptk: result!.teacherProfile?.nuptk,
        birthPlace: result!.teacherProfile?.birthPlace,
        birthDate: result!.teacherProfile?.birthDate,
        gender: result!.teacherProfile?.gender,
        lastEducation: result!.teacherProfile?.lastEducation,
        address: result!.teacherProfile?.address,
        avatar: result!.avatar,
        isActive: result!.isActive,
        createdAt: result!.createdAt
      }
    })
  } catch (error: any) {
    console.error('=== ERROR UPDATING KEPSEK ===')
    console.error('Error details:', error)
    console.error('Error message:', error?.message)
    console.error('Error code:', error?.code)
    console.error('Error meta:', error?.meta)
    console.error('Full error object:', JSON.stringify(error, null, 2))

    // Determine specific error message
    let errorMessage = 'Failed to update kepsek'
    if (error?.code === 'P2002') {
      errorMessage = 'NUPTK sudah digunakan oleh user lain'
    } else if (error?.code === 'P2025') {
      errorMessage = 'Data yang diperbarui tidak ditemukan'
    } else if (error?.message) {
      errorMessage = error.message
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE - Delete kepsek
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
        error: 'Kepala sekolah not found'
      }, { status: 404 })
    }

    await db.user.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Kepala sekolah deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting kepsek:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete kepsek'
    }, { status: 500 })
  }
}
