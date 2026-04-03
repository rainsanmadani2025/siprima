"use client"

import { Moon, Sun, Bell } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

export function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left Side - Logo and App Name */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="RA Insan Madani Logo"
              width={56}
              height={56}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-lg font-bold text-foreground leading-tight">
              APLIKASI KURIKULUM PEMBELAJARAN
            </h1>
            <p className="text-sm text-muted-foreground leading-tight">
              RA INSAN MADANI
            </p>
          </div>
        </div>

        {/* Right Side - Theme Toggle and Notifications */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="hover:bg-primary/10">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <span className="mr-2 text-sm">💻</span>
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="outline" size="icon" className="hover:bg-primary/10 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full animate-pulse" />
            <span className="sr-only">Notifikasi</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
