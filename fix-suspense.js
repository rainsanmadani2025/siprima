const fs = require("fs");
const path = require("path");

const fixes = [
  {
    file: "src/app/dashboard/guru/perencanaan/prosem/buat/page.tsx",
    oldImport: 'import { useState, useEffect } from "react"',
    newImport: 'import { useState, useEffect, Suspense } from "react"',
    oldExport: 'export default function PROSEMBuatPage() {',
    newExport: `export default function PROSEMBuatPageWrapper() {
  return (
    <Suspense fallback={<DashboardLayout role="guru" userName="Ibu Guru"><div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div></DashboardLayout>}>
      <PROSEMBuatPage />
    </Suspense>
  )
}

function PROSEMBuatPage() {`
  },
  {
    file: "src/app/dashboard/guru/portofolio/edit/page.tsx",
    oldImport: "import { useState, useEffect } from 'react'",
    newImport: "import { useState, useEffect, Suspense } from 'react'",
    oldExport: "export default function EditPortofolioPage() {",
    newExport: `export default function EditPortofolioPageWrapper() {
  return (
    <Suspense fallback={<DashboardLayout role="guru" userName="Ibu Guru"><div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div></DashboardLayout>}>
      <EditPortofolioPage />
    </Suspense>
  )
}

function EditPortofolioPage() {`
  },
  {
    file: "src/app/dashboard/guru/perencanaan/prosem/print/page.tsx",
    oldImport: 'import { useState, useEffect } from "react"',
    newImport: 'import { useState, useEffect, Suspense } from "react"',
    oldExport: "export default function PROSEMPrintPage() {",
    newExport: `export default function PROSEMPrintPageWrapper() {
  return (
    <Suspense fallback={<DashboardLayout role="guru" userName="Ibu Guru"><div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div></DashboardLayout>}>
      <PROSEMPrintPage />
    </Suspense>
  )
}

function PROSEMPrintPage() {`
  }
];

for (const fix of fixes) {
  let content = fs.readFileSync(fix.file, "utf-8");
  content = content.replace(fix.oldImport, fix.newImport);
  content = content.replace(fix.oldExport, fix.newExport);
  fs.writeFileSync(fix.file, content, "utf-8");
  console.log("Diperbaiki: " + fix.file);
}
console.log("Semua selesai!");
