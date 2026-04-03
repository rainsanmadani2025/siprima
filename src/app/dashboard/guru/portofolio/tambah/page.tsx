'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface Student {
  id: string
  name: string
  nis: string
}

export default function TambahPortofolioPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [studentsLoading, setStudentsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    studentId: '',
    title: '',
    type: 'karya',
    description: '',
    fileUrl: '',
    videoUrl: '',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setStudentsLoading(true)
      const userId = localStorage.getItem('userId')
      if (!userId) {
        console.warn('[Portofolio] No userId found')
        return
      }

      const response = await fetch(`/api/guru/students-list?userId=${userId}`)
      const data = await response.json()
      if (data.success && data.students) {
        setStudents(data.students)
        if (data.students.length > 0) {
          setFormData(prev => ({ ...prev, studentId: data.students[0].id }))
        }
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setStudentsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.studentId || !formData.title || !formData.type) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: formData.studentId,
          title: formData.title,
          type: formData.type,
          description: formData.description,
          fileUrl: formData.fileUrl,
          videoUrl: formData.videoUrl,
          date: formData.date
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Portofolio berhasil ditambahkan"
        })
        router.push('/dashboard/guru/portofolio')
      } else {
        throw new Error(data.error || 'Gagal menambahkan portofolio')
      }
    } catch (error: any) {
      console.error('Error adding portfolio:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal menambahkan portofolio",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout role="guru" userName="Ibu Guru">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tambah Portofolio</h1>
            <p className="text-muted-foreground mt-2">
              Tambahkan karya atau dokumentasi kegiatan siswa baru
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Form Portofolio</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pilih Siswa */}
              <div className="space-y-2">
                <Label htmlFor="student">Siswa *</Label>
                <Select
                  value={formData.studentId}
                  onValueChange={(value) => setFormData({ ...formData, studentId: value })}
                  disabled={studentsLoading}
                >
                  <SelectTrigger id="student">
                    {studentsLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memuat...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Pilih Siswa" />
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

              {/* Judul */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masukkan judul portofolio"
                  required
                />
              </div>

              {/* Tipe */}
              <div className="space-y-2">
                <Label htmlFor="type">Tipe Portofolio *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Pilih Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="karya">Hasil Karya</SelectItem>
                    <SelectItem value="foto">Foto Kegiatan</SelectItem>
                    <SelectItem value="video">Video Kegiatan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan tentang portofolio ini..."
                  rows={4}
                />
              </div>

              {/* Tanggal */}
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              {/* File URL */}
              <div className="space-y-2">
                <Label htmlFor="fileUrl">URL File/Gambar</Label>
                <Input
                  id="fileUrl"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Masukkan URL lengkap ke file atau gambar portofolio
                </p>
              </div>

              {/* Video URL */}
              <div className="space-y-2">
                <Label htmlFor="videoUrl">URL Video (Opsional)</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="text-xs text-muted-foreground">
                  Masukkan URL video (YouTube, dll) untuk tipe Video Kegiatan
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan Portofolio
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
