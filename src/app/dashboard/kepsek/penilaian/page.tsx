"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, FileText, Camera, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AspectStat {
  aspect: string
  label: string
  percent: number
  dominant: string
  color: string
  distribution: Record<string, number>
  totalAssessments: number
  assessedStudents: number
}

interface TeacherStat {
  teacherId: string
  teacherName: string
  classNames: string
  totalStudents: number
  assessedStudents: number
  averageScore: string
  status: 'selesai' | 'proses' | 'tertinggal'
  progress: number
}

interface ClassStat {
  classId: string
  className: string
  ageGroup: string
  totalStudents: number
  fisikMotorik: { dominant: string; assessedCount: number }
  bahasa: { dominant: string; assessedCount: number }
}

interface StudentSosial {
  studentId: string
  studentName: string
  className: string
  dominant: string
  assessmentCount: number
}

interface PenilaianData {
  summary: {
    totalStudents: number
    assessedStudents: number
    completionPercent: number
    averageScore: string
    anecdotalCount: number
    documentationCount: number
    semester: string
    academicYear: string
  }
  aspectStats: AspectStat[]
  teacherStats: TeacherStat[]
  classStats: ClassStat[]
  studentSosialEmosional: StudentSosial[]
}

const SCORE_LABELS: Record<string, string> = {
  BSB: 'Berkembang Sangat Baik',
  BSH: 'Berkembang Sesuai Harapan',
  MB: 'Mulai Berkembang',
  BB: 'Belum Berkembang',
}

const SCORE_COLORS: Record<string, string> = {
  BSB: 'bg-blue-600',
  BSH: 'bg-green-600',
  MB: 'bg-orange-600',
  BB: 'bg-red-600',
}

export default function KepsekPenilaianPage() {
  const [data, setData] = useState<PenilaianData | null>(null)
  const [loading, setLoading] = useState(true)
  const [semester, setSemester] = useState("auto")
  const [academicYear, setAcademicYear] = useState("auto")

  const fetchAssessmentData = async (sem: string, year: string) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (sem !== "auto") params.set('semester', sem)
      if (year !== "auto") params.set('academicYear', year)

      const response = await fetch(`/api/kepsek/penilaian?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
        setSemester(sem)
        setAcademicYear(year)
      }
    } catch (error) {
      console.error('Error fetching assessment data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssessmentData("auto", "auto")
  }, [])

  const handlePeriodChange = (value: string) => {
    if (value === "ganjil") {
      const now = new Date()
      const y = now.getFullYear()
      const year = now.getMonth() >= 7 ? `${y}/${y + 1}` : `${y - 1}/${y}`
      fetchAssessmentData("Ganjil", year)
    } else if (value === "genap") {
      const now = new Date()
      const y = now.getFullYear()
      const year = now.getMonth() >= 7 ? `${y + 1}/${y + 2}` : `${y}/${y + 1}`
      fetchAssessmentData("Genap", year)
    } else {
      fetchAssessmentData("auto", "auto")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'selesai':
        return (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-green-600">Selesai</span>
          </div>
        )
      case 'proses':
        return (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-600" />
            <span className="text-yellow-600">Dalam Proses</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-600">Tertinggal</span>
          </div>
        )
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

  if (!data) {
    return (
      <DashboardLayout role="kepsek" userName="Kepala Sekolah">
        <div className="text-center py-8 text-muted-foreground">
          Gagal memuat data penilaian
        </div>
      </DashboardLayout>
    )
  }

  const { summary, aspectStats, teacherStats, classStats, studentSosialEmosional } = data

  return (
    <DashboardLayout role="kepsek" userName="Kepala Sekolah">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Monitoring Penilaian & Perkembangan Anak</h1>
            <p className="text-muted-foreground mt-2">
              Pantau penilaian perkembangan siswa berdasarkan 6 aspek PAUD — {summary.semester} {summary.academicYear}
            </p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="auto" onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Semester Saat Ini</SelectItem>
                <SelectItem value="ganjil">Semester Ganjil</SelectItem>
                <SelectItem value="genap">Semester Genap</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Export Laporan</Button>
          </div>
        </div>

        {/* Statistik Penilaian */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Penilaian Selesai</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{summary.completionPercent}%</div>
              <p className="text-xs text-muted-foreground mt-1">{summary.assessedStudents}/{summary.totalStudents} siswa</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Nilai</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{summary.averageScore}</div>
              <p className="text-xs text-muted-foreground mt-1">{SCORE_LABELS[summary.averageScore] || '-'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Catatan Anekdot</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{summary.anecdotalCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Catatan semester ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dokumentasi</CardTitle>
              <Camera className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{summary.documentationCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Foto kegiatan</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="ringkasan" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ringkasan">Ringkasan</TabsTrigger>
            <TabsTrigger value="sikap">Sikap & Karakter</TabsTrigger>
            <TabsTrigger value="motorik">Motorik & Bahasa</TabsTrigger>
            <TabsTrigger value="sosial">Sosial Emosional</TabsTrigger>
          </TabsList>

          {/* Ringkasan Penilaian */}
          <TabsContent value="ringkasan" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Penilaian Per Aspek — {summary.semester} {summary.academicYear}</CardTitle>
              </CardHeader>
              <CardContent>
                {aspectStats.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {aspectStats.map((aspect) => (
                      <div key={aspect.aspect} className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm">{aspect.label}</h3>
                          {aspect.dominant !== '-' && (
                            <Badge className={SCORE_COLORS[aspect.dominant] || 'bg-gray-600'}>{aspect.dominant}</Badge>
                          )}
                        </div>
                        <div className="text-2xl font-bold">{aspect.percent}%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {aspect.assessedStudents}/{summary.totalStudents} siswa dinilai
                        </p>
                        <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                          <div
                            className={`h-full ${SCORE_COLORS[aspect.dominant] || 'bg-gray-600'}`}
                            style={{ width: `${aspect.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada data penilaian untuk semester ini
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Penilaian Sikap & Karakter */}
          <TabsContent value="sikap" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Progress Penilaian Per Guru ({summary.semester} {summary.academicYear})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {teacherStats.length > 0 ? (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Guru</TableHead>
                          <TableHead>Kelas</TableHead>
                          <TableHead>Jumlah Siswa Dinilai</TableHead>
                          <TableHead>Rata-rata Nilai</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teacherStats.map((teacher) => (
                          <TableRow key={teacher.teacherId}>
                            <TableCell className="font-medium">{teacher.teacherName}</TableCell>
                            <TableCell>{teacher.classNames || '-'}</TableCell>
                            <TableCell>{teacher.assessedStudents}/{teacher.totalStudents}</TableCell>
                            <TableCell>
                              {teacher.averageScore !== '-' ? (
                                <Badge className={SCORE_COLORS[teacher.averageScore] || 'bg-gray-600'}>{teacher.averageScore}</Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${teacher.progress === 100 ? 'bg-green-600' : teacher.progress >= 50 ? 'bg-yellow-600' : 'bg-red-600'}`}
                                    style={{ width: `${teacher.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-muted-foreground">{teacher.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(teacher.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada data guru
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Penilaian Motorik & Bahasa */}
          <TabsContent value="motorik" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Penilaian Fisik Motorik & Bahasa Per Kelas</CardTitle>
              </CardHeader>
              <CardContent>
                {classStats.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="font-semibold mb-3">Fisik Motorik</h3>
                      <div className="rounded-md border overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Kelas</TableHead>
                              <TableHead>Nilai Dominan</TableHead>
                              <TableHead>Siswa Dinilai</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {classStats.map((cls) => (
                              <TableRow key={cls.classId}>
                                <TableCell className="font-medium">{cls.className} ({cls.ageGroup})</TableCell>
                                <TableCell>
                                  {cls.fisikMotorik.dominant !== '-' ? (
                                    <Badge className={SCORE_COLORS[cls.fisikMotorik.dominant] || 'bg-gray-600'}>{cls.fisikMotorik.dominant}</Badge>
                                  ) : (
                                    <span className="text-muted-foreground text-sm">-</span>
                                  )}
                                </TableCell>
                                <TableCell>{cls.fisikMotorik.assessedCount}/{cls.totalStudents}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Bahasa</h3>
                      <div className="rounded-md border overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Kelas</TableHead>
                              <TableHead>Nilai Dominan</TableHead>
                              <TableHead>Siswa Dinilai</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {classStats.map((cls) => (
                              <TableRow key={cls.classId}>
                                <TableCell className="font-medium">{cls.className} ({cls.ageGroup})</TableCell>
                                <TableCell>
                                  {cls.bahasa.dominant !== '-' ? (
                                    <Badge className={SCORE_COLORS[cls.bahasa.dominant] || 'bg-gray-600'}>{cls.bahasa.dominant}</Badge>
                                  ) : (
                                    <span className="text-muted-foreground text-sm">-</span>
                                  )}
                                </TableCell>
                                <TableCell>{cls.bahasa.assessedCount}/{cls.totalStudents}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada data kelas
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Penilaian Sosial Emosional */}
          <TabsContent value="sosial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Penilaian Sosial Emosional Per Siswa</span>
                  <Badge variant="outline">{studentSosialEmosional.length} siswa</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {studentSosialEmosional.length > 0 ? (
                  <div className="rounded-md border overflow-x-auto max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No</TableHead>
                          <TableHead>Nama Siswa</TableHead>
                          <TableHead>Kelas</TableHead>
                          <TableHead>Nilai Dominan</TableHead>
                          <TableHead>Jumlah Penilaian</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentSosialEmosional.map((student, index) => (
                          <TableRow key={student.studentId}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{student.studentName}</TableCell>
                            <TableCell>{student.className}</TableCell>
                            <TableCell>
                              {student.dominant !== '-' ? (
                                <Badge className={SCORE_COLORS[student.dominant] || 'bg-gray-600'}>{student.dominant}</Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">Belum dinilai</span>
                              )}
                            </TableCell>
                            <TableCell>{student.assessmentCount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada data penilaian sosial emosional
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}