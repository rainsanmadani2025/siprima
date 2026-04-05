'use client'

import { useState, useEffect, useCallback } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Plus,
  Image,
  Video,
  FileText,
  Trash2,
  RefreshCw,
  Loader2,
  Users,
  Edit
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Portfolio {
  id: string
  studentId: string
  title: string
  type: string
  description?: string | null
  fileUrl?: string | null
  videoUrl?: string | null
  date: string
  createdAt: string
  updatedAt: string
  student: {
    id: string
    name: string
    nis: string
  }
}

export default function GuruPortofolioPage() {
  const { toast } = useToast()
  const [userName, setUserName] = useState('Ibu Guru')
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [students, setStudents] = useState<Array<{ id: string; name: string; nis: string }>>([])
  const [loading, setLoading] = useState(true)
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [filterType, setFilterType] = useState('semua')
  const [filterStudent, setFilterStudent] = useState('semua')

  // Load user from localStorage
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName')
    if (storedUserName) {
      setUserName(storedUserName)
    }
  }, [])

  // Fetch students
  const fetchStudents = useCallback(async () => {
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
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setStudentsLoading(false)
    }
  }, [])

  // Fetch portfolios
  const fetchPortfolios = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterStudent !== 'semua') {
        params.append('studentId', filterStudent)
      }
      if (filterType !== 'semua') {
        params.append('type', filterType)
      }

      const response = await fetch(`/api/portfolios?${params}`)
      const data = await response.json()
      console.log('Portfolios fetched:', data.portfolios)
      setPortfolios(data.portfolios || [])
    } catch (error) {
      console.error('Error fetching portfolios:', error)
    } finally {
      setLoading(false)
    }
  }, [filterType, filterStudent])

  // Initial fetch
  useEffect(() => {
    fetchStudents()
    fetchPortfolios()
  }, [fetchStudents, fetchPortfolios])

  // Refresh data when page becomes visible (e.g., after returning from edit page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchPortfolios()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchPortfolios])

  // Delete portfolio
  const deletePortfolio = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus portfolio ini?')) return

    try {
      setDeleteLoading(id)
      const response = await fetch(`/api/portfolios/${id}`, { method: 'DELETE' })
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Portfolio berhasil dihapus"
        })
        fetchPortfolios()
      } else {
        throw new Error(data.error || 'Gagal menghapus portfolio')
      }
    } catch (error: any) {
      console.error('Error deleting portfolio:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus portfolio",
        variant: "destructive"
      })
    } finally {
      setDeleteLoading(null)
    }
  }

  const getTypeBadge = (type: string) => {
    if (type === 'karya') {
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Karya</Badge>
    } else if (type === 'foto') {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Foto</Badge>
    } else if (type === 'video') {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Video</Badge>
    }
    return <Badge variant="secondary">{type}</Badge>
  }

  return (
    <DashboardLayout role="guru" userName={userName}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Portofolio Anak</h1>
            <p className="text-muted-foreground mt-2">
              Kelola karya dan dokumentasi kegiatan siswa
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchPortfolios}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => window.location.href = '/dashboard/guru/portofolio/tambah'}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Portofolio
            </Button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Tipe</SelectItem>
              <SelectItem value="karya">Hasil Karya</SelectItem>
              <SelectItem value="foto">Foto Kegiatan</SelectItem>
              <SelectItem value="video">Video Kegiatan</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStudent} onValueChange={setFilterStudent} disabled={studentsLoading}>
            <SelectTrigger className="w-64">
              {studentsLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memuat...</span>
                </div>
              ) : students.length === 0 ? (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Tidak ada siswa</span>
                </div>
              ) : (
                <SelectValue placeholder="Pilih Siswa" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Siswa</SelectItem>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} ({student.nis})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Statistik Portofolio */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-sm font-medium">Total Portfolio</span>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{portfolios.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Semua siswa</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-sm font-medium">Hasil Karya</span>
              <Image className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {portfolios.filter(p => p.type === 'karya').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Gambar, kerajinan, dll.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-sm font-medium">Foto Kegiatan</span>
              <Image className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {portfolios.filter(p => p.type === 'foto').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Dokumentasi kegiatan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-sm font-medium">Video Kegiatan</span>
              <Video className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {portfolios.filter(p => p.type === 'video').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Rekam kegiatan</p>
            </CardContent>
          </Card>
        </div>

        {/* Gallery Portofolio */}
        <Card>
          <CardHeader>
            <CardTitle>Gallery Portofolio</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : portfolios.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Belum ada portfolio</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {portfolios.map((portfolio) => (
                  <div key={portfolio.id} className="group relative rounded-lg overflow-hidden border bg-muted/50 hover:shadow-lg transition-shadow">
                    {console.log('Rendering portfolio:', portfolio.id, 'fileUrl:', portfolio.fileUrl)}
                    <div className={`relative aspect-video flex items-center justify-center overflow-hidden ${
                      portfolio.type === 'karya' ? 'bg-purple-50' :
                      portfolio.type === 'foto' ? 'bg-blue-50' :
                      'bg-red-50'
                    }`}>
                      {portfolio.type === 'karya' && <Image className="h-12 w-12 text-purple-400" />}
                      {portfolio.type === 'foto' && <Image className="h-12 w-12 text-blue-400" />}
                      {portfolio.type === 'video' && <Video className="h-12 w-12 text-red-400" />}
                      {portfolio.fileUrl && (
                        <img
                          src={portfolio.fileUrl}
                          alt={portfolio.title}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => console.error('Image load error:', portfolio.fileUrl, e)}
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-sm">{portfolio.title}</h3>
                          <p className="text-xs text-muted-foreground">{portfolio.student.name}</p>
                        </div>
                        {getTypeBadge(portfolio.type)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(portfolio.date).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      {portfolio.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {portfolio.description}
                        </p>
                      )}
                      {portfolio.videoUrl && (
                        <a 
                          href={portfolio.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-1 block"
                        >
                          Lihat Video
                        </a>
                      )}
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.location.href = `/dashboard/guru/portofolio/edit?id=${portfolio.id}`}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deletePortfolio(portfolio.id)}
                          disabled={deleteLoading === portfolio.id}
                        >
                          {deleteLoading === portfolio.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
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
