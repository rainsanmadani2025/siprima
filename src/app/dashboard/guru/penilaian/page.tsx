"use client"

import React, { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, Star, FileText, Camera, MessageSquare, Download, Save, Loader2, Edit, Upload, CheckCircle2, RefreshCw, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { getCurrentAcademicYear, getSemesterDateRange } from '@/lib/semester-utils'

interface Student {
  id: string
  name: string
  nis: string
  className: string
  classId?: string
}

interface AssessmentStatistics {
  totalStudents: number
  assessedStudents: number
  progress: string
  averageScore: string
  anecdotalNotesCount: number
  documentationCount: number
  scoreCounts: {
    BB: number
    MB: number
    BSH: number
    BSB: number
  }
}

const scoreLabels: Record<string, string> = {
  BB: 'Belum Berkembang',
  MB: 'Mulai Berkembang',
  BSH: 'Berkembang Sesuai Harapan',
  BSB: 'Berkembang Sangat Baik'
}

// Template styles
const templateStyles = ['Formal', 'Ramah', 'Lengkap'] as const

// Template narasi untuk setiap aspek, nilai, dan style
const narrativeTemplates: Record<string, Record<string, string[]>> = {
  agama_budi_pekerti: {
    BB: [
      'Anak belum menunjukkan kemampuan dalam aspek ini. Perlu bimbingan dan pendampingan lebih intensif.',
      'Perkembangan anak dalam aspek ini masih perlu diperhatikan. Diperlukan latihan rutin setiap hari.'
    ],
    MB: [
      'Anak mulai menunjukkan perkembangan dalam aspek ini dengan bimbingan guru.',
      'Kemampuan anak mulai terlihat meskipun masih memerlukan bantuan dan arahan.'
    ],
    BSH: [
      'Anak menunjukkan perkembangan yang sesuai dengan harapan. Kemampuan sudah cukup baik.',
      'Perkembangan anak dalam aspek ini sudah sesuai harapan. Terus berikan motivasi.'
    ],
    BSB: [
      'Anak menunjukkan perkembangan yang sangat baik. Kemampuan sudah melebihi harapan.',
      'Luar biasa! Anak menguasai aspek ini dengan sangat baik dan konsisten.'
    ]
  },
  jati_diri: {
    BB: [
      'Anak belum menunjukkan kemandirian dan kepercayaan diri. Perlu dukungan terus-menerus.',
      'Perkembangan jati diri anak masih perlu ditingkatkan melalui kegiatan yang menyenangkan.'
    ],
    MB: [
      'Anak mulai menunjukkan kemandirian dalam beberapa aspek.',
      'Perkembangan jati diri anak mulai terlihat meskipun belum konsisten.'
    ],
    BSH: [
      'Anak sudah mampu menunjukkan kemandirian sesuai dengan usianya.',
      'Perkembangan jati diri anak sudah baik. Anak mulai percaya diri.'
    ],
    BSB: [
      'Anak menunjukkan kemandirian dan kepercayaan diri yang luar biasa.',
      'Jati diri anak berkembang sangat baik, bahkan mampu membantu temannya.'
    ]
  },
  literasi_sains: {
    BB: [
      'Anak belum menunjukkan kemampuan literasi dan sains dasar. Perlu stimulasi lebih.',
      'Perkembangan anak dalam literasi dan sains masih sangat awal.'
    ],
    MB: [
      'Anak mulai mengenal konsep dasar literasi dan sains.',
      'Kemampuan literasi dan sains anak mulai berkembang dengan bimbingan.'
    ],
    BSH: [
      'Anak sudah mampu memahami konsep dasar literasi dan sains sesuai usianya.',
      'Perkembangan literasi dan sains anak sudah sesuai harapan.'
    ],
    BSB: [
      'Anak menunjukkan kemampuan literasi dan sains yang sangat baik.',
      'Kemampuan anak dalam literasi dan sains melebihi ekspektasi untuk usianya.'
    ]
  }
}

const narrativeStyles: Record<string, string> = {
  Formal: 'Berdasarkan hasil pengamatan, {nama} {narasi}',
  Ramah: '{nama} sudah {narasi.toLowerCase()} 🌟',
  Lengkap: 'Dalam periode ini, kami mengamati bahwa {nama} {narasi}. Hal ini ditunjukkan melalui berbagai kegiatan pembelajaran yang diikuti.'
}

export default function GuruPenilaianPage() {
  const [stats, setStats] = useState<AssessmentStatistics | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedSemester, setSelectedSemester] = useState('Ganjil')
  const currentYear = getCurrentAcademicYear()
  const prevYear = `${parseInt(currentYear.split('/')[0]) - 1}/${parseInt(currentYear.split('/')[0])}`
  const nextYear = `${parseInt(currentYear.split('/')[1])}/${parseInt(currentYear.split('/')[1]) + 1}`
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)
  const { toast } = useToast()

  // Shared notes for documentation section
  const [sharedNotes, setSharedNotes] = useState({
    observation: '',
    anecdotalNotes: ''
  })

  // Template-related state
  const [templateStyle, setTemplateStyle] = useState<string>('Formal')
  const [observationTemplateIndex, setObservationTemplateIndex] = useState(-1)
  const [anecdotalTemplateIndex, setAnecdotalTemplateIndex] = useState(-1)

  // Uploaded photos
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])

  // Form values for each aspect
  const [formValues, setFormValues] = useState<Record<string, { score: string; notes: string }>>({})

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchStatistics()
    fetchStudents()
  }, [selectedSemester, selectedYear])

  // Reset form values when semester or year changes
  useEffect(() => {
    setFormValues({})
    setSharedNotes({ observation: '', anecdotalNotes: '' })
    setTemplateIndices({})
    setObservationTemplateIndex(-1)
    setAnecdotalTemplateIndex(-1)
    setUploadedPhotos([])
  }, [selectedSemester, selectedYear])

  const fetchStatistics = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        console.warn('[Statistics] No userId found')
        return
      }

      const response = await fetch(`/api/guru/assessment-statistics?userId=${userId}&semester=${selectedSemester}`)

      if (!response.ok) {
        console.warn('[Statistics] Response not OK:', response.status)
        return
      }

      const data = await response.json()
      if (data.success && data.statistics) {
        setStats(data.statistics)
      }
    } catch (error) {
      console.error('[Statistics] Error:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        console.warn('[Students] No userId found')
        setLoading(false)
        return
      }

      const response = await fetch(`/api/guru/students?teacherId=${userId}`)
      if (!response.ok) {
        console.warn('[Students] Response not OK:', response.status)
        setLoading(false)
        return
      }

      const data = await response.json()
      if (data.success && data.students) {
        setStudents(data.students)
      }
    } catch (error) {
      console.error('[Students] Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentAssessments = async (studentId: string) => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) return

      const date = getSemesterDateRange(selectedSemester as 'Ganjil' | 'Genap').month

      const response = await fetch(`/api/guru/get-assessment?teacherId=${userId}&studentId=${studentId}&date=${date}`)
      if (!response.ok) return

      const data = await response.json()
      if (data.success && data.assessments) {
        const values: Record<string, { score: string; notes: string }> = {}
        let observation = ''
        let anecdotalNotes = ''
        let documentation: string[] = []

        data.assessments.forEach((assessment: any) => {
          if (assessment.aspect !== 'catatan_perkembangan') {
            values[assessment.aspect] = {
              score: assessment.score || '',
              notes: assessment.observation || ''
            }
          } else {
            observation = assessment.observation || ''
            anecdotalNotes = assessment.notes || ''
            try {
              const docData = JSON.parse(assessment.documentation || '{}')
              documentation = docData.photos || []
            } catch {
              documentation = []
            }
          }
        })

        setFormValues(values)
        setSharedNotes({ observation, anecdotalNotes })
        setUploadedPhotos(documentation)
      }
    } catch (error) {
      console.error('[Fetch Assessments] Error:', error)
    }
  }

  const handleStudentChange = (studentId: string) => {
    const student = students.find(s => s.id === studentId)
    if (student) {
      setSelectedStudent(student)
      setFormValues({})
      setSharedNotes({ observation: '', anecdotalNotes: '' })
      setObservationTemplateIndex(-1)
      setAnecdotalTemplateIndex(-1)
      setUploadedPhotos([])
      fetchStudentAssessments(studentId)
    }
  }

  const handleScoreChange = (aspect: string, score: string) => {
    setFormValues(prev => ({
      ...prev,
      [aspect]: {
        ...prev[aspect],
        score
      }
    }))
  }

  const handleNotesChange = (aspect: string, notes: string) => {
    setFormValues(prev => ({
      ...prev,
      [aspect]: {
        ...prev[aspect],
        notes
      }
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          setUploadedPhotos(prev => [...prev, result])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleGenerateNarrative = (aspect: string, type: 'notes') => {
    const value = formValues[aspect]
    if (!value?.score) {
      toast({
        title: "Perhatian",
        description: "Pilih nilai terlebih dahulu sebelum menghasilkan narasi",
        variant: "destructive"
      })
      return
    }

    const templates = narrativeTemplates[aspect]?.[value.score]
    if (!templates || templates.length === 0) return

    let templateIndex: number
    if (type === 'notes' && aspect === 'catatan_perkembangan') {
      templateIndex = (anecdotalTemplateIndex + 1) % templates.length
      setAnecdotalTemplateIndex(templateIndex)
    } else {
      templateIndex = (observationTemplateIndex + 1) % templates.length
      setObservationTemplateIndex(templateIndex)
    }

    const template = templates[templateIndex]
    const styleTemplate = narrativeStyles[templateStyle] || ''
    const narrative = styleTemplate
      .replace('{nama}', selectedStudent?.name || 'Anak')
      .replace('{narasi}', template)

    if (type === 'notes') {
      setSharedNotes(prev => ({ ...prev, anecdotalNotes: narrative }))
    } else {
      setSharedNotes(prev => ({ ...prev, observation: narrative }))
    }

    toast({
      title: "Narasi Dihasilkan",
      description: `Narasi ${templateStyle} berhasil digenerate`
    })
  }

  const handleSaveAssessment = async (aspect: string) => {
    if (!selectedStudent) return

    const formValue = formValues[aspect]
    if (!formValue?.score) {
      toast({
        title: "Perhatian",
        description: "Pilih nilai terlebih dahulu",
        variant: "destructive"
      })
      return
    }

    try {
      setSaving(true)
      const userId = localStorage.getItem('userId')

      const date = getSemesterDateRange(selectedSemester as 'Ganjil' | 'Genap').start

      const response = await fetch('/api/guru/save-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: userId,
          studentId: selectedStudent.id,
          aspect: aspect,
          score: formValue.score,
          observation: formValue.notes || '',
          notes: sharedNotes.anecdotalNotes || '',
          semester: selectedSemester,
          academicYear: selectedYear,
          date: date
        })
      })

      if (!response.ok) {
        throw new Error('Gagal menyimpan penilaian')
      }

      toast({
        title: "Berhasil",
        description: `Penilaian ${aspect.replace(/_/g, ' ')} berhasil disimpan`
      })

      fetchStatistics()
    } catch (error: any) {
      console.error('[Save Assessment] Error:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan penilaian",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedStudent) return

    try {
      setSavingNotes(true)
      const userId = localStorage.getItem('userId')

      const date = getSemesterDateRange(selectedSemester as 'Ganjil' | 'Genap').start

      const getAssessResponse = await fetch(`/api/guru/get-assessment?teacherId=${userId}&studentId=${selectedStudent.id}&date=${getSemesterDateRange(selectedSemester as 'Ganjil' | 'Genap').month}`)
      let existingDocData: any = {}
      if (getAssessResponse.ok) {
        const getAssessData = await getAssessResponse.json()
        if (getAssessData.success && getAssessData.assessments) {
          const catatanAssessment = getAssessData.assessments.find((a: any) => a.aspect === 'catatan_perkembangan')
          if (catatanAssessment?.documentation) {
            try {
              existingDocData = JSON.parse(catatanAssessment.documentation)
            } catch { /* ignore */ }
          }
        }
      }

      const documentation = {
        ...existingDocData,
        photos: uploadedPhotos
      }

      const response = await fetch('/api/guru/save-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: userId,
          studentId: selectedStudent.id,
          aspect: 'catatan_perkembangan',
          score: 'BSH',
          observation: sharedNotes.observation || '',
          notes: sharedNotes.anecdotalNotes || '',
          documentation: JSON.stringify(documentation),
          semester: selectedSemester,
          academicYear: selectedYear,
          date: date
        })
      })

      if (!response.ok) {
        throw new Error('Gagal menyimpan catatan')
      }

      toast({
        title: "Berhasil",
        description: "Catatan perkembangan berhasil disimpan"
      })

      fetchStatistics()
    } catch (error: any) {
      console.error('[Save Notes] Error:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan catatan",
        variant: "destructive"
      })
    } finally {
      setSavingNotes(false)
    }
  }

  const getProgressWidth = (score: string) => {
    switch (score) {
      case 'BB': return 'w-1/4'
      case 'MB': return 'w-2/4'
      case 'BSH': return 'w-3/4'
      case 'BSB': return 'w-full'
      default: return 'w-0'
    }
  }

  const getProgressColor = (score: string) => {
    switch (score) {
      case 'BB': return 'bg-red-400'
      case 'MB': return 'bg-orange-400'
      case 'BSH': return 'bg-emerald-400'
      case 'BSB': return 'bg-blue-400'
      default: return 'bg-gray-200'
    }
  }

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'BB': return 'bg-red-100 text-red-800 border-red-200'
      case 'MB': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'BSH': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'BSB': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSemesterLabel = (semester: string) => {
    return semester === 'Ganjil' ? 'Semester 1 (Ganjil)' : 'Semester 2 (Genap)'
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setTemplateIndices = (_indices: any) => {
    // Reserved for future use
  }

  return (
    <DashboardLayout role="guru" userName="Guru">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Penilaian Perkembangan Anak</h1>
          <p className="text-muted-foreground mt-2">
            Evaluasi dan catat perkembangan belajar anak didik
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
              <p className="text-xs text-muted-foreground">
                Kelas {selectedStudent?.className || '-'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sudah Dinilai</CardTitle>
              <Star className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{stats?.assessedStudents || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.progress || '0%'} selesai
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Catatan Anekdot</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.anecdotalNotesCount || 0}</div>
              <p className="text-xs text-muted-foreground">Catatan khusus</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dokumentasi</CardTitle>
              <Camera className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats?.documentationCount || 0}</div>
              <p className="text-xs text-muted-foreground">Foto kegiatan</p>
            </CardContent>
          </Card>
        </div>

        {/* Assessment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Form Penilaian</CardTitle>
            <div className="flex flex-col gap-4 mt-4">
              <Select
                value={selectedStudent?.id || ''}
                onValueChange={handleStudentChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Siswa" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.nis})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Pilih Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ganjil">Semester 1 (Ganjil)</SelectItem>
                    <SelectItem value="Genap">Semester 2 (Genap)</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Tahun Ajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={prevYear}>{prevYear}</SelectItem>
                    <SelectItem value={currentYear}>{currentYear}</SelectItem>
                    <SelectItem value={nextYear}>{nextYear}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedStudent ? (
              <div className="space-y-6">
                {/* Student Info */}
                <div className="mb-6 p-4 rounded-lg bg-muted/50">
                  <h3 className="font-semibold mb-1">
                    Siswa: {selectedStudent.name} ({selectedStudent.nis})
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Kelas {selectedStudent.className} • Periode: {getSemesterLabel(selectedSemester)} {selectedYear}
                  </p>
                </div>

                {/* Form Sections with Cards */}
                <div className="space-y-6">
                  {/* Aspect 1: Agama & Budi Pekerti */}
                  <Card className="border-l-4 border-l-emerald-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">A</div>
                        Nilai Agama dan Budi Pekerti
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="mb-2 block">Nilai Perkembangan</Label>
                        <div className="grid grid-cols-4 gap-3">
                          {['BB', 'MB', 'BSH', 'BSB'].map((score) => (
                            <button
                              key={score}
                              onClick={() => handleScoreChange('agama_budi_pekerti', score)}
                              className={`p-3 rounded-lg border-2 text-center transition-all hover:shadow-md ${
                                formValues.agama_budi_pekerti?.score === score
                                  ? getScoreColor(score)
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="font-bold text-lg">{score}</div>
                              <div className="text-xs mt-1">{scoreLabels[score]}</div>
                            </button>
                          ))}
                        </div>
                        {formValues.agama_budi_pekerti?.score && (
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className={`h-2 rounded-full transition-all ${getProgressColor(formValues.agama_budi_pekerti.score)} ${getProgressWidth(formValues.agama_budi_pekerti.score)}`} />
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Observasi / Narasi</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateNarrative('agama_budi_pekerti', 'notes')}
                            disabled={!formValues.agama_budi_pekerti?.score}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Generate Narasi
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Tulis observasi perkembangan nilai agama dan budi pekerti..."
                          rows={3}
                          value={formValues.agama_budi_pekerti?.notes || ''}
                          onChange={(e) => handleNotesChange('agama_budi_pekerti', e.target.value)}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleSaveAssessment('agama_budi_pekerti')}
                          disabled={saving || !formValues.agama_budi_pekerti?.score}
                        >
                          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                          Simpan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Aspect 2: Jati Diri */}
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">B</div>
                        Jati Diri
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="mb-2 block">Nilai Perkembangan</Label>
                        <div className="grid grid-cols-4 gap-3">
                          {['BB', 'MB', 'BSH', 'BSB'].map((score) => (
                            <button
                              key={score}
                              onClick={() => handleScoreChange('jati_diri', score)}
                              className={`p-3 rounded-lg border-2 text-center transition-all hover:shadow-md ${
                                formValues.jati_diri?.score === score
                                  ? getScoreColor(score)
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="font-bold text-lg">{score}</div>
                              <div className="text-xs mt-1">{scoreLabels[score]}</div>
                            </button>
                          ))}
                        </div>
                        {formValues.jati_diri?.score && (
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className={`h-2 rounded-full transition-all ${getProgressColor(formValues.jati_diri.score)} ${getProgressWidth(formValues.jati_diri.score)}`} />
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Observasi / Narasi</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateNarrative('jati_diri', 'notes')}
                            disabled={!formValues.jati_diri?.score}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Generate Narasi
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Tulis observasi perkembangan jati diri anak..."
                          rows={3}
                          value={formValues.jati_diri?.notes || ''}
                          onChange={(e) => handleNotesChange('jati_diri', e.target.value)}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleSaveAssessment('jati_diri')}
                          disabled={saving || !formValues.jati_diri?.score}
                        >
                          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                          Simpan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Aspect 3: Literasi, Sains, Teknologi */}
                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">C</div>
                        Dasar-dasar Literasi, Matematika, Sains, Teknologi, Rekayasa dan Seni
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="mb-2 block">Nilai Perkembangan</Label>
                        <div className="grid grid-cols-4 gap-3">
                          {['BB', 'MB', 'BSH', 'BSB'].map((score) => (
                            <button
                              key={score}
                              onClick={() => handleScoreChange('literasi_sains', score)}
                              className={`p-3 rounded-lg border-2 text-center transition-all hover:shadow-md ${
                                formValues.literasi_sains?.score === score
                                  ? getScoreColor(score)
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="font-bold text-lg">{score}</div>
                              <div className="text-xs mt-1">{scoreLabels[score]}</div>
                            </button>
                          ))}
                        </div>
                        {formValues.literasi_sains?.score && (
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className={`h-2 rounded-full transition-all ${getProgressColor(formValues.literasi_sains.score)} ${getProgressWidth(formValues.literasi_sains.score)}`} />
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Observasi / Narasi</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateNarrative('literasi_sains', 'notes')}
                            disabled={!formValues.literasi_sains?.score}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Generate Narasi
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Tulis observasi perkembangan literasi, matematika, sains, teknologi, rekayasa dan seni..."
                          rows={3}
                          value={formValues.literasi_sains?.notes || ''}
                          onChange={(e) => handleNotesChange('literasi_sains', e.target.value)}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleSaveAssessment('literasi_sains')}
                          disabled={saving || !formValues.literasi_sains?.score}
                        >
                          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                          Simpan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Documentation Section */}
                  <Card className="border-l-4 border-l-orange-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">D</div>
                        Observasi Kegiatan & Catatan Perkembangan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Template Style Selector */}
                      <div className="flex items-center gap-3">
                        <Label className="text-sm">Gaya Narasi:</Label>
                        <div className="flex gap-2">
                          {templateStyles.map((style) => (
                            <button
                              key={style}
                              onClick={() => setTemplateStyle(style)}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                templateStyle === style
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Observation */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Observasi Kegiatan</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateNarrative('agama_budi_pekerti', 'observation')}
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Generate Narasi
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Deskripsikan kegiatan perkembangan siswa secara umum..."
                          rows={4}
                          value={sharedNotes.observation}
                          onChange={(e) => setSharedNotes(prev => ({ ...prev, observation: e.target.value }))}
                        />
                      </div>

                      {/* Anecdotal Notes */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Catatan Anekdot</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateNarrative('agama_budi_pekerti', 'notes')}
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Generate Narasi
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Catatan insidental tentang perilaku dan perkembangan siswa..."
                          rows={3}
                          value={sharedNotes.anecdotalNotes}
                          onChange={(e) => setSharedNotes(prev => ({ ...prev, anecdotalNotes: e.target.value }))}
                        />
                      </div>

                      {/* Photo Upload */}
                      <div>
                        <Label className="mb-2 block">Dokumentasi Foto</Label>
                        <div className="flex gap-2 mb-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Foto
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUploadedPhotos([])}
                            disabled={uploadedPhotos.length === 0}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reset Foto
                          </Button>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          ref={fileInputRef}
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        {uploadedPhotos.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {uploadedPhotos.map((photo, index) => (
                              <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border-2">
                                <img
                                  src={photo}
                                  alt={`Dokumentasi ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  onClick={() => removePhoto(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                            <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Belum ada foto. Klik Upload Foto untuk menambahkan.</p>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <Button
                          onClick={handleSaveNotes}
                          disabled={savingNotes}
                        >
                          {savingNotes ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                          Simpan Catatan & Dokumentasi
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Pilih siswa untuk mulai menilai</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}