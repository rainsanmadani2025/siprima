"use client"

import { Bell, User, Moon, Sun, Clock, AlertTriangle, Info, AlertCircle, Eye, EyeOff, KeyRound } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)

  const handleChangePassword = async () => {
    setPasswordError("")

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Semua field harus diisi")
      return
    }
    if (newPassword.length < 6) {
      setPasswordError("Password baru minimal 6 karakter")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password tidak cocok")
      return
    }

    setPasswordLoading(true)
    try {
      const userId = localStorage.getItem('userId')
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, oldPassword, newPassword })
      })
      const data = await response.json()

      if (response.ok) {
        setPasswordDialogOpen(false)
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
        alert('Password berhasil diubah')
      } else {
        setPasswordError(data.error || 'Gagal mengubah password')
      }
    } catch {
      setPasswordError('Terjadi kesalahan')
    } finally {
      setPasswordLoading(false)
    }
  }

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

    const interval = setInterval(fetchNotifications, 30000)

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
                <DropdownMenuItem onClick={() => setPasswordDialogOpen(true)}>
                  <KeyRound className="mr-2 h-4 w-4" />
                  <span>Ubah Password</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                  <span className="mr-2 h-4 w-4">🚪</span>
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Ubah Password</DialogTitle>
                  <DialogDescription>Masukkan password lama dan password baru Anda</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="old-password">Password Lama</Label>
                    <div className="relative">
                      <Input
                        id="old-password"
                        type={showOldPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Masukkan password lama"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Password Baru</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ulangi password baru"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  {passwordError && (
                    <p className="text-sm text-destructive">{passwordError}</p>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>Batal</Button>
                  <Button onClick={handleChangePassword} disabled={passwordLoading}>
                    {passwordLoading ? "Menyimpan..." : "Simpan"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
    </div>
  )
}