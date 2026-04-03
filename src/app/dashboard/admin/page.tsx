"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  GraduationCap,
  UserCog,
  Shield,
  Loader2,
  Plus,
  Search
} from "lucide-react"
import Link from "next/link"

interface AdminStatistics {
  totalUsers: number
  totalAdmins: number
  totalKepsek: number
  totalTeachers: number
  totalParents: number
  activeUsers: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStatistics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/admin/statistics')
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="admin" userName="Administrator">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="admin" userName="Administrator">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrator</h1>
            <p className="text-muted-foreground mt-2">
              Kelola semua akun dan data sistem RA Insan Madani
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/admin/pengguna">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pengguna
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="card-gradient-1 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs opacity-80 mt-1">{stats?.activeUsers || 0} aktif</p>
            </CardContent>
          </Card>

          <Card className="card-gradient-2 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin & Kepsek</CardTitle>
              <Shield className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats?.totalAdmins || 0) + (stats?.totalKepsek || 0)}</div>
              <p className="text-xs opacity-80 mt-1">
                {stats?.totalAdmins || 0} admin, {stats?.totalKepsek || 0} kepsek
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient-3 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Guru</CardTitle>
              <GraduationCap className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalTeachers || 0}</div>
              <p className="text-xs opacity-80 mt-1">Tenaga pengajar aktif</p>
            </CardContent>
          </Card>

          <Card className="card-gradient-4 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orang Tua</CardTitle>
              <UserCog className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalParents || 0}</div>
              <p className="text-xs opacity-80 mt-1">Akun orang tua siswa</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Manajemen Pengguna
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Link
                  href="/dashboard/admin/pengguna"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors cursor-pointer"
                >
                  <UserCog className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Kelola Semua Pengguna</p>
                    <p className="text-sm text-muted-foreground">Tambah, edit, dan hapus akun</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Informasi Sistem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status Sistem</span>
                  <span className="text-sm font-medium text-green-600">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Database</span>
                  <span className="text-sm font-medium">Terhubung</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Versi</span>
                  <span className="text-sm font-medium">1.0.0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
