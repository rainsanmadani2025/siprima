"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save, Globe, Lock, Palette, Layout } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WebsiteSettings {
  siteName: string
  siteDescription: string
  siteKeywords: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
  facebookUrl: string
  instagramUrl: string
  youtubeUrl: string
  enableRegistration: boolean
  maintenanceMode: boolean
  themeColor: string
}

export default function AdminWebsitePage() {
  const [settings, setSettings] = useState<WebsiteSettings>({
    siteName: "RA Insan Madani",
    siteDescription: "RA Insan Madani - Membangun generasi berkarakter dan berakhlak mulia",
    siteKeywords: "RA, TK, PAUD, Insan Madani, Sekolah Islam",
    contactEmail: "info@ra-insanmadani.sch.id",
    contactPhone: "+62 812-3456-7890",
    contactAddress: "Jl. Pendidikan No. 123, Kota Bandung, Jawa Barat",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    enableRegistration: false,
    maintenanceMode: false,
    themeColor: "#3B82F6"
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/website-settings')
      const data = await response.json()
      if (data.success && data.settings) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error fetching website settings:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat pengaturan website"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/website-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Pengaturan website berhasil disimpan"
        })
      } else {
        throw new Error(data.error || 'Gagal menyimpan pengaturan')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menyimpan pengaturan"
      })
    } finally {
      setSaving(false)
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pengaturan Website</h1>
            <p className="text-muted-foreground mt-2">
              Kelola konfigurasi dan tampilan website
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>

        {/* Informasi Website */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Informasi Website
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nama Website *</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Deskripsi Website</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteKeywords">Keywords (SEO)</Label>
                <Input
                  id="siteKeywords"
                  value={settings.siteKeywords}
                  onChange={(e) => setSettings({ ...settings, siteKeywords: e.target.value })}
                  placeholder="Kata kunci dipisahkan dengan koma"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kontak */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5" />
              Informasi Kontak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">No. Telepon</Label>
                <Input
                  id="contactPhone"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactAddress">Alamat</Label>
              <Textarea
                id="contactAddress"
                value={settings.contactAddress}
                onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Media Sosial */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Media Sosial
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input
                  id="facebookUrl"
                  type="url"
                  value={settings.facebookUrl}
                  onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input
                  id="instagramUrl"
                  type="url"
                  value={settings.instagramUrl}
                  onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">YouTube URL</Label>
                <Input
                  id="youtubeUrl"
                  type="url"
                  value={settings.youtubeUrl}
                  onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pengaturan Sistem */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Pengaturan Sistem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Mode Pemeliharaan</h3>
                <p className="text-sm text-muted-foreground">
                  Website akan tidak dapat diakses oleh publik
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Pendaftaran Terbuka</h3>
                <p className="text-sm text-muted-foreground">
                  Izinkan pendaftaran pengguna baru
                </p>
              </div>
              <Switch
                checked={settings.enableRegistration}
                onCheckedChange={(checked) => setSettings({ ...settings, enableRegistration: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="themeColor">Warna Tema</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="themeColor"
                  type="color"
                  value={settings.themeColor}
                  onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })}
                  className="w-20 h-10 p-1"
                />
                <span className="text-sm text-muted-foreground">
                  Pilih warna utama untuk tampilan website
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
