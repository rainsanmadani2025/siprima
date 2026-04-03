"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, RefreshCw, Eye, Ear, Heart, Loader2, Stethoscope, Syringe } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface HealthData {
  bloodType: string
  height: string
  weight: string
  headCircumference: string
  waistCircumference: string
  eyesFunction: string
  earsFunction: string
  allergies: string
  diseases: string
  medicalNotes: string
}

interface Student {
  id: string
  name: string
  nis: string
  gender: string
  status: string
  class: {
    id: string
    name: string
    ageGroup: string
  } | null
  healthData: HealthData | null
  immunization: Array<{
    vaccine?: string
    vaksin?: string
    date?: string
    tanggal?: string
    status?: string
    completed?: boolean
    dose?: string
    notes?: string
  }> | null
}

export default function AdminKesehatanPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterKelas, setFilterKelas] = useState("semua")
  const [filterStatus, setFilterStatus] = useState("semua")
  const { toast } = useToast()

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/students')
      const data = await response.json()

      // Handle both response formats: { success: true, students: [] } or { students: [] }
      if (data.students) {
        setStudents(data.students)
      } else {
        setStudents([])
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      toast({
        title: "Error",
        description: "Gagal memuat data kesehatan siswa",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // Filter students based on search query, class, and status
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.nis.toLowerCase().includes(searchQuery.toLowerCase())

    // Match class filter
    let matchesClass = true
    if (filterKelas !== "semua") {
      const classInfo = student.class ? `${student.class.name} (${student.class.ageGroup})` : ''
      // Check if filter matches the full class info or just the age group
      matchesClass = classInfo === filterKelas ||
                     student.class?.ageGroup?.toLowerCase() === filterKelas.toLowerCase()
    }

    const matchesStatus = filterStatus === "semua" ||
                         student.status?.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesClass && matchesStatus
  })

  // Get unique classes
  const uniqueClasses = students
    .filter(s => s.class?.name && s.class?.ageGroup)
    .reduce((acc, s) => {
      const key = `${s.class!.name}-${s.class!.ageGroup}`
      if (!acc.some(cls => cls.key === key)) {
        acc.push({
          key,
          name: s.class!.name,
          ageGroup: s.class!.ageGroup
        })
      }
      return acc
    }, [] as Array<{ key: string; name: string; ageGroup: string }>)

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredStudents.length === 0) {
      toast({
        title: "Info",
        description: "Tidak ada data untuk diexport",
        variant: "default",
      })
      return
    }

    const headers = ["Kelas", "Nama Siswa", "NIS", "Golongan Darah", "Tinggi Badan (cm)", "Berat Badan (kg)", "Lingkar Kepala (cm)", "Lingkar Perut (cm)", "Fungsi Mata", "Fungsi Telinga", "Alergi", "Riwayat Penyakit", "Catatan Medis", "Imunisasi", "Status"]
    const rows = filteredStudents.map(s => {
      // Format immunization data for CSV
      const immunizationText = s.immunization && s.immunization.length > 0
        ? s.immunization.map(imm => {
            const vaccineName = imm.vaccine || imm.vaksin || 'Vaksin'
            const status = imm.status === 'completed' ||
                          imm.status === 'selesai' ||
                          imm.status === 'Sudah' ||
                          imm.completed === true ? 'Sudah' : 'Belum'
            return `${vaccineName} (${status})`
          }).join('; ')
        : '-'

      return [
        `${s.class?.name || '-'} (${s.class?.ageGroup || '-'})`,
        s.name,
        s.nis,
        s.healthData?.bloodType || '-',
        s.healthData?.height || '-',
        s.healthData?.weight || '-',
        s.healthData?.headCircumference || '-',
        s.healthData?.waistCircumference || '-',
        s.healthData?.eyesFunction || '-',
        s.healthData?.earsFunction || '-',
        s.healthData?.allergies || '-',
        s.healthData?.diseases || '-',
        s.healthData?.medicalNotes || '-',
        immunizationText,
        s.status
      ]
    })

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `data-kesehatan-siswa-${new Date().toISOString().split('T')[0]}.csv`
    link.click()

    toast({
      title: "Berhasil",
      description: "Data kesehatan berhasil diexport ke CSV",
    })
  }

  // Calculate statistics
  const totalStudents = filteredStudents.length
  const studentsWithHealthData = filteredStudents.filter(s => s.healthData).length
  const studentsWithoutHealthData = totalStudents - studentsWithHealthData

  return (
    <DashboardLayout role="admin" userName="Administrator">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Data Kesehatan Siswa</h1>
            <p className="text-muted-foreground mt-2">
              Matriks data kesehatan lengkap seluruh siswa
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={fetchStudents}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistik */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">Semua siswa</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Lengkap</CardTitle>
              <Heart className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{studentsWithHealthData}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalStudents > 0 ? Math.round((studentsWithHealthData / totalStudents) * 100) : 0}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Belum Lengkap</CardTitle>
              <Heart className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{studentsWithoutHealthData}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalStudents > 0 ? Math.round((studentsWithoutHealthData / totalStudents) * 100) : 0}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jumlah Kelas</CardTitle>
              <Stethoscope className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{uniqueClasses.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Kelas terisi</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari siswa berdasarkan nama atau NIS..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterKelas} onValueChange={setFilterKelas}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Kelas</SelectItem>
                  <SelectItem value="A">Kelas A</SelectItem>
                  <SelectItem value="B">Kelas B</SelectItem>
                  {uniqueClasses.map((cls) => (
                    <SelectItem key={cls.key} value={`${cls.name} (${cls.ageGroup})`}>
                      {cls.name} ({cls.ageGroup})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="keluar">Keluar</SelectItem>
                  <SelectItem value="lulus">Lulus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabel Data Kesehatan */}
        <Card>
          <CardHeader>
            <CardTitle>Matriks Data Kesehatan</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <Stethoscope className="h-12 w-12 mx-auto mb-2 opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground">Tidak ada data siswa yang ditemukan</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap sticky left-0 bg-background z-10 border-r">Kelas</TableHead>
                      <TableHead className="whitespace-nowrap sticky left-[80px] bg-background z-10 border-r">Nama Siswa</TableHead>
                      <TableHead className="whitespace-nowrap sticky left-[280px] bg-background z-10 border-r">NIS</TableHead>
                      <TableHead className="whitespace-nowrap">Gol. Darah</TableHead>
                      <TableHead className="whitespace-nowrap">TB (cm)</TableHead>
                      <TableHead className="whitespace-nowrap">BB (kg)</TableHead>
                      <TableHead className="whitespace-nowrap">LILA (cm)</TableHead>
                      <TableHead className="whitespace-nowrap">LP (cm)</TableHead>
                      <TableHead className="whitespace-nowrap">Fungsi Mata</TableHead>
                      <TableHead className="whitespace-nowrap">Fungsi Telinga</TableHead>
                      <TableHead className="whitespace-nowrap">Alergi</TableHead>
                      <TableHead className="whitespace-nowrap">Riwayat Penyakit</TableHead>
                      <TableHead className="whitespace-nowrap">Catatan Medis</TableHead>
                      <TableHead className="whitespace-nowrap">Imunisasi</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const health = student.healthData
                      const hasHealthData = health !== null

                      return (
                        <TableRow key={student.id} className={!hasHealthData ? "bg-orange-50/50" : ""}>
                          <TableCell className={`font-medium sticky left-0 z-10 border-r min-w-[80px] ${!hasHealthData ? 'bg-orange-50' : 'bg-background'}`}>
                            {student.class ? (
                              <Badge variant={student.class.ageGroup === 'A' ? 'default' : 'secondary'}>
                                {student.class.name} ({student.class.ageGroup})
                              </Badge>
                            ) : '-'}
                          </TableCell>
                          <TableCell className={`font-medium sticky left-[80px] z-10 border-r min-w-[200px] ${!hasHealthData ? 'bg-orange-50' : 'bg-background'}`}>{student.name}</TableCell>
                          <TableCell className={`sticky left-[280px] z-10 border-r min-w-[80px] ${!hasHealthData ? 'bg-orange-50' : 'bg-background'}`}>{student.nis}</TableCell>
                          <TableCell className="min-w-[100px]">
                            {hasHealthData && health.bloodType ? (
                              <Badge variant="outline">{health.bloodType}</Badge>
                            ) : '-'}
                          </TableCell>
                          <TableCell className="min-w-[80px]">{hasHealthData && health.height ? health.height : '-'}</TableCell>
                          <TableCell className="min-w-[80px]">{hasHealthData && health.weight ? health.weight : '-'}</TableCell>
                          <TableCell className="min-w-[80px]">{hasHealthData && health.headCircumference ? health.headCircumference : '-'}</TableCell>
                          <TableCell className="min-w-[80px]">{hasHealthData && health.waistCircumference ? health.waistCircumference : '-'}</TableCell>
                          <TableCell className="min-w-[120px]">
                            {hasHealthData && health.eyesFunction && health.eyesFunction !== '-' ? (
                              <Badge variant={health.eyesFunction === 'normal' ? 'default' : 'secondary'}>
                                <Eye className="h-3 w-3 mr-1" />
                                {health.eyesFunction === 'normal' ? 'Normal' : health.eyesFunction}
                              </Badge>
                            ) : '-'}
                          </TableCell>
                          <TableCell className="min-w-[120px]">
                            {hasHealthData && health.earsFunction && health.earsFunction !== '-' ? (
                              <Badge variant={health.earsFunction === 'normal' ? 'default' : 'secondary'}>
                                <Ear className="h-3 w-3 mr-1" />
                                {health.earsFunction === 'normal' ? 'Normal' : health.earsFunction}
                              </Badge>
                            ) : '-'}
                          </TableCell>
                          <TableCell className="min-w-[150px]">
                            {hasHealthData && health.allergies && health.allergies !== '-' ? (
                              <span className="max-w-32 truncate block" title={health.allergies}>
                                {health.allergies}
                              </span>
                            ) : '-'}
                          </TableCell>
                          <TableCell className="min-w-[150px]">
                            {hasHealthData && health.diseases && health.diseases !== '-' ? (
                              <span className="max-w-32 truncate block" title={health.diseases}>
                                {health.diseases}
                              </span>
                            ) : '-'}
                          </TableCell>
                          <TableCell className="min-w-[150px]">
                            {hasHealthData && health.medicalNotes && health.medicalNotes !== '-' ? (
                              <span className="max-w-32 truncate block" title={health.medicalNotes}>
                                {health.medicalNotes}
                              </span>
                            ) : '-'}
                          </TableCell>
                          <TableCell className="min-w-[180px]">
                            {student.immunization && student.immunization.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                {student.immunization.slice(0, 2).map((imm, idx) => {
                                  const vaccineName = imm.vaccine || imm.vaksin || 'Vaksin'
                                  const isCompleted = imm.status === 'completed' ||
                                                  imm.status === 'selesai' ||
                                                  imm.status === 'Sudah' ||
                                                  imm.completed === true
                                  return (
                                    <Badge key={idx} variant={isCompleted ? 'default' : 'secondary'} className="text-xs">
                                      <Syringe className="h-3 w-3 mr-1" />
                                      {vaccineName}
                                    </Badge>
                                  )
                                })}
                                {student.immunization.length > 2 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{student.immunization.length - 2} lagi
                                  </span>
                                )}
                              </div>
                            ) : '-'}
                          </TableCell>
                          <TableCell className="min-w-[80px]">
                            <Badge className={student.status === 'aktif' ? 'bg-green-600' : 'bg-red-600'}>
                              {student.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 rounded" />
                <span>Siswa Aktif</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded" />
                <span>Siswa Tidak Aktif</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-50 border rounded" />
                <span>Baris Berwarna = Data Kesehatan Belum Lengkap</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>Fungsi Mata Normal / Tidak Normal</span>
              </div>
              <div className="flex items-center gap-2">
                <Ear className="h-4 w-4" />
                <span>Fungsi Telinga Normal / Tidak Normal</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
