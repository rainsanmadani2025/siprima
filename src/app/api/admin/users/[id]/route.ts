import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { username, password, name, email, phone, role, isActive } = body

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    // Check if username is being changed and if new username exists
    if (username && username !== existingUser.username) {
      const duplicateUsername = await db.user.findUnique({
        where: { username }
      })

      if (duplicateUsername) {
        return NextResponse.json({
          success: false,
          error: 'Username already exists'
        }, { status: 400 })
      }
    }

    // Check if email is being changed and if new email exists
    if (email && email !== existingUser.email) {
      const duplicateEmail = await db.user.findUnique({
        where: { email }
      })

      if (duplicateEmail) {
        return NextResponse.json({
          success: false,
          error: 'Email already exists'
        }, { status: 400 })
      }
    }

    // Build update data object
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined && email !== "") updateData.email = email || null
    if (phone !== undefined && phone !== "") updateData.phone = phone || null
    if (role !== undefined) updateData.role = role
    if (isActive !== undefined) updateData.isActive = isActive
    if (password && password.trim() !== "") {
      const bcrypt = require("bcryptjs");
      updateData.password = bcrypt.hashSync(password, 10);
    }

    // Update user
    const user = await db.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update user'
    }, { status: 500 })
  }
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    // Delete user (this will cascade to related profiles)
    await db.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete user'
    }, { status: 500 })
  }
}
