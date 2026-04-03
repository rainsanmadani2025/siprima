import { PrismaClient } from '@prisma/client'

// Fresh Prisma Client instance
const prisma = new PrismaClient()

const kbcTemplates = [
  // Pilar 1: Beriman dan Berakhlak Mulia (3 templates)
  {
    tema: "Mengenal Nama-Nama Allah (Asmaul Husna)",
    kelompokUsia: "B",
    topikKBC: "Beriman dan Berakhlak Mulia",
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
    }
  },
  {
    tema: "Adab Makan dan Minum",
    kelompokUsia: "B",
    topikKBC: "Beriman dan Berakhlak Mulia",
    tujuanKBC: "Anak dapat memahami dan melaksanakan adab-adab makan dan minum sesuai ajaran Islam dengan penuh rasa syukur dan kebersamaan, memahami bahwa makan dan minum adalah nikmat dari Allah yang harus dijaga dengan cara yang baik dan halal, serta menjaga kebersihan dan kesehatan tubuh melalui perilaku makan yang benar.",
    tujuanProfilLulusan: {
      beriman_dan_berakhlak_mulia: "Anak membaca doa sebelum dan sesudah makan dengan lancar dan penuh pemahaman, mengucapkan Alhamdulillah sebagai wujud syukur, serta menghormati orang yang memberi makan dengan ucapan terima kasih yang tulus.",
      berkebinekaan_global: "Anak menghargai berbagai jenis makanan dari berbagai budaya, memahami bahwa setiap makanan memiliki keunikan dan keindahan, serta menghormati teman yang memiliki preferensi makanan berbeda karena alasan kesehatan atau agama.",
      gotong_royong: "Anak membantu menyiapkan meja makan, berbagi makanan dengan teman, membersihkan tempat makan bersama-sama, serta memastikan semua teman mendapat porsi yang cukup.",
      mandiri_dan_kreatif: "Anak dapat makan dengan sendiri menggunakan alat makan yang tepat, menyusun makanan di piring dengan rapi, membuat bentuk makanan yang menarik, serta membersihkan diri setelah makan dengan mandiri.",
      bernalar_kritis: "Anak dapat membedakan makanan yang halal dan haram, menjelaskan mengapa kita harus menjaga kebersihan saat makan, memahami manfaat setiap jenis makanan bagi tubuh, serta membuat pilihan makanan yang sehat.",
      sehat_jasmani_dan_rohani: "Anak memilih makanan yang sehat dan bergizi, mencuci tangan sebelum dan sesudah makan, mengunyah makanan dengan baik, tidak berlebihan dalam makan, serta menjaga kebersihan tempat makan.",
      warga_negara: "Anak memahami pentingnya ketertiban saat makan bersama, menghormati hak orang lain untuk makan dengan nyaman, serta menjaga lingkungan tetap bersih dari sampah makanan."
    },
    tujuanPembelajaranMendalam: "Melalui kegiatan pembelajaran yang praktis dan menyenangkan, anak akan:\n1. Menghafal dan memahami doa sebelum dan sesudah makan dengan benar\n2. Mempraktikkan adab makan dan minum sesuai ajaran Islam (cuci tangan, baca doa, duduk tertib, pakai tangan kanan, dll)\n3. Menjelaskan makna dan hikmah dari setiap adab makan dan minum yang dipelajari\n4. Membedakan perilaku makan yang baik dan kurang baik dengan memberikan alasan yang tepat\n5. Menerapkan adab makan dalam kehidupan sehari-hari di rumah dan sekolah\n6. Menghargai makanan sebagai nikmat Allah dengan tidak membuang-buang makanan\n7. Menunjukkan rasa syukur melalui doa, ucapan terima kasih, dan perilaku yang menghargai makanan",
    kerangkaPembelajaran: "Pembelajaran berlangsung selama 1 hari (± 2 jam) dengan pendekatan experiential learning:\n- Pembelajaran berbasis pengalaman langsung dan praktik nyata\n- Metode modeling dan demonstration dari guru\n- Pembelajaran kolaboratif melalui kegiatan makan bersama\n- Simulasi dan role playing situasi makan yang berbeda\n- Penilaian prosesual melalui observasi langsung\n- Integrasi nilai-nilai kebersihan, kesehatan, dan kerendahan hati\n- Lingkungan belajar yang hangat dan memberikan contoh nyata",
    kegiatanPembelajaran: {
      pendahuluan: "Guru menyambut anak dengan senyuman dan ajakan cuci tangan sebelum memulai kegiatan. Guru menanyakan: 'Siapa yang suka makan? Apa yang kita lakukan sebelum makan?' Guru memutarkan video atau menampilkan gambar anak-anak yang sedang makan dengan baik dan buruk. Guru mengajak anak menganalisis perbedaan antara dua gambar tersebut dan menentukan mana yang sesuai adab Islam. Guru memperkenalkan tema hari ini dengan cerita: 'Hari ini kita akan belajar menjadi anak yang beradab saat makan dan minum, sehingga Allah senang dan kita semua sehat.'",
      inti: [
        "EKSPLORASI: Guru membagi anak menjadi beberapa kelompok kecil. Setiap kelompok mendapat kartu berbagai adab makan (cuci tangan, baca doa, duduk tertib, pakai tangan kanan, tidak berbicara mulut penuh, dll). Anak mendiskusikan dan mempraktikkan adab tersebut dengan menggunakan properti mainan makanan. Setiap kelompok mempresentasikan hasil praktik mereka.",
        "ELABORASI: Guru mendemonstrasikan cara makan yang baik secara lengkap: mulai dari cuci tangan, berdoa, duduk dengan posisi yang baik, menggunakan tangan kanan, mengunyah dengan tertib, hingga berdoa sesudah makan. Anak diminta menirukan dan praktik dengan makanan sebenarnya (snack yang disiapkan). Guru memberikan umpan balik yang konstruktif dan penguatan positif.",
        "KONFIRMASI: Guru mengajak anak menyusun 'Puzzle Adab Makan' berbagai urutan langkah-langkah makan yang baik. Anak berdiskusi dan menempatkan setiap langkah pada urutan yang benar. Guru mengajak anak menyanyikan lagu tentang adab makan dengan gerakan yang menyenangkan.",
        "PRAKTIK: Anak berpartisipasi dalam 'Pesta Makan Bersama' di mana setiap anak mempraktikkan semua adab yang telah dipelajari. Guru berkeliling mengamati dan mencatat perilaku anak. Setelah makan, anak membersihkan tempat makan mereka dengan bantuan guru.",
        "REFLEKSI: Guru mengajak anak duduk melingkar dan berbagi pengalaman: 'Bagaimana perasaanmu ketika makan dengan adab yang baik? Apa yang kamu rasakan berbeda dengan kebiasaanmu sebelumnya?' Anak mengungkapkan pikiran dan perasaan mereka secara bebas."
      ],
      penutup: "Guru mengajak anak mengevaluasi diri sendiri dengan menunjuk jempol ke atas (sudah sangat baik), menyamping (perlu ditingkatkan), atau ke bawah (perlu banyak belajar) untuk setiap adab makan yang telah dipelajari. Guru memimpin doa penutup dengan memohon kepada Allah agar selalu diberikan kemampuan untuk menjaga adab makan dalam setiap kesempatan. Guru memberikan 'Sertifikat Adab Makan' kecil kepada setiap anak sebagai pengingat dan apresiasi. Guru menutup dengan salam dan ucapan terima kasih atas partisipasi aktif setiap anak."
    }
  }
]

async function seedCompleteTemplates() {
  console.log('🌱 Starting to seed complete RPP templates...')

  try {
    // Delete existing templates
    await prisma.rPPTemplate.deleteMany({})
    console.log('🗑️  Cleared existing templates')

    // Insert complete templates
    for (const template of kbcTemplates) {
      const { tema, topikKBC, profilLulusan, tujuanKBC, tujuanProfilLulusan, tujuanPembelajaranMendalam, kerangkaPembelajaran, kegiatanPembelajaran } = template

      await prisma.rPPTemplate.create({
        data: {
          tema,
          topikKBC,
          profilLulusan,
          tujuanKBC,
          tujuanProfilLulusan: JSON.stringify(tujuanProfilLulusan),
          tujuanPembelajaranMendalam,
          materiIntegrasiKBC: '',
          tujuanPembelajaran: '',
          kerangkaPembelajaran: JSON.stringify(kerangkaPembelajaran),
          kegiatanPembelajaran: JSON.stringify(kegiatanPembelajaran),
          isActive: true
        }
      })

      console.log(`✅ Created template: ${tema}`)
    }

    console.log(`\n🎉 Successfully seeded ${kbcTemplates.length} complete RPP templates!`)
  } catch (error) {
    console.error('❌ Error seeding templates:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedCompleteTemplates()
  .then(() => {
    console.log('✨ Seeding completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  })
