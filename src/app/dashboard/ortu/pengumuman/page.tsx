'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Bell,
  Calendar,
  Megaphone,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Filter,
  Search,
  Star,
  Info,
  ArrowLeft,
  RefreshCw
} from 'lucide-react'
import { io, Socket } from 'socket.io-client'
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

interface Announcement {
  id: string
  title: string
  content: string
  category: string
  targetAudience: string
  eventDate?: string | null
  priority: string
  createdAt: string
  updatedAt: string
}

export default function PengumumanPage() {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('semua')
  const [socket, setSocket] = useState<Socket | null>(null)

  // Fetch announcements from API
  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/announcements?targetAudience=ortu')
      const data = await response.json()
      setAnnouncements(data.announcements || [])
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initialize WebSocket for real-time updates
  useEffect(() => {
    const socketInstance = io('/', {
      query: { XTransformPort: 3003 },
      transports: ['websocket', 'polling']
    })

    socketInstance.on('connect', () => {
      console.log('Connected to chat service for announcements')
      socketInstance.emit('user:join', {
        userId: 'user-parent-1',
        role: 'ORTU',
        name: 'Bapak Ahmad Fauzi'
      })
    })

    // Listen for new announcement
    socketInstance.on('announcement:new', (data) => {
      console.log('New announcement received:', data)
      fetchAnnouncements()
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [fetchAnnouncements])

  // Initial fetch
  useEffect(() => {
    fetchAnnouncements()
  }, [fetchAnnouncements])

  const getCategoryBadge = (category: string) => {
    if (category.includes('libur') || category.includes('Libur')) {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">{category}</Badge>
    } else if (category.includes('rapat') || category.includes('Rapat')) {
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">{category}</Badge>
    } else if (category.includes('pentas') || category.includes('Pentas')) {
      return <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">{category}</Badge>
    } else if (category.includes('outing') || category.includes('Outing') || category.includes('kegiatan') || category.includes('Kegiatan')) {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{category}</Badge>
    } else if (category.includes('spp') || category.includes('SPP') || category.includes('pembayaran') || category.includes('Pembayaran') || category.includes('pendaftaran') || category.includes('Pendaftaran')) {
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">{category}</Badge>
    } else if (category.includes('umum') || category.includes('Umum')) {
      return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">{category}</Badge>
    } else {
      return <Badge variant="secondary">{category}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    if (priority === 'urgent') {
      return (
        <Badge className="bg-red-500 text-white hover:bg-red-600 flex-shrink-0">
          <Star className="w-3 h-3 mr-1" />
          Penting
        </Badge>
      )
    } else if (priority === 'important') {
      return (
        <Badge className="bg-amber-500 text-white hover:bg-amber-600 flex-shrink-0">
          <AlertCircle className="w-3 h-3 mr-1" />
          Penting
        </Badge>
      )
    }
    return null
  }

  const filterByCategory = (category: string) => {
    if (category === 'semua') return announcements

    return announcements.filter(a =>
      a.category.toLowerCase().includes(category.toLowerCase())
    )
  }

  const renderPengumuman = (data: Announcement[]) => {
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
          <Bell className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>Belum ada pengumuman</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {data.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.priority === 'urgent' ? 'bg-red-100' :
                      item.priority === 'important' ? 'bg-amber-100' : 'bg-blue-100'
                    }`}>
                      {item.priority === 'urgent' || item.priority === 'important' ? (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <Info className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                        {getPriorityBadge(item.priority)}
                      </div>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {getCategoryBadge(item.category)}
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {item.eventDate
                              ? new Date(item.eventDate).toLocaleDateString('id-ID', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric'
                                })
                              : new Date(item.createdAt).toLocaleDateString('id-ID', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric'
                                })
                            }
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{item.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const stats = {
    baru: announcements.filter(a => {
      const daysSinceCreated = (new Date().getTime() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceCreated <= 3
    }).length,
    penting: announcements.filter(a => a.priority === 'urgent' || a.priority === 'important').length,
    total: announcements.length
  }

  return (
    <DashboardLayout role="ortu" userName="Bapak/Ibu Orang Tua">
      <div className="space-y-6">
      <div className="flex justify-between items-center pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pengumuman Sekolah</h1>
          <p className="text-gray-600 mt-1">Informasi penting dari sekolah untuk orang tua dan wali murid</p>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/ortu')}
            className="mt-4 gap-2 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchAnnouncements}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.baru}</p>
                <p className="text-sm text-gray-600">Pengumuman Baru</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.penting}</p>
                <p className="text-sm text-gray-600">Penting</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Pengumuman</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Pengumuman */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full bg-white border">
          <TabsTrigger value="semua">
            <Bell className="w-4 h-4 mr-2" />
            Semua
          </TabsTrigger>
          <TabsTrigger value="libur">
            <Calendar className="w-4 h-4 mr-2" />
            Libur
          </TabsTrigger>
          <TabsTrigger value="rapat">
            <Megaphone className="w-4 h-4 mr-2" />
            Rapat
          </TabsTrigger>
          <TabsTrigger value="kegiatan">
            <Star className="w-4 h-4 mr-2" />
            Kegiatan
          </TabsTrigger>
          <TabsTrigger value="pembayaran">
            <DollarSign className="w-4 h-4 mr-2" />
            Pembayaran
          </TabsTrigger>
        </TabsList>

        {/* Tab Semua */}
        <TabsContent value="semua">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-6 h-6 text-emerald-600" />
                Semua Pengumuman
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {renderPengumuman(filterByCategory('semua'))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Libur */}
        <TabsContent value="libur">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-red-600" />
                Pengumuman Libur
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {renderPengumuman(filterByCategory('libur'))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Rapat */}
        <TabsContent value="rapat">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-purple-600" />
                Pengumuman Rapat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {renderPengumuman(filterByCategory('rapat'))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Kegiatan */}
        <TabsContent value="kegiatan">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-6 h-6 text-pink-600" />
                Pengumuman Kegiatan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {renderPengumuman(filterByCategory('kegiatan'))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Pembayaran */}
        <TabsContent value="pembayaran">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-orange-600" />
                Pengumuman Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {renderPengumuman(filterByCategory('pembayaran'))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Catatan */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-blue-900">Informasi</p>
              <p className="text-blue-800">
                Pengumuman dengan label "Penting" memerlukan perhatian khusus dan tindakan dari orang tua.
                Silakan periksa pengumuman secara berkala untuk mendapatkan informasi terbaru dari sekolah.
                Untuk pertanyaan lebih lanjut, hubungi administrasi sekolah atau guru kelas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  )
}
