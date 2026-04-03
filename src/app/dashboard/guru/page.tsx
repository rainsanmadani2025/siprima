"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Loader2
} from "lucide-react"

interface GuruStatistics {
  students: {
    total: number
    present: number
    izin: number
    sakit: number
    alpha: number
    attendanceRate: string
  }
  rpp: {
    total: number
    latest: any
    theme: string | null
    subTheme: string | null
    createdAt: string | null
  }
  rpph: {
    today: string
    theme: string | null
    subTheme: string | null
    status: string
  }
  assessments: {
    progress: string
    assessed: number
    total: number
  }
}

interface StudentAttendance {
  name: string
  status: string
  note?: string
}

export default function GuruDashboardPage() {
  const [stats, setStats] = useState<GuruStatistics | null>(null)
  const [studentsAttendance, setStudentsAttendance] = useState<StudentAttendance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
      const url = userId ? `/api/dashboard/guru/statistics?userId=${userId}` : '/api/dashboard/guru/statistics'
      
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
        await fetchStudentsAttendance()
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentsAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null

      const response = await fetch(`/api/student-attendance?date=${today}`)
      const data = await response.json()

      if (data.success && data.data) {
        // Get student names - filter by teacherId to only show students taught by this teacher
        let studentsUrl = '/api/students'
        if (userId) {
          studentsUrl += `?teacherId=${userId}`
        }
        const studentsResponse = await fetch(studentsUrl)
        const studentsData = await studentsResponse.json()

        const attendanceMap: Record<string, StudentAttendance> = {}
        data.data.forEach((attendance: any) => {
          const student = studentsData.students?.find((s: any) => s.id === attendance.studentId)
          if (student) {
            attendanceMap[student.id] = {
              name: student.name,
              status: attendance.status,
              note: attendance.notes || undefined
            }
          }
        })

        // Add students without attendance today
        studentsData.students?.forEach((student: any) => {
          if (!attendanceMap[student.id]) {
            attendanceMap[student.id] = {
              name: student.name,
              status: 'belum'
            }
          }
        })

        setStudentsAttendance(Object.values(attendanceMap).slice(0, 10))
      }
    } catch (error) {
      console.error('Error fetching students attendance:', error)
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="guru" userName="Ibu Guru">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="guru" userName="Ibu Guru">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Guru</h1>
          <p className="text-muted-foreground mt-2">
            Selamat datang, Ibu Guru
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="card-gradient-1 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Siswa</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.students.total || 0}</div>
              <p className="text-xs opacity-80 mt-1">Siswa Kelas</p>
            </CardContent>
          </Card>

          <Card className="card-gradient-2 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">RPP Dibuat</CardTitle>
              <BookOpen className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.rpp.total || 0}</div>
              <p className="text-xs opacity-80 mt-1">
                Total RPP tersimpan
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient-3 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kehadiran Hari Ini</CardTitle>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.students.present || 0}/{stats?.students.total || 0}
              </div>
              <p className="text-xs opacity-80 mt-1">
                {stats?.students.izin || 0} izin, {stats?.students.sakit || 0} sakit
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient-4 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Penilaian Bulanan</CardTitle>
              <ClipboardList className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.assessments.progress || '0'}%</div>
              <p className="text-xs opacity-80 mt-1">
                {stats?.assessments.assessed || 0}/{stats?.assessments.total || 0} siswa dinilai
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Aksi Cepat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" asChild>
                <a href="/dashboard/guru/perencanaan">
                  <BookOpen className="h-6 w-6" />
                  <span>Buat RPPH</span>
                </a>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" asChild>
                <a href="/dashboard/guru/absensi">
                  <Calendar className="h-6 w-6" />
                  <span>Isi Absensi</span>
                </a>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" asChild>
                <a href="/dashboard/guru/penilaian">
                  <ClipboardList className="h-6 w-6" />
                  <span>Isi Penilaian</span>
                </a>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" asChild>
                <a href="/dashboard/guru/portofolio">
                  <FileText className="h-6 w-6" />
                  <span>Tambah Portofolio</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Tasks & Students */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Today's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Tugas Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className={`flex items-start gap-3 p-3 rounded-lg border ${
                  stats?.rpp.total > 0 ? 'bg-green-50 dark:bg-green-950/20' : ''
                }`}>
                  {stats?.rpp.total > 0 ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">Buat RPP</p>
                    <p className="text-xs text-muted-foreground">
                      {stats?.rpp.total || 0} RPP sudah dibuat
                    </p>
                  </div>
                </div>
                <div className={`flex items-start gap-3 p-3 rounded-lg border ${
                  stats?.students.present === stats?.students.total ? 'bg-green-50 dark:bg-green-950/20' : ''
                }`}>
                  {stats?.students.present === stats?.students.total ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">Absensi siswa</p>
                    <p className="text-xs text-muted-foreground">
                      {stats?.students.present || 0} dari {stats?.students.total || 0} sudah hadir
                    </p>
                  </div>
                </div>
                <div className={`flex items-start gap-3 p-3 rounded-lg border ${
                  parseInt(stats?.assessments.progress || '0') >= 100 ? 'bg-green-50 dark:bg-green-950/20' : ''
                }`}>
                  {parseInt(stats?.assessments.progress || '0') >= 100 ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">Penilaian bulanan</p>
                    <p className="text-xs text-muted-foreground">
                      {(stats?.assessments.total || 0) - (stats?.assessments.assessed || 0)} siswa tersisa
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Students */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Kehadiran Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {studentsAttendance.map((student, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                    <span className="text-sm font-medium">{student.name}</span>
                    <div className="flex items-center gap-2">
                      {student.note && (
                        <span className="text-xs text-muted-foreground">({student.note})</span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        student.status === "hadir"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : student.status === "izin"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : student.status === "sakit"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                          : student.status === "belum"
                          ? "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {student.status === 'belum' ? 'Belum' : student.status}
                      </span>
                    </div>
                  </div>
                ))}
                {studentsAttendance.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Belum ada data absensi hari ini
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              RPP Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-muted/50">
              {stats?.rpp.theme ? (
                <>
                  <h3 className="text-lg font-semibold">
                    {stats.rpp.theme}
                  </h3>
                  {stats.rpp.subTheme && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Subtema: {stats.rpp.subTheme}
                    </p>
                  )}
                  {stats.rpp.createdAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Dibuat: {new Date(stats.rpp.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Belum ada RPP yang dibuat
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
