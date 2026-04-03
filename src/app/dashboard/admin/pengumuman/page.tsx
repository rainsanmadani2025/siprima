"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Edit,
  Trash2,
  Loader2,
  Bell,
  Calendar,
  AlertTriangle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Announcement {
  id: string
  title: string
  content: string
  category: string
  targetAudience: string
  eventDate?: string
  priority: string
  createdAt: string
}

export default function AdminPengumumanPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<Announcement | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "umum",
    targetAudience: "all",
    eventDate: "",
    priority: "normal"
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [categoryFilter])

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const url = categoryFilter === "all"
        ? '/api/announcements'
        : `/api/announcements?category=${categoryFilter}`
      const response = await fetch(url)
      const data = await response.json()
      if (data.announcements) {
        setAnnouncements(data.announcements)
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data pengumuman"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      targetAudience: announcement.targetAudience,
      eventDate: announcement.eventDate || "",
      priority: announcement.priority
    })
    setDialogOpen(true)
  }

  const handleDeleteAnnouncement = (announcement: Announcement) => {
    setDeletingAnnouncement(announcement)
    setDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAnnouncement) return

    setSubmitting(true)

    try {
      const response = await fetch(`/api/admin/announcements/${editingAnnouncement.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Pengumuman diperbarui"
        })
        setDialogOpen(false)
        fetchAnnouncements()
      } else {
        throw new Error(data.error || 'Gagal menyimpan pengumuman')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menyimpan pengumuman"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!deletingAnnouncement) return

    try {
      const response = await fetch(`/api/admin/announcements/${deletingAnnouncement.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Pengumuman berhasil dihapus"
        })
        setDeleteDialogOpen(false)
        fetchAnnouncements()
      } else {
        throw new Error(data.error || 'Gagal menghapus pengumuman')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menghapus pengumuman"
      })
    }
  }

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPriorityBadge = (priority: string) => {
    const config = {
      normal: { label: "Normal", className: "bg-gray-500" },
      important: { label: "Penting", className: "bg-orange-500" },
      urgent: { label: "Urgent", className: "bg-red-500" }
    }
    const { label, className } = config[priority as keyof typeof config] || config.normal
    return <Badge className={className}>{label}</Badge>
  }

  const getCategoryBadge = (category: string) => {
    const config: Record<string, { label: string; className: string }> = {
      umum: { label: "Umum", className: "bg-blue-500" },
      keagamaan: { label: "Keagamaan", className: "bg-green-500" },
      pembelajaran: { label: "Pembelajaran", className: "bg-purple-500" },
      outing: { label: "Outing", className: "bg-cyan-500" },
      parenting: { label: "Parenting", className: "bg-pink-500" },
      pentas_seni: { label: "Pentas Seni", className: "bg-yellow-500" },
      rapat: { label: "Rapat", className: "bg-indigo-500" }
    }
    const { label, className } = config[category] || config.umum
    return <Badge className={className}>{label}</Badge>
  }

  return (
    <DashboardLayout role="admin" userName="Administrator">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengaturan Pengumuman</h1>
          <p className="text-muted-foreground mt-2">
            Kelola pengumuman sekolah
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari judul atau isi pengumuman..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="umum">Umum</SelectItem>
                  <SelectItem value="keagamaan">Keagamaan</SelectItem>
                  <SelectItem value="pembelajaran">Pembelajaran</SelectItem>
                  <SelectItem value="outing">Outing</SelectItem>
                  <SelectItem value="parenting">Parenting</SelectItem>
                  <SelectItem value="pentas_seni">Pentas Seni</SelectItem>
                  <SelectItem value="rapat">Rapat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Daftar Pengumuman ({filteredAnnouncements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada data pengumuman
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Prioritas</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAnnouncements.map((announcement) => (
                      <TableRow key={announcement.id}>
                        <TableCell className="font-medium max-w-[300px]">
                          {announcement.title}
                        </TableCell>
                        <TableCell>{getCategoryBadge(announcement.category)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{announcement.targetAudience}</Badge>
                        </TableCell>
                        <TableCell>{getPriorityBadge(announcement.priority)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(announcement.createdAt).toLocaleDateString('id-ID')}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditAnnouncement(announcement)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteAnnouncement(announcement)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Pengumuman</DialogTitle>
            <DialogDescription>
              Perbarui informasi pengumuman
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Isi Pengumuman *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={5}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="umum">Umum</SelectItem>
                      <SelectItem value="keagamaan">Keagamaan</SelectItem>
                      <SelectItem value="pembelajaran">Pembelajaran</SelectItem>
                      <SelectItem value="outing">Outing</SelectItem>
                      <SelectItem value="parenting">Parenting</SelectItem>
                      <SelectItem value="pentas_seni">Pentas Seni</SelectItem>
                      <SelectItem value="rapat">Rapat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audiens</Label>
                  <Select
                    value={formData.targetAudience}
                    onValueChange={(value) => setFormData({ ...formData, targetAudience: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Tanggal Event</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Prioritas</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="important">Penting</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengumuman?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pengumuman "{deletingAnnouncement?.title}"? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
