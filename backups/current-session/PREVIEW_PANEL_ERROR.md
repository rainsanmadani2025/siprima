# Preview Panel Error Investigation

## Masalah
Preview panel sering mengalami error

## Gejala
- Preview panel tidak muncul
- Error saat mencoba membuka preview
- Loading terus tanpa hasil

## Kemungkinan Penyebab

### 1. Konfigurasi iframe/CORS
- Preview menggunakan iframe untuk menampilkan konten
- Mungkin ada masalah dengan header CORS
- Mungkin content-type tidak sesuai

### 2. URL Generation
- Preview URL mungkin tidak ter-generate dengan benar
- Port configuration issue

### 3. Browser Restrictions
- Browser memblokir konten iframe
- Security policy browser

### 4. Dev Server Configuration
- Next.js config untuk preview
- Webpack configuration

## Investigasi yang Perlu Dilakukan

### 1. Cek Log Browser
- Buka DevTools (F12)
- Tab Console
- Tab Network
- Lihat error apa yang muncul

### 2. Cek Log Server
```bash
tail -100 /home/z/my-project/dev.log | grep -i error
tail -100 /home/z/my-project/dev.log | grep -i preview
```

### 3. Cek File Preview
- `/home/z/my-project/src/app/api/rpp/export-pdf/route.ts` (line 707-744)
- `/home/z/my-project/src/app/dashboard/guru/perencanaan/buat/page.tsx` (line 707-744)

### 4. Test Preview Directly
```bash
# Test endpoint langsung
curl -X POST http://localhost:3000/api/rpp/export-pdf \
  -H "Content-Type: application/json" \
  -d '{"tema":"Test"}' \
  --output test.pdf
```

## Solusi Potensial

### 1. Fix Content-Type
```typescript
// Pastikan content-type header benar
return new NextResponse(Buffer.from(pdfBytes), {
  status: 200,
  headers: {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `inline; filename="RPP-KBC-${tema}.pdf"`
  }
})
```

### 2. Add CORS Headers
```typescript
headers: {
  'Content-Type': 'application/pdf',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}
```

### 3. Use Blob URL with Correct MIME Type
```typescript
const blob = new Blob([pdfBytes], { type: 'application/pdf' })
const url = window.URL.createObjectURL(blob)
window.open(url, '_blank')
```

### 4. Alternative: Use Object URL
```typescript
const pdfBytes = await response.arrayBuffer()
const blob = new Blob([pdfBytes], { type: 'application/pdf' })
const objectUrl = URL.createObjectURL(blob)
window.open(objectUrl, '_blank', '_blank,noreferrer')
```

## Testing

### Test 1: Direct API Call
```bash
curl -X POST http://localhost:3000/api/rpp/export-pdf \
  -H "Content-Type: application/json" \
  -d '{"tema":"Test","namaSekolah":"RA INSAN MADANI"}'
```

### Test 2: Check Response Headers
```bash
curl -I -X POST http://localhost:3000/api/rpp/export-pdf \
  -H "Content-Type: application/json" \
  -d '{"tema":"Test"}'
```

### Test 3: Browser Console
1. Buka preview
2. Buka DevTools (F12)
3. Tab Console - lihat error
4. Tab Network - cek request preview
5. Tab Application - cek blobs

## Next Steps

1. ✅ Investigate error message
2. ✅ Test direct API call
3. ✅ Check CORS configuration
4. ✅ Test di berbagai browser
5. ⏳ Implement fix berdasarkan hasil investigasi
6. ⏳ Test fix secara menyeluruh

## Status
- **Status:** Pending Investigation
- **Priority:** Medium
- **Created:** 2025-03-25

## Notes
- Issue ini tidak terkait dengan perubahan kode yang dilakukan
- Issue ini ada sebelum sesi ini
- Perlu investigasi lebih lanjut
