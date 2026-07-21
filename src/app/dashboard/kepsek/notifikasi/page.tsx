"use client"

import { useState, useEffect, useCallback } from 'react'
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, CheckCircle2, Clock, X, Filter, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Notification {
  id: string
  userId: string
  userName: string
  userRole: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

export default function KepsekNotifikasiPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')
  const [filterStatus, setFilterStatus] = useState('semua')
  const [filterType, setFilterType] = useState('semua')

  // Load userId from localStorage
  useEffect(() => {
    setUserId(localStorage.getItem('userId') || '')
  }, [])

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!userId) return
    try {
      setLoading(true)
      const params = new URLSearchParams({ userId })
      if (filterStatus === 'unread') params.set('isRead', 'false')
      if (filterStatus === 'read') params.set('isRead', 'true')
      if (filterType !== 'semua') params.set('type', filterType)

      const response = await fetch(`/api/notifications?${params}`)
      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [userId, filterStatus, filterType])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Mark as read
  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id], isRead: true })
      })
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      )
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id)
    if (unreadIds.length === 0) return

    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: unreadIds, isRead: true })
      })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  // Delete notification (remove from UI only, optional)
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Statistics
  const totalCount = notifications.length
  const unreadCount = notifications.filter(n => !n.isRead).length
  const alertCount = notifications.filter(n => n.type === 'alert' && !n.isRead).length
  const readCount = notifications.filter(n => n.isRead).length

  // Type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'alert':
        return <Badge variant="destructive">Alert</Badge>
      case 'warning':
        return <Badge className="bg-orange-600 hover:bg-orange-700">Warning</Badge>
      default:
        return <Badge variant="secondary">Info</Badge>
    }
  }

  // Type style
  const getTypeStyle = (type: string, isRead: boolean) => {
    if (isRead) return 'flex gap-3 p-4 rounded-lg border opacity-70'

    switch (type) {
      case 'alert':
        return 'flex gap-3 p-4 rounded-lg border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20'
      case 'warning':
        return 'flex gap-3 p-4 rounded-lg border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20'
      default:
        return 'flex gap-3 p-4 rounded-lg border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20'
    }
  }

  // Type icon
  const getTypeIcon = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-green-600'

    switch (type) {
      case 'alert':
        return 'bg-red-600'
      case 'warning':
        return 'bg-orange-600'
      default:
        return 'bg-blue-600'
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Baru saja'
    if (diffMins < 60) return `${diffMins} menit yang lalu`
    if (diffHours < 24) return `${diffHours} jam yang lalu`
    if (diffDays < 7) return `${diffDays} hari yang lalu`

    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <DashboardLayout role="kepsek" userName="Kepala Sekolah">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifikasi Sistem</h1>
            <p className="text-muted-foreground mt-2">Pemberitahuan dan alert dari sistem</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchNotifications}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Tandai Semua Dibaca
            </Button>
          </div>
        </div>

        {/* Statistik */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notifikasi</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Bulan ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Belum Dibaca</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Perlu diperhatikan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alert Penting</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{alertCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Memerlukan tindakan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sudah Dibaca</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{readCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Sudah ditindaklanjuti</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Daftar Notifikasi
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua">Semua Status</SelectItem>
                    <SelectItem value="unread">Belum Dibaca</SelectItem>
                    <SelectItem value="read">Sudah Dibaca</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua">Semua Tipe</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Tidak ada notifikasi</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div key={notif.id} className={getTypeStyle(notif.type, notif.isRead)}>
                    <div className={`h-10 w-10 rounded-full ${getTypeIcon(notif.type, notif.isRead)} flex items-center justify-center text-white flex-shrink-0`}>
                      {notif.isRead ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : notif.type === 'alert' ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : notif.type === 'warning' ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : (
                        <Bell className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-medium text-sm ${notif.isRead ? 'line-through' : ''}`}>
                          {notif.title}
                        </h4>
                        {getTypeBadge(notif.type)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notif.message}
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        {formatDate(notif.createdAt)}
                      </p>
                      {!notif.isRead && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => markAsRead(notif.id)}>
                            Tandai Dibaca
                          </Button>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                      onClick={() => dismissNotification(notif.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}