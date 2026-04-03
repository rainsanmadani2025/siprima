'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Palette,
  Camera,
  Video,
  Download,
  Calendar,
  Eye,
  ArrowLeft,
  RefreshCw
} from 'lucide-react'
import { io, Socket } from 'socket.io-client'
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

interface Portfolio {
  id: string
  studentId: string
  title: string
  type: string
  description?: string | null
  fileUrl?: string | null
  date: string
  createdAt: string
  updatedAt: string
  student: {
    id: string
    name: string
    nis: string
  }
}

export default function PortofolioPage() {
  const router = useRouter()
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('karya')
  const [socket, setSocket] = useState<Socket | null>(null)

  // Student ID yang sedang login (hardcoded untuk demo)
  const studentId = 'student-1'

  // Fetch portfolios from API
  const fetchPortfolios = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/portfolios?studentId=${studentId}`)
      const data = await response.json()
      setPortfolios(data.portfolios || [])
    } catch (error) {
      console.error('Error fetching portfolios:', error)
    } finally {
      setLoading(false)
    }
  }, [studentId])

  // Initialize WebSocket for real-time updates
  useEffect(() => {
    const socketInstance = io('/', {
      query: { XTransformPort: 3003 },
      transports: ['websocket', 'polling']
    })

    socketInstance.on('connect', () => {
      console.log('Connected to chat service for portfolios')
      socketInstance.emit('user:join', {
        userId: 'user-parent-1',
        role: 'ORTU',
        name: 'Bapak Ahmad Fauzi'
      })
    })

    // Listen for new portfolio
    socketInstance.on('portfolio:new', (data) => {
      console.log('New portfolio received:', data)
      // If portfolio belongs to this parent's child, refresh
      if (data.studentId === studentId) {
        fetchPortfolios()
      }
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [fetchPortfolios, studentId])

  // Initial fetch
  useEffect(() => {
    fetchPortfolios()
  }, [fetchPortfolios])

  const filterByType = (type: string) => {
    return portfolios.filter(p => p.type === type)
  }

  const renderPortfolio = (data: Portfolio[], type: string) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )
    }

    if (data.length === 0) {
      return (
        <div className="text-center text-gray-500 py-12">
          {type === 'karya' && <Palette className="w-12 h-12 mx-auto mb-2 text-gray-400" />}
          {type === 'foto' && <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />}
          {type === 'video' && <Video className="w-12 h-12 mx-auto mb-2 text-gray-400" />}
          <p>Belum ada {type} anak</p>
        </div>
      )
    }

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((item) => (
          <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`aspect-square flex items-center justify-center relative ${
              type === 'karya' ? 'bg-gradient-to-br from-purple-100 to-pink-100' :
              type === 'foto' ? 'bg-gradient-to-br from-blue-100 to-cyan-100' :
              'bg-gradient-to-br from-rose-100 to-orange-100'
            }`}>
              {type === 'karya' && <Palette className="w-16 h-16 text-purple-400 group-hover:scale-110 transition-transform" />}
              {type === 'foto' && <Camera className="w-16 h-16 text-blue-400 group-hover:scale-110 transition-transform" />}
              {type === 'video' && <Video className="w-16 h-16 text-rose-400 group-hover:scale-110 transition-transform" />}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary">
                  <Eye className="w-4 h-4 mr-1" />
                  {type === 'video' ? 'Putar' : 'Lihat'}
                </Button>
                {item.fileUrl && (
                  <Button size="sm" variant="secondary" onClick={() => window.open(item.fileUrl!, '_blank')}>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                )}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                <Badge variant="secondary" className="flex-shrink-0">{type}</Badge>
              </div>
              {item.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
              )}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{new Date(item.date).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const stats = {
    karya: portfolios.filter(p => p.type === 'karya').length,
    foto: portfolios.filter(p => p.type === 'foto').length,
    video: portfolios.filter(p => p.type === 'video').length
  }

  return (
    <DashboardLayout role="ortu" userName="Bapak/Ibu Orang Tua">
      <div className="space-y-6">
      <div className="flex justify-between items-center pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portofolio Anak</h1>
          <p className="text-gray-600 mt-1">Kumpulan karya, foto, dan video kegiatan anak</p>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/ortu')}
            className="mt-4 gap-2 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={fetchPortfolios}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Karya Anak</p>
                <p className="text-3xl font-bold mt-1">{stats.karya}</p>
              </div>
              <Palette className="w-10 h-10 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Foto Kegiatan</p>
                <p className="text-3xl font-bold mt-1">{stats.foto}</p>
              </div>
              <Camera className="w-10 h-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-500 to-orange-500 text-white border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-100 text-sm font-medium">Video Kegiatan</p>
                <p className="text-3xl font-bold mt-1">{stats.video}</p>
              </div>
              <Video className="w-10 h-10 text-rose-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full bg-white border">
          <TabsTrigger value="karya" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Karya Anak
          </TabsTrigger>
          <TabsTrigger value="foto" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Foto Kegiatan
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Video Kegiatan
          </TabsTrigger>
        </TabsList>

        {/* Tab Karya Anak */}
        <TabsContent value="karya">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-6 h-6 text-purple-600" />
                Karya Anak
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {renderPortfolio(filterByType('karya'), 'karya')}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Foto Kegiatan */}
        <TabsContent value="foto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-6 h-6 text-blue-600" />
                Foto Kegiatan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {renderPortfolio(filterByType('foto'), 'foto')}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Video Kegiatan */}
        <TabsContent value="video">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-6 h-6 text-rose-600" />
                Video Kegiatan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {renderPortfolio(filterByType('video'), 'video')}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Catatan */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Eye className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-blue-900">Catatan</p>
              <p className="text-blue-800">
                Portofolio ini berisi dokumentasi karya dan kegiatan anak yang diunggah oleh guru.
                Orang tua dapat melihat dan mendownload dokumentasi ini sebagai kenangan.
                Jika ingin mendapatkan file asli berkualitas tinggi, silakan hubungi guru atau sekolah.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  )
}
