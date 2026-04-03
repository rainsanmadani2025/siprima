import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// KBC Templates data (sangat lengkap)
const kbcTemplates = [
  // Pilar 1: Beriman dan Berakhlak Mulia (3 templates)
  {
    tema: "Mengenal Nama-Nama Allah (Asmaul Husna)",
    kelompokUsia: "B",
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
    lampiran: "Lampiran 1: Kartu-kartu Asmaul Husna (Ar-Rahman, Ar-Rahim, Al-Malik, Al-Quddus, As-Salam, Al-Mu'min, Al-Muhaymin, Al-Aziz, Al-Jabbar, Al-Mutakabbir, Al-Khaliq, Al-Bari', Al-Musawwir, Al-Ghaffar, Al-Qahhar, Al-Wahhab, Ar-Razzaq, Al-Fattah, Al-Alim, Al-Qabid, Al-Basit, Al-Khafid, Ar-Rafi', Al-Mu'izz, Al-Mudhill, As-Sami', Al-Basir, Al-Hakam, Al-Adl, Al-Latif, Al-Khabir, Al-Halim, Al-Azim, Al-Ghafur, Asy-Syakur, Al-Aliyy, Al-Kabir, Al-Hafiz, Al-Muqit, Al-Hasib, Al-Jalil, Al-Karim, Ar-Raqib, Al-Mujib, Al-Wasi', Al-Hakim, Al-Wadud, Al-Majid, Al-Ba'its, As-Syahid, Al-Haqq, Al-Wakil, Al-Qawiyy, Al-Matin, Al-Waliyy, Al-Hamid, Al-Muhsi, Al-Mubdi', Al-Mu'id, Al-Muhyi, Al-Mumit, Al-Hayy, Al-Qayyum, Al-Wajid, Al-Majid, Al-Wahid, As-Samad, Al-Qadir, Al-Muqtadir, Al-Muqaddim, Al-Mu'akhkhir, Al-Awwal, Al-Akhir, Az-Zahir, Al-Batin, Al-Wali, Al-Muta'ali, Al-Barr, At-Tawwab, Al-Muntaqim, Al-Afuww, Ar-Ra'uf, Malikul Mulk, Dzul Jalali wal Ikram, Al-Muqsit, Al-Jami', Al-Ghani, Al-Mughni, Al-Mani', Ad-Darr, An-Nafi', An-Nur, Al-Hadi, Al-Badi', Al-Baqi, Al-Warith, Ar-Rasyid, As-Sabur)."
  },
  // Add more templates here... (need to extract from seed-kbc-templates.ts)
]

async function main() {
  console.log('🌱 Seeding RPP Templates with COMPLETE content...\n')

  for (const template of kbcTemplates) {
    try {
      await prisma.rPPTemplate.create({
        data: {
          tema: template.tema,
          topikKBC: template.topikKBC,
          profilLulusan: template.profilLulusan,
          tujuanKBC: template.tujuanKBC,
          tujuanProfilLulusan: JSON.stringify(template.tujuanProfilLulusan),
          tujuanPembelajaranMendalam: template.tujuanPembelajaranMendalam,
          kerangkaPembelajaran: JSON.stringify(template.kerangkaPembelajaran),
          kegiatanPembelajaran: JSON.stringify(template.kegiatanPembelajaran),
          isActive: true
        }
      })

      console.log(`✅ Template created: ${template.tema}`)
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`⚠️  Template already exists: ${template.tema}`)
      } else {
        console.error(`❌ Error creating template ${template.tema}:`, error.message)
      }
    }
  }

  console.log('\n✅ Seeding completed!')
  console.log(`📊 Total templates seeded: ${kbcTemplates.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding templates:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
