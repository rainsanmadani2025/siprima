"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardList,
  Bell,
  FileText,
  TrendingUp,
  Activity,
  Loader2,
  AlertCircle
} from "lucide-react"

interface KepsekStatistics {
  totalStudents: number
  totalTeachers: number
  totalTeachersHonorer: number
  totalClasses: number
  classesA: number
  classesB: number
  attendance: {
    rate: string
    present: number
    absent: number
    total: number
  }
}

interface Announcement {
  id: string
  title: string
  content: string
  category: string
  eventDate: string | null
  priority: 'normal' | 'important' | 'urgent'
  targetAudience: string
  createdAt: string
}

interface ScheduleItem {
  time: string
  activity: string
}

const SCHOOL_SCHEDULE: ScheduleItem[] = [
  { time: "07:00 - 08:00", activity: "Apel Pagi & Upacara" },
  { time: "08:00 - 10:00", activity: "Kegiatan Pembelajaran Kelas A" },
  { time: "10:00 - 10:30", activity: "Istirahat & Makan" },
  { time: "10:30 - 12:00", activity: "Kegiatan Pembelajaran Kelas B" },
  { time: "12:00 - 13:00", activity: "Ishoma" },
  { time: "13:00 - 14:00", activity: "Doa & Pulang" },
]

export default function KepsekDashboardPage() {
  const [stats, setStats] = useState<KepsekStatistics | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [announcementsLoading, setAnnouncementsLoading] = useState(true)

  useEffect(() => {
    fetchStatistics()
    fetchAnnouncements()
  }, [])

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/dashboard/kepsek/statistics')
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements?targetAudience=kepsek')
      const data = await response.json()
      if (data.announcements) {
        setAnnouncements(data.announcements.slice(0, 4)) // Get only the latest 4
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setAnnouncementsLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'important': return 'bg-orange-500'
      case 'normal': return 'bg-yellow-500'
      default: return 'bg-blue-500'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} jam yang lalu`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} hari yang lalu`
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="kepsek" userName="Kepala Sekolah">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="kepsek" userName="Kepala Sekolah">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Kepala Sekolah</h1>
          <p className="text-muted-foreground mt-2">
            Selamat datang di Sistem Manajemen RA Insan Madani
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="card-gradient-1 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
              <p className="text-xs opacity-80 mt-1">Siswa Aktif</p>
            </CardContent>
          </Card>

          <Card className="card-gradient-2 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
              <GraduationCap className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalTeachers || 0}</div>
              <p className="text-xs opacity-80 mt-1">
                {stats?.totalTeachers || 0} tetap, {stats?.totalTeachersHonorer || 0} honorer
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient-3 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jumlah Kelas</CardTitle>
              <BookOpen className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalClasses || 0}</div>
              <p className="text-xs opacity-80 mt-1">
                {stats?.classesA || 0} Kelas A, {stats?.classesB || 0} Kelas B
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient-4 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kehadiran Hari Ini</CardTitle>
              <Activity className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.attendance.rate || '0'}%</div>
              <p className="text-xs opacity-80 mt-1">
                {stats?.attendance.present || 0} hadir, {stats?.attendance.absent || 0} izin/sakit
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access & Recent Activities */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Akses Cepat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <a
                  href="/dashboard/kepsek/guru"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Kelola Data Guru</p>
                    <p className="text-sm text-muted-foreground">Lihat dan kelola data guru</p>
                  </div>
                </a>
                <a
                  href="/dashboard/kepsek/siswa"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Kelola Data Siswa</p>
                    <p className="text-sm text-muted-foreground">Lihat dan kelola data siswa</p>
                  </div>
                </a>
                <a
                  href="/dashboard/kepsek/pembelajaran"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Monitoring Pembelajaran</p>
                    <p className="text-sm text-muted-foreground">Pantau kegiatan pembelajaran</p>
                  </div>
                </a>
                <a
                  href="/dashboard/kepsek/absensi"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Rekap Absensi</p>
                    <p className="text-sm text-muted-foreground">Lihat laporan kehadiran</p>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifikasi Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              {announcementsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                      <div className={`h-2 w-2 rounded-full ${getPriorityColor(announcement.priority)} mt-2 flex-shrink-0`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{announcement.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {announcement.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {announcement.category} • {formatTimeAgo(announcement.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm">Tidak ada notifikasi baru</p>
                </div>
              )}
              <Button variant="ghost" className="w-full mt-4" asChild>
                <a href="/dashboard/kepsek/notifikasi">
                  Lihat Semua Notifikasi
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Jadwal Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {SCHOOL_SCHEDULE.map((item, index) => (
                <div key={index} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="font-medium text-sm">{item.time}</div>
                  <div className="text-sm text-muted-foreground mt-1">{item.activity}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
