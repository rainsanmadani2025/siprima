'use client'

import { useState, useEffect, useCallback } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Palette,
  Camera,
  Video,
  Download,
  Eye,
  RefreshCw,
  Loader2,
  FileText,
  Users,
  GraduationCap,
  Image
} from 'lucide-react'

interface ClassItem {
  id: string
  name: string
  ageGroup: string
  teacher: {
    id: string
    user: {
      name: string
    }
  } | null
  _count: {
    students: number
  }
}

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
    class: {
      id: string
      name: string
      ageGroup: string
      teacher: {
        id: string
        user: {
          name: string
        }
      } | null
    } | null
  }
}

export default function KepsekPortofolioPage() {
  const [userName, setUserName] = useState('Kepala Sekolah')
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filterClass, setFilterClass] = useState('semua')
  const [filterType, setFilterType] = useState('semua')
  const [previewItem, setPreviewItem] = useState<Portfolio | null>(null)
  const [activeTab, setActiveTab] = useState('semua')

  // Load user from localStorage
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName')
    if (storedUserName) {
      setUserName(storedUserName)
    }
  }, [])

  // Fetch portfolios and classes
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterClass !== 'semua') {
        params.append('classId', filterClass)
      }
      if (filterType !== 'semua') {
        params.append('type', filterType)
      }

      const response = await fetch(`/api/kepsek/portofolios?${params}`)
      const data = await response.json()
      if (data.success) {
        setPortfolios(data.portfolios || [])
        setClasses(data.classes || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [filterClass, filterType])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Refresh data when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchData])

  const handlePreview = (item: Portfolio) => {
    setPreviewItem(item)
  }

  const handleDownload = (item: Portfolio) => {
    if (item.fileUrl) {
      const link = document.createElement('a')
      link.href = item.fileUrl
      link.download = item.title
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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

  const filteredPortfolios = activeTab === 'semua'
    ? portfolios
    : portfolios.filter(p => p.type === activeTab)

  const stats = {
    total: portfolios.length,
    karya: portfolios.filter(p => p.type === 'karya').length,
    foto: portfolios.filter(p => p.type === 'foto').length,
    video: portfolios.filter(p => p.type === 'video').length
  }

  const renderGallery = (data: Portfolio[]) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )
    }

    if (data.length === 0) {
      return (
        <div className="text-center text-gray-500 py-12">
          <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>Belum ada portofolio</p>
        </div>
      )
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((portfolio) => (
          <div key={portfolio.id} className="group rounded-lg overflow-hidden border bg-white hover:shadow-lg transition-shadow">
            <div className={`relative aspect-square flex items-center justify-center overflow-hidden ${
              portfolio.type === 'karya' ? 'bg-gradient-to-br from-purple-100 to-pink-100' :
              portfolio.type === 'foto' ? 'bg-gradient-to-br from-blue-100 to-cyan-100' :
              'bg-gradient-to-br from-rose-100 to-orange-100'
            }`}>
              {portfolio.type === 'karya' && !portfolio.fileUrl && (
                <Palette className="w-16 h-16 text-purple-400 group-hover:scale-110 transition-transform" />
              )}
              {portfolio.type === 'foto' && !portfolio.fileUrl && (
                <Camera className="w-16 h-16 text-blue-400 group-hover:scale-110 transition-transform" />
              )}
              {portfolio.type === 'video' && (
                <Video className="w-16 h-16 text-rose-400 group-hover:scale-110 transition-transform" />
              )}
              {portfolio.fileUrl && (
                <img
                  src={portfolio.fileUrl}
                  alt={portfolio.title}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              )}
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-1">{portfolio.title}</h3>
                  <p className="text-xs text-muted-foreground">{portfolio.student.name}</p>
                </div>
                {getTypeBadge(portfolio.type)}
              </div>

              {/* Class & Teacher info */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                {portfolio.student.class && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    <GraduationCap className="w-3 h-3 mr-0.5" />
                    Kelas {portfolio.student.class.name}
                  </Badge>
                )}
              </div>
              {portfolio.student.class?.teacher && (
                <p className="text-xs text-muted-foreground mb-1">
                  <Users className="w-3 h-3 inline mr-0.5" />
                  {portfolio.student.class.teacher.user.name}
                </p>
              )}

              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                {new Date(portfolio.date).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>

              {portfolio.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {portfolio.description}
                </p>
              )}

              {portfolio.videoUrl && (
                <a
                  href={portfolio.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline mb-2 block"
                >
                  Lihat Video
                </a>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handlePreview(portfolio)}
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  Lihat
                </Button>
                {portfolio.fileUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDownload(portfolio)}
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Download
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <DashboardLayout role="kepsek" userName={userName}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Portofolio Siswa</h1>
            <p className="text-muted-foreground mt-2">
              Lihat semua karya dan dokumentasi kegiatan siswa
            </p>
          </div>
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Statistik */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-sm font-medium">Total Portofolio</span>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Semua siswa</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-sm font-medium">Hasil Karya</span>
              <Palette className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.karya}</div>
              <p className="text-xs text-muted-foreground mt-1">Gambar, kerajinan, dll.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-sm font-medium">Foto Kegiatan</span>
              <Camera className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.foto}</div>
              <p className="text-xs text-muted-foreground mt-1">Dokumentasi kegiatan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <span className="text-sm font-medium">Video Kegiatan</span>
              <Video className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.video}</div>
              <p className="text-xs text-muted-foreground mt-1">Rekam kegiatan</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Filter Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Kelas</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  Kelas {cls.name} {cls.teacher ? `(${cls.teacher.user.name})` : ''} — {cls._count.students} siswa
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
        </div>

        {/* Tabs for quick type filter */}
        <div className="flex gap-2">
          {[
            { value: 'semua', label: 'Semua', icon: FileText },
            { value: 'karya', label: 'Karya', icon: Palette },
            { value: 'foto', label: 'Foto', icon: Camera },
            { value: 'video', label: 'Video', icon: Video }
          ].map((tab) => (
            <Button
              key={tab.value}
              variant={activeTab === tab.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.value)}
              className="gap-1.5"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Gallery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Gallery Portofolio Siswa
              {!loading && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({filteredPortfolios.length} item)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {renderGallery(filteredPortfolios)}
          </CardContent>
        </Card>

        {/* Preview Dialog */}
        <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{previewItem?.title}</DialogTitle>
            </DialogHeader>
            {previewItem && (
              <div className="space-y-4">
                {/* Image Preview */}
                <div className="relative rounded-lg overflow-hidden bg-muted flex items-center justify-center min-h-[300px]">
                  {previewItem.fileUrl ? (
                    <img
                      src={previewItem.fileUrl}
                      alt={previewItem.title}
                      className="max-w-full max-h-[60vh] object-contain"
                    />
                  ) : previewItem.videoUrl ? (
                    <div className="text-center p-8">
                      <Video className="w-16 h-16 text-rose-400 mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">Video tidak dapat ditampilkan di preview</p>
                      <a
                        href={previewItem.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Buka video di tab baru
                      </a>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      {previewItem.type === 'karya' && <Palette className="w-16 h-16 text-purple-400 mx-auto mb-4" />}
                      {previewItem.type === 'foto' && <Camera className="w-16 h-16 text-blue-400 mx-auto mb-4" />}
                      {previewItem.type === 'video' && <Video className="w-16 h-16 text-rose-400 mx-auto mb-4" />}
                      <p className="text-muted-foreground">Tidak ada file untuk ditampilkan</p>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Siswa</Badge>
                    <span className="text-sm">{previewItem.student.name} ({previewItem.student.nis})</span>
                  </div>
                  {previewItem.student.class && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Kelas</Badge>
                      <span className="text-sm">Kelas {previewItem.student.class.name}</span>
                      {previewItem.student.class.teacher && (
                        <span className="text-sm text-muted-foreground">— Guru: {previewItem.student.class.teacher.user.name}</span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Tanggal</Badge>
                    <span className="text-sm">
                      {new Date(previewItem.date).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Tipe</Badge>
                    {getTypeBadge(previewItem.type)}
                  </div>
                  {previewItem.description && (
                    <div className="flex items-start gap-2">
                      <Badge variant="outline">Keterangan</Badge>
                      <span className="text-sm">{previewItem.description}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                  {previewItem.fileUrl && (
                    <Button onClick={() => handleDownload(previewItem)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                  {previewItem.videoUrl && (
                    <a href={previewItem.videoUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline">
                        <Video className="w-4 h-4 mr-2" />
                        Buka Video
                      </Button>
                    </a>
                  )}
                  <Button variant="outline" onClick={() => setPreviewItem(null)}>
                    Tutup
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}