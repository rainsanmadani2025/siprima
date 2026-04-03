"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Baby,
  Calendar,
  ClipboardList,
  FileText,
  BookOpen,
  Bell,
  MessageSquare,
  Download,
  CheckCircle2,
  Loader2
} from "lucide-react"

interface OrtuStatistics {
  student: {
    id: string
    name: string
    nis: string
    class: string | null
    teacherName: string | null
  }
  attendance: {
    rate: string
    present: number
    total: number
    month: string
  }
  latestAssessment: {
    aspect: string
    score: string
    date: string
  } | null
  portfolio: {
    count: number
    latest: Array<{
      title: string
      date: string
      type: string
    }>
  }
  report: {
    semester: string
    academicYear: string
    status: string
    generatedAt: Date | null
  } | null
}

interface Announcement {
  id: string
  title: string
  content: string
  category: string
  eventDate: string | null
  priority: string
  targetAudience: string
  createdAt: string
  createdBy: string | null
}

export default function OrtuDashboardPage() {
  const [stats, setStats] = useState<OrtuStatistics | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  
  // Demo student ID (in real app, this would come from authenticated user's children)
  const studentId = 'demo-student-id'

  useEffect(() => {
    fetchStatistics()
    fetchAnnouncements()
  }, [])

  const fetchStatistics = async () => {
    try {
      // Get students to find the first one (for demo purposes)
      const studentsResponse = await fetch('/api/students')
      const studentsData = await studentsResponse.json()
      
      if (studentsData.students && studentsData.students.length > 0) {
        const actualStudentId = studentsData.students[0].id
        
        const response = await fetch(`/api/dashboard/ortu/statistics?studentId=${actualStudentId}`)
        const data = await response.json()
        if (data.success) {
          setStats(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements?targetAudience=all')
      const data = await response.json()
      if (data.announcements) {
        setAnnouncements(data.announcements.slice(0, 3)) // Ambil 3 terbaru
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAspectLabel = (aspect: string) => {
    const labels: Record<string, string> = {
      'agama_moral': 'Nilai Agama & Moral',
      'fisik_motorik': 'Perkembangan Fisik Motorik',
      'kognitif': 'Perkembangan Kognitif',
      'bahasa': 'Perkembangan Bahasa',
      'sosial_emosional': 'Perkembangan Sosial Emosional',
      'seni': 'Perkembangan Seni'
    }
    return labels[aspect] || aspect
  }

  const getScoreLabel = (score: string) => {
    const labels: Record<string, string> = {
      'BB': 'Belum Berkembang',
      'MB': 'Mulai Berkembang',
      'BSH': 'Berkembang Sesuai Harapan',
      'BSB': 'Berkembang Sangat Baik'
    }
    return labels[score] || score
  }

  if (loading) {
    return (
      <DashboardLayout role="ortu" userName="Bapak/Ibu Orang Tua">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="ortu" userName="Bapak/Ibu Orang Tua">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Orang Tua</h1>
          <p className="text-muted-foreground mt-2">
            Selamat datang, Bapak/Ibu Orang Tua
          </p>
        </div>

        {/* Child Info Card */}
        <Card className="card-gradient-1 text-primary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5" />
              Data Anak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm opacity-80">Nama Lengkap</p>
                <p className="text-xl font-bold mt-1">{stats?.student.name || '-'}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">NIS</p>
                <p className="text-xl font-bold mt-1">{stats?.student.nis || '-'}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Kelas</p>
                <p className="text-xl font-bold mt-1">{stats?.student.class || '-'}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Wali Kelas</p>
                <p className="text-xl font-bold mt-1">{stats?.student.teacherName || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="card-gradient-2 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kehadiran Bulan Ini</CardTitle>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.attendance.rate || '0'}%</div>
              <p className="text-xs opacity-80 mt-1">
                {stats?.attendance.present || 0}/{stats?.attendance.total || 0} hari hadir
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient-3 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Penilaian Terbaru</CardTitle>
              <ClipboardList className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.latestAssessment ? getScoreLabel(stats.latestAssessment.score) : '-'}
              </div>
              <p className="text-xs opacity-80 mt-1">
                {stats?.latestAssessment ? getAspectLabel(stats.latestAssessment.aspect) : 'Belum ada'}
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient-4 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portofolio</CardTitle>
              <BookOpen className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.portfolio.count || 0}</div>
              <p className="text-xs opacity-80 mt-1">Karya & dokumentasi</p>
            </CardContent>
          </Card>

          <Card className="card-gradient-5 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Raport</CardTitle>
              <FileText className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.report ? 'Siap' : 'Belum'}
              </div>
              <p className="text-xs opacity-80 mt-1">
                {stats?.report ? `Semester ${stats.report.semester} ${stats.report.academicYear}` : 'Belum tersedia'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access */}
        <Card>
          <CardHeader>
            <CardTitle>Akses Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 justify-start items-start" asChild>
                <a href="/dashboard/ortu/raport">
                  <FileText className="h-5 w-5" />
                  <div className="text-left">
                    <span className="font-medium">Lihat Raport</span>
                    <p className="text-xs text-muted-foreground mt-1">Download raport anak</p>
                  </div>
                </a>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 justify-start items-start" asChild>
                <a href="/dashboard/ortu/absensi">
                  <Calendar className="h-5 w-5" />
                  <div className="text-left">
                    <span className="font-medium">Riwayat Absensi</span>
                    <p className="text-xs text-muted-foreground mt-1">Lihat kehadiran anak</p>
                  </div>
                </a>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 justify-start items-start" asChild>
                <a href="/dashboard/ortu/penilaian">
                  <ClipboardList className="h-5 w-5" />
                  <div className="text-left">
                    <span className="font-medium">Penilaian Perkembangan</span>
                    <p className="text-xs text-muted-foreground mt-1">6 aspek perkembangan</p>
                  </div>
                </a>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 justify-start items-start" asChild>
                <a href="/dashboard/ortu/portofolio">
                  <BookOpen className="h-5 w-5" />
                  <div className="text-left">
                    <span className="font-medium">Portofolio Anak</span>
                    <p className="text-xs text-muted-foreground mt-1">Karya & dokumentasi</p>
                  </div>
                </a>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 justify-start items-start" asChild>
                <a href="/dashboard/ortu/pengumuman">
                  <Bell className="h-5 w-5" />
                  <div className="text-left">
                    <span className="font-medium">Pengumuman Sekolah</span>
                    <p className="text-xs text-muted-foreground mt-1">Info kegiatan & libur</p>
                  </div>
                </a>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 justify-start items-start" asChild>
                <a href="/dashboard/ortu/komunikasi">
                  <MessageSquare className="h-5 w-5" />
                  <div className="text-left">
                    <span className="font-medium">Hubungi Sekolah</span>
                    <p className="text-xs text-muted-foreground mt-1">Kirim pesan ke guru/sekolah</p>
                  </div>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities & Announcements */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Portfolios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Portofolio Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.portfolio.latest && stats.portfolio.latest.length > 0 ? (
                  stats.portfolio.latest.map((portfolio, idx) => (
                    <div key={idx} className="flex gap-3 p-3 rounded-lg border">
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
                        🎨
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{portfolio.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{portfolio.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Belum ada portofolio
                  </p>
                )}
              </div>
              <Button variant="ghost" className="w-full mt-4" asChild>
                <a href="/dashboard/ortu/portofolio">
                  Lihat Semua Portofolio
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Pengumuman Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {announcements.length > 0 ? (
                  announcements.map((announcement) => {
                    const getPriorityColor = (priority: string) => {
                      switch (priority) {
                        case 'urgent':
                          return 'bg-red-50 dark:bg-red-950/20 border-red-200'
                        case 'important':
                          return 'bg-orange-50 dark:bg-orange-950/20 border-orange-200'
                        default:
                          return ''
                      }
                    }

                    const getPriorityIcon = (priority: string) => {
                      switch (priority) {
                        case 'urgent':
                          return <Bell className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        case 'important':
                          return <CheckCircle2 className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        default:
                          return <Calendar className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      }
                    }

                    const formatDate = (dateString: string | null) => {
                      if (!dateString) return 'Tidak ada tanggal'
                      const date = new Date(dateString)
                      return date.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                    }

                    return (
                      <div 
                        key={announcement.id} 
                        className={`p-3 rounded-lg border ${getPriorityColor(announcement.priority)}`}
                      >
                        <div className="flex items-start gap-2">
                          {getPriorityIcon(announcement.priority)}
                          <div className="flex-1">
                            <p className="font-medium text-sm">{announcement.title}</p>
                            {announcement.eventDate && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDate(announcement.eventDate)}
                              </p>
                            )}
                            {!announcement.eventDate && announcement.createdAt && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDate(announcement.createdAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Belum ada pengumuman
                  </p>
                )}
              </div>
              <Button variant="ghost" className="w-full mt-4" asChild>
                <a href="/dashboard/ortu/pengumuman">
                  Lihat Semua Pengumuman
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Download Report Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Raport Semester {stats?.report?.semester || 'Ganjil'} {stats?.report?.academicYear || '2024/2025'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {stats?.report
                    ? 'Raport perkembangan anak telah tersedia. Silakan download untuk melihat detail penilaian.'
                    : 'Raport perkembangan anak belum tersedia. Silakan tunggu hingga guru selesai membuat raport.'
                  }
                </p>
              </div>
              <Button 
                className="gap-2" 
                variant={stats?.report ? "default" : "outline"}
                disabled={!stats?.report} 
                asChild
              >
                <a href="/dashboard/ortu/raport">
                  <Download className="h-4 w-4" />
                  {stats?.report ? 'Lihat Raport' : 'Belum Tersedia'}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
