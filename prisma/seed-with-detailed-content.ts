import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Import templates from the file with detailed content
const { kbcTemplates } = require('./seed-kbc-templates.ts')

async function main() {
  console.log('=== SEEDING RPP TEMPLATES WITH DETAILED CONTENT ===\n')

  // Delete all existing templates
  console.log('Step 1: Deleting all existing RPP templates...')
  const deleteCount = await prisma.rPPTemplate.deleteMany({})
  console.log(`✓ Deleted ${deleteCount.count} existing templates\n`)

  // Convert and insert templates with correct structure
  console.log('Step 2: Converting and inserting templates with detailed content...')
  let successCount = 0

  for (const template of kbcTemplates) {
    try {
      // Convert tujuanProfilLulusan keys from snake_case to camelCase for frontend
      const convertedTujuanProfilLulusan = {
        Beriman_dan_Berakhlak_Mulia: template.tujuanProfilLulusan?.beriman_dan_berakhlak_mulia || '',
        Berkebinekaan_Global: template.tujuanProfilLulusan?.berkebinekaan_global || '',
        Gotong_Royong: template.tujuanProfilLulusan?.gotong_royong || '',
        Mandiri_dan_Kreatif: template.tujuanProfilLulusan?.mandiri_dan_kreatif || '',
        Bernalar_Kritis: template.tujuanProfilLulusan?.bernar_kritis || '',
        Sehat_Jasmani_dan_Rohani: template.tujuanProfilLulusan?.sehat_jasmani_dan_rohani || '',
        Warga_Negara: template.tujuanProfilLulusan?.warga_negara || ''
      }

      // Convert kerangkaPembelajaran from string to JSON object
      const kerangkaLines = template.kerangkaPembelajaran?.split('\n') || []
      const praktekPedagogik = kerangkaLines.slice(1).filter(line => line.startsWith('-')).map(line => line.replace(/^- /, '')).join('\n')
      
      // Build lingkunganPembelajaran with detailed content
      const lingkunganPembelajaran = {
        fisik: "Ruang kelas yang nyaman, bersih, dan aman dengan pencahayaan dan ventilasi yang baik. Area sudut belajar yang terorganisir dengan baik. Dinding kelas yang didekorasi dengan karya-karya anak dan poster pembelajaran. Peralatan dan bahan yang aman dan mudah dijangkau oleh anak. Area outdoor yang luas dan aman untuk aktivitas fisik dan eksplorasi.",
        sosial: "Guru menciptakan lingkungan sosial yang mendukung, menghargai, dan menerima setiap anak secara utuh. Anak diajak untuk saling mengenal dan menghargai perbedaan antar individu. Guru memfasilitasi interaksi sosial yang positif antar anak melalui kegiatan kelompok dan kolaborasi. Terbuka ruang untuk diskusi dan berbagi pengalaman antar anak dan guru.",
        psikologis: "Lingkungan yang aman secara emosional, bebas dari tekanan, hukuman, dan kritik yang menyakitkan. Guru memberikan penguatan positif dan penghargaan untuk setiap usaha dan pencapaian anak. Anak diberi kebebasan untuk mengekspresikan perasaan dan emosi secara sehat. Terjalin hubungan yang hangat, saling percaya, dan saling menghargai antara guru dan anak.",
        akademik: "Lingkungan yang merangsang rasa ingin tahu dan motivasi belajar anak. Materi pembelajaran disajikan dengan cara yang menarik, relevan, dan sesuai dengan usia anak. Guru memberikan tantangan yang sesuai dengan kemampuan anak untuk mendorong perkembangan optimal. Terjadi proses scaffolding yang tepat untuk membantu anak mencapai potensi maksimalnya."
      }

      const kemitraanPembelajaran = "Kerjasama dengan orang tua untuk memperkuat pembelajaran di rumah. Kolaborasi dengan komunitas dan instansi terkait. Kemitraan dengan sekolah lain untuk berbagi praktik terbaik dalam pembelajaran."

      const pemanfaatanDigital = "Menggunakan video edukasi untuk memperkaya pembelajaran. Memanfaatkan aplikasi edukatif untuk mendukung aktivitas belajar anak. Menggunakan audio player untuk memutar lagu-lagu pembelajaran. Memutar slide show foto-foto kegiatan anak sebagai bahan refleksi. Menggunakan proyektor untuk menampilkan materi visual dan video pembelajaran."

      const kerangkaPembelajaranObj = {
        praktekPedagogik: template.kerangkaPembelajaran || '',
        lingkunganPembelajaran,
        kemitraanPembelajaran,
        pemanfaatanDigital
      }

      // Convert kegiatanPembelajaran from {pendahuluan, inti[], penutup} to {persiapan, pelaksanaan, pembuatanKarya, presentasi, refleksiAkhir}
      const kegiatan = template.kegiatanPembelajaran || {}
      const intiSteps = Array.isArray(kegiatan.inti) ? kegiatan.inti.join('\n\n') : kegiatan.inti || ''
      
      // Extract tools/materials from activities
      const extractedTools = extractToolsFromActivities(kegiatan.inti || [], kegiatan.pendahuluan || '')
      
      const kegiatanPembelajaranObj = {
        persiapan: {
          pemahamanKonsep: "Guru mempelajari konsep dasar tema pembelajaran. Guru memahami teori perkembangan anak usia dini. Guru mempelajari pendekatan pembelajaran yang efektif. Guru mengkaji kurikulum dan standar kompetensi yang relevan. Guru mempersiapkan konsep penilaian yang sesuai.",
          penyiapanAlat: "Menyiapkan alat-alat pembelajaran yang diperlukan. Menyiapkan bahan-bahan untuk kegiatan praktik. Menyiapkan media visual dan audio. Menyiapkan poster dan flashcard. Menyiapkan ruang kelas yang kondusif.",
          alatBahan: extractedTools
        },
        pelaksanaan: {
          orientasi: kegiatan.pendahuluan || '',
          eksplorasi: '',
          diskusi: '',
          kolaborasi: '',
          refleksi: ''
        },
        pembuatanKarya: {
          proses: "Anak menyiapkan bahan dan alat untuk membuat karya. Anak mengikuti langkah-langkah pembuatan karya dengan bimbingan guru. Anak mengekspresikan kreativitas dan imajinasi dalam pembuatan karya. Anak menyelesaikan karya sesuai dengan instruksi.",
          hasil: "Karya seni yang dibuat anak sesuai tema pembelajaran. Produk kreatif yang menunjukkan pemahaman anak. Karya kolaboratif yang dibuat bersama teman-teman. Dokumentasi kegiatan pembelajaran dalam bentuk foto atau video."
        },
        presentasi: {
          persiapan: "Anak mempersiapkan diri untuk mempresentasikan karya. Guru membantu anak merapikan karya. Anak berlatih berbicara di depan teman-teman.",
          pelaksanaan: "Anak mempresentasikan karya di depan kelas. Anak menjelaskan makna dan proses pembuatan karya. Teman-teman dan guru memberikan apresiasi."
        },
        refleksiAkhir: {
          refleksiGuru: "Guru mengevaluasi keberhasilan pembelajaran. Guru merefleksikan metode yang digunakan. Guru mengidentifikasi area yang perlu diperbaiki. Guru merencanakan tindak lanjut.",
          refleksiAnak: "Anak berbagi pengalaman belajar. Anak mengekspresikan perasaan setelah kegiatan. Anak menyebutkan hal baru yang dipelajari. Anak menentukan tujuan belajar selanjutnya."
        }
      }

      // Fill pelaksanaan with detailed inti steps
      if (kegiatan.inti && Array.isArray(kegiatan.inti)) {
        kegiatanPembelajaranObj.pelaksanaan.eksplorasi = kegiatan.inti[0] || ''
        kegiatanPembelajaranObj.pelaksanaan.diskusi = kegiatan.inti[1] || ''
        kegiatanPembelajaranObj.pelaksanaan.kolaborasi = kegiatan.inti[2] || ''
        kegiatanPembelajaranObj.pelaksanaan.refleksi = kegiatan.inti[3] || ''
        if (kegiatan.inti[4]) {
          kegiatanPembelajaranObj.pelaksanaan.refleksi += '\n\n' + kegiatan.inti[4]
        }
      }

      await prisma.rPPTemplate.create({
        data: {
          tema: template.tema,
          topikKBC: template.topikKBC,
          profilLulusan: template.profilLulusan || '',
          tujuanKBC: template.tujuanKBC || '',
          tujuanProfilLulusan: JSON.stringify(convertedTujuanProfilLulusan),
          tujuanPembelajaranMendalam: template.tujuanPembelajaranMendalam || '',
          materiIntegrasiKBC: template.materiIntegrasiKBC || '',
          tujuanPembelajaran: template.tujuanPembelajaran || '',
          kerangkaPembelajaran: JSON.stringify(kerangkaPembelajaranObj),
          kegiatanPembelajaran: JSON.stringify(kegiatanPembelajaranObj),
          isActive: true
        }
      })

      console.log(`✓ Template "${template.tema}" berhasil dibuat dengan narasi detail`)
      successCount++
    } catch (error) {
      console.error(`✗ Gagal membuat template "${template.tema}":`, error.message)
    }
  }

  console.log(`\n=== SEEDING SELESAI ===`)
  console.log(`Total template: ${kbcTemplates.length}`)
  console.log(`Berhasil dibuat: ${successCount}`)
  console.log(`Gagal: ${kbcTemplates.length - successCount}`)
}

// Helper function to extract tools and materials from activities
function extractToolsFromActivities(intiActivities, pendahuluan) {
  const tools = []
  
  // Extract from pendahuluan
  if (pendahuluan) {
    if (pendahuluan.includes('poster')) tools.push('Poster dan flashcard')
    if (pendahuluan.includes('lagu') || pendahuluan.includes('audio')) tools.push('Audio player dan lagu')
    if (pendahuluan.includes('video')) tools.push('Video pembelajaran')
    if (pendahuluan.includes('kamera')) tools.push('Kamera atau handphone')
    if (pendahuluan.includes('buku') || pendahuluan.includes('cerita')) tools.push('Buku cerita')
  }
  
  // Extract from inti activities
  if (Array.isArray(intiActivities)) {
    const allInti = intiActivities.join(' ')
    if (allInti.includes('kertas') || allInti.includes('krem') || allInti.includes('warna')) {
      tools.push('Kertas gambar, krayon, cat air, kuas')
    }
    if (allInti.includes('gunting')) tools.push('Guntingan anak')
    if (allInti.includes('lem')) tools.push('Lem kertas')
    if (allInti.includes('stiker')) tools.push('Stiker')
    if (allInti.includes('puzzle')) tools.push('Puzzle')
    if (allInti.includes('boneka')) tools.push('Boneka tangan atau puppet')
    if (allInti.includes('makanan') || allInti.includes('masak')) {
      tools.push('Bahan makanan, alat makan, alat memasak')
    }
  }
  
  return tools.length > 0 ? tools.join('. ') + '.' : 'Alat dan bahan pembelajaran sesuai tema.'
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
