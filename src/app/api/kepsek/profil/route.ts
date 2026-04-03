import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Get kepsek profile (only for authenticated kepsek)
export async function GET(request: NextRequest) {
  try {
    // For now, we'll get the first kepsek user
    // In production, you should use session/auth to get the logged-in user
    const kepsek = await db.user.findFirst({
      where: { role: 'KEPSEK', isActive: true },
      include: {
        teacherProfile: true
      }
    })

    if (!kepsek) {
      return NextResponse.json({
        success: false,
        error: 'Kepala sekolah tidak ditemukan'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: kepsek.id,
        name: kepsek.name,
        username: kepsek.username,
        email: kepsek.email,
        phone: kepsek.phone,
        nuptk: kepsek.teacherProfile?.nuptk,
        birthPlace: kepsek.teacherProfile?.birthPlace,
        birthDate: kepsek.teacherProfile?.birthDate,
        gender: kepsek.teacherProfile?.gender,
        lastEducation: kepsek.teacherProfile?.lastEducation,
        address: kepsek.teacherProfile?.address,
        avatar: kepsek.avatar,
        isActive: kepsek.isActive,
        createdAt: kepsek.createdAt
      }
    })
  } catch (error) {
    console.error('Error fetching kepsek profile:', error)
    return NextResponse.json({
      success: false,
      error: 'Gagal memuat profil kepala sekolah'
    }, { status: 500 })
  }
}

// PUT - Update kepsek profile (only for authenticated kepsek)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, nuptk, birthPlace, birthDate, gender, lastEducation, address, avatar, password } = body

    // Get the kepsek user (for now, get the first active kepsek)
    const kepsek = await db.user.findFirst({
      where: { role: 'KEPSEK', isActive: true },
      include: {
        teacherProfile: true
      }
    })

    if (!kepsek) {
      return NextResponse.json({
        success: false,
        error: 'Kepala sekolah tidak ditemukan'
      }, { status: 404 })
    }

    // Update user data
    const updateData: any = {
      name,
      email,
      phone,
    }

    // Only update avatar if provided
    if (avatar !== undefined) {
      updateData.avatar = avatar
    }

    // Only update password if provided
    if (password && password.trim() !== '') {
      updateData.password = password // In production, hash this!
    }

    const updatedUser = await db.user.update({
      where: { id: kepsek.id },
      data: updateData,
      include: {
        teacherProfile: true
      }
    })

    // Update or create teacher profile
    if (kepsek.teacherProfile) {
      // Update existing profile
      await db.teacher.update({
        where: { id: kepsek.teacherProfile.id },
        data: {
          nuptk,
          birthPlace,
          birthDate,
          gender,
          lastEducation,
          address
        }
      })
    } else {
      // Create new teacher profile if doesn't exist
      await db.user.update({
        where: { id: kepsek.id },
        data: {
          teacherProfile: {
            create: {
              nuptk,
              birthPlace,
              birthDate,
              gender,
              lastEducation,
              address,
              employmentStatus: 'tetap',
              subjects: ''
            }
          }
        }
      })
    }

    // Fetch updated data
    const finalUser = await db.user.findFirst({
      where: { id: kepsek.id },
      include: {
        teacherProfile: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: {
        id: finalUser!.id,
        name: finalUser!.name,
        username: finalUser!.username,
        email: finalUser!.email,
        phone: finalUser!.phone,
        nuptk: finalUser!.teacherProfile?.nuptk,
        birthPlace: finalUser!.teacherProfile?.birthDate,
        gender: finalUser!.teacherProfile?.gender,
        lastEducation: finalUser!.teacherProfile?.lastEducation,
        address: finalUser!.teacherProfile?.address,
        avatar: finalUser!.avatar,
        isActive: finalUser!.isActive,
        createdAt: finalUser!.createdAt
      }
    })
  } catch (error) {
    console.error('Error updating kepsek profile:', error)
    return NextResponse.json({
      success: false,
      error: 'Gagal memperbarui profil'
    }, { status: 500 })
  }
}
