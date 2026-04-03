'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Bell,
  Plus,
  Edit,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Send,
  RefreshCw
} from 'lucide-react'
import { io, Socket } from 'socket.io-client'

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

export default function KepsekPengumumanPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'umum',
    targetAudience: 'all',
    priority: 'normal',
    eventDate: ''
  })

  // Fetch announcements
  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/announcements')
      const data = await response.json()
      setAnnouncements(data.announcements || [])
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initialize WebSocket
  useEffect(() => {
    const socketInstance = io('/', {
      query: { XTransformPort: 3003 },
      transports: ['websocket', 'polling']
    })

    socketInstance.on('connect', () => {
      console.log('Kepsek connected to chat service')
      socketInstance.emit('user:join', {
        userId: 'user-kepsek-1',
        role: 'KEPSEK',
        name: 'Ibu Hj. Nurul Hidayah'
      })
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchAnnouncements()
  }, [fetchAnnouncements])

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'umum',
      targetAudience: 'all',
      priority: 'normal',
      eventDate: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  // Create announcement
  const createAnnouncement = async () => {
    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdBy: 'user-kepsek-1'
        })
      })

      const data = await response.json()

      if (socket && data.announcement) {
        socket.emit('announcement:new', data.announcement)
      }

      resetForm()
      fetchAnnouncements()
    } catch (error) {
      console.error('Error creating announcement:', error)
    }
  }

  // Update announcement
  const updateAnnouncement = async () => {
    if (!editingId) return

    try {
      await fetch(`/api/announcements/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      resetForm()
      fetchAnnouncements()
    } catch (error) {
      console.error('Error updating announcement:', error)
    }
  }

  // Delete announcement
  const deleteAnnouncement = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) return

    try {
      await fetch(`/api/announcements/${id}`, { method: 'DELETE' })
      fetchAnnouncements()
    } catch (error) {
      console.error('Error deleting announcement:', error)
    }
  }

  // Edit announcement
  const editAnnouncement = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      targetAudience: announcement.targetAudience,
      priority: announcement.priority,
      eventDate: announcement.eventDate || ''
    })
    setEditingId(announcement.id)
    setShowForm(true)
  }

  const getCategoryBadge = (category: string) => {
    if (category.includes('libur') || category.includes('Libur')) {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">{category}</Badge>
    } else if (category.includes('rapat') || category.includes('Rapat')) {
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">{category}</Badge>
    } else if (category.includes('pentas') || category.includes('Pentas')) {
      return <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">{category}</Badge>
    } else if (category.includes('outing') || category.includes('Outing') || category.includes('kegiatan') || category.includes('Kegiatan')) {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{category}</Badge>
    } else if (category.includes('spp') || category.includes('SPP') || category.includes('pembayaran') || category.includes('Pembayaran')) {
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">{category}</Badge>
    } else {
      return <Badge variant="secondary">{category}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    if (priority === 'urgent') {
      return <Badge className="bg-red-500 text-white hover:bg-red-600">Urgent</Badge>
    } else if (priority === 'important') {
      return <Badge className="bg-amber-500 text-white hover:bg-amber-600">Important</Badge>
    }
    return <Badge variant="secondary">Normal</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengelolaan Pengumuman</h1>
          <p className="text-muted-foreground mt-2">Buat dan kelola pengumuman untuk seluruh wali murid</p>
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
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Buat Pengumuman
          </Button>
        </div>
      </div>

      {/* Form Pengumuman */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingId ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}</span>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Judul Pengumuman</label>
                <Input
                  placeholder="Masukkan judul pengumuman"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Kategori</label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="umum">Umum</SelectItem>
                    <SelectItem value="libur">Libur</SelectItem>
                    <SelectItem value="rapat">Rapat</SelectItem>
                    <SelectItem value="kegiatan">Kegiatan</SelectItem>
                    <SelectItem value="pembayaran">Pembayaran</SelectItem>
                    <SelectItem value="pentas_seni">Pentas Seni</SelectItem>
                    <SelectItem value="parenting">Parenting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Prioritas</label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih prioritas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="important">Important</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Audience</label>
                <Select value={formData.targetAudience} onValueChange={(value) => setFormData({ ...formData, targetAudience: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="kepsek">Kepala Sekolah</SelectItem>
                    <SelectItem value="guru">Guru</SelectItem>
                    <SelectItem value="ortu">Orang Tua</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Acara (Opsional)</label>
              <Input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Isi Pengumuman</label>
              <Textarea
                placeholder="Tulis isi pengumuman..."
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>
                Batal
              </Button>
              <Button onClick={editingId ? updateAnnouncement : createAnnouncement}>
                <Send className="w-4 h-4 mr-2" />
                {editingId ? 'Update' : 'Kirim'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistik */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium">Total Pengumuman</span>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium">Urgent</span>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {announcements.filter(a => a.priority === 'urgent').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium">Important</span>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {announcements.filter(a => a.priority === 'important').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium">Target Orang Tua</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {announcements.filter(a => a.targetAudience === 'ortu' || a.targetAudience === 'all').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daftar Pengumuman */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Daftar Pengumuman
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <Bell className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Belum ada pengumuman</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          {getPriorityBadge(item.priority)}
                          {getCategoryBadge(item.category)}
                        </div>
                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Dibuat: {new Date(item.createdAt).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                          {item.eventDate && (
                            <>
                              <span>•</span>
                              <span>
                                Acara: {new Date(item.eventDate).toLocaleDateString('id-ID', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{item.content}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editAnnouncement(item)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteAnnouncement(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
