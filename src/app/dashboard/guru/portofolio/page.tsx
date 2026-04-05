'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, Loader2, Users, Image as ImageIcon, X, Video, Upload } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Student {
  id: string
  name: string
  nis: string
}

export default function EditPortofolioPage() {
  const params = useParams()
  const portfolioId = params.id as string
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [studentsLoading, setStudentsLoading] = useState(true)
  const [files, setFiles] = useState<File[]>([])
  const [filePreviews, setFilePreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    studentId: '',
    title: '',
    type: 'karya',
    description: '',
    videoUrl: '',
    date: new Date().toISOString().split('T')[0]
  })

  // Fetch portfolio data and students on mount
  useEffect(() => {
    fetchPortfolioData()
    fetchStudents()
  }, [portfolioId])

  const fetchPortfolioData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/portfolios/${portfolioId}`)
      const data = await response.json()

      if (data.success && data.portfolio) {
        const portfolio = data.portfolio
        setFormData({
          studentId: portfolio.studentId,
          title: portfolio.title,
          type: portfolio.type,
          description: portfolio.description || '',
          videoUrl: portfolio.videoUrl || '',
          date: portfolio.date
        })
        // Load existing fileUrls
        if (portfolio.fileUrls && portfolio.fileUrls.length > 0) {
          setFilePreviews(portfolio.fileUrls)
        }
      } else {
        toast({
          title: "Error",
          description: "Portfolio tidak ditemukan",
          variant: "destructive"
        })
        window.location.href = '/dashboard/guru/portofolio'
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      setStudentsLoading(true)
      const userId = localStorage.getItem('userId')
      if (!userId) {
        console.warn('[Edit Portofolio] No userId found')
        return
      }

      const response = await fetch(`/api/guru/students-list?userId=${userId}`)
      const data = await response.json()
      if (data.success && data.students) {
        setStudents(data.students)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setStudentsLoading(false)
    }
  }

  const handleSubmit = async () => {
    // Validasi form
    if (!formData.studentId) {
      toast({
        title: "Error",
        description: "Silakan pilih siswa terlebih dahulu",
        variant: "destructive"
      })
      return
    }

    if (!formData.title) {
      toast({
        title: "Error",
        description: "Silakan masukkan judul portfolio",
        variant: "destructive"
      })
      return
    }

    if (!formData.date) {
      toast({
        title: "Error",
        description: "Silakan pilih tanggal",
        variant: "destructive"
      })
      return
    }

    setSaving(true)
    try {
      // Convert new files to base64 and combine with existing previews
      let allFileUrls: string[] = [...filePreviews]

      if (files.length > 0) {
        setUploading(true)
        const newFileUrls = await Promise.all(
          files.map(file =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.onloadend = () => resolve(reader.result as string)
              reader.onerror = reject
              reader.readAsDataURL(file)
            })
          )
        )
        allFileUrls = [...allFileUrls, ...newFileUrls]
        setUploading(false)
      }

      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          fileUrls: allFileUrls
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`)
      }

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Portfolio berhasil diperbarui"
        })
        window.location.href = '/dashboard/guru/portofolio'
      } else {
        throw new Error(data.error || 'Gagal memperbarui portfolio')
      }
    } catch (error: any) {
      console.error('Error updating portfolio:', error)
      toast({
        title: "Error",
        description: error.message || 'Gagal memperbarui portfolio',
        variant: "destructive"
      })
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length === 0) return

    // Validate each file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']
    const maxSize = 5 * 1024 * 1024 // 5MB

    const validFiles: File[] = []

    for (const file of selectedFiles) {
      // Validate file size
      if (file.size > maxSize) {
        toast({
          title: "Error",
          description: `File ${file.name} terlalu besar (maks 5MB)`,
          variant: "destructive"
        })
        continue
      }

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: `File ${file.name} format tidak didukung`,
          variant: "destructive"
        })
        continue
      }

      validFiles.push(file)

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFilePreviews(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      }
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    // If it's an existing file (in previews), remove from previews
    if (index < filePreviews.length) {
      setFilePreviews(prev => prev.filter((_, i) => i !== index))
    }
    // If it's a new file, adjust index and remove from files
    const newFileIndex = index - filePreviews.length
    if (newFileIndex >= 0) {
      setFiles(prev => prev.filter((_, i) => i !== newFileIndex))
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
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/dashboard/guru/portofolio'}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Portofolio</h1>
            <p className="text-muted-foreground mt-2">
              Perbarui karya atau dokumentasi kegiatan siswa
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Portfolio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Pilih Siswa <span className="text-red-500">*</span></label>
                <Select
                  value={formData.studentId}
                  onValueChange={(value) => setFormData({ ...formData, studentId: value })}
                  disabled={studentsLoading}
                >
                  <SelectTrigger>
                    {studentsLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memuat siswa...</span>
                      </div>
                    ) : students.length === 0 ? (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Tidak ada siswa</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Pilih siswa" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.nis})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipe Portfolio <span className="text-red-500">*</span></label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="karya">Hasil Karya</SelectItem>
                    <SelectItem value="foto">Foto Kegiatan</SelectItem>
                    <SelectItem value="video">Video Kegiatan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Judul <span className="text-red-500">*</span></label>
                <Input
                  placeholder="Masukkan judul portfolio"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tanggal <span className="text-red-500">*</span></label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Unggah File/Gambar (Opsional)</label>
              <div className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-primary ${
                    filePreviews.length > 0 || files.length > 0 ? 'border-primary bg-primary/5' : 'border-input'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,application/pdf"
                    onChange={handleFileChange}
                    disabled={uploading || saving}
                    id="file-upload"
                    className="hidden"
                    multiple
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground">
                        {filePreviews.length + files.length > 0
                          ? `${filePreviews.length + files.length} file dipilih. Klik untuk tambah lagi.`
                          : 'Klik untuk memilih file'}
                      </p>
                      <p className="text-muted-foreground">
                        JPG, PNG, GIF, atau PDF (maks 5MB per file)
                      </p>
                    </div>
                  </label>
                </div>

                {/* File Previews */}
                {(filePreviews.length > 0 || files.length > 0) && (
                  <div className="grid grid-cols-4 gap-3">
                    {[...filePreviews, ...files.map(f => f.type.startsWith('image/') ? URL.createObjectURL(f) : '')].map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="relative w-full aspect-square rounded-lg border overflow-hidden bg-muted">
                          {preview ? (
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-2xl">📄</span>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors opacity-0 group-hover:opacity-100"
                          disabled={saving || uploading}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Unggah file atau gambar untuk portofolio ini. Bisa memilih beberapa file sekaligus.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Link Video Kegiatan (Opsional)</label>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <Input
                  type="url"
                  placeholder="Masukkan link video (YouTube, dll)"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Masukkan URL video dokumentasi kegiatan (opsional)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Deskripsi</label>
              <Textarea
                placeholder="Jelaskan kegiatan atau karya ini..."
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/dashboard/guru/portofolio'}
                disabled={saving}
              >
                Batal
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
