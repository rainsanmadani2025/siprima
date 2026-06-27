const fs = require("fs");

// Perbaiki PATCH route
const patchFile = "src/app/api/admin/users/[id]/route.ts";
let patchContent = fs.readFileSync(patchFile, "utf-8");

patchContent = `import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

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
        error: 'User tidak ditemukan'
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
          error: 'Username sudah digunakan'
        }, { status: 400 })
      }
    }

    // Check if email is being changed and if new email exists
    if (email && email.trim() !== '' && email !== existingUser.email) {
      const duplicateEmail = await db.user.findUnique({
        where: { email: email.trim() }
      })

      if (duplicateEmail) {
        return NextResponse.json({
          success: false,
          error: 'Email sudah digunakan'
        }, { status: 400 })
      }
    }

    // Build update data object
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined && email.trim() !== '') updateData.email = email.trim() || null
    if (phone !== undefined && phone.trim() !== '') updateData.phone = phone.trim() || null
    if (role !== undefined) updateData.role = role
    if (isActive !== undefined) updateData.isActive = isActive
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10)
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
  } catch (error: any) {
    console.error('Error updating user:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Gagal mengupdate pengguna'
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
        error: 'User tidak ditemukan'
      }, { status: 404 })
    }

    // Delete user (this will cascade to related profiles)
    await db.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Pengguna berhasil dihapus'
    })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Gagal menghapus pengguna'
    }, { status: 500 })
  }
}
`;

fs.writeFileSync(patchFile, patchContent, "utf-8");
console.log("PATCH route diperbaiki");

// Perbaiki POST route
const postFile = "src/app/api/admin/users/route.ts";
if (fs.existsSync(postFile)) {
  let postContent = fs.readFileSync(postFile, "utf-8");
  
  // Ganti password plain text jadi hash
  if (postContent.includes("password: body.password") && !postContent.includes("bcrypt.hash")) {
    // Tambah import bcrypt
    if (!postContent.includes("import bcrypt")) {
      postContent = postContent.replace(
        "import { db } from '@/lib/db'",
        "import { db } from '@/lib/db'\nimport bcrypt from 'bcryptjs'"
      );
    }
    // Ganti password plain text
    postContent = postContent.replace(
      /password: body\.password/g,
      "password: await bcrypt.hash(body.password, 10)"
    );
    // Tambah async kalau belum
    if (!postContent.includes("async function POST")) {
      postContent = postContent.replace(
        "export function POST",
        "export async function POST"
      );
    }
    fs.writeFileSync(postFile, postContent, "utf-8");
    console.log("POST route diperbaiki");
  } else {
    console.log("POST route sudah OK atau tidak ditemukan masalah");
  }
}

console.log("Semua selesai!");
