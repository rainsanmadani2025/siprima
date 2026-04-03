import { NextResponse } from 'next/server'

// Data tema yang akan digunakan secara bergantian
const temas = [
  "Diri Sendiri",
  "Lingkungan Sekitar",
  "Binatang",
  "Tanaman",
  "Alam Semesta",
  "Rekreasi",
  "Transportasi",
  "Profesi",
  "Bahan Alam",
  "Teknologi"
]

// Data lingkup perkembangan
const lingkupPerkembanganList = [
  "Nilai Agama dan Moral",
  "Fisik Motorik",
  "Kognitif",
  "Bahasa",
  "Sosial Emosional",
  "Seni"
]

// Generate content untuk setiap minggu
function generateWeeklyContent(minggu: number, tema: string) {
  const lingkup = lingkupPerkembanganList[minggu % lingkupPerkembanganList.length]

  const subTemaList = {
    "Diri Sendiri": ["Anggota Tubuh", "Merawat Diri", "Perasaan", "Keluarga", "Hobi"],
    "Lingkungan Sekitar": ["Rumah", "Sekolah", "Taman", "Jalanan", "Toko"],
    "Binatang": ["Binatang Darat", "Binatang Air", "Binatang Udara", "Binatang Ternak", "Binatang Liar"],
    "Tanaman": ["Bunga", "Sayuran", "Buah", "Pohon", "Rumput"],
    "Alam Semesta": ["Matahari", "Bulan", "Bintang", "Awan", "Hujan"],
    "Rekreasi": ["Taman Bermain", "Pantai", "Gunung", "Kebun Binatang", "Kolam Renang"],
    "Transportasi": ["Darat", "Laut", "Udara", "Jalur Kereta", "Terminal"],
    "Profesi": ["Dokter", "Guru", "Polisi", "Petani", "Pedagang"],
    "Bahan Alam": ["Tanah", "Air", "Udara", "Batu", "Pasir"],
    "Teknologi": ["Komputer", "Telepon", "Televisi", "Kamera", "Robot"]
  }

  const subTemaArray = subTemaList[tema] || ["Subtema 1", "Subtema 2", "Subtema 3", "Subtema 4", "Subtema 5"]
  const subTema = subTemaArray[minggu % subTemaArray.length]

  const kegiatanPembelajaranList = [
    "Mengamati gambar dan benda nyata terkait tema",
    "Bermain peran sesuai dengan tema yang dipelajari",
    "Mendengarkan cerita tentang tema",
    "Membuat karya seni dengan berbagai bahan",
    "Bernyanyi dan bergerak mengikuti lagu",
    "Diskusi kelompok tentang pengalaman terkait tema",
    "Eksplorasi lingkungan untuk menemukan objek terkait tema",
    "Membuat proyek kolaboratif",
    "Presentasi hasil karya di depan kelas",
    "Refleksi pembelajaran hari ini"
  ]

  const kegiatanPembelajaran = kegiatanPembelajaranList[minggu % kegiatanPembelajaranList.length]

  const indikatorList = [
    "Anak dapat menyebutkan nama-nama benda terkait tema",
    "Anak dapat menjelaskan fungsi dari benda-benda yang dipelajari",
    "Anak dapat mengelompokkan benda berdasarkan ciri-ciri tertentu",
    "Anak dapat membuat karya sederhana sesuai tema",
    "Anak dapat bekerja sama dalam kelompok",
    "Anak dapat menceritakan kembali pengalaman belajar",
    "Anak dapat menunjukkan sikap peduli terhadap lingkungan",
    "Anak dapat mengekspresikan diri melalui seni",
    "Anak dapat mengikuti instruksi dengan baik",
    "Anak dapat menunjukkan rasa ingin tahu yang tinggi"
  ]

  const indikator = indikatorList[minggu % indikatorList.length]

  return {
    minggu: minggu + 1,
    tema,
    subTema,
    lingkupPerkembangan: lingkup,
    kegiatanPembelajaran,
    indikator
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { semester, tahunAjaran } = body

    if (!semester || !tahunAjaran) {
      return NextResponse.json(
        { success: false, error: 'Semester dan tahun ajaran wajib diisi' },
        { status: 400 }
      )
    }

    // Generate 20 minggu
    const mingguan = []
    for (let i = 0; i < 20; i++) {
      const tema = temas[i % temas.length]
      mingguan.push(generateWeeklyContent(i, tema))
    }

    return NextResponse.json({
      success: true,
      mingguan
    })
  } catch (error: any) {
    console.error('Error generating PROSEM:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menggenerate PROSEM' },
      { status: 500 }
    )
  }
}
