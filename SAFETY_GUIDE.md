# Panduan Kerja Aman - Mencegah Database Hilang/Error

## PROBLEM
Sering terjadi database hilang atau aplikasi error setelah melakukan perubahan kode.

## ROOT CAUSE ANALYSIS

### Kemungkinan Penyebab:
1. **Hot reload dev server** - Perubahan file memicu restart yang tidak aman
2. **Operasi database tidak sengaja** - Script db:push, seed, dll. berjalan tanpa sadar
3. **Tidak ada backup sebelum perubahan** - Langsung edit tanpa jaring pengaman
4. **Concurrent operations** - Operasi database berjalan bersamaan

## SOLUTION - SAFETY PROTOCOLS

### 1. SEBELUM MELAKUKAN PERUBAHAN

#### a. Backup Database Wajib
```bash
# Manual backup
cp /home/z/my-project/db/custom.db /home/z/my-project/backups/custom_db_PRE_EDIT.db
```

#### b. Cek Log Dev Server
```bash
tail -50 /home/z/my-project/dev.log
```

#### c. Verifikasi Database Status
```bash
# Cek jumlah template
bun -e "const {PrismaClient}=require('@prisma/client'); const p=new PrismaClient(); p.rPPTemplate.count().then(c=>console.log('Templates:',c)).finally(()=>p.\$disconnect())"
```

### 2. SAAT MELAKUKAN PERUBAHAN

#### a. JANGAN menjalankan perintah ini kecuali diperlukan:
- `bun run db:push` - Hanya jika ada perubahan schema
- `bun run db:reset` - JANGAN PERNAH tanpa backup
- Script seed apapun - Hanya jika database benar-benar kosong

#### b. Perubahan Kode yang Aman:
- ✅ Edit file komponen/page (tsx, ts, js)
- ✅ Edit CSS/styling
- ✅ Edit logika bisnis
- ✅ Perbaikan bug non-database

#### c. Perubahan Kode yang Berbahaya:
- ⚠️ Edit prisma/schema.prisma
- ⚠️ Edit file di prisma/ folder
- ⚠️ Edit database configuration
- ⚠️ Edit env files

### 3. SETELAH MELAKUKAN PERUBAHAN

#### a. Verifikasi Aplikasi
```bash
# Cek log error
tail -100 /home/z/my-project/dev.log | grep -i error

# Cek database
# (seperti di langkah 1c)
```

#### b. Jika Error Terjadi:
1. Stop dev server (Ctrl+C)
2. Restore database dari backup jika perlu
3. Revert perubahan kode
4. Restart dev server

## BEST PRACTICES UNTUK AI ASSISTANT

### SEBELUM MENJAWAB:
1. ✅ Jangan pernah menjalankan operasi database tanpa izin eksplisit
2. ✅ Selalu gunakan `Read` tool sebelum `Edit`
3. ✅ Beri peringatan jika operasi berbahaya akan dilakukan
4. ✅ Tawarkan untuk backup sebelum perubahan besar

### SAAT MENJAWAB:
1. ✅ Jelaskan apa yang akan dilakukan
2. ✅ Tanyakan konfirmasi untuk operasi berbahaya
3. ✅ Gunakan perintah yang non-destructive terlebih dahulu
4. ✅ Fokus pada perubahan kode, bukan database

### SETELAH PERUBAHAN:
1. ✅ Selalu cek log dev server
2. ✅ Verifikasi database tidak terpengaruh
3. ✅ Beri ringkasan perubahan yang dilakukan

## CHECKLIST SEBELUM PERUBAHAN BESAR

- [ ] Backup database dibuat
- [ ] Log dev server dicek (tidak ada error)
- [ ] Status database terverifikasi
- [ ] Perubahan dipahami sepenuhnya
- [ ] Dampak samping diantisipasi
- [ ] Plan revert disiapkan

## PERBAIKAN YANG AKAN DILAKUKAN

1. ✅ Membuat script backup otomatis
2. ✅ Membuat script restore
3. ✅ Tidak akan menjalankan operasi database tanpa konfirmasi
4. ✅ Selalu menginformasikan dampak sebelum perubahan
5. ✅ Fokus pada perubahan kode, bukan database
