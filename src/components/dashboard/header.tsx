"use client"

import { Bell, User, Moon, Sun, Clock, AlertTriangle, Info, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"

interface DashboardHeaderProps {
  userName?: string
  userRole?: string
  role?: string
  showLogo?: boolean
  title?: string
}

interface NotificationItem {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

export function DashboardHeader({ userName = "User", userRole = "User", role = "user", showLogo = false, title = "Dashboard" }: DashboardHeaderProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(null)

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    router.push("/")
  }

  const handleProfileClick = () => {
    const profilePage = role === 'admin' ? '/dashboard/admin/profil' :
                          role === 'ortu' ? '/dashboard/ortu/profil' :
                          role === 'guru' ? '/dashboard/guru/profil' :
                          role === 'kepsek' ? '/dashboard/kepsek/profil' :
                          '/dashboard/profil'
    router.push(profilePage)
  }

  const fetchNotifications = useCallback(async () => {
    const userId = localStorage.getItem('userId')
    if (!userId) return

    try {
      const response = await fetch(`/api/notifications?userId=${userId}&isRead=false&limit=5`)
      const data = await response.json()
      if (data.success) {
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    const userId = localStorage.getItem('userId')
    if (!userId) return

    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isRead: true })
      })
      setUnreadCount(0)
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (error) {
      console.error('Error marking notifications as read:', error)
    }
  }, [])

  const fetchAvatar = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) return

      const response = await fetch(`/api/user/avatar?userId=${userId}`)
      const data = await response.json()
      if (data.success && data.avatar) {
        setAvatar(data.avatar)
      }
    } catch (error) {
      console.error('Error fetching avatar:', error)
    }
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true)
    })
    fetchNotifications()
    fetchAvatar()

    // Polling setiap 30 detik untuk cek notifikasi baru
    const interval = setInterval(fetchNotifications, 30000)

    // Listen for avatar update event
    const handleAvatarUpdate = (event: CustomEvent) => {
      setAvatar(event.detail.avatar)
    }

    window.addEventListener('avatarUpdated', handleAvatarUpdate as EventListener)

    return () => {
      clearInterval(interval)
      window.removeEventListener('avatarUpdated', handleAvatarUpdate as EventListener)
    }
  }, [fetchNotifications])

  const handleNotificationOpenChange = (open: boolean) => {
    setNotificationOpen(open)
    // Ketika popover dibuka, langsung mark all as read
    if (open && unreadCount > 0) {
      markAllAsRead()
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Hari ini'
    if (diffDays === 1) return 'Kemarin'
    if (diffDays <= 7) return `${diffDays} hari lalu`

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Popover open={notificationOpen} onOpenChange={handleNotificationOpenChange}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0" align="end">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Notifikasi</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs text-red-500 font-medium">{unreadCount} belum dibaca</span>
                    )}
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 hover:bg-muted transition-colors block cursor-pointer"
                          onClick={() => {
                            const announcementPage = role === 'ortu' ? '/dashboard/ortu/pengumuman' :
                                                    role === 'guru' ? '/dashboard/guru/pengumuman' :
                                                    role === 'admin' ? '/dashboard/admin/pengumuman' :
                                                    '/dashboard/kepsek/pengumuman'
                            setNotificationOpen(false)
                            router.push(announcementPage)
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getTypeIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium line-clamp-1">{notification.title}</p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(notification.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Tidak ada notifikasi baru</p>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t bg-muted/50">
                  <Button
                    variant="ghost"
                    className="w-full text-sm"
                    onClick={() => {
                      const announcementPage = role === 'ortu' ? '/dashboard/ortu/pengumuman' :
                                            role === 'guru' ? '/dashboard/guru/pengumuman' :
                                            role === 'admin' ? '/dashboard/admin/pengumuman' :
                                            '/dashboard/kepsek/pengumuman'
                      setNotificationOpen(false)
                      router.push(announcementPage)
                    }}
                  >
                    Lihat Semua Pengumuman
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground overflow-hidden">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">{userName}</span>
                    <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                  <span className="mr-2 h-4 w-4">🚪</span>
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
    </div>
  )
}