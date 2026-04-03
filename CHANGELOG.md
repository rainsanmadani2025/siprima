# CHANGELOG - RA INSAN MADANI PROJECT

## Format: YYYY-MM-DD - Deskripsi Perubahan

---

## 2025-03-26 - Perbaikan Sistem Raport, Penilaian, dan Absensi Matriks

### Raport Siswa (`/src/app/dashboard/guru/raport/page.tsx`)
- ✅ Perbaikan alamat sekolah dari database
- ✅ Perbaikan tampilan foto dokumentasi (struktur data documentation.diperbaiki)
- ✅ Perbaikan catatan pendidik (sekarang mengambil dari documentation.educatorNotes, bukan dari notes)
- ✅ Penambahan nama wali kelas di tanda tangan (ambil dari guru profile)
- ✅ Penambahan nama kepala sekolah di tanda tangan (ambil dari kepsek profile)
- ✅ Perubahan badge penilaian: "Belum Berkembang (BB)" bukan hanya "BB"
- ✅ Penghapusan tombol kriteria (BB/MB/BSH/BSB) di card penilaian
- ✅ Perubahan "NIP:" menjadi "NUPTK :" di tanda tangan

### Penilaian Perkembangan (`/src/app/dashboard/guru/penilaian/page.tsx`)
- ✅ Perbaikan parameter date (sekarang mengirim date sesuai periode yang dipilih)
- ✅ Perbaikan penyimpanan documentation (merge data photos, attendance, educatorNotes)
- ✅ Perbaikan handleSaveNotes untuk preserve data yang sudah ada

### Absensi Siswa (`/src/app/dashboard/guru/absensi/page.tsx`)
- ✅ BUAT BARU - Format tabel matriks dengan header: No, Nama Siswa, NIS, Tanggal 1-31
- ✅ Setiap cell tanggal berisi dropdown status (H/I/S/A)
- ✅ Hari Sabtu & Minggu di-gray out (disabled)
- ✅ Statistik rekap kehadiran di atas tabel
- ✅ Seleksi bulan untuk navigasi periode

### API Routes
- ✅ `/api/guru/save-assessment/route.ts` - Perbaikan teacherId dari userId
- ✅ `/api/guru/get-assessment/route.ts` - Perbaikan teacherId filter
- ✅ `/api/guru/profile/route.ts` - BARU - Get guru profile (nama, NUPTK)
- ✅ `/api/guru/attendance/month/route.ts` - BARU - Get absensi per bulan
- ✅ `/api/guru/attendance/save/route.ts` - BARU - Save absensi matriks

### Components
- ✅ `/src/components/dashboard/sidebar.tsx` - Pindah menu Raport ke bawah Penilaian

### Struktur Data Baru
```typescript
// Documentation structure
{
  photos: string[],              // Array foto (base64)
  attendance: {                 // Ketidakhadiran
    sakit: number,
    izin: number,
    alpa: number
  },
  educatorNotes: string         // Catatan pendidik
}
```

### Catatan Penting
- ⚠️ Halaman absensi matriks hilang saat error sebelumnya, sudah dibuat ulang
- ✅ Semua perubahan sekarang sudah di-backup
- ✅ Skrip backup otomatis dibuat: `/home/z/my-project/backup-changes.sh`

---

## Cara Menambah Entry Baru

### Format:
```markdown
## YYYY-MM-DD - Deskripsi Singkat Perubahan

### File/Modul
- ✅ Perubahan 1
- ✅ Perubahan 2

### Catatan
- ⚠️ Hal penting yang perlu diingatkan
- ✅ Fitur yang berhasil ditambahkan
```

---
