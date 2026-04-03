import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const templates = [
  {
    tema: 'Lingkungan Sekitarku',
    topikKBC: 'Cinta Diri dan Sesama',
    profilLulusan: 'Kesehatan, Kemandirian, Bernalar Kritis, Kreatif, Berkarakter, Beriman, Bertakwa',
    tujuanKBC: 'Mengenal mesjid sebagai tempat ibadah umat Islam dan memahami cara bersikap yang tepat di dalamnya. Anak diajak untuk mencintai tempat ibadah, memahami fungsi mesjid dalam kehidupan muslim, dan membiasakan diri dengan adab-adab yang harus dijaga saat berada di dalam mesjid. Melalui kegiatan ini, anak diharapkan tumbuh dengan rasa cinta dan hormat terhadap rumah Allah, memahami bahwa mesjid adalah tempat yang mulia dan sakral, serta menumbuhkan kebiasaan baik sejak dini untuk selalu menjaga kebersihan dan ketertiban di tempat ibadah.',
    tujuanProfilLulusan: {
      Kesehatan: 'Mengenal dan memahami lingkungan yang sehat di sekitar mesjid, termasuk menjaga kebersihan tempat ibadah, memahami pentingnya berwudhu sebelum beribadah, dan menjaga kesehatan fisik saat beraktivitas di lingkungan mesjid. Anak belajar bahwa kebersihan adalah sebagian dari iman dan bahwa menjaga tubuh tetap bersih saat berada di mesjid adalah bentuk rasa hormat kepada Allah.',
      Kemandirian: 'Dapat merawat diri sendiri saat berada di mesjid, mulai dari cara memakai pakaian yang sopan dan menutup aurat, cara berwudhu dengan benar dan mandiri, mengatur benda-benda pribadi seperti tasbih dan mukena, serta mempraktikkan tata cara salat secara mandiri dengan bimbingan guru yang minim. Anak dilatih untuk tidak bergantung pada orang dewasa dalam hal-hal dasar ibadah.',
      BernalarKritis: 'Memahami alasan mengapa harus berperilaku baik di mesjid, menganalisis fungsi setiap bagian mesjid seperti mihrab, mimbar, dan saf salat, mempertanyakan dan mencari jawaban tentang mengapa mesjid dianggap sakral dan harus dijaga kehormatannya, serta memahami makna gerakan-gerakan salat yang dilakukan dan hikmah di baliknya.',
      Kreatif: 'Menciptakan aktivitas bermain yang sesuai dengan lingkungan mesjid, membuat karya seni bertema mesjid dengan berbagai bahan dan teknik, bermain peran sebagai orang yang sedang beribadah di mesjid dengan ekspresi yang tepat, menemukan cara-cara baru untuk menjaga kebersihan dan ketertiban mesjid, serta berinovasi dalam menggambarkan keindahan mesjid.',
      Berkarakter: 'Menumbuhkan sikap hormat dan sopan di tempat ibadah, belajar untuk diam dan mendengarkan saat ceramah atau khotbah berlangsung, menghargai orang lain yang sedang beribadah dengan tidak membuat gangguan, serta mempraktikkan nilai-nilai kasih sayang dan kepedulian terhadap sesama jamaah mesjid. Anak belajar bahwa mesjid adalah tempat untuk kedamaian dan kebersamaan.',
      Beriman: 'Mengenal mesjid sebagai tempat untuk mendekatkan diri kepada Allah SWT, memahami bahwa mesjid adalah rumah Allah yang harus disegani dan dicintai, merasakan kedamaian dan ketenangan saat berada di dalam mesjid, serta mulai memahami konsep ibadah sebagai bentuk ketaatan dan cinta kepada Allah yang menciptakan kita.',
      Bertakwa: 'Mengenal dasar-dasar ibadah yang dilakukan di mesjid seperti salat, dzikir, dan mendengarkan ceramah agama, mempraktikkan gerakan salat dasar dengan benar dan penuh penghayatan sesuai dengan kemampuan usia dini, memahami bacaan-bacaan dasar dalam salat seperti Takbir, Al-Fatihah, dan sujud, serta membiasakan diri untuk datang ke mesjid sebagai bentuk taat kepada Allah.'
    },
    tujuanPembelajaranMendalam: 'KD1: Mengenal mesjid dan fungsi sebagai tempat ibadah umat Islam untuk mendekatkan diri kepada Allah SWT serta memahami peran mesjid dalam kehidupan komunitas Muslim.\nKD2: Memahami cara bersikap sopan dan hormat di mesjid sesuai dengan adab Islam, termasuk cara berjalan, berbicara, dan berpakaian yang sesuai di tempat ibadah.\nKD3: Mengenal aktivitas ibadah yang dilakukan di mesjid seperti salat berjamaah, dzikir, mendengarkan ceramah, dan membaca Al-Quran.',
    materiIntegrasiKBC: 'Pengenalan mesjid sebagai rumah Allah dan tempat ibadah umat Islam, fungsi mesjid dalam kehidupan masyarakat muslim sebagai pusat ibadah, pendidikan, dan sosial, adab dan tata tertib di dalam mesjid yang harus dipatuhi setiap Muslim.',
    tujuanPembelajaran: 'Setelah mengikuti kegiatan pembelajaran ini, anak diharapkan dapat mengenal mesjid sebagai tempat ibadah, memahami cara bersikap yang tepat di dalamnya, dan memiliki rasa cinta terhadap tempat ibadah',
    kerangkaPembelajaran: {
      praktekPedagogik: 'Main peran\nObservasi lapangan\nCerita bergambar\nPertanyaan terbuka\nPembelajaran berbasis proyek',
      lingkunganPembelajaran: {
        fisik: 'Model mesjid mini\nGambar mesjid\nKarpet sholat\nAlat salat',
        sosial: 'Kerja kelompok kecil\nInteraksi dengan pengurus masjid\nBermain bersama teman',
        psikologis: 'Lingkungan nyaman\nPujian dan motivasi\nKreativitas anak didik',
        akademik: 'Buku cerita tentang mesjid\nGambar-gambar ibadah\nVideo edukasi'
      },
      kemitraanPembelajaran: 'Orang tua\nPengurus masjid setempat\nTokoh agama',
      pemanfaatanDigital: 'Video singkat tentang mesjid\nAplikasi edukasi anak tentang ibadah'
    },
    kegiatanPembelajaran: {
      persiapan: {
        pemahamanKonsep: 'Membaca buku tentang mesjid\nMelihat video pendek mengenai mesjid\nDiskusi sederhana tentang tempat ibadah',
        penyiapanAlat: 'Mempersiapkan model mesjid mini\nMenyiapkan gambar-gambar aktivitas di mesjid\nMempersiapkan alat peraga salat',
        alatBahan: 'Kertas warna\ngunting\nlem\nstiker\ngambar mesjid\nmodel mesjid mini\nkarpet\ntasbih'
      },
      pelaksanaan: {
        orientasi: 'Mengajak anak duduk melingkar\nMenanyakan pengalaman anak mengenai mesjid\nMemperkenalkan tema pembelajaran',
        eksplorasi: 'Melihat model mesjid mini\nMengenal bagian-bagian mesjid\nMempraktikkan gerakan salat sederhana',
        diskusi: 'Membahas cara bersikap di mesjid\nMengapa mesjid tempat suci\nApa saja aktivitas di mesjid',
        kolaborasi: 'Membangun mesjid mini bersama\nBermain peran sholat berjamaah\nMembuat poster tentang mesjid',
        refleksi: 'Anak menceritakan pengalaman belajar\nMenanyakan apa yang telah dipelajari'
      },
      pembuatanKarya: {
        proses: 'Membuat gambar mesjid\nMewarnai gambar aktivitas ibadah\nMembuat miniatur mesjid dari kardus',
        hasil: 'Gambar mesjid yang diperkirakan\nMiniatur mesjid\nPoster tentang adab di mesjid'
      },
      presentasi: {
        persiapan: 'Menyiapkan karya hasil proyek\nMembuat kalimat sederhana untuk menjelaskan karya',
        pelaksanaan: 'Menampilkan karya kepada teman\nMenceritakan karya yang dibuat\nMenjawab pertanyaan teman'
      },
      refleksiAkhir: {
        refleksiGuru: 'Menilai pemahaman anak tentang mesjid\nMengamati sikap anak saat menirukan aktivitas di mesjid\nMenilai kreativitas anak dalam membuat karya',
        refleksiAnak: 'Menceritakan apa yang paling disukai\nMenyampaikan hal baru yang dipelajari\nMenyampaikan kesulitan yang dihadapi'
      }
    }
  }
]

async function main() {
  console.log('Deleting old templates and inserting new comprehensive templates...')

  // Delete all existing templates
  await prisma.$executeRaw`DELETE FROM RPPTemplate`
  
  console.log('✅ Old templates deleted')

  // Insert new templates
  for (const template of templates) {
    try {
      const id = await prisma.$executeRaw`
        INSERT INTO RPPTemplate (
          id, tema, topikKBC, profilLulusan, tujuanKBC, 
          tujuanProfilLulusan, tujuanPembelajaranMendalam, 
          materiIntegrasiKBC, tujuanPembelajaran, kerangkaPembelajaran,
          kegiatanPembelajaran, isActive, createdAt, updatedAt
        ) VALUES (
          lower(hex(randomblob(16))), 
          ${template.tema},
          ${template.topikKBC},
          ${template.profilLulusan},
          ${template.tujuanKBC},
          ${JSON.stringify(template.tujuanProfilLulusan)},
          ${template.tujuanPembelajaranMendalam},
          ${template.materiIntegrasiKBC},
          ${template.tujuanPembelajaran},
          ${JSON.stringify(template.kerangkaPembelajaran)},
          ${JSON.stringify(template.kegiatanPembelajaran)},
          1, datetime('now'), datetime('now')
        )
      `

      console.log(`✅ Template "${template.tema}" berhasil dimasukkan dengan konten komprehensif`)
    } catch (error) {
      console.error(`❌ Gagal memasukkan template "${template.tema}":`, error)
    }
  }

  console.log('\n✅ Selesai! Template sudah diperbarui dengan konten yang jauh lebih detail.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
