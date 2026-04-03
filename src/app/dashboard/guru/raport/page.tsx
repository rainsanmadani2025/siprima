'use client'

import { useState, useEffect, useCallback } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  FileText,
  Star,
  Heart,
  User,
  Brain,
  MessageSquare,
  Camera,
  CheckCircle2,
  Calendar,
  Download,
  Loader2,
  Printer,
  PenTool,
  Home,
  Eye,
  FileDown
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Student {
  id: string
  name: string
  nis: string
  nisn?: string
  className: string
  classId?: string
}

interface AssessmentData {
  aspect: string
  score: string
  observation: string
  notes: string
  documentation: string | null
}

interface ReportData {
  student: Student
  period: string
  assessments: {
    agama_budi_pekerti?: AssessmentData
    jati_diri?: AssessmentData
    literasi_sains?: AssessmentData
    catatan_perkembangan?: AssessmentData
  }
  attendance?: {
    sakit: number
    izin: number
    alpa: number
  }
  educatorNotes?: string
  schoolInfo?: {
    name: string
    address: string
    npsn: string
  }
}

const scoreLabels: Record<string, string> = {
  BB: 'Belum Berkembang',
  MB: 'Mulai Berkembang',
  BSH: 'Berkembang Sesuai Harapan',
  BSB: 'Berkembang Sangat Baik'
}

const scoreColors: Record<string, string> = {
  BB: 'bg-red-100 text-red-800',
  MB: 'bg-orange-100 text-orange-800',
  BSH: 'bg-emerald-100 text-emerald-800',
  BSB: 'bg-blue-100 text-blue-800'
}

const aspects = [
  {
    key: 'agama_budi_pekerti',
    label: 'A. Nilai Agama dan Budi Pekerti',
    shortLabel: 'Nilai Agama dan Budi Pekerti',
    icon: Heart,
    color: 'text-emerald-600'
  },
  {
    key: 'jati_diri',
    label: 'B. Jati Diri',
    shortLabel: 'Jati Diri',
    icon: User,
    color: 'text-blue-600'
  },
  {
    key: 'literasi_sains',
    label: 'C. Dasar-dasar Literasi, Matematika, Sains, Teknologi, Rekayasa dan Seni',
    shortLabel: 'Dasar-dasar Literasi, Matematika, Sains, Teknologi, Rekayasa dan Seni',
    icon: Brain,
    color: 'text-purple-600'
  }
]

export default function GuruRaportPage() {
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState(new Date().toISOString().slice(0, 7))
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingReport, setLoadingReport] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loadingPreviewPDF, setLoadingPreviewPDF] = useState(false)
  const [loadingExportPDF, setLoadingExportPDF] = useState(false)
  const [schoolInfo, setSchoolInfo] = useState<{ name: string; address: string; npsn: string } | null>(null)
  const [teacherInfo, setTeacherInfo] = useState<{ name: string; nip?: string } | null>(null)
  const [principalInfo, setPrincipalInfo] = useState<{ name: string; nip?: string } | null>(null)
  
  // Editable fields
  const [educatorNotes, setEducatorNotes] = useState('')
  const [attendance, setAttendance] = useState({ sakit: 0, izin: 0, alpa: 0 })

  useEffect(() => {
    fetchStudents()
    fetchSchoolInfo()
    fetchTeacherInfo()
    fetchPrincipalInfo()
  }, [])

  useEffect(() => {
    if (selectedStudent) {
      fetchReportData()
    }
  }, [selectedStudent, selectedPeriod])

  const fetchSchoolInfo = async () => {
    try {
      const response = await fetch('/api/school/profile')

      if (!response.ok) {
        console.warn('[School Info] Response not OK:', response.status)
        return
      }

      const data = await response.json()

      if (data.success && data.school) {
        setSchoolInfo({
          name: data.school.name,
          address: data.school.address,
          npsn: data.school.npsn || ''
        })
      }
    } catch (error) {
      console.error('Error fetching school info:', error)
    }
  }

  const fetchTeacherInfo = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        console.warn('[Teacher Info] No userId found')
        return
      }

      const response = await fetch(`/api/guru/profile?userId=${userId}`)

      if (!response.ok) {
        console.warn('[Teacher Info] Response not OK:', response.status)
        return
      }

      const data = await response.json()

      if (data.success && data.teacher) {
        setTeacherInfo({
          name: data.teacher.user?.name || data.teacher.name || 'Guru',
          nip: data.teacher.nuptk
        })
      }
    } catch (error) {
      console.error('Error fetching teacher info:', error)
    }
  }

  const fetchPrincipalInfo = async () => {
    try {
      const response = await fetch('/api/kepsek/profil')

      if (!response.ok) {
        console.warn('[Principal Info] Response not OK:', response.status)
        return
      }

      const data = await response.json()

      if (data.success && data.data) {
        setPrincipalInfo({
          name: data.data.name || 'Kepala Sekolah',
          nip: data.data.nuptk
        })
      }
    } catch (error) {
      console.error('Error fetching principal info:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        console.warn('[Students] No userId found')
        return
      }

      const response = await fetch(`/api/guru/students-list?userId=${userId}`)

      if (!response.ok) {
        console.warn('[Students] Response not OK:', response.status)
        return
      }

      const data = await response.json()

      if (data.success && data.students.length > 0) {
        setStudents(data.students)
        setSelectedStudent(data.students[0])
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReportData = async () => {
    if (!selectedStudent) return

    try {
      setLoadingReport(true)
      const userId = localStorage.getItem('userId')

      // Fetch all assessments for the selected student and period
      const response = await fetch(`/api/guru/get-assessment?teacherId=${userId}&studentId=${selectedStudent.id}&date=${selectedPeriod}`)

      if (!response.ok) {
        console.warn('[Report] Response not OK:', response.status)
        setReportData(null)
        return
      }

      const data = await response.json()

      if (data.success && data.assessments && data.assessments.length > 0) {
        // Group assessments by aspect
        const assessments: any = {}
        data.assessments.forEach((assessment: any) => {
          assessments[assessment.aspect] = assessment
        })

        // Parse documentation data
        let docData: any = {}
        if (assessments.catatan_perkembangan?.documentation) {
          try {
            docData = JSON.parse(assessments.catatan_perkembangan.documentation)
          } catch (e) {
            console.warn('Failed to parse documentation data')
          }
        }

        // Set educator notes from documentation.educatorNotes (not from notes which is anecdotal)
        if (docData.educatorNotes) {
          setEducatorNotes(docData.educatorNotes)
        } else {
          setEducatorNotes('')
        }

        // Set attendance from documentation.attendance
        if (docData.attendance) {
          setAttendance(docData.attendance)
        }

        setReportData({
          student: selectedStudent,
          period: selectedPeriod,
          assessments,
          attendance: docData.attendance || { sakit: 0, izin: 0, alpa: 0 },
          educatorNotes: docData.educatorNotes || '',
          schoolInfo: schoolInfo || { name: 'RA INSAN MADANI', address: '', npsn: '' }
        })
      } else {
        setReportData(null)
        setEducatorNotes('')
        setAttendance({ sakit: 0, izin: 0, alpa: 0 })
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
      setReportData(null)
    } finally {
      setLoadingReport(false)
    }
  }

  const getMonthLabel = (month: string) => {
    const [year, monthNum] = month.split('-')
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    return `${months[parseInt(monthNum) - 1]} ${year}`
  }

  const getSemester = (month: string) => {
    const monthNum = parseInt(month.split('-')[1])
    return monthNum <= 6 ? 'Ganjil' : 'Genap'
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    alert('Fitur export akan diimplementasikan')
  }

  const handleSaveReport = async () => {
    if (!selectedStudent) return

    try {
      setSaving(true)
      const userId = localStorage.getItem('userId')

      // Generate date from selected period (first day of the month)
      const date = `${selectedPeriod}-01`

      // Get existing assessment data to preserve photos
      let existingDocData: any = {}
      try {
        const getAssessResponse = await fetch(`/api/guru/get-assessment?teacherId=${userId}&studentId=${selectedStudent.id}&date=${selectedPeriod}`)
        if (getAssessResponse.ok) {
          const getAssessData = await getAssessResponse.json()
          if (getAssessData.success && getAssessData.assessments) {
            const catatanAssessment = getAssessData.assessments.find((a: any) => a.aspect === 'catatan_perkembangan')
            if (catatanAssessment?.documentation) {
              existingDocData = JSON.parse(catatanAssessment.documentation)
            }
          }
        }
      } catch (e) {
        console.warn('Failed to fetch existing assessment data')
      }

      // Merge existing documentation data with new data
      const documentation = {
        ...existingDocData,
        attendance,
        educatorNotes,
        photos: existingDocData.photos || []
      }

      const response = await fetch('/api/guru/save-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: userId,
          studentId: selectedStudent.id,
          aspect: 'catatan_perkembangan',
          score: 'BSH',
          observation: reportData?.assessments.catatan_perkembangan?.observation || '',
          notes: reportData?.assessments.catatan_perkembangan?.notes || '', // Keep existing anecdotal notes
          documentation: JSON.stringify(documentation),
          semester: getSemester(selectedPeriod),
          academicYear: `${parseInt(selectedPeriod.split('-')[0]) - 1}/${selectedPeriod.split('-')[0]}`,
          date: date
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Catatan Pendidik dan Ketidakhadiran berhasil disimpan"
        })
      } else {
        throw new Error(data.error || 'Gagal menyimpan')
      }
    } catch (error: any) {
      console.error('Error saving report:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePreviewPDF = async () => {
    if (!selectedStudent || !reportData) {
      toast({
        title: "Error",
        description: "Pilih siswa dan pastikan data raport tersedia",
        variant: "destructive"
      })
      return
    }

    try {
      setLoadingPreviewPDF(true)

      const response = await fetch('/api/raport/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: selectedStudent.name,
          studentNis: selectedStudent.nis,
          studentNisn: selectedStudent.nisn || '',
          className: selectedStudent.className,
          period: selectedPeriod,
          periodLabel: getMonthLabel(selectedPeriod),
          semester: getSemester(selectedPeriod),
          academicYear: `${parseInt(selectedPeriod.split('-')[0]) - 1}/${selectedPeriod.split('-')[0]}`,
          schoolName: schoolInfo?.name || 'RA INSAN MADANI',
          schoolAddress: schoolInfo?.address || '',
          teacherName: teacherInfo?.name || 'Guru',
          teacherNip: teacherInfo?.nip || '',
          principalName: principalInfo?.name || 'Kepala Sekolah',
          principalNip: principalInfo?.nip || '',
          assessments: reportData.assessments,
          attendance: attendance,
          educatorNotes: educatorNotes
        }),
      })

      if (!response.ok) {
        throw new Error('Gagal membuat preview PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      // Open PDF in new tab using browser's native PDF viewer
      window.open(url, '_blank')

      toast({
        title: "Berhasil",
        description: "PDF dibuka di tab baru"
      })
    } catch (error: any) {
      console.error('Error previewing PDF:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal membuat preview PDF",
        variant: "destructive"
      })
    } finally {
      setLoadingPreviewPDF(false)
    }
  }

  const handleExportPDF = async () => {
    if (!selectedStudent || !reportData) {
      toast({
        title: "Error",
        description: "Pilih siswa dan pastikan data raport tersedia",
        variant: "destructive"
      })
      return
    }

    try {
      setLoadingExportPDF(true)
      const response = await fetch('/api/raport/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: selectedStudent.name,
          studentNis: selectedStudent.nis,
          studentNisn: selectedStudent.nisn || '',
          className: selectedStudent.className,
          period: selectedPeriod,
          periodLabel: getMonthLabel(selectedPeriod),
          semester: getSemester(selectedPeriod),
          academicYear: `${parseInt(selectedPeriod.split('-')[0]) - 1}/${selectedPeriod.split('-')[0]}`,
          schoolName: schoolInfo?.name || 'RA INSAN MADANI',
          schoolAddress: schoolInfo?.address || '',
          teacherName: teacherInfo?.name || 'Guru',
          teacherNip: teacherInfo?.nip || '',
          principalName: principalInfo?.name || 'Kepala Sekolah',
          principalNip: principalInfo?.nip || '',
          assessments: reportData.assessments,
          attendance: attendance,
          educatorNotes: educatorNotes
        }),
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Raport-${selectedStudent.name}-${getMonthLabel(selectedPeriod)}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast({
        title: "Berhasil",
        description: "Raport berhasil diekspor ke PDF"
      })
    } catch (error: any) {
      console.error('Error exporting PDF:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal mengekspor Raport ke PDF",
        variant: "destructive"
      })
    } finally {
      setLoadingExportPDF(false)
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Raport Siswa</h1>
          <p className="text-muted-foreground mt-2">
            Lihat dan cetak raport perkembangan siswa
          </p>
        </div>

        {/* Student Selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Pilih Siswa
              </CardTitle>
              <div className="flex gap-2 flex-wrap items-center">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Pilih Periode" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      new Date().toISOString().slice(0, 7),
                      '2025-01', '2025-02', '2025-03', '2025-04', '2025-05',
                      '2025-06', '2025-07', '2025-08', '2025-09', '2025-10',
                      '2025-11', '2025-12'
                    ].map(month => (
                      <SelectItem key={month} value={month}>
                        {getMonthLabel(month)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {reportData && (
                  <>
                    <Button onClick={handlePreviewPDF} disabled={loadingPreviewPDF} variant="outline" size="sm">
                      {loadingPreviewPDF && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Eye className="mr-2 h-4 w-4" />
                      Preview PDF
                    </Button>
                    <Button onClick={handleExportPDF} disabled={loadingExportPDF} variant="outline" size="sm">
                      {loadingExportPDF && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <FileDown className="mr-2 h-4 w-4" />
                      Export PDF
                    </Button>
                    <Button variant="outline" onClick={handleExport} size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <Button variant="outline" onClick={handlePrint} size="sm">
                      <Printer className="mr-2 h-4 w-4" />
                      Cetak
                    </Button>
                    <Button onClick={handleSaveReport} disabled={saving} size="sm">
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <PenTool className="mr-2 h-4 w-4" />
                      Simpan Catatan
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {students.length > 0 ? (
              <Select
                value={selectedStudent?.id || ''}
                onValueChange={(value) => {
                  const student = students.find(s => s.id === value)
                  if (student) setSelectedStudent(student)
                }}
              >
                <SelectTrigger className="w-full md:w-96">
                  <SelectValue placeholder="Pilih Siswa" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.nis}) - {student.className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-muted-foreground">Tidak ada siswa yang tersedia</p>
            )}
          </CardContent>
        </Card>

        {/* Report Display */}
        {loadingReport ? (
          <Card>
            <CardContent className="p-12">
              <div className="flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            </CardContent>
          </Card>
        ) : reportData && selectedStudent ? (
          <div className="space-y-6 print:space-y-4">
            {/* Header Report */}
            <Card className="print:border print:border-gray-300">
              <CardContent className="p-6 space-y-4">
                <div className="text-center space-y-2 pb-4 border-b-2">
                  <h1 className="text-2xl font-bold">{reportData.schoolInfo?.name || 'RA INSAN MADANI'}</h1>
                  <p className="text-sm text-muted-foreground">Laporan Perkembangan Anak</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="font-medium w-32">Nama</span>
                      <span>: {selectedStudent.name}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">NIS/NISN</span>
                      <span>: {selectedStudent.nis} / {selectedStudent.nisn || '-'}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Madrasah</span>
                      <span>: {reportData.schoolInfo?.name || 'RA INSAN MADANI'}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Alamat</span>
                      <span>: {reportData.schoolInfo?.address || '-'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="font-medium w-32">Kelas</span>
                      <span>: {selectedStudent.className}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Fase</span>
                      <span>: Pondasi</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Semester</span>
                      <span>: {getSemester(selectedPeriod)}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Tahun Ajaran</span>
                      <span>: {parseInt(selectedPeriod.split('-')[0]) - 1}/{selectedPeriod.split('-')[0]}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3 Aspek Penilaian */}
            {aspects.map((aspect, index) => {
              const assessment = reportData.assessments[aspect.key]
              const Icon = aspect.icon

              return (
                <Card key={aspect.key} className="print:border print:border-gray-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className={aspect.color}>{aspect.label}</span>
                      {assessment?.score && (
                        <Badge className={scoreColors[assessment.score] || ''}>
                          <Star className="w-3 h-3 mr-1" />
                          {scoreLabels[assessment.score]} ({assessment.score})
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Catatan Perkembangan */}
                    <div>
                      <h3 className="font-semibold text-sm mb-2">Catatan Perkembangan</h3>
                      <div className="p-4 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap min-h-[100px] border-2 border-dashed">
                        {assessment?.observation || '.........................................................................................................................................................................................................................................'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Observasi Kegiatan */}
            <Card className="print:border print:border-gray-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Observasi Kegiatan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Deskripsikan kegiatan perkembangan siswa secara umum..."
                  rows={3}
                  value={reportData.assessments.catatan_perkembangan?.observation || ''}
                  readOnly
                  className="min-h-[100px] border-2"
                />
              </CardContent>
            </Card>

            {/* Catatan Anekdot */}
            <Card className="print:border print:border-gray-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Catatan Anekdot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Catatan insidental tentang perilaku dan perkembangan siswa..."
                  rows={3}
                  value={reportData.assessments.catatan_perkembangan?.notes || ''}
                  readOnly
                  className="min-h-[100px] border-2"
                />
              </CardContent>
            </Card>

            {/* Dokumentasi Foto */}
            <Card className="print:border print:border-gray-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Dokumentasi Foto
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reportData.assessments.catatan_perkembangan?.documentation ? (
                  (() => {
                    try {
                      const docData = JSON.parse(reportData.assessments.catatan_perkembangan.documentation)
                      const photos = docData.photos || []
                      
                      if (photos.length > 0) {
                        return (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {photos.map((photo: string, index: number) => (
                              <div key={index} className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                                <img
                                  src={photo}
                                  alt={`Dokumentasi ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )
                      } else {
                        return (
                          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                            <p>Tidak ada foto dokumentasi</p>
                          </div>
                        )
                      }
                    } catch (e) {
                      return <p className="text-muted-foreground">Gagal memuat dokumentasi</p>
                    }
                  })()
                ) : (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    <p>Tidak ada foto dokumentasi</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ketidakhadiran */}
            <Card className="print:border print:border-gray-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Ketidakhadiran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <Label className="font-medium mb-2 block">Sakit</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={attendance.sakit}
                        onChange={(e) => setAttendance({ ...attendance, sakit: parseInt(e.target.value) || 0 })}
                        className="text-center text-lg font-semibold"
                        min="0"
                      />
                      <span className="text-sm text-muted-foreground">Hari</span>
                    </div>
                  </div>
                  <div>
                    <Label className="font-medium mb-2 block">Izin</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={attendance.izin}
                        onChange={(e) => setAttendance({ ...attendance, izin: parseInt(e.target.value) || 0 })}
                        className="text-center text-lg font-semibold"
                        min="0"
                      />
                      <span className="text-sm text-muted-foreground">Hari</span>
                    </div>
                  </div>
                  <div>
                    <Label className="font-medium mb-2 block">Alpa</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={attendance.alpa}
                        onChange={(e) => setAttendance({ ...attendance, alpa: parseInt(e.target.value) || 0 })}
                        className="text-center text-lg font-semibold"
                        min="0"
                      />
                      <span className="text-sm text-muted-foreground">Hari</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Catatan Pendidik */}
            <Card className="print:border print:border-gray-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="h-5 w-5" />
                  Catatan Pendidik
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Tulis catatan pendidik tentang perkembangan siswa..."
                  rows={3}
                  value={educatorNotes}
                  onChange={(e) => setEducatorNotes(e.target.value)}
                  className="min-h-[100px] border-2"
                />
              </CardContent>
            </Card>

            {/* Footer Report - Tanda Tangan */}
            <Card className="print:border print:border-gray-300">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 mt-8 pt-4">
                  <div className="text-center space-y-2">
                    <p className="font-semibold text-sm">Orang Tua</p>
                    <div className="min-h-[80px]"></div>
                    <div className="border-b border-gray-400 min-h-[2px]"></div>
                    <p className="text-xs text-muted-foreground mt-1">Parent/Guardian</p>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-semibold text-sm">Wali Kelas</p>
                    <div className="min-h-[80px]"></div>
                    <p className="font-semibold text-sm">{teacherInfo?.name || '................................'}</p>
                    {teacherInfo?.nip && (
                      <p className="text-xs text-muted-foreground">NUPTK : {teacherInfo.nip}</p>
                    )}
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-semibold text-sm">Mengetahui,</p>
                    <p className="font-semibold text-sm">Kepala Sekolah</p>
                    <div className="min-h-[60px]"></div>
                    <p className="font-semibold text-sm">{principalInfo?.name || '................................'}</p>
                    {principalInfo?.nip && (
                      <p className="text-xs text-muted-foreground">NUPTK : {principalInfo.nip}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : selectedStudent ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Belum Ada Data Raport</h3>
              <p className="text-muted-foreground">
                Data penilaian untuk {selectedStudent.name} pada periode {getMonthLabel(selectedPeriod)} belum tersedia.
                Silakan lakukan penilaian terlebih dahulu di halaman Penilaian.
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </DashboardLayout>
  )
}
