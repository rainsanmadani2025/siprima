import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample COMPLETE templates extracted from seed-kbc-templates.ts
const completeTemplates = [
  {
    tema: "Mengenal Nama-Nama Allah (Asmaul Husna)",
    topikKBC: "Cinta Tuhan",
    profilLulusan: "Beriman dan Berakhlak Mulia, Berkebinekaan Global, Gotong Royong, Mandiri dan Kreatif, Bernalar Kritis, Sehat Jasmani dan Rohani, Warga Negara",
    tujuanKBC: "Anak dapat mengenal dan memahami nama-nama Allah yang indah dengan penuh cinta dan kagum, menumbuhkan rasa syukur dan kepercayaan kepada Allah, serta menerapkan nilai-nilai keteladanan dalam kehidupan sehari-hari melalui perilaku yang mencerminkan sifat-sifat terpuji Allah SWT.",
    tujuanProfilLulusan: {
      beriman_dan_berakhlak_mulia: "Anak dapat menghafal dan memahami makna minimal 10 Asmaul Husna, menyebutkan nama Allah dengan penuh kekaguman dan hormat, serta meneladani sifat-sifat Allah dalam perilaku sehari-hari seperti: Ar-Rahman (Maha Pengasih) dengan bersikap ramah dan peduli kepada teman, Al-Karim (Maha Mulia) dengan bersikap sopan dan tawadhu, Al-Hakim (Maha Bijaksana) dengan mampu membedakan perbuatan baik dan buruk.",
      berkebinekaan_global: "Anak menghargai perbedaan dalam beribadah dan keyakinan teman-temannya, memahami bahwa Asmaul Husna adalah ajaran Islam sambil menghormati teman-teman dari latar belakang berbeda.",
      gotong_royong: "Anak membantu teman yang kesulitan menghafal Asmaul Husna, berbagi cerita tentang kebaikan yang pernah dialami, dan bekerja sama dalam kelompok untuk membuat karya seni yang menggambarkan Asmaul Husna.",
      mandiri_dan_kreatif: "Anak dapat menemukan sendiri contoh penerapan Asmaul Husna dalam kehidupan sehari-hari, membuat karya kreatif seperti poster atau lagu tentang Asmaul Husna, serta mempresentasikannya dengan percaya diri.",
      bernalar_kritis: "Anak dapat menganalisis dan menjelaskan mengapa Allah memiliki nama-nama yang indah, membandingkan sifat-sifat Allah dengan perilaku manusia, serta mengajukan pertanyaan-pertanyaan tentang makna Asmaul Husna.",
      sehat_jasmani_dan_rohani: "Anak menjaga kebersihan hati dan pikiran dengan selalu mengingat Allah, melakukan gerakan fisik yang lembut saat menyebutkan Asmaul Husna, serta menjaga kesehatan melalui perilaku sesuai ajaran Islam.",
      warga_negara: "Anak memahami dirinya sebagai bagian dari masyarakat yang beriman, menghormati perbedaan agama di lingkungannya, serta bersikap toleran dan damai dalam pergaulan sehari-hari."
    },
    tujuanPembelajaranMendalam: "Melalui kegiatan pembelajaran yang menyenangkan dan bermakna, anak akan:\n1. Mengenali dan menyebutkan minimal 10 nama Allah (Asmaul Husna) dengan benar dan lancar\n2. Memahami makna dasar dari setiap Asmaul Husna yang dipelajari dengan bahasa yang sederhana dan mudah dipahami\n3. Menyambungkan setiap nama Allah dengan perilaku nyata yang dapat diteladani dalam kehidupan sehari-hari\n4. Menghafal Asmaul Husna dengan metode yang menyenangkan melalui lagu, permainan, dan gerakan tubuh\n5. Mengungkapkan perasaan syukur dan cinta kepada Allah melalui doa, dzikir, dan pujian\n6. Menunjukkan perilaku yang mencerminkan sifat-sifat Allah seperti kasih sayang, keadilan, dan kebijaksanaan dalam interaksi dengan teman dan keluarga\n7. Membuat karya seni sederhana yang menggambarkan pemahaman tentang Asmaul Husna",
    kerangkaPembelajaran: "Pembelajaran berlangsung selama 1 hari (± 2 jam) dengan pendekatan Cinta (KBC) yang menekankan:\n- Pembelajaran terintegrasi antara kognitif, afektif, dan psikomotorik\n- Metode inkuiri dan eksplorasi untuk membangun pemahaman yang mendalam\n- Pembelajaran kolaboratif melalui kerja kelompok dan diskusi\n- Pengalaman langsung dan praktik nyata dalam kehidupan sehari-hari\n- Penilaian berkelanjutan yang berfokus pada proses dan hasil\n- Integrasi nilai-nilai Islam dalam setiap aktivitas pembelajaran\n- Pemanfaatan lingkungan belajar yang hangat, nyaman, dan penuh cinta",
    kegiatanPembelajaran: {
      pendahuluan: "Guru membuka pembelajaran dengan salam, senyuman, dan pelukan kasih sayang kepada setiap anak. Guru mengajak anak berdoa bersama dengan khusyuk dan penuh rasa syukur. Guru memutarkan lagu Asmaul Husna yang menyenangkan dan mengajak anak menyanyikan bersama sambil melakukan gerakan tangan yang sesuai. Guru memunculkan rasa ingin tahu dengan bertanya: 'Anak-anak, siapa yang tahu bahwa Allah punya nama-nama yang sangat indah? Siapa yang ingin tahu nama-nama Allah itu?' Guru menampilkan poster atau flashcard Asmaul Husna dan meminta anak menebak maknanya.",
      inti: [
        "EKSPLORASI: Guru membagikan kartu-kartu Asmaul Husna kepada setiap anak secara berpasangan. Anak diminta mendiskusikan dan mencari tahu makna dari nama Allah yang mereka pegang dengan bantuan buku cerita atau gambar ilustrasi. Setiap kelompok mempresentasikan hasil diskusi mereka di depan kelas dengan cara yang kreatif.",
        "ELABORASI: Guru menceritakan kisah-kisah teladan yang menunjukkan penerapan Asmaul Husna dalam kehidupan sehari-hari. Contoh: kisah tentang Ar-Rahman melalui cerita Nabi yang menyayangi anak yatim, kisah Al-Adl melalui cerita keadilan Nabi. Guru mengajak anak bermain peran (role play) untuk mempraktikkan sifat-sifat tersebut dalam situasi nyata.",
        "KONFIRMASI: Guru mengajak anak menghafal Asmaul Husna dengan metode bernyanyi dan gerakan tubuh yang menyenangkan. Setiap nama Allah dinyanyikan dengan melodi lagu yang familiar dan diikuti gerakan tangan yang menggambarkan maknanya. Guru memberikan penguatan positif dan apresiasi untuk setiap usaha anak.",
        "PRAKTIK: Guru mengajak anak membuat 'Buku Asmaul Husna' milik mereka sendiri. Setiap halaman berisi satu nama Allah, artinya sederhana, dan gambar atau kolase yang menggambarkan maknanya. Anak dapat mewarnai, menempel stiker, atau menggambar sesuai imajinasi mereka.",
        "REFLEKSI: Guru memimpin diskusi kelompok tentang bagaimana anak dapat meneladani Asmaul Husna di rumah dan sekolah. Setiap anak berbagi pengalaman ketika mereka melihat seseorang meneladani sifat Allah, seperti ibu yang Ar-Rahman saat merawat adik yang sakit."
      ],
      penutup: "Guru mengajak anak duduk melingkar dan menggenggam tangan teman di sebelahnya. Bersama-sama, mereka menyebutkan kembali Asmaul Husna yang telah dipelajari dengan suara lembut dan penuh makna. Guru mengajak anak berdoa penutup dengan penuh rasa syukur kepada Allah atas semua nikmat yang telah diberikan. Guru memberikan tanda penghargaan berupa stiker Asmaul Husna kepada setiap anak sebagai bentuk apresiasi dan pengingat untuk selalu meneladani sifat-sifat Allah. Guru menutup dengan salam, pelukan, dan senyuman kasih sayang."
    },
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan konsep cinta Tuhan melalui berbagai aktivitas yang menekankan pada pengembangan keimanan dan akhlak anak melalui pembiasa keimanan kepada Allah, rasa syukur dan kekagum terhadap kebesaran-Nya, serta menerapkan nilai-nilai keteladanan malaikat dalam perilaku sehari-hari."
  },
  {
    tema: "Bekerja Sama Membuat Taman Sekolah",
    topikKBC: "Gotong Royong",
    profilLulusan: "Beriman dan Berakhlak Mulia, Berkebinekaan Global, Gotong Royong, Mandiri dan Kreatif, Bernalar Kritis, Sehat Jasmani dan Rohani, Warga Negara",
    tujuanKBC: "Anak dapat memahami pentingnya kerja sama dan gotong royong dalam mewujudkan lingkungan yang indah dan asri, memahami bahwa bekerja sama membuat hal menjadi mudah, menumbuhkan rasa memiliki dan tanggung jawab terhadap lingkungan, serta mempraktikkan nilai gotong royong dalam kehidupan sehari-hari.",
    tujuanProfilLulusan: {
      beriman_dan_berakhlak_mulia: "Anak bekerja sama karena ikhlas pada sesama karena cinta, bersyukur kepada Allah atas kesempatan bekerja sama, serta berbagi rezeki dan kekuatan dengan teman-teman. Anak menghargai teman-temannya dan menghormati kontribusi setiap orang.",
      berkebinekaan_global: "Anak menghargai berbagai cara kerja sama dari berbagai budaya, memahami bahwa setiap orang memiliki peran yang berbeda dalam kerja sama, serta menghormati perbedaan kemampuan teman.",
      gotong_royong: "Anak membantu teman yang lelah, membagi tugas, memberikan dukungan dan semangat, serta memastikan semua teman mendapat kesempatan untuk berpartisasi dalam kegiatan.",
      mandiri_dan_kreatif: "Anak dapat menyelesaikan tugas-tugas sederhana, mengatur waktu kerja dengan baik, membuat rencana kerja kelompok, serta melaksanakan tugas dengan mandiri tanpa perlu diingat terus.",
      bernalar_kritis: "Anak dapat menganalisis pembagian tugas, membagi tugas sesuai kemampuan, memprediksi hasil akhir dari kerja sama, serta memecahkan masalah yang muncul dalam kerja sama.",
      sehat_jasmani_dan_rohani: "Anak melakukan gerakan fisik saat bekerja (menggali, menanam, menanam tanah), menjaga kebersihan area kerja, istirahat saat lelah, serta menikmati hasil kerja sama dengan penuh kepuasan.",
      warga_negara: "Anak memahami bahwa kerja sama adalah kunci kemajuan bangsa, berpartisasi dalam kegiatan sosial, serta berkontribusi untuk membuat lingkungan yang lebih baik."
    },
    tujuanPembelajaranMendalam: "Melalui kegiatan pembelajaran yang praktis dan nyata, anak akan:\n1. Memahami pentingnya kerja sama dan gotong royong\n2. Memahami perbedaan kerja individu dan kerja tim\n3. Mengenal peran masing-masing dalam kerja sama\n4. Mempraktikkan kerja sama untuk membuat taman sekolah\n5. Membagi tugas secara adil\n6. Menunjukkan rasa memiliki dan kebersamaan terhadap lingkungan\n7. Memelihara taman yang sudah dibuat bersama-sama",
    kerangkaPembelajaran: "Pembelajaran berlangsung selama 1 hari (± 4 jam) dengan pendekatan experiential learning:\n- Pembelajaran berbasis pengalaman langsung dan praktik nyata\n- Metode modeling dan demonstration dari guru\n- Pembelajaran kolaboratif melalui kegiatan makan bersama\n- Simulasi dan role playing situasi kerja yang berbeda\n- Penilaian prosesual melalui observasi langsung\n- Integrasi nilai-nilai kebersihan, kesehatan, dan kerendahan hati\n- Lingkungan belajar yang hangat dan memberikan contoh nyata",
    kegiatanPembelajaran: {
      pendahuluan: "Guru mengajak anak keluar ke halaman sekolah. Guru bertanya: 'Lihat taman sekolah kita! Bagaimana kondisinya?' Guru mengajak anak mengamati taman sekarang (tanaman kosong atau sudah berisi tanaman liar). Guru bertanya: 'Apa yang bisa kalian lakukan agar taman ini menjadi indah?' Guru memperkenalkan tema: 'Hari ini kita akan bekerja sama membuat taman sekolah yang indah!'",
      inti: [
        "EKSPLORASI: Guru membagi anak menjadi beberapa kelompok kecil. Setiap kelompok mendapat area taman yang akan dikerjakan. Anak diminta mengamati kondisi taman mereka: apa saja yang perlu dikerjakan (bersih dari rumput liar, menanam bunga, menambah tanah baru). Setiap kelompok membuat daftar pekerjaan yang perlu dilakukan.",
        "DISKUSI: Guru mengajak anak duduk melingkar dan berdiskusi: Apa saja yang bisa kalian kerjakan? Apa yang perlu dipersiapkan terlebih dahulu? Anak memikirkan: 'Perlu membersihkan area dari rumput liar', 'Perlu menyiapkan tanah dan menanam bunga', 'Perlu alat-alat kebun'. Anak membuat rencana kerja kelompok mereka.",
        "PRAKTIK: Anak mulai bekerja sesuai rencana. Setiap kelompok mulai membersihkan area dari rumput liar dan menyiapkan tanah. Guru berkeliling membimbingu: Bagaimana cara menggunak cangkul? Bagaimana menanam tanaman yang benar? Anak menggunakan alat kebun yang disiapkan. Anak saling membantu satu sama lain ketika ada kesulitan.",
        "REFLEKSI: Setelah selesai bekerja, semua anak berkumpul di taman. Guru bertanya: 'Bagaimana perasaan kalian setelah bekerja sama? Apa yang kalian pelajari?' Anak berbagi pengalaman dan perasaan mereka. Guru mengatakan: 'Kalian hebat! Dengan bekerja sama, taman ini menjadi indah. Terima kasih atas kerja keras kalian!'",
        "PEMBERIANAN: Guru memimpin anak memikir apa langkah selanjutnya untuk merawat taman. Anak menyadakan rencana: 'Perlu disiram setiap hari', 'Perlu memupuk pupuk secara berkala', 'Perlu membuang sampah'. Anak membuat jadwal perawatan taman.",
      ],
      penutup: "Guru mengajak anak berdiri di taman dan melihat hasil kerja mereka. Guru memuji semua anak: 'Lihat! Taman sekolah kita sekarang jauh lebih indah dari sebelumnya! Ini berkat hasil kerja keras kalian!' Guru memberikan 'Sertifikat Petani Cilik' kepada setiap anak sebagai pengingat. Guru mengajak anak berdoa syukur kepada Allah atas hasil kerja keras dan bumi yang subur. Guru menutup dengan ajakan: 'Mari jaga taman ini agar tetap indah!'"
    },
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan konsep gotong royong dan cinta lingkungan melalui berbagai aktivitas perawatan taman seperti membersihkan rumput liar, menanam tanaman, dan memupuk pupuk, yang menekankan pada pentingnya bekerja sama, saling membantu, dan rasa memiliki serta merawat lingkungan sebagai bentuk cinta kasih kepada ciptaan-Nya."
  },
  {
    tema: "Memecahkan Masalah Sehari-hari",
    topikKBC: "Bernalar Kritis",
    profilLulusan: "Beriman dan Berakhlak Mulia, Berkebinekaan Global, Gotong Royong, Mandiri dan Kreatif, Bernalar Kritis, Sehat Jasmani dan Rohani, Warga Negara",
    tujuanKBC: "Anak dapat mengembangkan kemampuan memecahkan masalah melalui pemikiran kritis, mengidentifikasi masalah sederhana dalam kehidupan sehari-hari, menemukan beberapa solusi yang mungkin, mengevaluasi solusi dan memilih yang terbaik, serta mempraktikkan solusi yang dipilih.",
    tujuanProfilLulusan: {
      beriman_dan_berakhlak_mulia: "Anak memohon bantuan dan petunjuk Allah saat menghadapi masalah, bersabar dan tidak putus asa, menggunakan solusi yang halal dan baik, serta bersyukur ketika masalah terpecahkan.",
      berkebinekaan_global: "Anak memahami bahwa setiap orang menghadapi masalah berbeda, menghargai berbagai cara memecahkan masalah di berbagai budaya, serta menghormati solusi yang dipilih orang lain.",
      gotong_royong: "Anak membantu teman yang menghadapi masalah, bekerja sama menemukan solusi, berbagi pengalaman dan tips, serta mendukung teman saat menghadapi kesulitan.",
      mandiri_dan_kreatif: "Anak dapat mengidentifikasi masalah mereka sendiri, memikirkan beberapa solusi yang mungkin, mengevaluasi pro dan kontra setiap solusi, memilih solusi terbaik, serta melaksanakan solusi dengan mandiri.",
      bernalar_kritis: "Anak menganalisis penyebab masalah, membedakan antara masalah kecil dan besar, menilai kelayakan setiap solusi, memprediksi konsekuensi setiap solusi, serta mengevaluasi keberhasilan solusi yang dipilih.",
      sehat_jasmani_dan_rohani: "Anak mengelola emosi saat menghadapi masalah (tidak marah, tidak menangis), menggunakan teknik menenangkan diri, menjaga kesehatan mental saat stres, serta merasakan kepuasan ketika masalah terpecahkan.",
      warga_negara: "Anak memahami bahwa memecahkan masalah adalah keterampilan penting dalam kehidupan, sadar bahwa masalah adalah bagian dari kehidupan, serta siap menghadapi tantangan di masa depan."
    },
    tujuanPembelajaranMendalam: "Melalui kegiatan pembelajaran berbasis pemecahan masalah, anak akan:\n1. Mengidentifikasi masalah sederhana dalam kehidupan sehari-hari\n2. Menganalisis penyebab masalah\n3. Memikirkan beberapa solusi yang mungkin\n4. Mengevaluasi setiap solusi (pro dan kontra)\n5. Memilih solusi terbaik\n6. Mempraktikkan solusi yang dipilih\n7. Mengevaluasi keberhasilan solusi",
    kerangkaPembelajaran: "Pembelajaran berlangsung selama 2 hari (± 4 jam total) dengan pendekatan problem-based learning:\n- Pembelajaran berbasis masalah nyata yang relevan dengan anak\n- Metode brainstorming dan diskusi\n- Pembelajaran kolaboratif melalui kerja kelompok\n- Pembelajaran karakter dan keterampilan sosial\n- Penilaian berbasis proses pemecahan masalah\n- Integrasi nilai-nilai ketekunan, kesabaran, dan kreativitas\n- Lingkungan belajar yang suportif dan mendorong pemikiran",
    kegiatanPembelajaran: {
      pendahuluan: "Guru memulai dengan bertanya: 'Pernahkah kalian menghadapi masalah? Apa itu? Apa yang kalian lakukan?' Guru menceritakan kisah tentang anak yang menghadapi masalah dan berhasil memecahkannya. Guru menampilkan gambar-gambar situasi bermasalah (mainan rusak, kehilangan barang, teman bertengkar, tidak bisa mengerjakan tugas). Guru bertanya: 'Masalah apa yang kalian lihat? Apa yang bisa dilakukan?' Guru memperkenalkan tema: 'Hari ini kita akan belajar menjadi pemecah masalah yang hebat! Setiap masalah pasti ada solusinya!'",
      inti: [
        "LANGKAH-LANGKAH PEMECAHAN MASALAH: Guru memperkenalkan 5 langkah pemecahan masalah: (1) KENALI: Apa masalahnya?, (2) PIKIRKAN: Apa penyebabnya?, (3) TEMUKAN: Apa solusinya?, (4) PILIH: Solusi mana yang terbaik?, (5) LAKSANAKAN: Praktikkan solusinya! Guru menuliskan langkah-langkah ini di papan dengan ikon yang jelas.",
        "STUDI KASUS: Guru menampilkan situasi bermasalah: 'Budi kehilangan buku favoritnya di kelas. Dia sangat sedih. Apa yang Budi harus lakukan?' Anak berdiskusi dalam kelompok: Apa masalah Budi? Apa penyebabnya? Apa solusi yang mungkin? (Mencari di kelas, bertanya teman, bertanya guru, mencari di rumah, membeli baru). Setiap kelompok mempresentasikan solusi terbaik mereka beserta alasannya.",
        "BRAINSTORMING SOLUSI: Guru membagikan kartu-kartu situasi bermasalah kepada anak secara berpasangan. Setiap kartu berisi skenario (misalnya: 'Mainanmu rusak', 'Tugasmu terlalu banyak', 'Temanmu tidak mau bermain denganmu'). Anak mendiskusikan dan menuliskan minimal 3 solusi yang mungkin. Setiap pasangan mempresentasikan solusi-solusi mereka.",
        "EVALUASI SOLUSI: Guru mengajarkan cara mengevaluasi solusi: (1) Apakah solusi ini aman?, (2) Apakah solusi ini jujur?, (3) Apakah solusi ini bisa dilakukan?, (4) Apakah solusi ini adil? Anak mempraktikkan mengevaluasi solusi dari studi kasus sebelumnya menggunakan kriteria ini.",
        "PRAKTIK NYATA: Anak diminta memikirkan masalah nyata yang mereka hadapi saat ini (di sekolah atau di rumah). Anak menuliskan atau mendiktekan kepada guru: (1) Masalahnya, (2) Penyebabnya, (3) 3 solusi yang mungkin, (4) Solusi terbaik, (5) Cara melaksanakannya. Anak berbagi dengan teman sebaya untuk mendapatkan masukan.",
        "ROLE PLAYING: Anak bermain peran situasi bermasalah dan solusinya. Misalnya, satu anak bermain sebagai 'anak yang kehilangan barang' dan anak lain bermain sebagai 'teman yang membantu memecahkan masalah'. Anak mempraktikkan langkah-langkah pemecahan masalah yang telah dipelajari."
      ],
      penutup: "Guru mengajak anak duduk melingkar dan memimpin refleksi: 'Masalah apa yang paling sulit bagimu? Solusi mana yang paling kreatif? Apa yang akan kamu lakukan berbeda saat menghadapi masalah?' Anak berbagi pengalaman dan pembelajaran mereka. Guru memberikan 'Sertifikat Pemecah Masalah Cilik' atau 'Bintang Solusi' kepada setiap anak dengan catatan khusus tentang kekuatan mereka (misalnya: 'Pemikiran yang kreatif', 'Analisis yang baik', 'Ketekunan yang luar biasa'). Guru memimpin doa agar selalu diberikan kemampuan untuk memecahkan masalah dengan bijaksana dan menutup dengan ajakan: 'Jangan pernah takut menghadapi masalah! Setiap masalah adalah kesempatan untuk belajar dan menjadi lebih kuat!'"
    },
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan konsep cinta ilmu dan bernalar kritis melalui berbagai aktivitas pemecahan masalah seperti brainstorming solusi, menganalisis penyebab masalah, mengevaluasi solusi, dan mempraktikkan solusi yang dipilih, yang menekankan pada pengembangan kemampuan berpikir, ketenangan, kreativitas, dan rasa percaya diri saat menghadapi tantangan."
  }
]

async function main() {
  console.log('🌱 Seeding 3 COMPLETE KBC Templates with FULL content...\n')

  // Clear existing templates
  const deleted = await prisma.rPPTemplate.deleteMany({})
  console.log(`🗑️  Cleared ${deleted.count} existing templates\n`)

  let successCount = 0

  for (const template of completeTemplates) {
    try {
      await prisma.rPPTemplate.create({
        data: {
          tema: template.tema,
          topikKBC: template.topikKBC,
          profilLulusan: template.profilLulusan || '',
          tujuanKBC: template.tujuanKBC || '',
          tujuanProfilLulusan: JSON.stringify(template.tujuanProfilLulusan || {}),
          tujuanPembelajaranMendalam: template.tujuanPembelajaranMendalam || '',
          materiIntegrasiKBC: template.materiIntegrasiKBC || '',
          kerangkaPembelajaran: JSON.stringify(template.kerangkaPembelajaran || {}),
          kegiatanPembelajaran: JSON.stringify(template.kegiatanPembelajaran || {}),
          rubrikPenilaian: JSON.stringify({}),
          isActive: true
        }
      })
      console.log(`✅ Template created: ${template.tema}`)
      successCount++
    } catch (error: any) {
      console.error(`❌ Error creating "${template.tema}":`, error.message)
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅ Seeding completed!`)
  console.log(`   Successfully created: ${successCount}/3`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n⚠️  Note: This is a sample of 3 complete templates.')
  console.log('📚 The original seed-kbc-templates.ts has 15 complete templates.')
  console.log('💡 To add more templates, extract from seed-kbc-templates.ts and add them to this script.')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
