# Perbaikan Statistik Dashboard Guru

## Tanggal
2026-03-27

## Masalah
Data statistik di halaman `/dashboard/guru` tidak sesuai dengan data real di database.

### Perbedaan Data (Sebelum Perbaikan):

| Statistik | Data Real (Database) | Data API (Salah) | Status |
|-----------|---------------------|------------------|--------|
| **Total Siswa** | 2 | 4 | ❌ BEDA |
| **Siswa Hadir** | 0 | 0 | ✅ Sesuai |
| **RPP Total** | 2 | 2 | ✅ Sesuai |
| **Penilaian Bulanan** | 0/2 (0%) | 1/4 (25%) | ❌ BEDA |

### Data Real (Database):
- Teacher ID: `cmn4ix1je0005p0jxhlgmmd1p`
- User ID: `cmn4ix1jd0003p0jx9hp69amm`
- Kelas: B1
- Total Siswa: 2 (Muhammad Putra, Fatimah Wati)
- RPP Total: 2
- Penilaian: 0/2 (0%)

## Penyebab Masalah

File: `/src/app/api/dashboard/guru/statistics/route.ts`

Frontend mengirim parameter `userId`, tapi backend mencari parameter `teacherId`:

```typescript
// Backend (Salah):
const userId = searchParams.get('userId')
const teacherId = searchParams.get('teacherId')  // ❌ Tidak pernah ada

if (teacherId) {  // ❌ Selalu false karena teacherId null
  // Filter by teacher
} else {  // ✅ Masuk sini karena teacherId null
  // Fallback: ambil semua siswa tanpa filter
  students = await db.student.findMany({
    where: { status: 'aktif' },  // ❌ Tidak ada filter kelas/teacher
    include: { class: true }
  })
}
```

Karena `teacherId` tidak ada (null), backend selalu menggunakan fallback yang mengambil SEMUA siswa tanpa filter, sehingga menampilkan 4 siswa (bukan 2 yang diajar guru tersebut).

## Perbaikan

### File yang diubah: `/src/app/api/dashboard/guru/statistics/route.ts`

#### Perubahan 1: Gunakan langsung `userId` untuk mencari teacher

**Sebelum:**
```typescript
const userId = searchParams.get('userId')
const teacherId = searchParams.get('teacherId')  // ❌ Hapus ini

if (teacherId) {  // ❌ Tidak pernah true
  const teacher = await db.teacher.findFirst({
    where: { userId: teacherId },  // ❌ Salah
    select: { id: true }
  })
  // ...
}
```

**Sesudah:**
```typescript
const userId = searchParams.get('userId')
let actualTeacherId: string | null = null

if (userId) {  // ✅ Gunakan userId langsung
  const teacher = await db.teacher.findFirst({
    where: { userId: userId },  // ✅ Benar
    select: { id: true }
  })

  if (teacher) {
    actualTeacherId = teacher.id  // ✅ Simpan untuk keperluan lain
    // ...
  }
}
```

#### Perubahan 2: Gunakan `actualTeacherId` untuk RPPH

**Sebelum:**
```typescript
const todayRPPH = await db.dailyPlan.findFirst({
  where: {
    date: today,
    ...(teacherId && { teacherId }),  // ❌ teacherId undefined
    ...(classId && { classId })
  }
})
```

**Sesudah:**
```typescript
const todayRPPH = await db.dailyPlan.findFirst({
  where: {
    date: today,
    ...(actualTeacherId && { teacherId: actualTeacherId }),  // ✅ Gunakan actualTeacherId
    ...(classId && { classId })
  }
})
```

## Hasil Setelah Perbaikan

### Data API (Sesuai dengan Database):
```json
{
  "students": {
    "total": 2,        // ✅ Benar (sebelumnya 4)
    "present": 0,
    "izin": 0,
    "sakit": 0,
    "alpha": 0,
    "attendanceRate": "0"
  },
  "rpp": {
    "total": 2,        // ✅ Benar
    ...
  },
  "assessments": {
    "progress": "0",   // ✅ Benar (sebelumnya "25")
    "assessed": 0,     // ✅ Benar (sebelumnya 1)
    "total": 2         // ✅ Benar (sebelumnya 4)
  }
}
```

### Verifikasi:
```bash
# Test API
curl "http://localhost:3000/api/dashboard/guru/statistics?userId=cmn4ix1jd0003p0jx9hp69amm"

# Result:
# - Students total: 2 ✅
# - Present: 0 ✅
# - Assessments: 0/2 (0%) ✅
# - RPP total: 2 ✅
```

## Kesimpulan

✅ **Perbaikan Berhasil!**

Semua data statistik di dashboard guru sekarang sudah **sesuai dengan data real** di database:
- Total siswa hanya menampilkan siswa yang diajar oleh guru tersebut
- Penilaian bulanan hanya menghitung siswa yang diajar oleh guru tersebut
- Data kehadiran sesuai dengan siswa yang diajar oleh guru tersebut

**Pelajaran:**
Selalu pastikan nama parameter yang dikirim dari frontend (`userId`) sesuai dengan yang diterima dan digunakan di backend.
