"use client"

import { ReactNode, useEffect, useState } from "react"
import { Sidebar } from "./sidebar"
import { DashboardHeader } from "./header"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DialogTitle,
} from "@/components/ui/dialog"

interface DashboardLayoutProps {
  children: ReactNode
  role: string
  userName?: string
}

export function DashboardLayout({ children, role, userName }: DashboardLayoutProps) {
  const [storedUserName, setStoredUserName] = useState(userName || "User")
  const [isMounted, setIsMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Baca userName dari localStorage hanya setelah komponen dimount di client
    const localName = localStorage.getItem('userName')
    if (localName) {
      setStoredUserName(localName)
    }
  }, [])

  const getRoleTitle = (r: string) => {
    switch (r) {
      case "kepsek": return "Kepala Sekolah"
      case "guru": return "Guru"
      case "ortu": return "Orang Tua"
      case "admin": return "Admin"
      default: return "User"
    }
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Single Header - Logo, Title, Bell, Theme, User all in one row */}
        <header className="w-full h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
          <div className="h-full flex items-center gap-2 pl-4 pr-6 md:pl-8 md:pr-12 lg:pl-4 lg:pr-16 lg:gap-4">
            {/* Mobile Menu Button */}
            <div className="lg:hidden flex-shrink-0">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 flex flex-col">
                  <DialogTitle className="sr-only">Menu Navigasi</DialogTitle>
                  <Sidebar role={role} hideHeader={false} />
                </SheetContent>
              </Sheet>
            </div>

            {/* Left Side - Logo and Title */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="RA Insan Madani Logo"
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
              {/* Title and Subtitle - same as landing page */}
              <div className="hidden md:flex flex-col justify-center">
                <h1 className="text-sm font-bold text-foreground leading-tight">
                  APLIKASI KURIKULUM PEMBELAJARAN
                </h1>
                <p className="text-xs text-muted-foreground leading-tight">
                  RA INSAN MADANI
                </p>
              </div>
            </div>

            {/* Push content to the right */}
            <div className="flex-1 min-w-0"></div>

            {/* Right Side - Bell, Theme, User */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <DashboardHeader
                userName={isMounted ? storedUserName : (userName || "User")}
                userRole={getRoleTitle(role)}
                role={role}
                showLogo={false}
              />
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Menu Only (without header) - Desktop */}
          <aside className="hidden lg:flex lg:w-72 lg:flex-col border-r border-border bg-card shrink-0 overflow-hidden">
            <Sidebar role={role} hideHeader={true} />
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-10 lg:px-16 lg:py-12">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
