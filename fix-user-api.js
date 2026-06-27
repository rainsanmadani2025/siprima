const fs = require("fs");

const file = "src/app/api/admin/users/[id]/route.ts";
let content = fs.readFileSync(file, "utf-8");

// Perbaiki: jangan kirim email/phone kosong ke database
const oldCode = `    // Build update data object
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (role !== undefined) updateData.role = role
    if (isActive !== undefined) updateData.isActive = isActive
    if (password) updateData.password = password // In production, hash this!`;

const newCode = `    // Build update data object
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined && email !== "") updateData.email = email || null
    if (phone !== undefined && phone !== "") updateData.phone = phone || null
    if (role !== undefined) updateData.role = role
    if (isActive !== undefined) updateData.isActive = isActive
    if (password && password.trim() !== "") {
      const bcrypt = require("bcryptjs");
      updateData.password = bcrypt.hashSync(password, 10);
    }`;

content = content.replace(oldCode, newCode);
fs.writeFileSync(file, content, "utf-8");
console.log("File diperbaiki: " + file);
