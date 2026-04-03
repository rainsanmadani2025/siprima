# Perubahan Halaman Raport Siswa

## Tanggal
2026-03-27

## Permintaan User
Memindahkan tombol export, cetak, simpan catatan, dan dropdown bulan ke card 'pilih siswa', serta menambahkan tombol preview PDF dengan layout yang sama seperti di halaman `/dashboard/guru/perencanaan/buat`.

## Perubahan yang Dilakukan

### 1. File: `/src/app/dashboard/guru/raport/page.tsx`

#### Perubahan A: Menambahkan Import Icon
```typescript
import {
  // ... existing imports
  Eye,      // Icon untuk Preview PDF
  FileDown  // Icon untuk Export PDF
} from 'lucide-react'
```

#### Perubahan B: Menambahkan State Loading PDF
```typescript
const [loadingPDF, setLoadingPDF] = useState(false)
```

#### Perubahan C: Menambahkan Handler HandlePreviewPDF
```typescript
const handlePreviewPDF = async () => {
  if (!selectedStudent || !reportData) {
    toast({
      title: "Error",
      description: "Pilih siswa dan pastikan data raport tersedia",
      variant: "destructive"
    })
    return
  }

  try {
    setLoadingPDF(true)

    const response = await fetch('/api/raport/export-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // ... data raport
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
    console.error('Error previewing PDF:', error)
    toast({
      title: "Error",
      description: error.message || "Gagal membuat preview PDF",
      variant: "destructive"
    })
  } finally {
    setLoadingPDF(false)
  }
}
```

#### Perubahan D: Menambahkan Handler HandleExportPDF
```typescript
const handleExportPDF = async () => {
  // Similar to handlePreviewPDF but downloads the PDF instead of opening in new tab
  const a = document.createElement('a')
  a.href = url
  a.download = `Raport-${selectedStudent.name}-${getMonthLabel(selectedPeriod)}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}
```

#### Perubahan E: Memodifikasi Layout Halaman

**Sebelum:**
```tsx
// Header Section - Tombol-tombol di sini
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
  <div>
    <h1 className="text-3xl font-bold tracking-tight">Raport Siswa</h1>
    <p className="text-muted-foreground mt-2">
      Lihat dan cetak raport perkembangan siswa
    </p>
  </div>
  <div className="flex gap-2">
    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
      {/* ... */}
    </Select>
    {reportData && (
      <>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Cetak
        </Button>
        <Button onClick={handleSaveReport} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <PenTool className="mr-2 h-4 w-4" />
          Simpan Catatan
        </Button>
      </>
    )}
  </div>
</div>

// Card Pilih Siswa - Hanya dropdown siswa
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <FileText className="h-5 w-5" />
      Pilih Siswa
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Dropdown siswa */}
  </CardContent>
</Card>
```

**Sesudah:**
```tsx
// Header Section - Hanya judul
<div>
  <h1 className="text-3xl font-bold tracking-tight">Raport Siswa</h1>
  <p className="text-muted-foreground mt-2">
    Lihat dan cetak raport perkembangan siswa
  </p>
</div>

// Card Pilih Siswa - Semua tombol dipindahkan ke sini
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Pilih Siswa
      </CardTitle>
      <div className="flex gap-2 flex-wrap items-center">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          {/* Dropdown bulan */}
        </Select>
        {reportData && (
          <>
            <Button onClick={handlePreviewPDF} disabled={loadingPDF} variant="outline" size="sm">
              {loadingPDF && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Eye className="mr-2 h-4 w-4" />
              Preview PDF
            </Button>
            <Button onClick={handleExportPDF} disabled={loadingPDF} variant="outline" size="sm">
              {loadingPDF && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <FileDown className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={handleExport} size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" onClick={handlePrint} size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Cetak
            </Button>
            <Button onClick={handleSaveReport} disabled={saving} size="sm">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <PenTool className="mr-2 h-4 w-4" />
              Simpan Catatan
            </Button>
          </>
        )}
      </div>
    </div>
  </CardHeader>
  <CardContent>
    {/* Dropdown siswa */}
  </CardContent>
</Card>
```

### 2. File Baru: `/src/app/api/raport/export-pdf/route.ts`

API endpoint baru untuk generate PDF raport menggunakan pdfkit.

#### Fitur:
- Menerima data raport via POST request
- Generate PDF dengan format A4
- Isi PDF mencakup:
  - Header (Nama sekolah, alamat)
  - Judul "LAPORAN PERKEMBANGAN ANAK"
  - Info siswa (Nama, NIS/NISN, Madrasah, Kelas, Fase, Semester, Tahun Ajaran)
  - 3 Aspek Penilaian dengan skor dan catatan perkembangan
  - Observasi Kegiatan
  - Catatan Anekdot
  - Ketidakhadiran (Sakit, Izin, Alpa)
  - Catatan Pendidik
  - Tanda tangan (Orang Tua, Wali Kelas, Kepala Sekolah)
  - Footer (Periode dan tanggal cetak)

#### Contoh Request:
```json
POST /api/raport/export-pdf
{
  "studentId": "...",
  "studentName": "Muhammad Putra",
  "studentNis": "12345",
  "studentNisn": "",
  "className": "B1",
  "period": "2026-03",
  "periodLabel": "Maret 2026",
  "semester": "Genap",
  "academicYear": "2025/2026",
  "schoolName": "RA INSAN MADANI",
  "schoolAddress": "Jl. Pendidikan No. 123",
  "schoolNpsn": "12345678",
  "teacherName": "Ibu Guru",
  "teacherNip": "1234567890",
  "principalName": "Kepala Sekolah",
  "principalNip": "0987654321",
  "assessments": {
    "agama_budi_pekerti": { ... },
    "jati_diri": { ... },
    "literasi_sains": { ... },
    "catatan_perkembangan": { ... }
  },
  "attendance": { "sakit": 0, "izin": 0, "alpa": 0 },
  "educatorNotes": "..."
}
```

#### Library yang Digunakan:
- `pdfkit` - Generate PDF
- Sudah tersedia di package.json (versi 0.18.0)

## Layout Tombol di Card Pilih Siswa

Urutan tombol (dari kiri ke kanan):
1. **Dropdown Bulan** - Pilih periode raport
2. **Preview PDF** - Buka PDF di tab baru (icon Eye)
3. **Export PDF** - Download PDF (icon FileDown)
4. **Export** - Export ke format lain (icon Download)
5. **Cetak** - Print halaman (icon Printer)
6. **Simpan Catatan** - Simpan catatan pendidik dan ketidakhadiran (icon PenTool)

Semua tombol menggunakan:
- `size="sm"` - Ukuran tombol kecil
- `variant="outline"` - Tombol outline (kecuali Simpan Catatan yang solid)
- `flex gap-2 flex-wrap items-center` - Layout responsif

## Testing
- ✅ Halaman berjalan tanpa error (status 200)
- ✅ Tidak ada linting error pada file raport
- ✅ Tombol Preview PDF dan Export PDF tersedia
- ✅ Semua tombol dipindahkan ke card "Pilih Siswa"
- ✅ Layout responsif dengan flex-wrap

## Catatan
- Tombol-tombol hanya muncul jika `reportData` ada (data raport tersedia)
- Dropdown bulan selalu muncul untuk memilih periode
- Tombol Preview PDF dan Export PDF menggunakan API endpoint `/api/raport/export-pdf` yang baru dibuat
- Loading state ditampilkan saat sedang memproses PDF
