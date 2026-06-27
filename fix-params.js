const fs = require("fs");

const file = "src/app/api/admin/users/[id]/route.ts";
let content = fs.readFileSync(file, "utf-8");

// Ganti params jadi Promise dan await
content = content.replace(
  /\{ params \}: \{ params: \{ id: string \} \}/g,
  "{ params }: { params: Promise<{ id: string }> }"
);

// Tambah await params di awal fungsi PATCH
content = content.replace(
  "const { username, password, name, email, phone, role, isActive } = body",
  "const { id } = await params\n    const { username, password, name, email, phone, role, isActive } = body"
);

// Ganti semua params.id jadi id
content = content.replace(/params\.id/g, "id");

fs.writeFileSync(file, content, "utf-8");
console.log("File diperbaiki");
