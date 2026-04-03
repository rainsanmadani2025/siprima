"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, ArrowLeft, Loader2, Plus, RefreshCw, Eye, Sparkles, FileDown, Save, Printer } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Template {
  id: string
  tema: string
  topikKBC?: string
  profilLulusan?: string
  tujuanKBC?: string
  tujuanProfilLulusan?: any
  tujuanPembelajaranMendalam?: string
  materiIntegrasiKBC?: string
  tujuanPembelajaran?: string
  kerangkaPembelajaran?: any
  kegiatanPembelajaran?: any
  rubrikPenilaian?: any
}

interface SchoolProfile {
  name: string
  address: string
}

export default function BuatRPPPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingPDF, setLoadingPDF] = useState(false)
  const [saving, setSaving] = useState(false)
  const [fetchingTemplates, setFetchingTemplates] = useState(true)
  const [generatingTemplate, setGeneratingTemplate] = useState(false)
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [newTema, setNewTema] = useState("")
  const { toast } = useToast()

  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const [formData, setFormData] = useState({
    // A. Identitas Pembelajaran
    fase: "Fase Fondasi",
    kelompokUsia: "Kelompok A (4-5 Tahun)",
    semester: "Ganjil",
    tahunAjaran: "2025/2026",
    hari: "",
    jumlahPertemuan: "8 JP",
    kelas: "",
    guru: "",
    // B. Tema Projek
    tema: "",
    subtema: "",
    temaProjek: "",
    judulKegiatan: "",
    pokokBahasan: "",
    // C. Topik KBC
    topikKBC: "Cinta Diri dan Sesama",
    // D. Profil Lulusan
    profilLulusan: "",
    // E. Tujuan KBC
    tujuanKBC: "",
    // F. Tujuan Profil Lulusan
    tujuanProfilLulusan: {
      Kesehatan: "",
      Kemandirian: "",
      BernalarKritis: "",
      Kreatif: "",
      Berkarakter: "",
      Beriman: "",
      Bertakwa: ""
    },
    // G. Tujuan Pembelajaran Mendalam
    tujuanPembelajaranMendalam: "",
    // H. Materi Integrasi KBC
    materiIntegrasiKBC: "",
    // I. Tujuan Pembelajaran
    tujuanPembelajaran: "",
    // J. Kerangka Pembelajaran
    kerangkaPembelajaran: {
      praktekPedagogik: "",
      lingkunganPembelajaran: {
        fisik: "",
        sosial: "",
        psikologis: "",
        akademik: ""
      },
      kemitraanPembelajaran: "",
      pemanfaatanDigital: ""
    },
    // K. Kegiatan Pembelajaran
    kegiatanPembelajaran: {
      persiapan: {
        pemahamanKonsep: "",
        penyiapanAlat: "",
        alatBahan: ""
      },
      pelaksanaan: {
        orientasi: "",
        eksplorasi: "",
        diskusi: "",
        kolaborasi: "",
        refleksi: ""
      },
      pembuatanKarya: {
        proses: "",
        hasil: ""
      },
      presentasi: {
        persiapan: "",
        pelaksanaan: ""
      },
      refleksiAkhir: {
        refleksiGuru: "",
        refleksiAnak: ""
      }
    },
    // L. Rubrik Penilaian
    rubrikPenilaian: {}
  })

  // Fetch school profile and templates on mount
  useEffect(() => {
    fetchSchoolProfile()
    fetchTemplates()
  }, [])

  const fetchSchoolProfile = async () => {
    try {
      const response = await fetch('/api/school/profile')
      const data = await response.json()
      if (data.success) {
        setSchoolProfile(data.school)
      }
    } catch (error) {
      console.error('Error fetching school profile:', error)
    }
  }

  const fetchTemplates = async () => {
    try {
      setFetchingTemplates(true)
      const response = await fetch('/api/rpp-template-list')
      const data = await response.json()
      if (data.success) {
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setFetchingTemplates(false)
    }
  }

  const handleGenerateTemplate = async () => {
    if (!newTema.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Tema harus diisi"
      })
      return
    }

    let isRequestActive = true
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      if (isRequestActive) {
        controller.abort()
      }
    }, 65000)

    try {
      setGeneratingTemplate(true)

      const response = await fetch('/api/rpp/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema: newTema.trim(),
          kelompokUsia: formData.kelompokUsia,
          topikKBC: formData.topikKBC
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      isRequestActive = false

      // Check if response is OK before parsing
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('401: API Key belum dikonfigurasi. Fitur AI tidak tersedia.')
        }
        throw new Error(`Gagal membuat template. Server error: ${response.status}`)
      }

      try {
        const responseText = await response.text()
        console.log('[Generate Template] Response status:', response.status)

        if (!responseText.trim()) {
          throw new Error('Response kosong dari server')
        }

        const data = JSON.parse(responseText)

        if (data.success) {
          const message = data.updated
            ? `Template "${newTema}" berhasil diperbarui`
            : `Template "${newTema}" berhasil dibuat dan tersedia untuk dipilih`
          toast({
            title: data.updated ? "Template Diperbarui" : "Template Berhasil Dibuat",
            description: message
          })
          setNewTema("")
          setGenerateDialogOpen(false)
          await fetchTemplates()
        } else {
          throw new Error(data.error || 'Gagal membuat template')
        }
      } catch (parseError) {
        console.error('[Generate Template] Parse error:', parseError)
        throw new Error(`Gagal membuat template. Server error: ${response.status}`)
      }
    } catch (error: any) {
      const isTimeout = error.name === 'AbortError' && isRequestActive
      isRequestActive = false

      console.error('Error generating template:', error)

      if (error.message.includes('502')) {
        toast({
          variant: "destructive",
          title: "Server Sibuk",
          description: "Server sedang sibuk memproses permintaan. Silakan coba lagi."
        })
      } else if (isTimeout) {
        toast({
          variant: "destructive",
          title: "Timeout",
          description: "Server tidak merespon dalam waktu 65 detik. AI sedang sibuk atau tema terlalu kompleks. Silakan coba lagi dengan tema yang lebih sederhana."
        })
      } else if (error.message && error.message.includes('401')) {
        // Khusus untuk error API key belum dikonfigurasi
        toast({
          variant: "destructive",
          title: "Fitur AI Tidak Tersedia",
          description: "Fitur generate template memerlukan konfigurasi API Key. Silakan gunakan template yang sudah tersedia atau hubungi administrator untuk mengonfigurasi API Key."
        })
      } else if (error.name !== 'AbortError') {
        let errorMessage = error.message || "Gagal membuat template"
        if (errorMessage.includes('<') && errorMessage.includes('>')) {
          errorMessage = "Gagal membuat template. Silakan coba lagi."
        }
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage
        })
      }
    } finally {
      clearTimeout(timeoutId)
      setGeneratingTemplate(false)
    }
  }

  const handleTemplateChange = async (templateId: string) => {
    setSelectedTemplateId(templateId)

    if (!templateId) {
      setSelectedTemplate(null)
      return
    }

    try {
      const response = await fetch(`/api/rpp-template-detail?id=${templateId}`)
      const data = await response.json()

      if (data.success && data.template) {
        const template = data.template
        setSelectedTemplate(template)

        // Parse rubrikPenilaian if it exists
        let rubrikPenilaian = {}
        if (template.rubrikPenilaian) {
          try {
            rubrikPenilaian = typeof template.rubrikPenilaian === 'string'
              ? JSON.parse(template.rubrikPenilaian)
              : template.rubrikPenilaian
          } catch (e) {
            console.error('Error parsing rubrikPenilaian:', e)
          }
        }

        // Helper function to merge with defaults
        const mergeWithDefaults = (templateValue: any, defaultValue: any) => {
          if (!templateValue) return defaultValue
          // Check if templateValue has the required structure
          if (typeof templateValue === 'string') {
            return defaultValue
          }
          // Merge object with defaults
          return { ...defaultValue, ...templateValue }
        }

        // Default values for kerangkaPembelajaran
        const defaultKerangka = {
          praktekPedagogik: "",
          lingkunganPembelajaran: {
            fisik: "",
            sosial: "",
            psikologis: "",
            akademik: ""
          },
          kemitraanPembelajaran: "",
          pemanfaatanDigital: ""
        }

        // Default values for kegiatanPembelajaran
        const defaultKegiatan = {
          persiapan: {
            pemahamanKonsep: "",
            penyiapanAlat: "",
            alatBahan: ""
          },
          pelaksanaan: {
            orientasi: "",
            eksplorasi: "",
            diskusi: "",
            kolaborasi: "",
            refleksi: ""
          },
          pembuatanKarya: {
            proses: "",
            hasil: ""
          },
          presentasi: {
            persiapan: "",
            pelaksanaan: ""
          },
          refleksiAkhir: {
            refleksiGuru: "",
            refleksiAnak: ""
          }
        }

        // Generate subtema, temaProjek, judulKegiatan, and pokokBahasan automatically based on tema
        const tema = template.tema || ""
        const generatedSubtema = generateSubtema(tema)
        const generatedTemaProjek = generateTemaProjek(tema)
        const generatedJudulKegiatan = generateJudulKegiatan(tema)
        const generatedPokokBahasan = generatePokokBahasan(tema)

        // Auto-fill all fields based on template
        setFormData(prev => ({
          ...prev,
          tema: tema,
          subtema: generatedSubtema,
          temaProjek: generatedTemaProjek,
          judulKegiatan: generatedJudulKegiatan,
          pokokBahasan: generatedPokokBahasan,
          topikKBC: template.topikKBC || prev.topikKBC,
          profilLulusan: template.profilLulusan || prev.profilLulusan,
          tujuanKBC: template.tujuanKBC || prev.tujuanKBC,
          tujuanProfilLulusan: template.tujuanProfilLulusan || prev.tujuanProfilLulusan,
          tujuanPembelajaranMendalam: template.tujuanPembelajaranMendalam || prev.tujuanPembelajaranMendalam,
          materiIntegrasiKBC: template.materiIntegrasiKBC || prev.materiIntegrasiKBC,
          tujuanPembelajaran: template.tujuanPembelajaran || prev.tujuanPembelajaran,
          kerangkaPembelajaran: mergeWithDefaults(template.kerangkaPembelajaran, defaultKerangka),
          kegiatanPembelajaran: mergeWithDefaults(template.kegiatanPembelajaran, defaultKegiatan),
          rubrikPenilaian: rubrikPenilaian || prev.rubrikPenilaian
        }))

        toast({
          title: "Template dimuat",
          description: `Template "${template.tema}" berhasil dimuat dengan isi otomatis.`
        })
      }
    } catch (error) {
      console.error('Error fetching template:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat template"
      })
    }
  }

  // Helper functions to generate content based on tema
  const generateSubtema = (tema: string): string => {
    const temaLower = tema.toLowerCase()
    
    // Pattern matching for common subtemas
    if (temaLower.includes("alam") || temaLower.includes("lingkungan")) {
      return "Menjaga dan merawat lingkungan sekitar"
    } else if (temaLower.includes("diri") || temaLower.includes("tubuh")) {
      return "Mengenal bagian-bagian tubuh dan fungsinya"
    } else if (temaLower.includes("pahlawan") || temaLower.includes("tokoh")) {
      return "Mengenal tokoh pahlawan nasional dan keberaniannya"
    } else if (temaLower.includes("tanaman") || temaLower.includes("tumbuhan")) {
      return "Jenis-jenis tanaman dan cara merawatnya"
    } else if (temaLower.includes("hewan") || temaLower.includes("binatang")) {
      return "Jenis-jenis hewan dan habitatnya"
    } else if (temaLower.includes("kebersihan") || temaLower.includes("bersih")) {
      return "Menjaga kebersihan diri dan lingkungan"
    } else if (temaLower.includes("keluarga")) {
      return "Anggota keluarga dan peran mereka"
    } else if (temaLower.includes("pekerjaan") || temaLower.includes("profesi")) {
      return "Jenis-jenis pekerjaan di masyarakat"
    } else if (temaLower.includes("transportasi") || temaLower.includes("kendaraan")) {
      return "Jenis-jenis alat transportasi"
    } else if (temaLower.includes("makanan") || temaLower.includes("minuman")) {
      return "Makanan sehat dan bergizi"
    } else if (temaLower.includes("agama") || temaLower.includes("ibadah")) {
      return "Mengenal tempat ibadah dan kegiatan keagamaan"
    } else if (temaLower.includes("warna") || temaLower.includes("bentuk")) {
      return "Mengenal warna-warna dan bentuk-bentuk dasar"
    } else if (temaLower.includes("angka") || temaLower.includes("hitung")) {
      return "Berhitung dengan benda-benda sekitar"
    } else if (temaLower.includes("huruf") || temaLower.includes("baca")) {
      return "Mengenal huruf dan membaca sederhana"
    } else {
      // Default: generate based on tema
      return `Kegiatan pembelajaran tentang ${tema}`
    }
  }

  const generateTemaProjek = (tema: string): string => {
    const temaLower = tema.toLowerCase()
    
    if (temaLower.includes("alam") || temaLower.includes("lingkungan")) {
      return `Menjaga dan mencintai lingkungan alam sekitar`
    } else if (temaLower.includes("diri") || temaLower.includes("tubuh")) {
      return `Mengenal dan merawat tubuh dengan baik`
    } else if (temaLower.includes("pahlawan") || temaLower.includes("tokoh")) {
      return `Meneladani kepahlawanan dan keberanian para pahlawan`
    } else if (temaLower.includes("tanaman") || temaLower.includes("tumbuhan")) {
      return `Menanam dan merawat tanaman dengan cinta`
    } else if (temaLower.includes("hewan") || temaLower.includes("binatang")) {
      return `Menyayangi dan merawat hewan dengan baik`
    } else if (temaLower.includes("kebersihan") || temaLower.includes("bersih")) {
      return `Membiasakan hidup bersih dan sehat`
    } else if (temaLower.includes("keluarga")) {
      return `Menghargai dan menyayangi keluarga`
    } else if (temaLower.includes("pekerjaan") || temaLower.includes("profesi")) {
      return `Menghargai pekerjaan dan tenaga kerja`
    } else if (temaLower.includes("transportasi") || temaLower.includes("kendaraan")) {
      return `Mengenal dan menggunakan transportasi dengan bijak`
    } else if (temaLower.includes("makanan") || temaLower.includes("minuman")) {
      return `Menerapkan pola makan sehat dan bergizi`
    } else if (temaLower.includes("agama") || temaLower.includes("ibadah")) {
      return `Membiasakan beribadah dengan ikhlas dan teratur`
    } else if (temaLower.includes("warna") || temaLower.includes("bentuk")) {
      return `Mengenal dan bereksplorasi warna dan bentuk`
    } else if (temaLower.includes("angka") || temaLower.includes("hitung")) {
      return `Belajar berhitung melalui permainan edukatif`
    } else if (temaLower.includes("huruf") || temaLower.includes("baca")) {
      return `Belajar membaca dan mengenal huruf melalui permainan`
    } else {
      return `Pembelajaran tematik tentang ${tema} dengan pendekatan bermain`
    }
  }

  const generateJudulKegiatan = (tema: string): string => {
    const temaLower = tema.toLowerCase()
    
    if (temaLower.includes("alam") || temaLower.includes("lingkungan")) {
      return `Bermain sambil belajar di lingkungan alam sekitar`
    } else if (temaLower.includes("diri") || temaLower.includes("tubuh")) {
      return `Eksplorasi bagian tubuh melalui permainan dan lagu`
    } else if (temaLower.includes("pahlawan") || temaLower.includes("tokoh")) {
      return `Dongeng tentang pahlawan dan permainan keberanian`
    } else if (temaLower.includes("tanaman") || temaLower.includes("tumbuhan")) {
      return `Menanam dan merawat tanaman di kebun sekolah`
    } else if (temaLower.includes("hewan") || temaLower.includes("binatang")) {
      return `Mengamati hewan dan habitatnya melalui kunjungan`
    } else if (temaLower.includes("kebersihan") || temaLower.includes("bersih")) {
      return `Praktik kebersihan diri dan lingkungan kelas`
    } else if (temaLower.includes("keluarga")) {
      return `Bercerita tentang keluarga dan peran anggota keluarga`
    } else if (temaLower.includes("pekerjaan") || temaLower.includes("profesi")) {
      return `Role play berbagai jenis pekerjaan di masyarakat`
    } else if (temaLower.includes("transportasi") || temaLower.includes("kendaraan")) {
      return `Permainan transportasi dan simulasi lalu lintas`
    } else if (temaLower.includes("makanan") || temaLower.includes("minuman")) {
      return `Membuat dan mencicipi makanan sehat bersama`
    } else if (temaLower.includes("agama") || temaLower.includes("ibadah")) {
      return `Kunjungan ke tempat ibadah dan praktik ibadah`
    } else if (temaLower.includes("warna") || temaLower.includes("bentuk")) {
      return `Eksplorasi warna dan bentuk dengan karya seni`
    } else if (temaLower.includes("angka") || temaLower.includes("hitung")) {
      return `Permainan berhitung dengan benda sehari-hari`
    } else if (temaLower.includes("huruf") || temaLower.includes("baca")) {
      return `Permainan mengenal huruf dan membaca sederhana`
    } else {
      return `Kegiatan bermain dan belajar tentang ${tema}`
    }
  }

  const generatePokokBahasan = (tema: string): string => {
    const temaLower = tema.toLowerCase()
    
    if (temaLower.includes("alam") || temaLower.includes("lingkungan")) {
      return `Jenis-jenis lingkungan, cara menjaga, dan manfaatnya`
    } else if (temaLower.includes("diri") || temaLower.includes("tubuh")) {
      return `Bagian-bagian tubuh dan fungsi masing-masing`
    } else if (temaLower.includes("pahlawan") || temaLower.includes("tokoh")) {
      return `Tokoh pahlawan nasional, perjuangan, dan sifat keberanian`
    } else if (temaLower.includes("tanaman") || temaLower.includes("tumbuhan")) {
      return `Jenis tanaman, cara menanam, dan merawat tanaman`
    } else if (temaLower.includes("hewan") || temaLower.includes("binatang")) {
      return `Jenis hewan, ciri-ciri, habitat, dan cara merawat`
    } else if (temaLower.includes("kebersihan") || temaLower.includes("bersih")) {
      return `Pentingnya kebersihan, cara menjaga, dan dampaknya`
    } else if (temaLower.includes("keluarga")) {
      return `Struktur keluarga, peran anggota, dan nilai kekeluargaan`
    } else if (temaLower.includes("pekerjaan") || temaLower.includes("profesi")) {
      return `Jenis pekerjaan, alat kerja, dan peran dalam masyarakat`
    } else if (temaLower.includes("transportasi") || temaLower.includes("kendaraan")) {
      return `Jenis alat transportasi, fungsi, dan keselamatan`
    } else if (temaLower.includes("makanan") || temaLower.includes("minuman")) {
      return `Jenis makanan, gizi, dan menu makan sehat`
    } else if (temaLower.includes("agama") || temaLower.includes("ibadah")) {
      return `Jenis ibadah, tata cara, dan makna ibadah`
    } else if (temaLower.includes("warna") || temaLower.includes("bentuk")) {
      return `Jenis warna, pencampuran warna, dan bentuk geometri dasar`
    } else if (temaLower.includes("angka") || temaLower.includes("hitung")) {
      return `Konsep bilangan, berhitung, dan operasi dasar`
    } else if (temaLower.includes("huruf") || temaLower.includes("baca")) {
      return `Huruf abjad, mengenal huruf, dan membaca sederhana`
    } else {
      return `Konsep dasar ${tema} dan penerapannya dalam kehidupan sehari-hari`
    }
  }

  const handleGenerateVariation = async () => {
    if (!selectedTemplate) return

    const tema = selectedTemplate.tema

    let isRequestActive = true
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      if (isRequestActive) {
        controller.abort()
      }
    }, 65000)

    try {
      setGeneratingTemplate(true)

      const response = await fetch('/api/rpp/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema: tema,
          kelompokUsia: formData.kelompokUsia,
          topikKBC: formData.topikKBC
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      isRequestActive = false

      if (!response.ok) {
        // For non-OK responses, try to parse error from backend
        try {
          const responseText = await response.text()
          const errorData = JSON.parse(responseText)
          throw new Error(errorData.error || `Gagal membuat variasi template. Server error: ${response.status}`)
        } catch (parseError) {
          // If parsing fails, use status code
          if (response.status === 503) {
            throw new Error('Fitur AI tidak tersedia. Konfigurasi AI belum lengkap. Silakan gunakan template yang sudah tersedia.')
          } else if (response.status === 429) {
            throw new Error('Rate limit tercapai. Akun AI telah mencapai batas request. Silakan tunggu 1-2 menit sebelum mencoba lagi.')
          }
          throw new Error(`Gagal membuat variasi template. Server error: ${response.status}`)
        }
      }

      let data
      try {
        const responseText = await response.text()
        data = JSON.parse(responseText)
      } catch (parseError) {
        throw new Error('Gagal membuat variasi template. Server tidak merespon dengan format yang benar.')
      }

      if (data.success) {
        toast({
          title: "Variasi template berhasil dibuat",
          description: `Variasi baru untuk tema "${tema}" telah dibuat. Silakan pilih lagi dari dropdown.`
        })
        await fetchTemplates()
        const newTemplates = await (await fetch('/api/rpp-template-list')).json()
        if (newTemplates.success && newTemplates.templates.length > 0) {
          const lastTemplate = newTemplates.templates[newTemplates.templates.length - 1]
          handleTemplateChange(lastTemplate.id)
        }
      } else {
        throw new Error(data.error || 'Gagal membuat variasi template')
      }
    } catch (error: any) {
      const isTimeout = error.name === 'AbortError' && isRequestActive
      isRequestActive = false

      console.error('Error generating variation:', error)

      if (isTimeout) {
        toast({
          variant: "destructive",
          title: "Timeout",
          description: "Server tidak merespon dalam waktu 90 detik. AI sedang sibuk atau tema terlalu kompleks. Silakan coba lagi dengan tema yang lebih sederhana."
        })
      } else if (error.message && error.message.includes('Fitur AI tidak tersedia')) {
        // Khusus untuk error fitur AI belum tersedia (503)
        toast({
          variant: "destructive",
          title: "Fitur AI Tidak Tersedia",
          description: "Fitur generate variasi template memerlukan konfigurasi API AI. Silakan gunakan 15 template yang sudah tersedia atau hubungi administrator untuk mengonfigurasi fitur AI."
        })
      } else if (error.name !== 'AbortError') {
        let errorMessage = error.message || "Gagal membuat variasi template"

        // Clean up HTML-like error messages
        if (errorMessage.includes('<') && errorMessage.includes('>')) {
          errorMessage = "Gagal membuat variasi template. Server error. Silakan coba lagi."
        }

        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage
        })
      }
    } finally {
      clearTimeout(timeoutId)
      setGeneratingTemplate(false)
    }
  }

  const handleExport = async () => {
    try {
      setLoading(true)

      const response = await fetch('/api/rpp/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          namaSekolah: schoolProfile?.name || "RA INSAN MADANI",
          alamatSekolah: schoolProfile?.address || ""
        }),
      })

      if (!response.ok) {
        throw new Error('Gagal mengekspor RPP')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `RPP-KBC-${formData.tema || 'Baru'}-${new Date().toISOString().split('T')[0]}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Berhasil",
        description: "RPP berhasil diekspor ke Word"
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal mengekspor RPP"
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePreviewPDF = async () => {
    try {
      setLoadingPDF(true)

      const response = await fetch('/api/rpp/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          namaSekolah: schoolProfile?.name || "RA INSAN MADANI",
          alamatSekolah: schoolProfile?.address || ""
        }),
      })

      if (!response.ok) {
        throw new Error('Gagal membuat preview PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      // Open PDF in new tab using browser's native PDF viewer
      window.open(url, '_blank')

      toast({
        title: "Berhasil",
        description: "PDF dibuka di tab baru"
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal membuat preview PDF"
      })
    } finally {
      setLoadingPDF(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      setLoadingPDF(true)
      const response = await fetch('/api/rpp/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          namaSekolah: schoolProfile?.name || "RA INSAN MADANI",
          alamatSekolah: schoolProfile?.address || ""
        }),
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `RPP-KBC-${formData.tema || 'Baru'}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast({
        title: "Berhasil",
        description: "RPP berhasil diekspor ke PDF"
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal mengekspor RPP ke PDF"
      })
    } finally {
      setLoadingPDF(false)
    }
  }

  const handleSave = async () => {
    // Validate required fields
    if (!formData.tema || !formData.subtema || !formData.temaProjek || !formData.judulKegiatan) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Mohon lengkapi field yang diperlukan: Tema, Subtema, Tema Projek, Judul Kegiatan"
      })
      return
    }

    try {
      setSaving(true)
      
      // Simpan RPP ke database
      const response = await fetch('/api/rpp/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          namaSekolah: schoolProfile?.name || "RA INSAN MADANI",
          alamatSekolah: schoolProfile?.address || ""
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "RPP berhasil disimpan"
        })
        router.push('/dashboard/guru/perencanaan')
      } else {
        throw new Error(data.error || 'Gagal menyimpan RPP')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menyimpan RPP"
      })
    } finally {
      setSaving(false)
    }
  }

  const formatPreviewText = (text: string) => {
    if (!text) return '-'
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-2">{line}</p>
    ))
  }

  return (
    <DashboardLayout role="guru" userName="Ibu Guru">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Buat RPP KBC Baru</h1>
            <p className="text-muted-foreground mt-1">
              Rencana Pelaksanaan Pembelajaran Kurikulum Berbasis Cinta
              {schoolProfile && (
                <span className="ml-2 text-sm text-primary">• {schoolProfile.name}</span>
              )}
            </p>
          </div>
        </div>

        {/* Info Card */}
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <div className="text-yellow-600 dark:text-yellow-500 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">Fitur AI Sementara Tidak Tersedia</h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                  Fitur "Generate Variasi Baru" dan "Buat Template Baru" memerlukan konfigurasi API Key yang belum tersedia.
                  Silakan gunakan 15 template yang sudah tersedia (semua telah lengkap dengan narasi detail).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Template Selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pilih Template Tema</CardTitle>
                <CardDescription>Pilih template atau buat template baru untuk mengisi form RPP</CardDescription>
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                {selectedTemplate && (
                  <>
                    <Button onClick={handleGenerateVariation} variant="outline" size="sm" disabled={generatingTemplate}>
                      {generatingTemplate ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Memuat...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Variasi Baru
                        </>
                      )}
                    </Button>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      ⚠️ Fitur AI belum tersedia
                    </span>
                  </>
                )}
                <Button onClick={handlePreviewPDF} disabled={loadingPDF} variant="outline" size="sm">
                  {loadingPDF && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Eye className="mr-2 h-4 w-4" />
                  Preview PDF
                </Button>
                <Button onClick={handleSave} disabled={saving} variant="outline" size="sm">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Simpan
                </Button>
                <Button onClick={handleExportPDF} disabled={loadingPDF} variant="outline" size="sm">
                  {loadingPDF && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <FileDown className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
                <Button onClick={handleExport} disabled={loading} variant="outline" size="sm">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Download className="mr-2 h-4 w-4" />
                  Export Word
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fetchingTemplates ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Memuat template...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={templates.length === 0 ? "Belum ada template. Buat template baru dulu." : "Pilih template untuk mengisi otomatis..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.tema}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setGenerateDialogOpen(true)} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Template Baru
                </Button>
                <Button onClick={fetchTemplates} variant="outline" size="icon" title="Refresh template">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generate Template Dialog */}
        <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Template Baru</DialogTitle>
              <DialogDescription>
                Masukkan nama tema untuk membuat template RPP KBC baru secara otomatis
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tema *</Label>
                <Input
                  value={newTema}
                  onChange={(e) => setNewTema(e.target.value)}
                  placeholder="Contoh: Alam Semesta, Pahlawanku, dll."
                  disabled={generatingTemplate}
                />
              </div>
              <div className="bg-muted/50 p-3 rounded text-sm text-muted-foreground">
                <p><strong>Info:</strong> Template akan dibuat otomatis oleh AI dengan konten lengkap sesuai format RPP KBC.</p>
                <p className="mt-2 text-amber-600 dark:text-amber-400"><strong>⏱️ Perhatian:</strong> Proses ini memerlukan waktu sekitar 30-60 detik karena AI sedang menghasilkan konten. Mohon tunggu sebentar.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setGenerateDialogOpen(false)}
                disabled={generatingTemplate}
              >
                Batal
              </Button>
              <Button onClick={handleGenerateTemplate} disabled={generatingTemplate}>
                {generatingTemplate ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses (AI bekerja...)
                  </>
                ) : (
                  "Buat Template"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Template Preview Dialog */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Preview Template: {selectedTemplate?.tema}</DialogTitle>
              <DialogDescription>
                Lihat isi template sebelum mengisi form RPP
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Topik & Profil Lulusan */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">Topik & Profil Lulusan</h3>
                  <Card>
                    <CardContent className="pt-4 space-y-3">
                      <div>
                        <Label className="font-medium">Topik KBC</Label>
                        <p className="text-sm text-muted-foreground mt-1">{selectedTemplate?.topikKBC || '-'}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Profil Lulusan</Label>
                        <p className="text-sm text-muted-foreground mt-1">{selectedTemplate?.profilLulusan || '-'}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tujuan KBC & Tujuan Pembelajaran */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">Tujuan Pembelajaran (KBC & Umum)</h3>
                  <Card>
                    <CardContent className="pt-4 space-y-3">
                      <div>
                        <Label className="font-medium">Tujuan KBC</Label>
                        <div className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                          {formatPreviewText(selectedTemplate?.tujuanKBC || '')}
                        </div>
                      </div>
                      <div>
                        <Label className="font-medium">Tujuan Pembelajaran</Label>
                        <div className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                          {formatPreviewText(selectedTemplate?.tujuanPembelajaran || '')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tujuan Profil Lulusan per Kategori */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">Tujuan Profil Lulusan per Kategori</h3>
                  <Card>
                    <CardContent className="pt-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="font-medium">Kesehatan</Label>
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                            {selectedTemplate?.tujuanProfilLulusan?.Kesehatan || '-'}
                          </p>
                        </div>
                        <div>
                          <Label className="font-medium">Kemandirian</Label>
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                            {selectedTemplate?.tujuanProfilLulusan?.Kemandirian || '-'}
                          </p>
                        </div>
                        <div>
                          <Label className="font-medium">Bernalar Kritis</Label>
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                            {selectedTemplate?.tujuanProfilLulusan?.BernalarKritis || '-'}
                          </p>
                        </div>
                        <div>
                          <Label className="font-medium">Kreatif</Label>
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                            {selectedTemplate?.tujuanProfilLulusan?.Kreatif || '-'}
                          </p>
                        </div>
                        <div>
                          <Label className="font-medium">Berkarakter</Label>
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                            {selectedTemplate?.tujuanProfilLulusan?.Berkarakter || '-'}
                          </p>
                        </div>
                        <div>
                          <Label className="font-medium">Beriman</Label>
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                            {selectedTemplate?.tujuanProfilLulusan?.Beriman || '-'}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="font-medium">Bertakwa</Label>
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                            {selectedTemplate?.tujuanProfilLulusan?.Bertakwa || '-'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tujuan Pembelajaran Mendalam */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">Tujuan Pembelajaran Mendalam (KD)</h3>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-sm text-muted-foreground whitespace-pre-line">
                        {formatPreviewText(selectedTemplate?.tujuanPembelajaranMendalam || '')}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Kerangka Pembelajaran */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">Kerangka Pembelajaran</h3>
                  <Card>
                    <CardContent className="pt-4 space-y-3">
                      <div>
                        <Label className="font-medium">Praktek Pedagogik</Label>
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                          {selectedTemplate?.kerangkaPembelajaran?.praktekPedagogik || '-'}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="font-medium">Lingkungan Fisik</Label>
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                            {selectedTemplate?.kerangkaPembelajaran?.lingkunganPembelajaran?.fisik || '-'}
                          </p>
                        </div>
                        <div>
                          <Label className="font-medium">Lingkungan Sosial</Label>
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                            {selectedTemplate?.kerangkaPembelajaran?.lingkunganPembelajaran?.sosial || '-'}
                          </p>
                        </div>
                        <div>
                          <Label className="font-medium">Lingkungan Psikologis</Label>
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                            {selectedTemplate?.kerangkaPembelajaran?.lingkunganPembelajaran?.psikologis || '-'}
                          </p>
                        </div>
                        <div>
                          <Label className="font-medium">Lingkungan Akademik</Label>
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                            {selectedTemplate?.kerangkaPembelajaran?.lingkunganPembelajaran?.akademik || '-'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label className="font-medium">Kemitraan Pembelajaran</Label>
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                          {selectedTemplate?.kerangkaPembelajaran?.kemitraanPembelajaran || '-'}
                        </p>
                      </div>
                      <div>
                        <Label className="font-medium">Pemanfaatan Digital</Label>
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                          {selectedTemplate?.kerangkaPembelajaran?.pemanfaatanDigital || '-'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Kegiatan Pembelajaran */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">Kegiatan Pembelajaran</h3>
                  <Card>
                    <CardContent className="pt-4 space-y-4">
                      {/* Tahap Persiapan */}
                      <div className="space-y-2">
                        <Label className="font-semibold">1. Tahap Persiapan</Label>
                        <div className="pl-4 space-y-2">
                          <div>
                            <Label className="text-sm">Pemahaman Konsep</Label>
                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                              {selectedTemplate?.kegiatanPembelajaran?.persiapan?.pemahamanKonsep || '-'}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm">Penyiapan Alat</Label>
                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                              {selectedTemplate?.kegiatanPembelajaran?.persiapan?.penyiapanAlat || '-'}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm">Alat & Bahan</Label>
                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                              {selectedTemplate?.kegiatanPembelajaran?.persiapan?.alatBahan || '-'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Tahap Pelaksanaan */}
                      <div className="space-y-2">
                        <Label className="font-semibold">2. Tahap Pelaksanaan</Label>
                        <div className="pl-4 space-y-2">
                          <div>
                            <Label className="text-sm">Orientasi</Label>
                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                              {selectedTemplate?.kegiatanPembelajaran?.pelaksanaan?.orientasi || '-'}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm">Eksplorasi</Label>
                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                              {selectedTemplate?.kegiatanPembelajaran?.pelaksanaan?.eksplorasi || '-'}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm">Diskusi</Label>
                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                              {selectedTemplate?.kegiatanPembelajaran?.pelaksanaan?.diskusi || '-'}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm">Kolaborasi</Label>
                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                              {selectedTemplate?.kegiatanPembelajaran?.pelaksanaan?.kolaborasi || '-'}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm">Refleksi</Label>
                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                              {selectedTemplate?.kegiatanPembelajaran?.pelaksanaan?.refleksi || '-'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Tahap Pembuatan Karya */}
                      <div className="space-y-2">
                        <Label className="font-semibold">3. Tahap Pembuatan Karya</Label>
                        <div className="pl-4 space-y-2">
                          <div>
                            <Label className="text-sm">Proses</Label>
                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                              {selectedTemplate?.kegiatanPembelajaran?.pembuatanKarya?.proses || '-'}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm">Hasil</Label>
                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                              {selectedTemplate?.kegiatanPembelajaran?.pembuatanKarya?.hasil || '-'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Tahap Presentasi */}
                      <div className="space-y-2">
                        <Label className="font-semibold">4. Tahap Presentasi</Label>
                        <div className="pl-4 space-y-2">
                          <div>
                            <Label className="text-sm">Persiapan</Label>
                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                              {selectedTemplate?.kegiatanPembelajaran?.presentasi?.persiapan || '-'}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm">Pelaksanaan</Label>
                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                              {selectedTemplate?.kegiatanPembelajaran?.presentasi?.pelaksanaan || '-'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Tahap Refleksi Akhir */}
                      <div className="space-y-2">
                        <Label className="font-semibold">5. Tahap Refleksi Akhir</Label>
                        <div className="pl-4 space-y-2">
                          <div>
                            <Label className="text-sm">Refleksi Guru</Label>
                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                              {selectedTemplate?.kegiatanPembelajaran?.refleksiAkhir?.refleksiGuru || '-'}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm">Refleksi Anak</Label>
                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                              {selectedTemplate?.kegiatanPembelajaran?.refleksiAkhir?.refleksiAnak || '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Form Sections */}
        <div className="space-y-6">
          {/* A. Identitas Pembelajaran */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">A</span>
                Identitas Pembelajaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Fase</Label>
                  <Select value={formData.fase} onValueChange={(v) => setFormData({...formData, fase: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fase Fondasi">Fase Fondasi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Kelompok Usia</Label>
                  <Select value={formData.kelompokUsia} onValueChange={(v) => setFormData({...formData, kelompokUsia: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kelompok A (4-5 Tahun)">Kelompok A (4-5 Tahun)</SelectItem>
                      <SelectItem value="Kelompok B (5-6 Tahun)">Kelompok B (5-6 Tahun)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select value={formData.semester} onValueChange={(v) => setFormData({...formData, semester: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ganjil">Ganjil</SelectItem>
                      <SelectItem value="Genap">Genap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tahun Ajaran</Label>
                  <Input value={formData.tahunAjaran} onChange={(e) => setFormData({...formData, tahunAjaran: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Hari</Label>
                  <Input value={formData.hari} onChange={(e) => setFormData({...formData, hari: e.target.value})} placeholder="Contoh: Selasa" />
                </div>
                <div className="space-y-2">
                  <Label>Jumlah Pertemuan</Label>
                  <Input value={formData.jumlahPertemuan} onChange={(e) => setFormData({...formData, jumlahPertemuan: e.target.value})} placeholder="Contoh: 8 JP" />
                </div>
                <div className="space-y-2">
                  <Label>Kelas</Label>
                  <Input value={formData.kelas} onChange={(e) => setFormData({...formData, kelas: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Guru</Label>
                  <Input value={formData.guru} onChange={(e) => setFormData({...formData, guru: e.target.value})} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* B. Tema Projek */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">B</span>
                Tema Projek
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tema *</Label>
                  <Input value={formData.tema} onChange={(e) => setFormData({...formData, tema: e.target.value})} placeholder="Contoh: Lingkungan Sekitarku" />
                </div>
                <div className="space-y-2">
                  <Label>Subtema *</Label>
                  <Input value={formData.subtema} onChange={(e) => setFormData({...formData, subtema: e.target.value})} placeholder="Contoh: Mesjid tempat ibadah" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tema Projek *</Label>
                <Input value={formData.temaProjek} onChange={(e) => setFormData({...formData, temaProjek: e.target.value})} placeholder="Contoh: Mengenal tempat ibadah umat Islam" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Judul Kegiatan *</Label>
                  <Input value={formData.judulKegiatan} onChange={(e) => setFormData({...formData, judulKegiatan: e.target.value})} placeholder="Contoh: Bermain dan belajar di lingkungan mesjid" />
                </div>
                <div className="space-y-2">
                  <Label>Pokok Bahasan</Label>
                  <Input value={formData.pokokBahasan} onChange={(e) => setFormData({...formData, pokokBahasan: e.target.value})} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* C - I. Auto-filled from Template */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">C-I</span>
                Isi Otomatis dari Template
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Topik KBC</Label>
                  <Input value={formData.topikKBC} onChange={(e) => setFormData({...formData, topikKBC: e.target.value})} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Profil Lulusan</Label>
                  <Input value={formData.profilLulusan} onChange={(e) => setFormData({...formData, profilLulusan: e.target.value})} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tujuan KBC</Label>
                <Textarea
                  value={formData.tujuanKBC}
                  onChange={(e) => setFormData({...formData, tujuanKBC: e.target.value})}
                  rows={6}
                  disabled
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tujuan Profil Lulusan (Kesehatan)</Label>
                  <Textarea
                    value={formData.tujuanProfilLulusan.Kesehatan}
                    onChange={(e) => setFormData({...formData, tujuanProfilLulusan: {...formData.tujuanProfilLulusan, Kesehatan: e.target.value}})}
                    rows={4}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tujuan Profil Lulusan (Kemandirian)</Label>
                  <Textarea
                    value={formData.tujuanProfilLulusan.Kemandirian}
                    onChange={(e) => setFormData({...formData, tujuanProfilLulusan: {...formData.tujuanProfilLulusan, Kemandirian: e.target.value}})}
                    rows={4}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tujuan Profil Lulusan (Bernalar Kritis)</Label>
                  <Textarea
                    value={formData.tujuanProfilLulusan.BernalarKritis}
                    onChange={(e) => setFormData({...formData, tujuanProfilLulusan: {...formData.tujuanProfilLulusan, BernalarKritis: e.target.value}})}
                    rows={4}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tujuan Profil Lulusan (Kreatif)</Label>
                  <Textarea
                    value={formData.tujuanProfilLulusan.Kreatif}
                    onChange={(e) => setFormData({...formData, tujuanProfilLulusan: {...formData.tujuanProfilLulusan, Kreatif: e.target.value}})}
                    rows={4}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tujuan Profil Lulusan (Berkarakter)</Label>
                  <Textarea
                    value={formData.tujuanProfilLulusan.Berkarakter}
                    onChange={(e) => setFormData({...formData, tujuanProfilLulusan: {...formData.tujuanProfilLulusan, Berkarakter: e.target.value}})}
                    rows={4}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tujuan Profil Lulusan (Beriman)</Label>
                  <Textarea
                    value={formData.tujuanProfilLulusan.Beriman}
                    onChange={(e) => setFormData({...formData, tujuanProfilLulusan: {...formData.tujuanProfilLulusan, Beriman: e.target.value}})}
                    rows={4}
                    disabled
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Tujuan Profil Lulusan (Bertakwa)</Label>
                  <Textarea
                    value={formData.tujuanProfilLulusan.Bertakwa}
                    onChange={(e) => setFormData({...formData, tujuanProfilLulusan: {...formData.tujuanProfilLulusan, Bertakwa: e.target.value}})}
                    rows={4}
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tujuan Pembelajaran Mendalam (KD)</Label>
                <Textarea
                  value={formData.tujuanPembelajaranMendalam}
                  onChange={(e) => setFormData({...formData, tujuanPembelajaranMendalam: e.target.value})}
                  rows={8}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label>Materi Integrasi KBC</Label>
                <Textarea
                  value={formData.materiIntegrasiKBC}
                  onChange={(e) => setFormData({...formData, materiIntegrasiKBC: e.target.value})}
                  rows={6}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label>Tujuan Pembelajaran</Label>
                <Textarea
                  value={formData.tujuanPembelajaran}
                  onChange={(e) => setFormData({...formData, tujuanPembelajaran: e.target.value})}
                  rows={6}
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          {/* J - Kerangka Pembelajaran */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">J</span>
                Kerangka Pembelajaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Praktek Pedagogik</Label>
                <Textarea
                  value={formData.kerangkaPembelajaran.praktekPedagogik}
                  onChange={(e) => setFormData({...formData, kerangkaPembelajaran: {...formData.kerangkaPembelajaran, praktekPedagogik: e.target.value}})}
                  rows={6}
                  disabled
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Lingkungan Fisik</Label>
                  <Textarea
                    value={formData.kerangkaPembelajaran.lingkunganPembelajaran.fisik}
                    onChange={(e) => setFormData({...formData, kerangkaPembelajaran: {...formData.kerangkaPembelajaran, lingkunganPembelajaran: {...formData.kerangkaPembelajaran.lingkunganPembelajaran, fisik: e.target.value}}})}
                    rows={4}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lingkungan Sosial</Label>
                  <Textarea
                    value={formData.kerangkaPembelajaran.lingkunganPembelajaran.sosial}
                    onChange={(e) => setFormData({...formData, kerangkaPembelajaran: {...formData.kerangkaPembelajaran, lingkunganPembelajaran: {...formData.kerangkaPembelajaran.lingkunganPembelajaran, sosial: e.target.value}}})}
                    rows={4}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lingkungan Psikologis</Label>
                  <Textarea
                    value={formData.kerangkaPembelajaran.lingkunganPembelajaran.psikologis}
                    onChange={(e) => setFormData({...formData, kerangkaPembelajaran: {...formData.kerangkaPembelajaran, lingkunganPembelajaran: {...formData.kerangkaPembelajaran.lingkunganPembelajaran, psikologis: e.target.value}}})}
                    rows={4}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lingkungan Akademik</Label>
                  <Textarea
                    value={formData.kerangkaPembelajaran.lingkunganPembelajaran.akademik}
                    onChange={(e) => setFormData({...formData, kerangkaPembelajaran: {...formData.kerangkaPembelajaran, lingkunganPembelajaran: {...formData.kerangkaPembelajaran.lingkunganPembelajaran, akademik: e.target.value}}})}
                    rows={4}
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Kemitraan Pembelajaran</Label>
                <Textarea
                  value={formData.kerangkaPembelajaran.kemitraanPembelajaran}
                  onChange={(e) => setFormData({...formData, kerangkaPembelajaran: {...formData.kerangkaPembelajaran, kemitraanPembelajaran: e.target.value}})}
                  rows={4}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label>Pemanfaatan Digital</Label>
                <Textarea
                  value={formData.kerangkaPembelajaran.pemanfaatanDigital}
                  onChange={(e) => setFormData({...formData, kerangkaPembelajaran: {...formData.kerangkaPembelajaran, pemanfaatanDigital: e.target.value}})}
                  rows={4}
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          {/* K - Kegiatan Pembelajaran */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">K</span>
                Kegiatan Pembelajaran (5 Tahap)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tahap Persiapan */}
              <div className="space-y-3 border p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold">1. Tahap Persiapan</h4>
                <div className="space-y-2">
                  <Label>Pemahaman Konsep</Label>
                  <Textarea
                    value={formData.kegiatanPembelajaran.persiapan.pemahamanKonsep}
                    onChange={(e) => setFormData({...formData, kegiatanPembelajaran: {...formData.kegiatanPembelajaran, persiapan: {...formData.kegiatanPembelajaran.persiapan, pemahamanKonsep: e.target.value}}})}
                    rows={4}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label>Penyiapan Alat</Label>
                  <Textarea
                    value={formData.kegiatanPembelajaran.persiapan.penyiapanAlat}
                    onChange={(e) => setFormData({...formData, kegiatanPembelajaran: {...formData.kegiatanPembelajaran, persiapan: {...formData.kegiatanPembelajaran.persiapan, penyiapanAlat: e.target.value}}})}
                    rows={4}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label>Alat & Bahan</Label>
                  <Textarea
                    value={formData.kegiatanPembelajaran.persiapan.alatBahan}
                    onChange={(e) => setFormData({...formData, kegiatanPembelajaran: {...formData.kegiatanPembelajaran, persiapan: {...formData.kegiatanPembelajaran.persiapan, alatBahan: e.target.value}}})}
                    rows={4}
                    disabled
                  />
                </div>
              </div>

              {/* Tahap Pelaksanaan */}
              <div className="space-y-3 border p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold">2. Tahap Pelaksanaan</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Orientasi</Label>
                    <Textarea
                      value={formData.kegiatanPembelajaran.pelaksanaan.orientasi}
                      onChange={(e) => setFormData({...formData, kegiatanPembelajaran: {...formData.kegiatanPembelajaran, pelaksanaan: {...formData.kegiatanPembelajaran.pelaksanaan, orientasi: e.target.value}}})}
                      rows={4}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Eksplorasi</Label>
                    <Textarea
                      value={formData.kegiatanPembelajaran.pelaksanaan.eksplorasi}
                      onChange={(e) => setFormData({...formData, kegiatanPembelajaran: {...formData.kegiatanPembelajaran, pelaksanaan: {...formData.kegiatanPembelajaran.pelaksanaan, eksplorasi: e.target.value}}})}
                      rows={4}
                      disabled
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Diskusi</Label>
                    <Textarea
                      value={formData.kegiatanPembelajaran.pelaksanaan.diskusi}
                      onChange={(e) => setFormData({...formData, kegiatanPembelajaran: {...formData.kegiatanPembelajaran, pelaksanaan: {...formData.kegiatanPembelajaran.pelaksanaan, diskusi: e.target.value}}})}
                      rows={4}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Kolaborasi</Label>
                    <Textarea
                      value={formData.kegiatanPembelajaran.pelaksanaan.kolaborasi}
                      onChange={(e) => setFormData({...formData, kegiatanPembelajaran: {...formData.kegiatanPembelajaran, pelaksanaan: {...formData.kegiatanPembelajaran.pelaksanaan, kolaborasi: e.target.value}}})}
                      rows={4}
                      disabled
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Refleksi</Label>
                  <Textarea
                    value={formData.kegiatanPembelajaran.pelaksanaan.refleksi}
                    onChange={(e) => setFormData({...formData, kegiatanPembelajaran: {...formData.kegiatanPembelajaran, pelaksanaan: {...formData.kegiatanPembelajaran.pelaksanaan, refleksi: e.target.value}}})}
                    rows={4}
                    disabled
                  />
                </div>
              </div>

              {/* Tahap Pembuatan Karya */}
              <div className="space-y-3 border p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold">3. Tahap Pembuatan Karya</h4>
                <div className="space-y-2">
                  <Label>Proses</Label>
                  <Textarea
                    value={formData.kegiatanPembelajaran.pembuatanKarya.proses}
                    onChange={(e) => setFormData({...formData, kegiatanPembelajaran: {...formData.kegiatanPembelajaran, pembuatanKarya: {...formData.kegiatanPembelajaran.pembuatanKarya, proses: e.target.value}}})}
                    rows={4}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hasil</Label>
                  <Textarea
                    value={formData.kegiatanPembelajaran.pembuatanKarya.hasil}
                    onChange={(e) => setFormData({...formData, kegiatanPembelajaran: {...formData.kegiatanPembelajaran, pembuatanKarya: {...formData.kegiatanPembelajaran.pembuatanKarya, hasil: e.target.value}}})}
                    rows={4}
                    disabled
                  />
                </div>
              </div>

              {/* Tahap Presentasi */}
              <div className="space-y-3 border p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold">4. Tahap Presentasi</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Persiapan</Label>
                    <Textarea
                      value={formData.kegiatanPembelajaran.presentasi.persiapan}
                      onChange={(e) => setFormData({...formData, kegiatanPembelajaran: {...formData.kegiatanPembelajaran, presentasi: {...formData.kegiatanPembelajaran.presentasi, persiapan: e.target.value}}})}
                      rows={4}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pelaksanaan</Label>
                    <Textarea
                      value={formData.kegiatanPembelajaran.presentasi.pelaksanaan}
                      onChange={(e) => setFormData({...formData, kegiatanPembelajaran: {...formData.kegiatanPembelajaran, presentasi: {...formData.kegiatanPembelajaran.presentasi, pelaksanaan: e.target.value}}})}
                      rows={4}
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Tahap Refleksi Akhir */}
              <div className="space-y-3 border p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold">5. Tahap Refleksi Akhir</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Refleksi Guru</Label>
                    <Textarea
                      value={formData.kegiatanPembelajaran.refleksiAkhir.refleksiGuru}
                      onChange={(e) => setFormData({...formData, kegiatanPembelajaran: {...formData.kegiatanPembelajaran, refleksiAkhir: {...formData.kegiatanPembelajaran.refleksiAkhir, refleksiGuru: e.target.value}}})}
                      rows={4}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Refleksi Anak</Label>
                    <Textarea
                      value={formData.kegiatanPembelajaran.refleksiAkhir.refleksiAnak}
                      onChange={(e) => setFormData({...formData, kegiatanPembelajaran: {...formData.kegiatanPembelajaran, refleksiAkhir: {...formData.kegiatanPembelajaran.refleksiAkhir, refleksiAnak: e.target.value}}})}
                      rows={4}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  )
}
