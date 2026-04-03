"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Building2,
  User,
  Users,
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  Bell,
  MessageSquare,
  LogOut,
  Settings,
  GraduationCap,
  Baby,
  ChartLine,
  Shield,
  Stethoscope
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface SidebarProps {
  role: string
  className?: string
  hideHeader?: boolean
}

const menuItems = {
  kepsek: [
    {
      title: "Dashboard",
      items: [
        { href: "/dashboard/kepsek", icon: LayoutDashboard, label: "Dashboard Utama" },
      ]
    },
    {
      title: "Data Sekolah",
      items: [
        { href: "/dashboard/kepsek/sekolah", icon: Building2, label: "Data Sekolah" },
        { href: "/dashboard/kepsek/profil", icon: User, label: "Profil Kepala Sekolah" },
      ]
    },
    {
      title: "Data Pegawai & Siswa",
      items: [
        { href: "/dashboard/kepsek/guru", icon: GraduationCap, label: "Data Guru" },
        { href: "/dashboard/kepsek/siswa", icon: Users, label: "Data Siswa" },
      ]
    },
    {
      title: "Monitoring",
      items: [
        { href: "/dashboard/kepsek/pembelajaran", icon: BookOpen, label: "Monitoring Pembelajaran" },
        { href: "/dashboard/kepsek/penilaian", icon: ClipboardList, label: "Monitoring Penilaian" },
        { href: "/dashboard/kepsek/absensi", icon: Calendar, label: "Monitoring Absensi" },
      ]
    },
    {
      title: "Laporan & Informasi",
      items: [
        { href: "/dashboard/kepsek/laporan", icon: FileText, label: "Laporan" },
        { href: "/dashboard/kepsek/pengumuman", icon: Bell, label: "Pengumuman" },
        { href: "/dashboard/kepsek/notifikasi", icon: MessageSquare, label: "Notifikasi" },
      ]
    },
  ],
  guru: [
    {
      title: "Dashboard",
      items: [
        { href: "/dashboard/guru", icon: LayoutDashboard, label: "Dashboard Utama" },
      ]
    },
    {
      title: "Data Pribadi",
      items: [
        { href: "/dashboard/guru/profil", icon: User, label: "Profil Guru" },
      ]
    },
    {
      title: "Kelas & Siswa",
      items: [
        { href: "/dashboard/guru/kelas", icon: Building2, label: "Data Kelas" },
        { href: "/dashboard/guru/siswa", icon: Users, label: "Data Siswa" },
      ]
    },
    {
      title: "Pembelajaran",
      items: [
        { href: "/dashboard/guru/perencanaan", icon: BookOpen, label: "Perencanaan Pembelajaran" },
        { href: "/dashboard/guru/absensi", icon: Calendar, label: "Absensi Siswa" },
        { href: "/dashboard/guru/penilaian", icon: ClipboardList, label: "Penilaian Perkembangan" },
        { href: "/dashboard/guru/raport", icon: FileText, label: "Raport Siswa" },
      ]
    },
    {
      title: "Portofolio & Komunikasi",
      items: [
        { href: "/dashboard/guru/portofolio", icon: FileText, label: "Portofolio Anak" },
        { href: "/dashboard/guru/komunikasi", icon: MessageSquare, label: "Komunikasi Orang Tua" },
      ]
    },
  ],
  ortu: [
    {
      title: "Dashboard",
      items: [
        { href: "/dashboard/ortu", icon: LayoutDashboard, label: "Dashboard Utama" },
      ]
    },
    {
      title: "Data Anak",
      items: [
        { href: "/dashboard/ortu/anak", icon: Baby, label: "Data Anak" },
        { href: "/dashboard/ortu/absensi", icon: Calendar, label: "Absensi" },
        { href: "/dashboard/ortu/penilaian", icon: ClipboardList, label: "Penilaian Perkembangan" },
      ]
    },
    {
      title: "Laporan & Portofolio",
      items: [
        { href: "/dashboard/ortu/raport", icon: FileText, label: "Raport Anak" },
        { href: "/dashboard/ortu/portofolio", icon: BookOpen, label: "Portofolio Anak" },
      ]
    },
    {
      title: "Informasi & Komunikasi",
      items: [
        { href: "/dashboard/ortu/pengumuman", icon: Bell, label: "Pengumuman Sekolah" },
        { href: "/dashboard/ortu/komunikasi", icon: MessageSquare, label: "Komunikasi Sekolah" },
      ]
    },
  ],
  admin: [
    {
      title: "Dashboard",
      items: [
        { href: "/dashboard/admin", icon: LayoutDashboard, label: "Dashboard Utama" },
      ]
    },
    {
      title: "Manajemen Pengguna",
      items: [
        { href: "/dashboard/admin/pengguna", icon: Users, label: "Kelola Pengguna" },
        { href: "/dashboard/admin/hak-akses", icon: Shield, label: "Hak Akses" },
      ]
    },
    {
      title: "Data Sekolah",
      items: [
        { href: "/dashboard/admin/sekolah", icon: Building2, label: "Data Sekolah" },
      ]
    },
    {
      title: "Data Pegawai & Siswa",
      items: [
        { href: "/dashboard/admin/kepsek", icon: GraduationCap, label: "Data Kepala Sekolah" },
        { href: "/dashboard/admin/guru", icon: GraduationCap, label: "Data Guru" },
        { href: "/dashboard/admin/siswa", icon: Users, label: "Data Siswa" },
        { href: "/dashboard/admin/kesehatan", icon: Stethoscope, label: "Data Kesehatan Siswa" },
      ]
    },
    {
      title: "Akademik",
      items: [
        { href: "/dashboard/admin/perencanaan", icon: BookOpen, label: "Perencanaan Pembelajaran" },
        { href: "/dashboard/admin/absensi", icon: Calendar, label: "Absensi Sekolah" },
        { href: "/dashboard/admin/pengumuman", icon: Bell, label: "Pengumuman" },
      ]
    },
    {
      title: "Pengaturan",
      items: [
        { href: "/dashboard/admin/website", icon: Settings, label: "Pengaturan Website" },
        { href: "/dashboard/admin/profil", icon: User, label: "Profil Admin" },
      ]
    }
  ]
}

export function Sidebar({ role, className, hideHeader = false }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const currentMenu = menuItems[role as keyof typeof menuItems] || []

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    router.push("/")
  }

  const getRoleTitle = (r: string) => {
    switch (r) {
      case "kepsek": return "Kepala Sekolah"
      case "guru": return "Guru"
      case "ortu": return "Orang Tua"
      case "admin": return "Admin"
      default: return "Dashboard"
    }
  }

  return (
    <div className={cn("flex flex-col h-full bg-card", className)}>
      {!hideHeader && (
        <div className="h-16 flex items-center px-6 shrink-0">
          <div className="flex items-center gap-3 w-full">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image
                src="/logo.png"
                alt="RA Insan Madani Logo"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold gradient-text leading-tight truncate">
                RA Insan Madani
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {getRoleTitle(role)}
              </p>
            </div>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
        {currentMenu.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
              {section.title}
            </h3>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </ScrollArea>

      {!hideHeader && (
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </Button>
        </div>
      )}
    </div>
  )
}
