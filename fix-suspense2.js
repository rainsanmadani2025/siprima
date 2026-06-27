const fs = require("fs");

// Baca file yang rusak, ambil isi mulai dari function asli
let f1 = fs.readFileSync("src/app/dashboard/guru/perencanaan/prosem/buat/page.tsx", "utf-8");
// Cari bagian setelah "function PROSEMBuatPage() {"
let idx1 = f1.indexOf("function PROSEMBuatPage() {");
let body1 = idx1 > 0 ? f1.substring(idx1 + "function PROSEMBuatPage() {".length) : "";
// Hapus \n literal jika ada
body1 = body1.replace(/`n/g, "\n");

let header1 = `"use client"

import { useState, useEffect, Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Save, Loader2, Sparkles, Eye, FileDown, Printer } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function PROSEMBuatPageWrapper() {
  return (
    <Suspense fallback={<DashboardLayout role="guru" userName="Ibu Guru"><div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div></DashboardLayout>}>
      <PROSEMBuatPage />
    </Suspense>
  )
}

function PROSEMBuatPage() {
`;

fs.writeFileSync("src/app/dashboard/guru/perencanaan/prosem/buat/page.tsx", header1 + body1, "utf-8");
console.log("File 1 diperbaiki");

// File 2
let f2 = fs.readFileSync("src/app/dashboard/guru/portofolio/edit/page.tsx", "utf-8");
let idx2 = f2.indexOf("function EditPortofolioPage() {");
let body2 = idx2 > 0 ? f2.substring(idx2 + "function EditPortofolioPage() {".length) : "";
body2 = body2.replace(/`n/g, "\n");

let header2 = `'use client'

import { useState, useEffect, Suspense } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export default function EditPortofolioPageWrapper() {
  return (
    <Suspense fallback={<DashboardLayout role="guru" userName="Ibu Guru"><div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div></DashboardLayout>}>
      <EditPortofolioPage />
    </Suspense>
  )
}

function EditPortofolioPage() {
`;

fs.writeFileSync("src/app/dashboard/guru/portofolio/edit/page.tsx", header2 + body2, "utf-8");
console.log("File 2 diperbaiki");

// File 3
let f3 = fs.readFileSync("src/app/dashboard/guru/perencanaan/prosem/print/page.tsx", "utf-8");
let idx3 = f3.indexOf("function PROSEMPrintPage() {");
let body3 = idx3 > 0 ? f3.substring(idx3 + "function PROSEMPrintPage() {".length) : "";
body3 = body3.replace(/`n/g, "\n");

let header3 = `"use client"

import { useState, useEffect, Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Loader2, Printer, FileDown } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function PROSEMPrintPageWrapper() {
  return (
    <Suspense fallback={<DashboardLayout role="guru" userName="Ibu Guru"><div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div></DashboardLayout>}>
      <PROSEMPrintPage />
    </Suspense>
  )
}

function PROSEMPrintPage() {
`;

fs.writeFileSync("src/app/dashboard/guru/perencanaan/prosem/print/page.tsx", header3 + body3, "utf-8");
console.log("File 3 diperbaiki");
console.log("Semua selesai!");
