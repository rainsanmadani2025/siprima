"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Loader2, Shield, Lock, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserWithPermissions {
  id: string
  name: string
  username: string
  role: string
  isActive: boolean
  permissions: {
    manageUsers: boolean
    manageSchool: boolean
    manageStudents: boolean
    manageTeachers: boolean
    manageAnnouncements: boolean
    manageAttendance: boolean
  }
}

export default function AdminHakAksesPage() {
  const [users, setUsers] = useState<UserWithPermissions[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserWithPermissions | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users-with-permissions')
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data pengguna"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleManagePermissions = (user: UserWithPermissions) => {
    setSelectedUser(user)
    setDialogOpen(true)
  }

  const handleToggleStatus = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !users.find(u => u.id === userId)?.isActive })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Status pengguna diperbarui"
        })
        fetchUsers()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memperbarui status"
      })
    }
  }

  const handleSavePermissions = async () => {
    if (!selectedUser) return

    setSubmitting(true)

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/permissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedUser.permissions)
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Hak akses diperbarui"
        })
        setDialogOpen(false)
        fetchUsers()
      } else {
        throw new Error(data.error || 'Gagal menyimpan hak akses')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menyimpan hak akses"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getRoleBadge = (role: string) => {
    const config = {
      ADMIN: { label: "Admin", className: "bg-red-500" },
      KEPSEK: { label: "Kepsek", className: "bg-purple-500" },
      GURU: { label: "Guru", className: "bg-blue-500" },
      ORTU: { label: "Orang Tua", className: "bg-green-500" },
    }
    const { label, className } = config[role as keyof typeof config] || config.GURU
    return <Badge className={className}>{label}</Badge>
  }

  return (
    <DashboardLayout role="admin" userName="Administrator">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hak Akses Pengguna</h1>
          <p className="text-muted-foreground mt-2">
            Kelola hak akses dan status pengguna
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Daftar Pengguna ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada data pengguna
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {user.isActive ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-sm">
                              {user.isActive ? "Aktif" : "Nonaktif"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleManagePermissions(user)}
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              Hak Akses
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(user.id)}
                            >
                              {user.isActive ? "Nonaktifkan" : "Aktifkan"}
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
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kelola Hak Akses</DialogTitle>
            <DialogDescription>
              Atur hak akses untuk {selectedUser?.name} ({selectedUser?.role})
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="font-medium">Manajemen</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Kelola Pengguna</span>
                    <Switch
                      checked={selectedUser.permissions.manageUsers}
                      onCheckedChange={(checked) => {
                        setSelectedUser({
                          ...selectedUser,
                          permissions: { ...selectedUser.permissions, manageUsers: checked }
                        })
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Kelola Data Sekolah</span>
                    <Switch
                      checked={selectedUser.permissions.manageSchool}
                      onCheckedChange={(checked) => {
                        setSelectedUser({
                          ...selectedUser,
                          permissions: { ...selectedUser.permissions, manageSchool: checked }
                        })
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Data Akademik</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Kelola Data Siswa</span>
                    <Switch
                      checked={selectedUser.permissions.manageStudents}
                      onCheckedChange={(checked) => {
                        setSelectedUser({
                          ...selectedUser,
                          permissions: { ...selectedUser.permissions, manageStudents: checked }
                        })
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Kelola Data Guru</span>
                    <Switch
                      checked={selectedUser.permissions.manageTeachers}
                      onCheckedChange={(checked) => {
                        setSelectedUser({
                          ...selectedUser,
                          permissions: { ...selectedUser.permissions, manageTeachers: checked }
                        })
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Kelola Absensi</span>
                    <Switch
                      checked={selectedUser.permissions.manageAttendance}
                      onCheckedChange={(checked) => {
                        setSelectedUser({
                          ...selectedUser,
                          permissions: { ...selectedUser.permissions, manageAttendance: checked }
                        })
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Komunikasi</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Kelola Pengumuman</span>
                    <Switch
                      checked={selectedUser.permissions.manageAnnouncements}
                      onCheckedChange={(checked) => {
                        setSelectedUser({
                          ...selectedUser,
                          permissions: { ...selectedUser.permissions, manageAnnouncements: checked }
                        })
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Batal
            </Button>
            <Button onClick={handleSavePermissions} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
