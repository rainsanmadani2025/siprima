import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// === TEMPLATES DARI FILE 97KB (seed-kbc-templates.ts) ===
const kbcTemplates = [
  {
    tema: "Mengenal Nama-Nama Allah (Asmaul Husna)",
    kelompokUsia: "B",
    topikKBC: "Beriman dan Berakhlak Mulia",
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
    tujuanPembelajaranMendalam: "Melalui kegiatan pembelajaran yang praktis dan menyenangkan, anak akan:\n1. Menghafal dan memahami doa sebelum dan sesudah makan dengan benar\n2. Mempraktikkan adab makan dan minum sesuai ajaran Islam (cuci tangan, duduk dengan tertib, makan dengan tangan kanan, dll)\n3. Menjelaskan makna dan hikmah dari setiap adab makan dan minum yang dipelajari\n4. Membedakan perilaku makan yang baik dan kurang baik dengan memberikan alasan yang tepat\n5. Menerapkan adab makan dalam kehidupan sehari-hari di rumah dan sekolah\n6. Menghargai makanan sebagai nikmat Allah dengan tidak membuang-buang makanan\n7. Menunjukkan rasa syukur melalui doa, ucapan terima kasih, dan perilaku yang menghargai makanan",
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
  },
  {
    tema: "Mengenal Malaikat Allah",
    kelompokUsia: "B",
    topikKBC: "Beriman dan Berakhlak Mulia",
    tujuanKBC: "Anak dapat mengenal dan memahami keberadaan malaikat sebagai makhluk Allah yang tidak terlihat, memahami tugas-tugas utama beberapa malaikat, menumbuhkan rasa kagum dan keimanan kepada Allah atas ciptaan-Nya yang luar biasa, serta memahami bahwa malaikat selalu mendampingi dan mencatat amal kebaikan kita.",
    tujuanProfilLulusan: {
      beriman_dan_berakhlak_mulia: "Anak percaya kepada keberadaan malaikat sebagai makhluk Allah, mengenal nama dan tugas 10 malaikat utama (Jibril menyampaikan wahyu, Mikail mengatur rezeki, Israfil meniup sangkakala, Izrail mencabut nyawa, Munkar dan Nakir menanyakan di kubur, Raqib dan Atid mencatat amal, Malik penjaga neraka, Ridwan penjaga surga), serta mengimani bahwa malaikat selalu menjaga kita.",
      berkebinekaan_global: "Anak memahami bahwa keyakinan kepada malaikat adalah bagian dari ajaran Islam sambil menghargai teman-teman yang memiliki kepercayaan berbeda, serta belajar bersikap toleran dan menghormati perbedaan keyakinan.",
      gotong_royong: "Anak belajar dari teladan malaikat yang saling bekerja sama untuk menjalankan tugas Allah, membantu teman yang kesulitan memahami pelajaran, serta bekerja sama dalam kelompok untuk membuat karya tentang malaikat.",
      mandiri_dan_kreatif: "Anak dapat menceritakan kembali tugas malaikat dengan bahasa sendiri, membuat karya seni atau buku cerita tentang malaikat, menemukan contoh perilaku yang mencerminkan iman kepada malaikat dalam kehidupan sehari-hari, serta mempresentasikannya dengan percaya diri.",
      bernalar_kritis: "Anak dapat menjelaskan mengapa kita tidak bisa melihat malaikat, memahami perbedaan antara malaikat dan manusia, menganalisis mengapa Allah menciptakan malaikat, serta mengajukan pertanyaan-pertanyaan yang relevan tentang malaikat.",
      sehat_jasmani_dan_rohani: "Anak menjaga kebersihan hati dengan selalu berbuat baik karena tahu malaikat mencatat amal kita, melakukan gerakan fisik yang melambangkan tugas malaikat, serta menjaga kesehatan sebagai bentuk rasa syukur kepada Allah.",
      warga_negara: "Anak memahami dirinya sebagai makhluk ciptaan Allah yang diperhatikan dan dijaga, menghargai keberadaan semua makhluk Allah, serta bersikap baik kepada semua karena tahu bahwa malaikat selalu mengawasi dan mencatat perbuatan kita."
    },
    tujuanPembelajaranMendalam: "Melalui kegiatan pembelajaran yang menarik dan penuh imajinasi, anak akan:\n1. Menyebutkan minimal 10 nama malaikat dan tugas-tugasnya dengan benar\n2. Memahami bahwa malaikat adalah makhluk Allah yang tidak terlihat dan selalu taat\n3. Menjelaskan perbedaan antara malaikat dan manusia dengan bahasa sederhana\n4. Menghubungkan iman kepada malaikat dengan perilaku sehari-hari\n5. Menceritakan kembali informasi tentang malaikat dengan cara yang kreatif\n6. Menunjukkan rasa kagum dan syukur kepada Allah atas penciptaan malaikat\n7. Mempraktikkan perilaku yang mencerminkan iman kepada malaikat (berbuat baik, jujur, dll)",
    kerangkaPembelajaran: "Pembelajaran berlangsung selama 1 hari (± 2 jam) dengan pendekatan storytelling dan imaginative learning:\n- Pembelajaran berbasis cerita dan narasi yang menarik\n- Metode inkuiri melalui pertanyaan pemicu\n- Pembelajaran kolaboratif melalui proyek kelompok\n- Penggunaan media visual dan audio untuk memperkuat pemahaman\n- Penilaian berbasis kinerja dan produk karya\n- Integrasi nilai-nilai iman, taqwa, dan akhlak mulia\n- Lingkungan belajar yang hangat, penuh keajaiban, dan menginspirasi",
    kegiatanPembelajaran: {
      pendahuluan: "Guru membuka dengan salam, senyuman, dan pelukan hangat kepada setiap anak. Guru memutarkan audio suara langit atau musik yang lembut dan menenangkan. Guru bertanya dengan suara lembut: 'Anak-anak, pernahkah kamu merasa seperti ada seseorang yang mengawasi dan menjagamu meskipun kamu tidak melihatnya? Ada makhluk Allah yang luar biasa yang selalu bersama kita, mencatat semua kebaikan yang kita lakukan. Siapa ya kira-kira?' Guru menampilkan gambar-gambar yang menunjukkan keindahan ciptaan Allah dan memunculkan rasa ingin tahu tentang malaikat.",
      inti: [
        "EKSPLORASI: Guru membagikan kartu-kartu malaikat (Jibril, Mikail, Israfil, Izrail, Munkar, Nakir, Raqib, Atid, Malik, Ridwan) kepada anak-anak secara berpasangan. Setiap pasangan mendiskusikan dan mencari tahu tugas malaikat tersebut dengan bantuan buku cerita yang disediakan. Guru berkeliling memfasilitasi diskusi dan menjawab pertanyaan anak.",
        "ELABORASI: Guru menceritakan kisah-kisah tentang malaikat dengan cara yang menarik dan penuh emosi. Misalnya: cerita tentang Jibril yang turun ke Gua Hira untuk memberikan wahyu pertama kepada Nabi Muhammad SAW, cerita tentang Raqib dan Atid yang mencatat amal baik kita setiap hari. Guru menggunakan boneka tangan atau puppet untuk memerankan kisah tersebut.",
        "KONFIRMASI: Guru mengajak anak bermain 'Guess the Angel' di mana guru memberikan clue tentang tugas malaikat dan anak menebak namanya. Setiap anak yang benar mendapat poin. Guru mengajak anak menyanyikan lagu tentang malaikat dengan gerakan tangan yang menggambarkan tugas-tugas mereka.",
        "PRAKTIK: Anak membuat 'Buku Malaikat' milik mereka sendiri. Setiap halaman berisi nama malaikat, tugasnya, dan gambar yang menggambarkan tugas tersebut. Anak dapat mewarnai, menempel stiker bintang, atau menggambar malaikat dengan imajinasi mereka. Guru berkeliling memberikan apresiasi dan bimbingan.",
        "REFLEKSI: Guru mengajak anak duduk melingkar dan memimpin diskusi: 'Setelah mengetahui tentang malaikat, bagaimana perasaanmu? Apa yang akan kamu lakukan berbeda mulai hari ini?' Anak berbagi refleksi dan komitmen untuk berbuat lebih banyak kebaikan."
      ],
      penutup: "Guru mengajak anak menutup mata dan membayangkan malaikat yang selalu ada di samping kita, mencatat setiap kebaikan yang kita lakukan. Guru memimpin doa dengan penuh rasa syukur dan kekaguman kepada Allah yang telah menciptakan malaikat sebagai penjaga dan pencatat amal kita. Guru memberikan 'Bintang Malaikat' kepada setiap anak sebagai pengingat untuk selalu berbuat baik. Guru menutup dengan salam, senyuman, dan ucapan: 'Terima kasih anak-anak, hari ini malaikat pasti sangat senang mencatat banyak kebaikan kalian.'"
    }
  },
  {
    tema: "Budaya Indonesia: Batik, Wayang, dan Rumah Adat",
    kelompokUsia: "B",
    topikKBC: "Berkebinekaan Global",
    tujuanKBC: "Anak dapat mengenal, menghargai, dan bangga dengan keberagaman budaya Indonesia melalui batik, wayang, dan rumah adat, memahami bahwa setiap daerah memiliki keunikan dan keindahan yang berbeda-beda, serta menumbuhkan rasa cinta dan bangga terhadap tanah air sebagai bagian dari identitas mereka.",
    tujuanProfilLulusan: {
      beriman_dan_berakhlak_mulia: "Anak bersyukur kepada Allah atas keberagaman budaya yang ada di Indonesia, menghargai ciptaan seni manusia sebagai anugerah Allah, serta menghormati perbedaan budaya sebagai bentuk kasih sayang kepada sesama.",
      berkebinekaan_global: "Anak mengenal minimal 5 motif batik dari berbagai daerah (Batik Jawa, Batik Bali, Batik Sumatera, dll), mengenal jenis-jenis wayang (Wayang Kulit, Wayang Golek, Wayang Orang), serta mengenal minimal 5 rumah adat (Rumah Gadang, Tongkonan, Joglo, Kebaya, Honai).",
      gotong_royong: "Anak bekerja sama dalam kelompok untuk membuat karya seni batik sederhana, membantu teman yang kesulitan dalam proyek seni, serta mempresentasikan hasil karya kelompok dengan bangga.",
      mandiri_dan_kreatif: "Anak membuat motif batik sederhana dengan teknik kolase atau crayon resist, membuat wayang kertas dan menyiapkan pertunjukan wayang mini, membuat rumah adat dari bahan daur ulang, serta mempresentasikan karya dengan percaya diri.",
      bernalar_kritis: "Anak membedakan berbagai motif batik dan asal daerahnya, menganalisis fungsi wayang sebagai media pendidikan dan hiburan, membandingkan berbagai rumah adat dan memahami kenapa bentuknya berbeda, serta mengajukan pertanyaan tentang budaya Indonesia.",
      sehat_jasmani_dan_rohani: "Anak melakukan gerakan-gerakan tangan dan tubuh saat membuat karya seni, menjaga kebersihan saat bekerja dengan pewarna, serta menikmati proses berkarya dengan penuh ketenangan dan kebahagiaan.",
      warga_negara: "Anak mengidentifikasi diri sebagai bagian dari bangsa Indonesia yang kaya budaya, bangga dengan keberagaman budaya Indonesia, serta menyadari tanggung jawab untuk melestarikan budaya bangsa."
    },
    tujuanPembelajaranMendalam: "Melalui kegiatan pembelajaran yang kaya budaya dan kreatif, anak akan:\n1. Mengenal minimal 5 motif batik dari berbagai daerah Indonesia\n2. Memahami makna dan filosofi dari setiap motif batik yang dipelajari\n3. Mengenal jenis-jenis wayang dan fungsinya dalam budaya Indonesia\n4. Mengenal minimal 5 rumah adat dari berbagai daerah\n5. Memahami keunikan dan fungsi setiap rumah adat\n6. Membuat karya seni sederhana yang terinspirasi dari budaya Indonesia\n7. Menunjukkan rasa bangga dan cinta terhadap budaya Indonesia",
    kerangkaPembelajaran: "Pembelajaran berlangsung selama 2 hari (± 4 jam total) dengan pendekatan project-based learning:\n- Pembelajaran berbasis proyek seni dan budaya\n- Metode eksplorasi langsung dengan benda asli atau replika\n- Pembelajaran kolaboratif melalui kerja kelompok\n- Pembelajaran lintas mata pelajaran (seni, bahasa, sosial)\n- Penilaian berbasis produk dan proses\n- Integrasi nilai-nilai cinta tanah air dan toleransi\n- Lingkungan belajar yang kaya visual dan inspiratif",
    kegiatanPembelajaran: {
      pendahuluan: "Guru memulai dengan memutarkan lagu 'Indonesia Pusaka' atau lagu daerah sambil menampilkan gambar-gambar keindahan Indonesia. Guru bertanya: 'Anak-anak, tahu tidak Indonesia punya banyak sekali keunikan? Setiap daerah punya ciri khas yang berbeda-beda. Siapa yang pernah melihat batik? Wayang? Rumah adat?' Guru menampilkan berbagai contoh batik, wayang, dan rumah adat dan mengajak anak mengamati perbedaan-perbedaannya. Guru memperkenalkan tema: 'Hari ini dan besok kita akan menjadi penjelajah budaya Indonesia!'",
      inti: [
        "EKSPLORASI BATIK: Guru menampilkan kain batik asli atau replika dari berbagai daerah (Batik Solo, Batik Pekalongan, Batik Bali, Batik Palembang). Anak diajak mengamati motif, warna, dan pola dengan kaca pembesar. Setiap anak memilih motif batik favorit dan menjelaskan alasannya. Guru menjelaskan makna dan filosofi di balik setiap motif.",
        "PRAKTIK BATIK: Anak membuat 'Batik Kertas' dengan teknik crayon resist. Anak menggambar motif batik dengan crayon, kemudian mewarnai dengan cat air sehingga motif crayon tahan terhadap warna. Setiap anak membuat karya batik unik mereka sendiri.",
        "EKSPLORASI WAYANG: Guru menampilkan berbagai jenis wayang (Wayang Kulit, Wayang Golek, Wayang Kertas). Guru menceritakan kisah singkat tentang wayang dan fungsinya. Anak diajak memegang dan mengamati wayang dari dekat. Guru menjelaskan karakter tokoh-tokoh wayang seperti Arjuna, Srikandi, dan Gatotkaca.",
        "PRAKTIK WAYANG: Anak membuat wayang kertas mereka sendiri. Anak menggambar tokoh wayang, mewarnainya, dan memasang tangkai dari bambu sederhana. Setiap anak mempresentasikan wayang yang mereka buat dan menceritakan karakternya.",
        "EKSPLORASI RUMAH ADAT: Guru menampilkan gambar atau model rumah adat (Rumah Gadang Sumatera Barat, Tongkonan Sulawesi Selatan, Joglo Jawa, Rumah Kebaya Kalimantan, Honai Papua). Guru menjelaskan bentuk, fungsi, dan keunikan setiap rumah adat. Anak berdiskusi tentang mengapa setiap daerah punya rumah yang berbeda.",
        "PRAKTIK RUMAH ADAT: Anak bekerja dalam kelompok untuk membuat rumah adat dari bahan daur ulang (kotak kardus, stik es krim, kertas warna). Setiap kelompok membuat satu rumah adat dan mempresentasikan hasil karya mereka di depan kelas."
      ],
      penutup: "Guru mengajak anak memamerkan semua karya mereka (batik, wayang, rumah adat) dalam 'Pameran Budaya Indonesia' mini. Setiap anak menjelaskan karya mereka kepada teman-teman. Guru memimpin diskusi refleksi: 'Apa yang paling kamu sukai dari budaya Indonesia? Mengapa kita harus bangga dengan budaya kita?' Guru memberikan apresiasi berupa 'Sertifikat Penjelajah Budaya' kepada setiap anak. Guru memimpin doa syukur untuk Indonesia dan menutup dengan lagu kebangsaan atau lagu daerah bersama-sama."
    }
  },
  {
    tema: "Makanan Nusantara: Rasa dan Cerita",
    kelompokUsia: "B",
    topikKBC: "Berkebinekaan Global",
    tujuanKBC: "Anak dapat mengenal berbagai makanan khas dari berbagai daerah di Indonesia, memahami bahwa setiap daerah memiliki cita rasa dan bahan yang berbeda-beda karena kondisi geografis dan budaya, menumbuhkan rasa bangga terhadap kekayaan kuliner Indonesia, serta menghargai perbedaan selera dan budaya makan di Indonesia.",
    tujuanProfilLulusan: {
      beriman_dan_berakhlak_mulia: "Anak bersyukur kepada Allah atas keberagaman rezeki berupa makanan di Indonesia, menghargai usaha petani dan pebisnis kuliner, serta berbagi makanan dengan teman sebagai bentuk kasih sayang.",
      berkebinekaan_global: "Anak mengenal minimal 10 makanan khas dari berbagai provinsi (Rendang Sumatera Barat, Sate Madura, Gudeg Yogyakarta, Pempek Palembang, Soto Lamongan, Bakso Malang, Coto Makassar, Bika Ambon Manado, Kerak Telor Jakarta, Es Teler Jawa), serta memahami bahan utama dan cara pembuatannya secara sederhana.",
      gotong_royong: "Anak bekerja sama dalam kelompok untuk membuat resep sederhana, berbagi bahan dan alat, membantu teman yang kesulitan, serta membersihkan bersama setelah kegiatan memasak.",
      mandiri_dan_kreatif: "Anak dapat menggambarkan makanan khas yang mereka suka, membuat 'Buku Resep' dengan gambar dan tulisan sederhana, menciptakan varian rasa baru dengan imajinasi, serta mempresentasikan dengan percaya diri.",
      bernalar_kritis: "Anak membedakan berbagai rasa (manis, asin, pedas, asam) dari makanan Nusantara, memahami mengapa setiap daerah punya makanan berbeda (iklim, bahan lokal, budaya), menjelaskan manfaat setiap bahan makanan bagi tubuh, serta mengajukan pertanyaan tentang makanan daerah lain.",
      sehat_jasmani_dan_rohani: "Anak memilih makanan yang sehat dari berbagai daerah, mencoba makanan baru dengan rasa ingin tahu, menjaga kebersihan saat menyiapkan dan menyantap makanan, serta menghargai makanan dengan tidak membuang-buang.",
      warga_negara: "Anak mengidentifikasi diri sebagai bagian dari bangsa Indonesia yang kaya kuliner, bangga dengan keanekaragaman makanan Indonesia, serta menyadari pentingnya melestarikan resep tradisional."
    },
    tujuanPembelajaranMendalam: "Melalui kegiatan pembelajaran yang lezat dan edukatif, anak akan:\n1. Mengenal minimal 10 makanan khas dari berbagai daerah di Indonesia\n2. Memahami bahan utama dan cara pembuatan sederhana setiap makanan\n3. Membedakan berbagai rasa dari makanan Nusantara\n4. Menjelaskan hubungan antara makanan dengan budaya dan geografi daerah\n5. Mempraktikkan pembuatan makanan sederhana dari resep daerah\n6. Menunjukkan rasa bangga terhadap kuliner Indonesia\n7. Menghargai perbedaan selera dan budaya makan",
    kerangkaPembelajaran: "Pembelajaran berlangsung selama 2 hari (± 4 jam total) dengan pendekatan hands-on learning:\n- Pembelajaran berbasis pengalaman langsung mencicipi dan membuat makanan\n- Metode eksperimen sensorik (mencicipi, mencium, melihat)\n- Pembelajaran kolaboratif melalui kegiatan memasak bersama\n- Pembelajaran lintas mata pelajaran (biologi, geografi, matematika ukuran)\n- Penilaian berbasis proses dan hasil\n- Integrasi nilai-nilai kebersihan, kesehatan, dan gotong royong\n- Lingkungan belajar yang hangat, aman, dan menyenangkan",
    kegiatanPembelajaran: {
      pendahuluan: "Guru menarik perhatian anak dengan aroma makanan yang lezat yang disiapkan sebelumnya. Guru bertanya: 'Wah, aromanya enak sekali! Siapa yang bisa menebak makanan apa ini? Dari daerah mana ya?' Guru menampilkan peta Indonesia dengan gambar-gambar makanan di setiap provinsi. Guru mengatakan: 'Indonesia punya ribuan makanan lezat! Setiap daerah punya makanan khas yang unik. Hari ini kita akan menjadi penjelajah rasa Nusantara!'",
      inti: [
        "EKSPLORASI RASA: Guru menyajikan sampel makanan khas dari berbagai daerah (Rendang, Sate, Gudeg, Pempek, dll dalam porsi kecil). Anak diajak mencicipi setiap makanan dan menggambarkan rasanya (manis, asin, pedas, gurih, asam). Guru mencatat respon anak di papan tulis dalam bentuk tabel.",
        "STUDI KASUS: Guru membagikan kartu berisi gambar makanan khas dan cerita singkat tentang asal-usulnya. Anak berdiskusi dalam kelompok: Mengapa makanan ini terkenal di daerah tersebut? Bahan apa yang tersedia di daerah itu? Setiap kelompok mempresentasikan temuan mereka.",
        "PRAKTIK MEMASAK: Anak berpartisipasi dalam 'Kelas Memasak Mini' untuk membuat salah satu makanan sederhana, misalnya Es Teler atau Kerupuk. Guru mendemonstrasikan langkah-langkahnya, kemudian anak mempraktikkan dengan bimbingan. Anak belajar mengukur bahan, mencampur, dan menyajikan.",
        "KREASI RESIP: Anak membuat 'Buku Resep Mini' mereka sendiri. Setiap halaman berisi gambar makanan khas yang mereka suka, daftar bahan sederhana, dan langkah-langkah membuat dengan gambar ilustrasi. Anak dapat menulis kata-kata sederhana atau mendiktekan kepada guru.",
        "PAMERAN MAKANAN: Anak memamerkan karya mereka (Buku Resep, makanan yang dibuat) dalam 'Pameran Kuliner Nusantara'. Setiap anak menjelaskan karya mereka kepada teman-teman dan guru. Anak juga membawa makanan khas dari rumah (jika memungkinkan) untuk dibagikan dan diceritakan asal-usulnya."
      ],
      penutup: "Guru mengajak anak duduk melingkar dan memimpin diskusi refleksi: 'Makanan mana yang paling kamu sukai? Apa yang kamu pelajari dari kegiatan hari ini? Mengapa kita harus bangga dengan makanan Indonesia?' Anak berbagi pengalaman dan perasaan mereka. Guru memberikan 'Sertifikat Juru Masak Cilik' atau 'Bintang Kuliner' kepada setiap anak. Guru memimpin doa syukur atas rezeki makanan yang berlimpah dan menutup dengan ajakan untuk selalu menghargai makanan dan tidak membuang-buangnya."
    }
  },
  {
    tema: "Pakaian Adat Nusantara",
    kelompokUsia: "B",
    topikKBC: "Berkebinekaan Global",
    tujuanKBC: "Anak dapat mengenal berbagai pakaian adat dari berbagai provinsi di Indonesia, memahami bahwa setiap daerah memiliki ciri khas pakaian yang berbeda-beda karena budaya, iklim, dan sejarah yang berbeda, menumbuhkan rasa bangga terhadap kekayaan budaya Indonesia, serta menghargai perbedaan dalam berpakaian sebagai bentuk keragaman.",
    tujuanProfilLulusan: {
      beriman_dan_berakhlak_mulia: "Anak bersyukur kepada Allah atas keberagaman budaya berpakaian, menghargai ciptaan seni dalam pakaian adat sebagai anugerah Allah, serta menghormati perbedaan pakaian orang lain sebagai bentuk kasih sayang.",
      berkebinekaan_global: "Anak mengenal minimal 10 pakaian adat dari berbagai provinsi (Kebaya Jawa, Ulos Batak, Baju Kurung Sumatera, Baju Bodo Sulawesi Selatan, Pakaian Adat Bali, Pakaian Adat Papua, Pakaian Adat Dayak Kalimantan, Pakaian Adat Sumba, Pakaian Adat Timor, Pakaian Adat Maluku), serta memahami ciri khas dan maknanya.",
      gotong_royong: "Anak bekerja sama dalam kelompok untuk membuat pakaian adat dari kertas, membantu teman mengenakan pakaian adat, serta mempresentasikan hasil karya kelompok dengan bangga.",
      mandiri_dan_kreatif: "Anak membuat pakaian adat kertas dengan teknik origami atau kolase, menghias pakaian dengan motif khas daerah, mempresentasikan karya dengan percaya diri, serta menceritakan makna pakaian adat yang dibuat.",
      bernalar_kritis: "Anak membedakan berbagai pakaian adat dan asal daerahnya, menganalisis mengapa pakaian adat berbeda-beda (iklim, bahan, budaya), membandingkan pakaian adat dengan pakaian sehari-hari, serta mengajukan pertanyaan tentang pakaian daerah lain.",
      sehat_jasmani_dan_rohani: "Anak bergerak dan menari dengan pakaian adat kertas, menjaga kebersihan saat bekerja dengan kertas dan pewarna, serta menikmati proses berkarya dengan penuh kebahagiaan.",
      warga_negara: "Anak mengidentifikasi diri sebagai bagian dari bangsa Indonesia yang kaya budaya, bangga dengan keanekaragaman pakaian adat, serta menyadari pentingnya melestarikan budaya berpakaian tradisional."
    },
    tujuanPembelajaranMendalam: "Melalui kegiatan pembelajaran yang kreatif dan budaya, anak akan:\n1. Mengenal minimal 10 pakaian adat dari berbagai daerah di Indonesia\n2. Memahami ciri khas dan makna dari setiap pakaian adat yang dipelajari\n3. Menjelaskan hubungan antara pakaian adat dengan budaya dan lingkungan daerah\n4. Membuat karya pakaian adat sederhana dari kertas\n5. Menunjukkan rasa bangga terhadap kekayaan budaya Indonesia\n6. Menghargai perbedaan dalam berpakaian sebagai bentuk keragaman\n7. Mempraktikkan sikap toleran terhadap perbedaan budaya berpakaian",
    kerangkaPembelajaran: "Pembelajaran berlangsung selama 2 hari (± 4 jam total) dengan pendekatan arts-based learning:\n- Pembelajaran berbasis seni dan kerajinan tangan\n- Metode eksplorasi visual dengan gambar dan video\n- Pembelajaran kolaboratif melalui proyek kelompok\n- Pembelajaran lintas mata pelajaran (seni, budaya, bahasa)\n- Penilaian berbasis produk kreatif\n- Integrasi nilai-nilai toleransi, bangga budaya, dan kreativitas\n- Lingkungan belajar yang kaya warna dan inspiratif",
    kegiatanPembelajaran: {
      pendahuluan: "Guru memulai dengan menampilkan video tari tradisional dengan berbagai pakaian adat atau menunjukkan gambar-gambar pakaian adat yang indah. Guru bertanya: 'Wah, pakaian-pakaian ini cantik sekali! Ada yang tahu ini pakaian dari daerah mana? Kenapa bentuknya berbeda-beda?' Guru menampilkan peta Indonesia dan menunjukkan berbagai pakaian adat di setiap daerah. Guru mengatakan: 'Indonesia punya ratusan pakaian adat yang cantik! Hari ini kita akan belajar dan membuat pakaian adat kita sendiri!'",
      inti: [
        "EKSPLORASI VISUAL: Guru menampilkan gambar-gambar pakaian adat dari berbagai daerah (Kebaya, Ulos, Baju Bodo, dll) dalam ukuran besar. Anak diajak mengamati detail, warna, motif, dan bentuk. Guru menjelaskan asal daerah, ciri khas, dan makna setiap pakaian adat. Anak diminta memilih pakaian adat favorit mereka dan menjelaskan alasannya.",
        "VIDEO DAN CERITA: Guru memutar video singkat tentang pakaian adat atau menceritakan kisah di balik pakaian adat tertentu. Misalnya, cerita tentang Kebaya yang dikenakan oleh perempuan Jawa sebagai simbol kesopanan dan keanggunan, atau Ulos Batak yang memiliki makna perlindungan dan kasih sayang.",
        "PRAKTIK KREATIF: Anak membuat 'Pakaian Adat Kertas' mereka sendiri. Guru menyediakan template pakaian adat sederhana yang dapat dicetak. Anak memotong, menghias dengan kertas warna, menambahkan motif khas daerah, dan membuat pakaian adat yang unik. Anak dapat memilih pakaian adat mana yang ingin mereka buat.",
        "PERMAINAN PERAN: Anak memakai pakaian adat kertas yang mereka buat dan bermain peran sebagai 'Duta Budaya' dari daerah tersebut. Setiap anak memperkenalkan diri: 'Halo, saya dari [daerah]. Pakaian ini disebut [nama pakaian]. Ciri khasnya adalah [detail]. Maknanya adalah [makna].' Anak lain bertanya tentang pakaian adat tersebut.",
        "PAMERAN FASHION: Guru mengadakan 'Peragaan Busana Adat' mini di mana setiap anak memperagakan pakaian adat kertas mereka dengan jalan di depan kelas sambil guru atau teman menjelaskan tentang pakaian tersebut. Musik tradisional diputar sebagai latar belakang."
      ],
      penutup: "Guru mengajak anak berkumpul dan memimpin diskusi refleksi: 'Pakaian adat mana yang paling kamu sukai? Apa yang kamu pelajari hari ini? Mengapa kita harus bangga dengan pakaian adat Indonesia?' Anak berbagi refleksi. Guru menampilkan semua karya anak di dinding kelas sebagai 'Galeri Pakaian Adat Nusantara'. Guru memberikan 'Sertifikat Desainer Cilik' atau 'Bintang Budaya' kepada setiap anak. Guru memimpin doa syukur atas kekayaan budaya Indonesia dan menutup dengan ajakan untuk selalu bangga dengan budaya bangsa sendiri."
    }
  },
  {
    tema: "Bekerja Sama Membuat Taman Sekolah",
    kelompokUsia: "B",
    topikKBC: "Gotong Royong",
    tujuanKBC: "Anak dapat memahami pentingnya kerja sama dan gotong royong dalam mewujudkan lingkungan yang indah dan sehat, melaksanakan kegiatan berkebun secara kolaboratif, memahami tanggung jawab bersama terhadap lingkungan, serta menumbuhkan rasa cinta dan peduli terhadap alam dan lingkungan sekitar.",
    tujuanProfilLulusan: {
      beriman_dan_berakhlak_mulia: "Anak bersyukur kepada Allah atas ciptaan-Nya berupa tumbuhan dan alam, merawat tanaman sebagai bentuk kasih sayang kepada ciptaan Allah, serta memahami bahwa menjaga alam adalah amanah dari Allah.",
      berkebinekaan_global: "Anak memahami bahwa setiap negara memiliki taman dan kebun yang berbeda-beda, menghargai berbagai jenis tanaman dari berbagai daerah, serta menghormati teman yang memiliki preferensi tanaman berbeda.",
      gotong_royong: "Anak bekerja sama dalam kelompok untuk membuat taman sekolah, membagi tugas secara adil (menggali, menanam, menyiram, membersihkan), membantu teman yang kesulitan, serta saling mengingatkan untuk merawat tanaman.",
      mandiri_dan_kreatif: "Anak dapat menanam benih dengan benar, merancang taman mini di pot, membuat tanda tanaman kreatif, serta merawat tanaman dengan mandiri (menyiram, membersihkan daun kering).",
      bernalar_kritis: "Anak membedakan berbagai jenis tanaman dan cara merawatnya, memahami siklus hidup tanaman (benih → tunas → tumbuhan dewasa), menjelaskan mengapa tanaman membutuhkan air, matahari, dan tanah, serta mengajukan pertanyaan tentang pertumbuhan tanaman.",
      sehat_jasmani_dan_rohani: "Anak bergerak aktif saat berkebun (menggali, menanam, menyiram), menyentuh tanah dan tanaman sebagai terapi alami, bernapas udara segar di taman, serta menikmati keindahan alam dengan ketenangan.",
      warga_negara: "Anak memahami dirinya sebagai bagian dari komunitas sekolah yang bertanggung jawab atas lingkungan, sadar bahwa taman adalah milik bersama yang harus dijaga, serta berpartisipasi dalam kegiatan lingkungan sekolah."
    },
    tujuanPembelajaranMendalam: "Melalui kegiatan pembelajaran berbasis proyek lingkungan, anak akan:\n1. Memahami konsep gotong royong dan kerja sama dalam keberlanjutan lingkungan\n2. Menjelaskan tahapan menanam dan merawat tanaman dengan benar\n3. Mempraktikkan kegiatan berkebun secara kolaboratif\n4. Memahami siklus hidup tanaman dan kebutuhannya\n5. Menunjukkan tanggung jawab terhadap lingkungan sekolah\n6. Menumbuhkan rasa cinta dan peduli terhadap alam\n7. Mempraktikkan nilai-nilai gotong royong dalam kegiatan sehari-hari",
    kerangkaPembelajaran: "Pembelajaran berlangsung selama 2-3 hari (± 6 jam total) dengan pendekatan project-based learning:\n- Pembelajaran berbasis proyek lingkungan nyata\n- Metode experiential learning di luar ruangan\n- Pembelajaran kolaboratif melalui kerja kelompok\n- Pembelajaran lintas mata pelajaran (IPA, matematika, seni, PKn)\n- Penilaian berbasis proses dan hasil jangka panjang\n- Integrasi nilai-nilai kepedulian lingkungan dan tanggung jawab\n- Lingkungan belajar di alam terbuka yang menyenangkan",
    kegiatanPembelajaran: {
      pendahuluan: "Guru membawa anak ke area luar ruangan sekolah yang akan dijadikan taman. Guru bertanya: 'Anak-anak, apa yang kalian lihat di sini? Bagaimana perasaan kalian melihat tempat ini? Apakah tempat ini bisa menjadi lebih indah?' Guru menampilkan gambar-gambar taman yang indah dan menarik. Guru mengatakan: 'Jika kita bekerja sama, kita bisa membuat tempat ini menjadi taman yang indah dan sehat! Siapa yang mau membantu?' Guru memperkenalkan proyek 'Taman Sekolah Kita' dan membagi anak menjadi beberapa kelompok dengan tugas berbeda.",
      inti: [
        "PERENCANAAN: Setiap kelompok mendiskusikan dan merencanakan bagian taman yang akan mereka kerjakan. Kelompok A bertugas membuat area bunga, Kelompok B membuat area sayuran, Kelompok C membuat area tanaman hias. Guru memfasilitasi diskusi dan membantu anak membuat sketsa sederhana taman mereka.",
        "PERSIAPAN: Guru dan anak bersama-sama menyiapkan alat dan bahan (cangkul, sekop, pot, tanah, benih, pupuk). Guru menjelaskan fungsi setiap alat dan cara menggunakannya dengan aman. Anak membagi tugas: ada yang mengambil tanah, ada yang menyiapkan benih, ada yang menyiapkan pot.",
        "PRAKTIK MENANAM: Guru mendemonstrasikan cara menanam benih dengan benar: mengisi pot dengan tanah, membuat lubang kecil, memasukkan benih, menutup dengan tanah, dan menyiram. Anak mempraktikkan dengan bimbingan. Setiap anak menanam minimal 2-3 benih. Guru berkeliling memberikan bimbingan dan penguatan.",
        "PEMAKAMAN TANDA: Anak membuat tanda tanaman kreatif dari tongkat es krim dan kertas. Setiap tanda berisi nama tanaman, tanggal ditanam, dan nama anak yang merawatnya. Anak menghias tanda dengan gambar dan warna yang cerah.",
        "PELAKSANAAN GOTONG ROYONG: Setiap kelompok menata tanaman mereka di area yang ditentukan. Anak bekerja sama mengangkat pot, menyusun tanaman, dan membersihkan area sekitar. Guru mengamati dan mencatat contoh perilaku gotong royong yang ditunjukkan anak.",
        "PERAWATAN RUTIN: Guru menjelaskan bahwa tanaman membutuhkan perawatan rutin. Anak membuat jadwal penyiraman dan perawatan secara bergantian. Setiap anak memiliki tanggung jawab untuk merawat tanaman tertentu."
      ],
      penutup: "Guru mengajak anak berkumpul di taman yang baru dibuat. Guru memimpin refleksi: 'Lihat! Taman ini menjadi indah karena kita bekerja sama. Apa yang kamu rasakan saat melihat hasil kerja keras kita? Apa yang kamu pelajari tentang gotong royong?' Anak berbagi pengalaman dan perasaan mereka. Guru memberikan 'Sertifikat Pejuang Lingkungan' atau 'Bintang Taman' kepada setiap anak. Guru memimpin doa syukur atas keindahan ciptaan Allah dan menutup dengan ajakan untuk terus merawat taman bersama-sama sebagai tanggung jawab kolektif."
    }
  },
  {
    tema: "Membantu Teman yang Kesulitan",
    kelompokUsia: "B",
    topikKBC: "Gotong Royong",
    tujuanKBC: "Anak dapat memahami pentingnya empati dan kepedulian terhadap sesama, melaksanakan tindakan nyata untuk membantu teman yang kesulitan, membedakan antara menolong dengan mengganggu, serta menumbuhkan budaya saling membantu dan mendukung di lingkungan sekolah.",
    tujuanProfilLulusan: {
      beriman_dan_berakhlak_mulia: "Anak membantu teman sebagai bentuk kasih sayang sesama, memahami bahwa menolong adalah perbuatan yang dicintai Allah, serta berdoa untuk teman yang kesulitan.",
      berkebinekaan_global: "Anak memahami bahwa setiap orang memiliki kesulitan yang berbeda-beda, menghargai berbagai cara orang mengekspresikan kesulitan mereka, serta menghormati teman yang butuh bantuan atau tidak.",
      gotong_royong: "Anak mengamati dan mengenali tanda-tanda teman yang kesulitan, menawarkan bantuan dengan sopan, membantu tanpa mengharapkan imbalan, bekerja sama menyelesaikan masalah teman, serta memberikan dukungan emosional.",
      mandiri_dan_kreatif: "Anak dapat menemukan cara kreatif untuk membantu teman, memecahkan masalah sederhana yang dihadapi teman, mengajak teman lain untuk ikut membantu, serta mempertimbangkan konsekuensi dari setiap tindakan bantuan.",
      bernalar_kritis: "Anak membedakan situasi ketika teman butuh bantuan atau tidak, menganalisis cara bantuan yang tepat untuk setiap situasi, memahami perbedaan antara menolong dan memanjakan, serta mengevaluasi efektivitas bantuan yang diberikan.",
      sehat_jasmani_dan_rohani: "Anak menunjukkan empati melalui ekspresi wajah dan bahasa tubuh, menenangkan teman yang sedih atau cemas, menjaga jarak dan batasan pribadi saat menolong, serta merasakan kebahagiaan saat membantu orang lain.",
      warga_negara: "Anak memahami dirinya sebagai bagian dari komunitas yang saling mendukung, sadar bahwa membantu teman adalah tanggung jawab bersama, serta berkontribusi dalam menciptakan lingkungan yang suportif."
    },
    tujuanPembelajaranMendalam: "Melalui kegiatan pembelajaran berbasis empati dan praktik sosial, anak akan:\n1. Memahami konsep empati dan kepedulian terhadap sesama\n2. Mengenali tanda-tanda teman yang membutuhkan bantuan\n3. Mempraktikkan cara menawarkan bantuan dengan sopan dan tepat\n4. Membedakan antara menolong yang baik dan mengganggu\n5. Menunjukkan perilaku gotong royong dalam kegiatan sehari-hari\n6. Menumbuhkan rasa tanggung jawab terhadap teman\n7. Membangun budaya saling membantu di lingkungan sekolah",
    kerangkaPembelajaran: "Pembelajaran berlangsung selama 1-2 hari (± 4 jam total) dengan pendekatan social-emotional learning:\n- Pembelajaran berbasis pengalaman sosial dan emosional\n- Metode role playing dan simulasi situasi nyata\n- Pembelajaran kolaboratif melalui diskusi dan refleksi\n- Pembelajaran karakter dan nilai-nilai moral\n- Penilaian berbasis observasi perilaku\n- Integrasi nilai-nilai empati, kepedulian, dan tanggung jawab\n- Lingkungan belajar yang aman, suportif, dan penuh kasih",
    kegiatanPembelajaran: {
      pendahuluan: "Guru memulai dengan cerita tentang seorang anak yang kesulitan dan dibantu oleh temannya. Guru bertanya: 'Apa yang terjadi dalam cerita ini? Bagaimana perasaan anak yang dibantu? Bagaimana perasaan anak yang menolong?' Guru menampilkan gambar-gambar berbagai situasi (teman yang menangis, teman yang terjatuh, teman yang kesulitan mengerjakan tugas). Guru bertanya: 'Dari gambar-gambar ini, siapa yang membutuhkan bantuan? Bagaimana kita tahu?' Guru memperkenalkan tema: 'Hari ini kita akan belajar menjadi teman yang peduli dan suka menolong!'",
      inti: [
        "DISKUSI EMPATI: Guru memimpin diskusi tentang empati. Apa itu empati? Bagaimana rasanya ketika kita sedih dan ada yang menolong? Bagaimana rasanya ketika kita menolong orang lain? Anak berbagi pengalaman pribadi ketika mereka dibantu atau menolong orang lain. Guru mencatat kata-kata kunci di papan (sadar, peduli, tanya, bantu).",
        "SIMULASI SITUASI: Guru dan anak bermain peran (role playing) berbagai situasi: Teman yang jatuh di lapangan, teman yang bingung mengerjakan tugas, teman yang kehilangan barang, teman yang sedang sendirian. Anak mempraktikkan cara menawarkan bantuan: 'Apa yang bisa saya bantu?', 'Apakah kamu butuh bantuan?', 'Mari kita kerjakan bersama.' Guru memberikan umpan balik dan penguatan.",
        "KARTU SITUASI: Guru membagikan kartu-kartu situasi kepada anak secara berpasangan. Setiap kartu berisi skenario (misalnya: 'Temanmu menangis karena kehilangan mainan'). Anak mendiskusikan: Apa yang harus dilakukan? Apa yang harus dikatakan? Setiap pasangan mempresentasikan cara mereka menolong.",
        "PRAKTIK NYATA: Guru mengamati anak selama istirahat atau kegiatan bebas. Guru memberikan catatan positif setiap kali anak membantu teman. Setelah kegiatan, guru membahas contoh-contoh bantuan yang dilakukan anak dan memberikan apresiasi.",
        "REFLEKSI KELAS: Guru memimpin diskusi: 'Siapa yang pernah dibantu teman hari ini? Bagaimana perasaannya? Siapa yang sudah membantu teman? Apa yang kamu rasakan setelah membantu?' Anak berbagi pengalaman dan perasaan mereka secara bebas."
      ],
      penutup: "Guru mengajak anak duduk melingkar dan memegang tangan teman di sebelahnya. Guru mengatakan: 'Hari ini kita belajar bahwa membantu teman membuat kita bahagia dan teman kita juga bahagia. Ketika kita membantu, kita membuat lingkungan kita menjadi lebih baik.' Setiap anak berbagi satu hal yang akan mereka lakukan untuk membantu teman besok. Guru memberikan 'Bintang Pertolongan' kepada setiap anak sebagai pengingat untuk selalu peduli dan menolong. Guru memimpin doa penutup dengan memohon kepada Allah agar selalu diberikan hati yang peduli terhadap sesama."
    }
  },
  {
    tema: "Kerja Bakti Membersihkan Lingkungan",
    kelompokUsia: "B",
    topikKBC: "Gotong Royong",
    tujuanKBC: "Anak dapat memahami pentingnya kebersihan lingkungan sebagai tanggung jawab bersama, melaksanakan kegiatan kerja bakti secara kolaboratif, mempraktikkan cara memilah dan membuang sampah dengan benar, serta menumbuhkan rasa cinta dan peduli terhadap lingkungan sekolah dan lingkungan sekitar.",
    tujuanProfilLulusan: {
      beriman_dan_berakhlak_mulia: "Anak menjaga kebersihan sebagai bentuk syukur kepada Allah, memahami bahwa lingkungan yang bersih adalah nikmat dari Allah, serta berdoa untuk selalu diberikan kemampuan menjaga lingkungan.",
      berkebinekaan_global: "Anak memahami bahwa setiap negara memiliki tantangan lingkungan yang berbeda, menghargai berbagai cara menjaga kebersihan di berbagai budaya, serta menghormati upaya orang lain dalam menjaga lingkungan.",
      gotong_royong: "Anak bekerja sama dalam kelompok untuk membersihkan lingkungan sekolah, membagi tugas secara adil (menyapu, memungut sampah, mengepel), membantu teman yang kesulitan, serta saling mengingatkan untuk menjaga kebersihan.",
      mandiri_dan_kreatif: "Anak dapat memilah sampah organik dan anorganik dengan benar, membuat poster kebersihan kreatif, menemukan cara kreatif untuk mendaur ulang barang bekas, serta membersihkan area yang menjadi tanggung jawabnya.",
      bernalar_kritis: "Anak membedakan berbagai jenis sampah dan cara membuangnya, memahami dampak sampah terhadap lingkungan, menganalisis mengapa kebersihan penting bagi kesehatan, serta mengajukan pertanyaan tentang pengelolaan sampah.",
      sehat_jasmani_dan_rohani: "Anak bergerak aktif saat kerja bakti (menyapu, memungut sampah), menjaga kebersihan diri setelah kegiatan, bernapas udara bersih di lingkungan yang sehat, serta merasakan kepuasan setelah melihat lingkungan bersih.",
      warga_negara: "Anak memahami dirinya sebagai bagian dari masyarakat yang bertanggung jawab atas kebersihan, sadar bahwa lingkungan bersih adalah milik bersama, serta berpartisipasi dalam kegiatan gotong royong komunitas."
    },
    tujuanPembelajaranMendalam: "Melalui kegiatan pembelajaran berbasis aksi lingkungan, anak akan:\n1. Memahami konsep kebersihan lingkungan sebagai tanggung jawab bersama\n2. Menjelaskan cara memilah dan membuang sampah dengan benar\n3. Mempraktikkan kegiatan kerja bakti secara kolaboratif\n4. Memahami dampak sampah terhadap lingkungan dan kesehatan\n5. Menunjukkan tanggung jawab terhadap lingkungan sekolah\n6. Menumbuhkan rasa cinta dan peduli terhadap lingkungan\n7. Mempraktikkan nilai-nilai gotong royong dalam menjaga kebersihan",
    kerangkaPembelajaran: "Pembelajaran berlangsung selama 2-3 hari (± 6 jam total) dengan pendekatan service learning:\n- Pembelajaran berbasis aksi nyata dan pengabdian\n- Metode experiential learning di lingkungan sebenarnya\n- Pembelajaran kolaboratif melalui kerja kelompok\n- Pembelajaran lintas mata pelajaran (IPA, PKn, seni)\n- Penilaian berbasis kinerja dan dampak nyata\n- Integrasi nilai-nilai kepedulian lingkungan dan tanggung jawab\n- Lingkungan belajar yang nyata dan bermakna",
    kegiatanPembelajaran: {
      pendahuluan: "Guru membawa anak untuk mengamati kondisi lingkungan sekolah. Guru bertanya: 'Anak-anak, apa yang kalian lihat di sekitar kita? Apakah tempat ini bersih? Bagaimana perasaan kalian melihat sampah berserakan?' Guru menampilkan gambar-gambar lingkungan yang bersih dan kotor untuk perbandingan. Guru mengatakan: 'Hari ini kita akan menjadi pejuang lingkungan dan membersihkan sekolah kita bersama-sama! Siapa yang mau ikut?' Guru memperkenalkan kegiatan 'Kerja Bakti Besar' dan membagi anak menjadi beberapa kelompok dengan area dan tugas yang berbeda.",
      inti: [
        "EDUKASI SAMPAH: Guru menjelaskan berbagai jenis sampah (organik, anorganik, B3) dan cara membuangnya. Guru menampilkan contoh sampah dan menempatkannya di keranjang yang benar. Anak berlatih memilah sampah dengan bimbingan guru.",
        "PERENCANAAN KERJA BAKTI: Setiap kelompok mendiskusikan area yang akan dibersihkan dan tugas yang akan dilakukan. Kelompok A bertugas menyapu halaman, Kelompok B memungut sampah di area taman, Kelompok C mengepel koridor, Kelompok D membersihkan kelas. Guru memfasilitasi diskusi dan membantu membuat rencana kerja.",
        "PERSIAPAN ALAT: Guru dan anak bersama-sama menyiapkan alat kebersihan (sapu, pengki, pengki sampah, sarung tangan, masker). Guru menjelaskan cara menggunakan alat dengan aman. Anak membagi tugas alat dan menyiapkan diri untuk kerja bakti.",
        "PELAKSANAAN KERJA BAKTI: Anak bekerja dalam kelompok untuk membersihkan area yang ditentukan. Guru berkeliling memantau, memberikan bimbingan, dan mencatat contoh kerja sama yang ditunjukkan anak. Anak saling membantu jika ada yang kesulitan.",
        "PEMILAHAN SAMPAH: Setelah membersihkan, anak memisahkan sampah yang terkumpul ke dalam keranjang yang benar (organik, anorganik, daur ulang). Guru menjelaskan dampak setiap jenis sampah dan cara pengolahannya.",
        "REFLESI TINDAKAN: Setelah kerja bakti, anak berkumpul dan mengamati hasil kerja mereka. Guru memimpin diskusi: 'Lihat perbedaan sebelum dan sesudah kerja bakti! Bagaimana perasaan kalian melihat lingkungan yang bersih? Apa yang kalian pelajari hari ini?'"
      ],
      penutup: "Guru memimpin anak untuk melihat hasil kerja keras mereka dan berkumpul di area yang sudah bersih. Guru memberikan apresiasi: 'Terima kasih anak-anak! Lingkungan kita sekarang menjadi indah dan bersih berkat kerja sama kalian!' Setiap anak berbagi satu hal yang akan mereka lakukan untuk terus menjaga kebersihan. Guru memberikan 'Sertifikat Pejuang Lingkungan' atau 'Bintang Kebersihan' kepada setiap anak. Guru memimpin doa syukur atas kemampuan untuk menjaga lingkungan dan menutup dengan ajakan untuk selalu menjaga kebersihan sebagai tanggung jawab sehari-hari."
    }
  },
  {
    tema: "Berani Tampil di Depan Umum",
    kelompokUsia: "B",
    topikKBC: "Mandiri dan Kreatif",
    tujuanKBC: "Anak dapat mengembangkan kepercayaan diri untuk tampil di depan umum, mempraktikkan teknik dasar public speaking yang sesuai usia, mengekspresikan ide dan perasaan dengan jelas dan percaya diri, serta mengatasi rasa takut dan cemas saat berbicara di depan orang lain.",
    tujuanProfilLulusan: {
      beriman_dan_berakhlak_mulia: "Anak berani tampil dengan niat baik dan jujur, mengucapkan kata-kata yang sopan dan bermartabat, serta bersyukur kepada Allah atas kemampuan yang diberikan.",
      berkebinekaan_global: "Anak menghargai berbagai gaya komunikasi dan ekspresi dari budaya berbeda, memahami bahwa setiap anak memiliki cara unik untuk tampil, serta menghormati teman yang tampil dengan gaya berbeda.",
      gotong_royong: "Anak mendukung dan menyemangati teman yang tampil, memberikan apresiasi dan tepuk tangan untuk setiap penampil, membantu teman yang gugup atau lupa, serta bekerja sama dalam persiapan pertunjukan.",
      mandiri_dan_kreatif: "Anak dapat menyiapkan materi tampilan sendiri, mengatur pernapasan sebelum tampil, menggunakan gerakan tubuh dan ekspresi wajah yang tepat, mempraktikkan teknik eye contact sederhana, serta pulih dengan cepat jika terjadi kesalahan.",
      bernalar_kritis: "Anak membedakan antara tampilan yang baik dan perlu ditingkatkan, menganalisis mengapa beberapa orang lebih percaya diri, memahami pentingnya persiapan sebelum tampil, serta mengevaluasi performa diri dan teman secara konstruktif.",
      sehat_jasmani_dan_rohani: "Anak melakukan teknik pernapasan untuk menenangkan diri, menggunakan postur tubuh yang baik saat tampil, menjaga kesehatan suara dengan cara yang tepat, serta merasakan kepuasan setelah berhasil tampil.",
      warga_negara: "Anak memahami kemampuan berbicara di depan umum sebagai keterampilan penting, berani menyampaikan pendapat dengan sopan, serta berkontribusi dalam diskusi kelas."
    },
    tujuanPembelajaranMendalam: "Melalui kegiatan pembelajaran berbasis pengembangan diri, anak akan:\n1. Memahami konsep kepercayaan diri dan public speaking\n2. Mempraktikkan teknik dasar public speaking (pernapasan, postur, suara)\n3. Menyiapkan dan menyampaikan presentasi singkat dengan percaya diri\n4. Mengatasi rasa takut dan cemas saat tampil di depan umum\n5. Menggunakan bahasa tubuh dan ekspresi yang sesuai\n6. Memberikan dan menerima umpan balik secara konstruktif\n7. Menumbuhkan kebiasaan berani tampil di berbagai kesempatan",
    kerangkaPembelajaran: "Pembelajaran berlangsung selama 2-3 hari (± 6 jam total) dengan pendekatan performance-based learning:\n- Pembelajaran berbasis praktik dan pengalaman langsung\n- Metode scaffolding dari tampil sederhana ke kompleks\n- Pembelajaran kolaboratif melalui dukungan teman sebaya\n- Pembelajaran karakter dan keterampilan sosial\n- Penilaian berbasis performa dan progres\n- Integrasi nilai-nilai keberanian, kejujuran, dan penghargaan\n- Lingkungan belajar yang aman, suportif, dan non-judgmental",
    kegiatanPembelajaran: {
      pendahuluan: "Guru memulai dengan bertanya: 'Siapa di sini yang suka bercerita? Siapa yang pernah bercerita di depan kelas? Bagaimana perasaannya?' Guru menampilkan video anak-anak yang tampil percaya diri (misalnya dalam kontes cerita, pidato, atau pertunjukan). Guru mengajak anak mengamati: 'Apa yang membuat mereka tampak percaya diri? Bagaimana mereka berdiri? Bagaimana suara mereka?' Guru mengatakan: 'Hari ini kita akan belajar menjadi pembicara yang percaya diri! Setiap dari kalian punya kemampuan untuk tampil hebat!'",
      inti: [
        "TEKNIK DASAR: Guru mengajarkan teknik dasar public speaking yang sesuai usia: (1) Berdiri dengan kedua kaki terbuka lebar bahu, (2) Pandang mata pendengar, (3) Gunakan suara yang jelas dan cukup keras, (4) Gunakan tangan untuk gerakan yang wajar, (5) Senyum dan bersikap positif. Anak mempraktikkan setiap teknik satu per satu dengan bimbingan guru.",
        "LATIHAN PERNAPASAN: Guru mengajarkan teknik pernapasan untuk menenangkan diri: tarik napas dalam-dalam selama 4 detik, tahan selama 4 detik, hembuskan selama 4 detik. Anak mempraktikkan bersama-sama. Guru menjelaskan bahwa teknik ini dapat digunakan saat merasa gugup.",
        "SHOW AND TELL: Setiap anak diminta membawa benda atau foto dari rumah yang ingin mereka ceritakan. Satu per satu, anak tampil di depan kelas selama 1-2 menit untuk menceritakan tentang benda tersebut. Guru dan teman memberikan tepuk tangan dan apresiasi setelah setiap penampilan.",
        "CERITA BERSAMA: Anak dibagi menjadi kelompok kecil. Setiap kelompok diberikan gambar sebagai pemicu cerita. Kelompok berdiskusi dan menyusun cerita sederhana. Setiap kelompok memilih satu wakil untuk menceritakan di depan kelas. Guru memberikan umpan balik positif.",
        "MICRO PRESENTASI: Anak menyiapkan presentasi singkat (30-60 detik) tentang topik favorit mereka (hobi, makanan kesukaan, keluarga, dll). Anak berlatih dengan pasangan, kemudian tampil di depan kelas. Guru mencatat kekuatan dan area yang perlu dikembangkan untuk setiap anak.",
        "UMBAL BALIK: Setelah semua anak tampil, guru memimpin diskusi tentang pengalaman mereka. 'Apa yang paling kamu sukai dari tampil di depan? Apa yang paling menantang? Apa yang akan kamu lakukan berbeda next time?' Guru memberikan catatan pribadi dan saran untuk setiap anak."
      ],
      penutup: "Guru mengajak anak duduk melingkar. Guru memuji keberanian setiap anak yang telah tampil, tidak peduli seberapa sempurna penampilannya. Guru memberikan 'Sertifikat Pembicara Cilik' atau 'Bintang Keberanian' kepada setiap anak dengan catatan khusus tentang kekuatan mereka. Guru memimpin doa syukur atas kemampuan yang diberikan Allah dan menutup dengan ajakan: 'Teruslah berlatih dan berani tampil! Kalian semua luar biasa!' Guru dan anak menutup dengan tepuk tangan meriah untuk semua."
    }
  },
  {
    tema: "Membuat Karya Seni Sendiri",
    kelompokUsia: "B",
    topikKBC: "Mandiri dan Kreatif",
    tujuanKBC: "Anak dapat mengekspresikan kreativitas melalui berbagai media seni, membuat karya seni orisinal dengan imajinasi sendiri, mempraktikkan teknik seni dasar yang sesuai usia, serta menumbuhkan rasa bangga dan percaya diri terhadap kemampuan kreatif mereka.",
    tujuanProfilLulusan: {
      beriman_dan_berakhlak_mulia: "Anak bersyukur kepada Allah atas kemampuan kreatif yang diberikan, mengekspresikan keindahan ciptaan Allah melalui seni, serta menggunakan karya seni untuk menyebarkan kebaikan dan keindahan.",
      berkebinekaan_global: "Anak menghargai berbagai gaya seni dari budaya berbeda, memahami bahwa setiap orang memiliki gaya seni yang unik, serta menghormati perbedaan dalam ekspresi artistik.",
      gotong_royong: "Anak berbagi ide dan inspirasi dengan teman, membantu teman yang kesulitan dalam berkarya, memberikan apresiasi dan komentar positif untuk karya teman, serta bekerja sama dalam proyek seni kelompok.",
      mandiri_dan_kreatif: "Anak dapat menghasilkan ide-ide kreatif sendiri, memilih media dan teknik yang sesuai dengan ide mereka, memecahkan masalah yang muncul saat berkarya, menyelesaikan karya dengan mandiri, serta mempresentasikan karya dengan percaya diri.",
      bernalar_kritis: "Anak menganalisis komposisi dan warna dalam karya seni, membedakan berbagai teknik seni dan efeknya, menjelaskan alasan di balik pilihan artistik mereka, serta mengevaluasi karya sendiri dan teman secara konstruktif.",
      sehat_jasmani_dan_rohani: "Anak menggunakan motorik halus saat berkarya (menggambar, melukis, merangkai), menjaga kebersihan saat bekerja dengan cat dan bahan seni, menikmati proses berkarya dengan ketenangan dan kebahagiaan, serta merasakan kepuasan melihat hasil karya.",
      warga_negara: "Anak memahami seni sebagai bagian dari budaya bangsa, bangga dengan karya seni Indonesia, serta menyadari peran seni dalam kehidupan masyarakat."
    },
    tujuanPembelajaranMendalam: "Melalui kegiatan pembelajaran berbasis seni dan kreativitas, anak akan:\n1. Mengekspresikan ide dan imajinasi melalui berbagai media seni\n2. Mempraktikkan teknik seni dasar (menggambar, melukis, kolase, origami)\n3. Membuat karya seni orisinal dengan gaya sendiri\n4. Memecahkan masalah kreatif yang muncul saat berkarya\n5. Menjelaskan karya seni mereka dengan kata-kata sendiri\n6. Memberikan dan menerima apresiasi terhadap karya seni\n7. Menumbuhkan rasa bangga dan percaya diri terhadap kemampuan kreatif",
    kerangkaPembelajaran: "Pembelajaran berlangsung selama 2-3 hari (± 6 jam total) dengan pendekatan arts-based learning:\n- Pembelajaran berbasis eksplorasi dan ekspresi artistik\n- Metode open-ended art activities\n- Pembelajaran individual dan kolaboratif\n- Pembelajaran lintas mata pelajaran (seni, bahasa, matematika)\n- Penilaian berbasis proses dan produk kreatif\n- Integrasi nilai-nilai kreativitas, kebebasan berekspresi, dan apresiasi\n- Lingkungan belajar yang kaya warna, inspiratif, dan non-judgmental",
    kegiatanPembelajaran: {
      pendahuluan: "Guru memulai dengan memamerkan berbagai karya seni anak (lukisan, kolase, origami, patung tanah liat). Guru bertanya: 'Karya mana yang paling kamu suka? Mengapa? Apa yang kamu lihat dari karya ini?' Guru menampilkan karya seni terkenal yang sesuai usia anak (karya seniman anak, ilustrasi buku anak). Guru mengatakan: 'Setiap orang bisa membuat karya seni yang indah! Hari ini kalian akan menjadi seniman cilik dan membuat karya seni kalian sendiri!'",
      inti: [
        "EKSPLORASI MEDIA: Guru menyediakan berbagai media seni (krayon, cat air, cat minyak, pastel, kertas warna, kertas bekas, tanah liat, bahan alam seperti daun dan batu). Anak diajak mengeksplorasi setiap media: mencoba menggambar dengan berbagai alat, mencampur warna, merasakan tekstur berbagai bahan. Guru memfasilitasi eksplorasi dan menjawab pertanyaan anak.",
        "TEKNIK DASAR: Guru mendemonstrasikan teknik dasar seni: (1) Menggambar garis dan bentuk, (2) Mencampur warna primer untuk membuat warna sekunder, (3) Membuat kolase dengan menempel kertas, (4) Melukis dengan kuas dan spons. Anak mempraktikkan setiap teknik dengan bimbingan guru.",
        "PROYEK BEBAS: Guru memberikan kebebasan kepada anak untuk membuat karya seni orisinal mereka sendiri. Anak dapat memilih media dan teknik yang mereka sukai. Satu-satunya aturan adalah: karya harus 100% ide dan eksekusi anak sendiri. Guru berkeliling memberikan dukungan, bukan arahan, dan mengajukan pertanyaan pemicu: 'Ceritakan tentang karyamu', 'Apa yang kamu coba ekspresikan?'",
        "KESEMPATAN BERKARYA: Anak diberikan waktu yang cukup untuk berkarya tanpa terburu-buru. Guru mengobservasi proses kreatif anak, mencatat teknik yang digunakan, dan memberikan dukungan individual sesuai kebutuhan.",
        "PERSIAPAN PRESENTASI: Setelah selesai berkarya, anak menyiapkan diri untuk mempresentasikan karya mereka. Guru membantu anak memikirkan kata-kata untuk menjelaskan karya mereka.",
        "PRESENTASI KARYA: Setiap anak mempresentasikan karya seni mereka di depan kelas. Anak menjelaskan: 'Ini adalah karya saya tentang [topik]. Saya menggunakan [media/teknik]. Saya senang dengan [bagian dari karya].' Teman-teman memberikan apresiasi dengan tepuk tangan dan komentar positif."
      ],
      penutup: "Guru mengajak anak berkumpul dan memamerkan semua karya mereka sebagai 'Pameran Seni Kelas'. Setiap anak berjalan mengelilingi kelas untuk melihat karya teman-teman. Guru memimpin diskusi refleksi: 'Karya mana yang paling kamu kagumi? Apa yang kamu pelajari dari kegiatan hari ini? Bagaimana perasaanmu setelah membuat karya seni sendiri?' Anak berbagi refleksi. Guru memberikan 'Sertifikat Seniman Cilik' atau 'Bintang Kreativitas' kepada setiap anak. Guru memimpin doa syukur atas kemampuan kreatif yang diberikan Allah dan menutup dengan ajakan untuk terus berkarya dan mengekspresikan diri."
    }
  },
  {
    tema: "Mengelola Keuangan Cilik (Tabung, Belanja, Bagi)",
    kelompokUsia: "B",
    topikKBC: "Mandiri dan Kreatif",
    tujuanKBC: "Anak dapat memahami konsep dasar uang, membedakan kebutuhan dan keinginan, mempraktikkan cara menabung, belanja dengan bijak, dan berbagi (sedekah) secara sederhana, serta menumbuhkan sikap tanggung jawab dan kepedulian terhadap pengelolaan keuangan sejak dini.",
    tujuanProfilLulusan: {
      beriman_dan_berakhlak_mulia: "Anak memahami bahwa uang adalah amanah dari Allah, bersyukur atas rezeki yang diberikan, serta belajar berbagi (sedekah) sebagai bentuk kasih sayang kepada sesama.",
      berkebinekaan_global: "Anak memahami bahwa setiap negara memiliki mata uang yang berbeda, menghargai perbedaan ekonomi antar keluarga, serta menghormati teman yang memiliki kondisi ekonomi berbeda.",
      gotong_royong: "Anak berbagi uang jajan atau barang dengan teman yang membutuhkan, bekerja sama dalam kegiatan jual beli permainan, saling mengingatkan untuk menabung, serta membantu teman mengatur pengeluaran.",
      mandiri_dan_kreatif: "Anak dapat membedakan kebutuhan dan keinginan, membuat rencana pengeluaran sederhana, menabung secara konsisten di celengan, mencari cara kreatif untuk menambah tabungan, serta menghitung uang sederhana.",
      bernalar_kritis: "Anak membedakan berbagai jenis uang dan nilainya, memahami konsep harga dan nilai tukar, menganalisis manfaat menabung versus membelanjakan, serta membuat keputusan bijak dalam berbelanja.",
      sehat_jasmani_dan_rohani: "Anak menjaga keseimbangan antara menabung dan menggunakan uang untuk kebutuhan, tidak terlalu kikir atau terlalu boros, merasakan kebahagiaan saat berbagi, serta menjaga hati dari sifat tamak.",
      warga_negara: "Anak memahami peran uang dalam kehidupan ekonomi, menghargai usaha orang tua dalam mencari nafkah, serta menyadari pentingnya literasi keuangan untuk masa depan."
    },
    tujuanPembelajaranMendalam: "Melalui kegiatan pembelajaran berbasis literasi keuangan, anak akan:\n1. Mengenal berbagai jenis uang dan membedakan nilainya\n2. Memahami konsep kebutuhan dan keinginan\n3. Menyusun rencana pengeluaran sederhana (tabung, belanja, bagi)\n4. Mempraktikkan cara menabung dengan konsisten\n5. Menjelaskan manfaat menabung dan berbagi\n6. Menghitung uang sederhana dan membuat transaksi\n7. Menunjukkan sikap tanggung jawab dalam pengelolaan uang",
    kerangkaPembelajaran: "Pembelajaran berlangsung selama 2-3 hari (± 6 jam total) dengan pendekatan financial literacy education:\n- Pembelajaran berbasis pengalaman nyata dengan uang\n- Metode simulasi dan role playing\n- Pembelajaran kolaboratif melalui permainan ekonomi\n- Pembelajaran lintas mata pelajaran (matematika, PKn, agama)\n- Penilaian berbasis kinerja dan kebiasaan\n- Integrasi nilai-nilai tanggung jawab, kebijaksanaan, dan kepedulian\n- Lingkungan belajar yang praktis dan bermakna",
    kegiatanPembelajaran: {
      pendahuluan: "Guru memulai dengan menampilkan uang kertas dan koin (asli atau mainan). Guru bertanya: 'Apa ini? Apa fungsinya? Dari mana uang berasal? Apa yang bisa kita lakukan dengan uang?' Guru menampilkan gambar berbagai barang (mainan, makanan, pakaian, buku). Guru bertanya: 'Mana yang paling kamu inginkan? Mana yang benar-benar kamu butuhkan?' Guru memperkenalkan tema: 'Hari ini kita akan belajar mengelola uang dengan bijak! Uang bukan untuk dibelanjakan semua, tetapi untuk ditabung dan dibagikan juga!'",
      inti: [
        "PENGENALAN UANG: Guru menampilkan berbagai jenis uang (kertas dan koin) dengan berbagai nilai. Anak mengamati, menyebutkan, dan membedakan nilai uang tersebut. Guru menjelaskan bahwa uang digunakan untuk menukar barang dan jasa.",
        "KEBUTUHAN VS KEINGINAN: Guru menjelaskan perbedaan kebutuhan (makanan, air, pakaian, tempat tinggal) dan keinginan (mainan, permen, hobi). Anak berdiskusi dan mengelompokkan berbagai barang yang ditampilkan ke dalam kategori kebutuhan atau keinginan.",
        "KONSEP TABUNG, BELANJA, BAGI: Guru memperkenalkan konsep 3T: Tabung (sisihkan sebagian uang), Belanja (gunakan untuk kebutuhan penting), Bagi (berikan sebagian untuk orang yang membutuhkan). Anak membuat 3 celengan atau tas terpisah untuk masing-masing kategori.",
        "PRAKTIK MENGHITUNG: Guru mendemonstrasikan cara menghitung uang sederhana (menjumlahkan koin, menghitung kertas uang). Anak berlatih menghitung dengan uang mainan. Anak juga berlatih membuat transaksi sederhana (membeli dengan uang yang tepat).",
        "SIMULASI BELANJA: Guru mengadakan 'Toko Mini' di kelas. Anak mendapatkan uang mainan dan harus berbelanja barang-barang yang ada di toko. Anak harus mempertimbangkan kebutuhan dan keinginan, menghitung total belanja, dan membayar dengan uang yang tepat.",
        "KEGIATAN BERBAGI: Guru menjelaskan konsep sedekah dan berbagi. Anak berdiskusi tentang siapa yang bisa mereka bantu. Anak memasukkan sebagian uang ke celengan 'Bagi' untuk donasi (misalnya untuk anak yatim atau lingkungan)."
      ],
      penutup: "Guru mengajak anak duduk melingkar dan memimpin diskusi refleksi: 'Apa yang paling kamu pelajari tentang uang hari ini? Mengapa penting menabung? Bagaimana perasaanmu saat berbagi dengan orang lain?' Setiap anak berbagi rencana mereka untuk menabung dan berbagi ke depan. Guru memberikan 'Sertifikat Pengelola Uang Cilik' atau 'Bintang Keuangan' kepada setiap anak. Guru memimpin doa syukur atas rezeki yang diberikan Allah dan memohon agar selalu diberikan kebijaksanaan dalam mengelola keuangan. Guru menutup dengan ajakan: 'Teruslah menabung, belanjalah dengan bijak, dan berbagilah dengan orang yang membutuhkan!'"
    }
  },
  {
    tema: "Eksperimen Sains Sederhana",
    kelompokUsia: "B",
    topikKBC: "Bernalar Kritis",
    tujuanKBC: "Anak dapat mengembangkan rasa ingin tahu dan kemampuan berpikir kritis melalui eksperimen sains sederhana, mempraktikkan langkah-langkah metode ilmiah dasar (observasi, hipotesis, eksperimen, kesimpulan), memahami konsep-konsep sains dasar melalui praktik langsung, serta menumbuhkan minat terhadap ilmu pengetahuan.",
    tujuanProfilLulusan: {
      beriman_dan_berakhlak_mulia: "Anak bersyukur kepada Allah atas keindahan dan keajaiban ciptaan-Nya, memahami bahwa ilmu pengetahuan adalah jalan untuk mengenal Allah lebih dekat, serta menggunakan ilmu untuk kebaikan.",
      berkebinekaan_global: "Anak memahami bahwa sains menghubungkan kita dengan alam semesta, menghargai temuan ilmiah dari berbagai budaya, serta menghormati pendapat ilmiah yang berbeda.",
      gotong_royong: "Anak bekerja sama dalam kelompok untuk melakukan eksperimen, membagi peran (pemimpin, pencatat, pelaksana, penyaji), membantu teman yang kesulitan, serta berdiskusi hasil eksperimen bersama.",
      mandiri_dan_kreatif: "Anak dapat merumuskan pertanyaan ilmiah sendiri, merancang eksperimen sederhana, mencatat hasil observasi dengan sistematis, menarik kesimpulan dari data, serta mengkomunikasikan temuan secara jelas.",
      bernalar_kritis: "Anak membedakan fakta dan opini, menganalisis hubungan sebab-akibat dalam eksperimen, membandingkan hasil eksperimen dengan hipotesis awal, serta mengajukan pertanyaan lanjutan untuk eksperimen berikutnya.",
      sehat_jasmani_dan_rohani: "Anak menjaga keselamatan saat melakukan eksperimen (memakai alat pelindung jika diperlukan), menggunakan motorik halus dan kasar saat menangani alat, bernapas dengan benar saat fokus, serta merasakan kegembiraan saat menemukan sesuatu yang baru.",
      warga_negara: "Anak memahami pentingnya ilmu pengetahuan bagi kemajuan bangsa, menghargai kontribusi ilmuwan Indonesia, serta menyadari peran sains dalam kehidupan sehari-hari."
    },
    tujuanPembelajaranMendalam: "Melalui kegiatan pembelajaran berbasis inkuiri sains, anak akan:\n1. Mengenal dan mempraktikkan langkah-langkah metode ilmiah dasar\n2. Merumuskan pertanyaan ilmiah dan hipotesis sederhana\n3. Melakukan eksperimen sains dengan alat dan bahan yang aman\n4. Mengamati dan mencatat hasil eksperimen secara sistematis\n5. Menganalisis data dan menarik kesimpulan dari eksperimen\n6. Mengkomunikasikan temuan ilmiah dengan cara yang sederhana\n7. Menumbuhkan rasa ingin tahu dan minat terhadap sains",
    kerangkaPembelajaran: "Pembelajaran berlangsung selama 2-3 hari (± 6 jam total) dengan pendekatan inquiry-based science education:\n- Pembelajaran berbasis pertanyaan dan eksplorasi\n- Metode hands-on dan minds-on\n- Pembelajaran kolaboratif melalui kerja kelompok ilmiah\n- Pembelajaran lintas mata pelajaran (IPA, matematika, bahasa)\n- Penilaian berbasis proses ilmiah dan temuan\n- Integrasi nilai-nilai kejujuran, ketelitian, dan kekaguman\n- Lingkungan belajar yang merangsang rasa ingin tahu",
    kegiatanPembelajaran: {
      pendahuluan: "Guru memulai dengan menunjukkan eksperimen menarik sederhana (misalnya: membuat gunung berapi dari soda dan baking soda, atau membuat air berwarna dengan kubis). Guru bertanya: 'Wah, apa yang terjadi? Mengapa bisa begitu? Apa yang kalian ingin ketahui lebih lanjut?' Guru menampilkan gambar-gambar ilmuwan dan penemuan sains. Guru mengatakan: 'Hari ini kalian akan menjadi ilmuwan cilik dan melakukan eksperimen sendiri! Siapa yang mau mencoba?'",
      inti: [
        "PENGENALAN METODE ILMIAH: Guru menjelaskan langkah-langkah metode ilmiah sederhana: (1) Bertanya, (2) Membuat Hipotesis (tebakan cerdas), (3) Melakukan Eksperimen, (4) Mengamati, (5) Menarik Kesimpulan. Guru memberikan contoh sederhana untuk setiap langkah.",
        "EKSPLORASI PERTANYAAN: Guru dan anak bersama-sama mengidentifikasi pertanyaan ilmiah yang menarik (misalnya: 'Apakah semua benda mengapung di air?', 'Bagaimana tumbuhan bisa minum air?', 'Mengapa langit berwarna biru?'). Anak memilih pertanyaan yang ingin mereka eksplorasi.",
        "PERENCANAAN EKSPERIMEN: Anak bekerja dalam kelompok untuk merancang eksperimen sederhana yang menjawab pertanyaan mereka. Guru memfasilitasi diskusi dan membantu anak menentukan alat, bahan, dan langkah-langkah eksperimen yang aman.",
        "PELAKSANAAN EKSPERIMEN: Anak melakukan eksperimen dengan bimbingan guru. Guru memastikan keselamatan anak dan memberikan bantuan jika diperlukan. Anak mengamati dengan teliti dan mencatat apa yang terjadi.",
        "PENGAMATAN DAN PENCATATAN: Anak mencatat hasil eksperimen dalam jurnal sains sederhana (menggambar, menulis kata-kata, atau mendiktekan kepada guru). Anak membandingkan hasil eksperimen dengan hipotesis awal mereka.",
        "ANALISIS DAN KESIMPULAN: Anak berdiskusi dalam kelompok tentang apa yang mereka pelajari dari eksperimen. Setiap kelompok menarik kesimpulan sederhana dari hasil eksperimen mereka. Anak mengkomunikasikan temuan mereka kepada kelas."
      ],
      penutup: "Guru mengajak anak berkumpul dan memamerkan hasil eksperimen mereka. Setiap kelompok mempresentasikan: 'Pertanyaan kami adalah..., Hipotesis kami adalah..., Yang kami lakukan adalah..., Yang kami temukan adalah..., Kesimpulannya adalah...' Teman-teman memberikan tepuk tangan dan mengajukan pertanyaan. Guru memberikan 'Sertifikat Ilmuwan Cilik' atau 'Bintang Sains' kepada setiap anak. Guru memimpin doa syukur atas keindahan ilmu pengetahuan dan keajaiban ciptaan Allah. Guru menutup dengan ajakan: 'Teruslah bertanya, bereksperimen, dan belajar! Kalian semua adalah ilmuwan masa depan!'"
    }
  },
  {
    tema: "Memecahkan Masalah Sehari-hari",
    kelompokUsia: "B",
    topikKBC: "Bernalar Kritis",
    tujuanKBC: "Anak dapat mengembangkan kemampuan berpikir kritis dan keterampilan memecahkan masalah melalui situasi nyata, mempraktikkan langkah-langkah pemecahan masalah (identifikasi, brainstorming solusi, evaluasi, implementasi), membedakan solusi yang baik dan kurang baik, serta menumbuhkan sikap tanggung jawab dan kepercayaan diri dalam menghadapi tantangan.",
    tujuanProfilLulusan: {
      beriman_dan_berakhlak_mulia: "Anak berdoa dan bertawakal kepada Allah saat menghadapi masalah, memahami bahwa setiap masalah ada hikmahnya, serta memecahkan masalah dengan cara yang baik dan benar.",
      berkebinekaan_global: "Anak memahami bahwa setiap budaya memiliki cara berbeda dalam memecahkan masalah, menghargai solusi yang ditawarkan teman dari latar belakang berbeda, serta belajar dari pengalaman orang lain.",
      gotong_royong: "Anak bekerja sama dalam kelompok untuk memecahkan masalah, mendengarkan pendapat teman dengan hormat, berbagi ide solusi, membantu teman yang kesulitan, serta merayakan keberhasilan bersama.",
      mandiri_dan_kreatif: "Anak dapat mengidentifikasi masalah secara mandiri, merumuskan solusi kreatif, membuat rencana tindakan, melaksanakan solusi dengan percaya diri, serta mengevaluasi hasil dan belajar dari pengalaman.",
      bernalar_kritis: "Anak menganalisis penyebab masalah secara logis, membandingkan berbagai solusi yang mungkin, mengevaluasi konsekuensi setiap solusi, memilih solusi terbaik, serta refleksi terhadap proses pemecahan masalah.",
      sehat_jasmani_dan_rohani: "Anak mengelola emosi saat menghadapi masalah, menggunakan teknik relaksasi jika merasa stres, menjaga keseimbangan antara berpikir dan bertindak, serta merasakan kepuasan setelah berhasil memecahkan masalah.",
      warga_negara: "Anak memahami kemampuan memecahkan masalah sebagai keterampilan penting, berani menghadapi tantangan, serta berkontribusi dalam memecahkan masalah di lingkungan sekitar."
    },
    tujuanPembelajaranMendalam: "Melalui kegiatan pembelajaran berbasis pemecahan masalah, anak akan:\n1. Mengidentifikasi masalah dengan jelas dan spesifik\n2. Menerapkan langkah-langkah pemecahan masalah secara sistematis\n3. Mencari dan mengevaluasi berbagai solusi yang mungkin\n4. Memilih dan melaksanakan solusi terbaik\n5. Mengevaluasi hasil dan belajar dari pengalaman\n6. Menunjukkan sikap tanggung jawab dan kepercayaan diri\n7. Mengembangkan kemampuan berpikir kritis dan kreatif",
    kerangkaPembelajaran: "Pembelajaran berlangsung selama 2-3 hari (± 6 jam total) dengan pendekatan problem-based learning:\n- Pembelajaran berbasis masalah nyata dan kontekstual\n- Metode inkuiri dan eksplorasi solusi\n- Pembelajaran kolaboratif melalui diskusi dan kerja kelompok\n- Pembelajaran karakter dan keterampilan berpikir\n- Penilaian berbasis proses dan solusi\n- Integrasi nilai-nilai ketekunan, keberanian, dan kerja sama\n- Lingkungan belajar yang menantang dan suportif",
    kegiatanPembelajaran: {
      pendahuluan: "Guru memulai dengan bertanya: 'Pernahkah kalian menghadapi masalah? Apa itu? Apa yang kalian lakukan?' Guru menceritakan kisah tentang anak yang menghadapi masalah dan berhasil memecahkannya. Guru menampilkan gambar-gambar situasi bermasalah (mainan rusak, kehilangan barang, teman bertengkar, tidak bisa mengerjakan tugas). Guru bertanya: 'Masalah apa yang kalian lihat? Apa yang bisa dilakukan?' Guru memperkenalkan tema: 'Hari ini kita akan belajar menjadi pemecah masalah yang hebat! Setiap masalah pasti ada solusinya!'",
      inti: [
        "PENGENALAN LANGKAH PEMECAHAN MASALAH: Guru menjelaskan 5 langkah pemecahan masalah: (1) Identifikasi Masalah - Apa masalahnya?, (2) Brainstorming Solusi - Apa solusinya?, (3) Evaluasi Solusi - Solusi mana yang terbaik?, (4) Implementasi - Bagaimana melaksanakannya?, (5) Evaluasi Hasil - Apakah berhasil?",
        "PRAKTIK IDENTIFIKASI: Guru menampilkan berbagai skenario masalah. Anak berlatih mengidentifikasi masalah dengan jelas dan spesifik. Contoh: 'Anak tidak bisa menemukan mainan favoritnya' → Masalah: Anak kehilangan mainan.",
        "BRAINSTORMING SOLUSI: Anak dibagi menjadi kelompok kecil. Setiap kelompok mendapat satu masalah dan harus menghasilkan minimal 3-5 solusi berbeda. Anak didorong untuk berpikir kreatif dan tidak menghakimi solusi apa pun pada tahap ini.",
        "EVALUASI SOLUSI: Setiap kelompok mengevaluasi solusi-solusi yang mereka hasilkan. Guru memberikan kriteria: Apakah solusi ini aman? Apakah bisa dilakukan? Apakah adil? Apakah efektif? Anak memilih solusi terbaik berdasarkan kriteria tersebut.",
        "IMPLEMENTASI SOLUSI: Anak berlatih melaksanakan solusi yang telah dipilih melalui role playing atau simulasi. Guru berkeliling memberikan bimbingan dan mencatat strategi yang digunakan anak.",
        "REFLEKSI PROSES: Setelah melaksanakan solusi, anak merefleksikan: Apakah solusinya berhasil? Apa yang bisa diperbaiki? Apa yang dipelajari dari pengalaman ini? Anak berbagi pengalaman dan belajar satu sama lain."
      ],
      penutup: "Guru mengajak anak duduk melingkar dan memimpin diskusi refleksi: 'Masalah apa yang kalian hadapi hari ini? Solusi apa yang kalian pilih? Bagaimana rasanya memecahkan masalah sendiri?' Anak berbagi pengalaman dan perasaan mereka. Guru memberikan 'Sertifikat Pemecah Masalah' atau 'Bintang Pemikir' kepada setiap anak. Guru memimpin doa agar selalu diberikan hikmah dan kemampuan dalam menghadapi setiap masalah. Guru menutup dengan ajakan: 'Teruslah berpikir kritis dan berani menghadapi setiap tantangan! Kalian semua mampu memecahkan masalah!'"
    }
  },
  {
    tema: "Mengajukan Pertanyaan yang Baik",
    kelompokUsia: "B",
    topikKBC: "Bernalar Kritis",
    tujuanKBC: "Anak dapat mengembangkan rasa ingin tahu dan kemampuan bertanya yang baik, membedakan berbagai jenis pertanyaan (fakta, opini, perasaan), mempraktikkan cara mengajukan pertanyaan yang jelas dan spesifik, serta memahami bahwa pertanyaan adalah kunci untuk belajar dan mengembangkan pemahaman.",
    tujuanProfilLulusan: {
      beriman_dan_berakhlak_mulia: "Anak bertanya dengan niat baik untuk mencari kebenaran, memahami bahwa bertanya adalah cara mengenal Allah dan ciptaan-Nya, serta menghormati orang yang ditanyai dengan sopan.",
      berkebinekaan_global: "Anak memahami bahwa setiap budaya memiliki cara berbeda dalam bertanya, menghargai pertanyaan dari teman dengan latar belakang berbeda, serta belajar dari berbagai perspektif.",
      gotong_royong: "Anak mendengarkan pertanyaan teman dengan hormat, membantu menjawab pertanyaan teman, saling mengingatkan untuk bertanya dengan sopan, serta berkolaborasi dalam mencari jawaban.",
      mandiri_dan_kreatif: "Anak dapat mengidentifikasi apa yang ingin mereka ketahui, merumuskan pertanyaan yang jelas, mencari jawabannya sendiri, mengajukan pertanyaan lanjutan, serta bertanggung jawab atas rasa ingin tahu mereka.",
      bernalar_kritis: "Anak membedakan pertanyaan yang baik dan kurang baik, menganalisis struktur pertanyaan (siapa, apa, di mana, kapan, mengapa, bagaimana), mengevaluasi apakah pertanyaan relevan, serta menghubungkan pertanyaan dengan konteks.",
      sehat_jasmani_dan_rohani: "Anak menjaga sikap sopan saat bertanya, menggunakan bahasa tubuh yang baik, menunggu giliran bertanya, serta merasakan kepuasan saat mendapatkan jawaban yang memuaskan.",
      warga_negara: "Anak memahami pentingnya bertanya dalam demokrasi, berani menyampaikan pertanyaan dengan sopan, serta berkontribusi dalam diskusi dan dialog."
    },
    tujuanPembelajaranMendalam: "Melalui kegiatan pembelajaran berbasis inkuiri, anak akan:\n1. Mengenal berbagai jenis pertanyaan (fakta, opini, perasaan)\n2. Merumuskan pertanyaan yang jelas, spesifik, dan relevan\n3. Menggunakan kata tanya (siapa, apa, di mana, kakah, mengapa, bagaimana) dengan tepat\n4. Mempraktikkan cara mengajukan pertanyaan dengan sopan\n5. Membedakan pertanyaan yang mendalam dan dangkal\n6. Mengembangkan kebiasaan bertanya aktif dalam pembelajaran\n7. Menghargai pertanyaan sebagai kunci pembelajaran",
    kerangkaPembelajaran: "Pembelajaran berlangsung selama 2-3 hari (± 6 jam total) dengan pendekatan inquiry-based learning:\n- Pembelajaran berbasis rasa ingin tahu dan eksplorasi\n- Metode Socratic questioning\n- Pembelajaran kolaboratif melalui diskusi dan tanya jawab\n- Pembelajaran karakter dan keterampilan komunikasi\n- Penilaian berbasis kualitas pertanyaan dan partisipasi\n- Integrasi nilai-nilai kejujuran, hormat, dan rasa ingin tahu\n- Lingkungan belajar yang merangsang dan menghargai pertanyaan",
    kegiatanPembelajaran: {
      pendahuluan: "Guru memulai dengan memunculkan rasa ingin tahu. Guru menampilkan kotak misterius dan bertanya: 'Apa yang ada di dalam kotak ini? Siapa yang ingin tahu?' Guru mengizinkan beberapa anak menebak. Setelah semua menebak, guru membuka kotak dan menunjukkan isinya. Guru bertanya: 'Mengapa kalian ingin tahu isinya? Apa yang kalian rasakan ketika bertanya?' Guru memperkenalkan tema: 'Pertanyaan adalah kunci untuk belajar! Hari ini kita akan belajar mengajukan pertanyaan yang hebat!'",
      inti: [
        "PENGENALAN JENIS PERTANYAAN: Guru menjelaskan 3 jenis pertanyaan: (1) Pertanyaan Fakta - bisa dibuktikan, (2) Pertanyaan Opini - pendapat pribadi, (3) Pertanyaan Perasaan - tentang emosi. Guru memberikan contoh untuk setiap jenis dan meminta anak mengidentifikasi jenisnya.",
        "KATA TANYA 5W1H: Guru memperkenalkan kata tanya dasar: Siapa (Who), Apa (What), Di mana (Where), Kapan (When), Mengapa (Why), Bagaimana (How). Anak berlatih membuat pertanyaan menggunakan setiap kata tanya tentang topik yang diberikan guru.",
        "PRAKTIK BERTANYA: Anak berpasangan dan saling bertanya tentang berbagai topik (hobi, keluarga, makanan favorit, dll). Satu anak bertanya, yang lain menjawab, kemudian berganti peran. Guru berkeliling memberikan bimbingan.",
        "GAME 'TEBAK PERTANYAAN': Guru menampilkan gambar atau benda, dan anak harus mengajukan pertanyaan yang baik untuk menebak atau mengetahui lebih banyak tentang gambar/benda tersebut. Guru memberikan poin untuk pertanyaan yang jelas dan relevan.",
        "PENINGKATAN PERTANYAAN: Guru menampilkan beberapa pertanyaan yang kurang baik (terlalu umum, tidak jelas, tidak relevan) dan mengajak anak bersama-sama meningkatkan pertanyaan tersebut menjadi pertanyaan yang lebih baik dan lebih spesifik.",
        "FORUM PERTANYAAN: Anak mengajukan pertanyaan yang mereka punya tentang topik yang sedang atau akan mereka pelajari. Guru dan anak bersama-sama mencatat pertanyaan-pertanyaan ini dan membahas mana yang akan dijawab hari ini."
      ],
      penutup: "Guru mengajak anak duduk melingkar dan memimpin diskusi refleksi: 'Pertanyaan apa yang paling kamu suka buat hari ini? Mengapa penting bertanya? Apa yang kamu pelajari tentang cara bertanya yang baik?' Anak berbagi pengalaman. Guru memberikan 'Sertifikat Penanya Hebat' atau 'Bintang Ingin Tahu' kepada setiap anak. Guru memimpin doa agar selalu diberikan hikmah dan kemampuan untuk mencari kebenaran. Guru menutup dengan ajakan: 'Teruslah bertanya! Setiap pertanyaan membawa kalian menuju pemahaman yang lebih baik!'"
    }
  }
]

// === TEMPLATES DARI FILE 15-TEMPLATES (materiIntegrasiKBC dan tujuanPembelajaran) ===
const templatesWithFields = [
  {
    tema: "Diriku yang Berharga",
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan konsep cinta diri melalui berbagai aktivitas yang menekankan pada pengenalan diri, penerimaan diri, dan pengembangan potensi diri. Anak belajar mengenal bagian-bagian tubuh melalui lagu, permainan, dan cerita yang menyenangkan. Anak juga diajak untuk berdiskusi tentang perasaan, emosi, dan cara mengelolanya dengan sehat. Melalui kegiatan seni dan kreatif, anak mengekspresikan identitas dan kepribadiannya yang unik. Nilai-nilai keagamaan diintegrasikan melalui cerita-cerita tentang penciptaan manusia, keunikan setiap individu, dan pentingnya bersyukur kepada Tuhan atas nikmat yang diberikan.",
    tujuanPembelajaran: "Melalui pembelajaran tema 'Diriku yang Berharga', anak diharapkan dapat mengenal dan menerima diri sendiri sebagai ciptaan Tuhan yang berharga dan unik, membangun rasa percaya diri yang sehat, serta mengembangkan potensi dan kemampuan yang dimiliki secara optimal. Anak juga belajar untuk mencintai dan menghargai diri sendiri dengan cara menjaga kesehatan, kebersihan, dan menjalankan ibadah dengan ikhlas sebagai bentuk rasa syukur kepada Tuhan."
  },
  {
    tema: "Tubuhku yang Sehat",
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan konsep cinta diri dan kesehatan tubuh. Anak belajar mengenal bagian-bagian tubuh melalui lagu, permainan, dan praktik langsung. Anak juga mempelajari tentang makanan sehat melalui aktivitas memasak sederhana, mencoba berbagai makanan, dan membuat poster makanan sehat. Pentingnya olahraga diajarkan melalui aktivitas fisik yang menyenangkan seperti senam, permainan lari, dan tarian. Nilai-nilai keagamaan diintegrasikan melalui doa sebelum makan, syukur atas nikmat kesehatan, dan memahami bahwa tubuh adalah amanah Tuhan.",
    tujuanPembelajaran: "Melalui pembelajaran tema 'Tubuhku yang Sehat', anak diharapkan dapat mengenal dan memahami pentingnya menjaga kesehatan tubuh sebagai bentuk cinta diri, menerapkan perilaku hidup sehat dalam kehidupan sehari-hari, serta bersyukur kepada Tuhan atas anugerah kesehatan yang diberikan."
  },
  {
    tema: "Keluargaku yang Sayang",
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan konsep cinta keluarga melalui cerita, permainan, dan aktivitas kreatif. Anak belajar tentang struktur keluarga, peran anggota keluarga, dan cara membangun hubungan yang harmonis. Nilai-nilai keagamaan diintegrasikan melalui cerita tentang keluarga teladan, doa untuk keluarga, dan pentingnya beribadah bersama keluarga.",
    tujuanPembelajaran: "Melalui pembelajaran tema 'Keluargaku yang Sayang', anak diharapkan dapat memahami dan menghargai keluarga, membangun hubungan yang penuh kasih sayang, serta bersyukur kepada Tuhan atas keluarga yang diberikan."
  },
  {
    tema: "Teman-temanku yang Baik",
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan konsep persahabatan melalui permainan kolaboratif, diskusi, dan aktivitas bersama.",
    tujuanPembelajaran: "Anak dapat membangun persahabatan yang sehat dan saling menghargai."
  },
  {
    tema: "Alam Semesta yang Indah",
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan observasi langsung alam, eksperimen sederhana, dan aktivitas seni.",
    tujuanPembelajaran: "Anak dapat mengenal dan menghargai keindahan alam semesta."
  },
  {
    tema: "Tanaman dan Bunga",
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan kegiatan menanam, merawat tanaman, dan mengamati pertumbuhan.",
    tujuanPembelajaran: "Anak dapat mengenal berbagai jenis tanaman dan cara merawatnya."
  },
  {
    tema: "Hewan Peliharaanku",
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan pengenalan hewan, cara merawat hewan, dan empati terhadap makhluk hidup.",
    tujuanPembelajaran: "Anak dapat mengenal dan merawat hewan peliharaan dengan baik."
  },
  {
    tema: "Angka dan Berhitung",
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan permainan berhitung, aktivitas matematika praktis, dan pemecahan masalah.",
    tujuanPembelajaran: "Anak dapat mengenal angka dan melakukan berhitung sederhana."
  },
  {
    tema: "Huruf dan Membaca",
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan permainan huruf, pengenalan suara huruf, dan aktivitas membaca sederhana.",
    tujuanPembelajaran: "Anak dapat mengenal huruf dan membaca kata-kata sederhana."
  },
  {
    tema: "Sains dan Eksperimen",
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan eksperimen sains, observasi fenomena alam, dan inkuiri ilmiah.",
    tujuanPembelajaran: "Anak dapat melakukan eksperimen sains sederhana dan memahami konsep dasar ilmu pengetahuan."
  },
  {
    tema: "Masjid Tempat Ibadah",
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan pengenalan masjid, adab masjid, dan pentingnya beribadah.",
    tujuanPembelajaran: "Anak dapat mengenal masjid sebagai tempat ibadah dan mempraktikkan adab masjid."
  },
  {
    tema: "Rasul-rasul Allah",
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan kisah-kisah para rasul, teladan mereka, dan nilai-nilai yang diajarkan.",
    tujuanPembelajaran: "Anak dapat mengenal para rasul Allah dan meneladani perilaku mereka."
  },
  {
    tema: "Al-Quran Kitab Suci",
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan pengenalan Al-Quran, cara membaca Al-Quran, dan makna ayat-ayat pendek.",
    tujuanPembelajaran: "Anak dapat mengenal Al-Quran sebagai kitab suci dan memahami makna ayat-ayat pendek."
  },
  {
    tema: "Adab dan Akhlak Mulia",
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan contoh-contoh adab dan akhlak mulia, praktik langsung, dan penguatan karakter.",
    tujuanPembelajaran: "Anak dapat mempraktikkan adab dan akhlak mulia dalam kehidupan sehari-hari."
  },
  {
    tema: "Indonesia Pusaka",
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan pengenalan budaya Indonesia, geografi, dan sejarah sederhana.",
    tujuanPembelajaran: "Anak dapat mengenal dan mencintai budaya dan kekayaan Indonesia."
  }
]

// === MAPPING PROFIL LULUSAN BERDASARKAN TOPIK KBC ===
const profilLulusanMapping: Record<string, string> = {
  "Beriman dan Berakhlak Mulia": "Beriman dan Berakhlak Mulia, Berkebinekaan Global, Gotong Royong, Mandiri dan Kreatif, Bernalar Kritis, Sehat Jasmani dan Rohani, Warga Negara",
  "Berkebinekaan Global": "Beriman dan Berakhlak Mulia, Berkebinekaan Global, Gotong Royong, Mandiri dan Kreatif, Bernalar Kritis, Sehat Jasmani dan Rohani, Warga Negara",
  "Gotong Royong": "Beriman dan Berakhlak Mulia, Berkebinekaan Global, Gotong Royong, Mandiri dan Kreatif, Bernalar Kritis, Sehat Jasmani dan Rohani, Warga Negara",
  "Mandiri dan Kreatif": "Beriman dan Berakhlak Mulia, Berkebinekaan Global, Gotong Royong, Mandiri dan Kreatif, Bernalar Kritis, Sehat Jasmani dan Rohani, Warga Negara",
  "Bernalar Kritis": "Beriman dan Berakhlak Mulia, Berkebinekaan Global, Gotong Royong, Mandiri dan Kreatif, Bernalar Kritis, Sehat Jasmani dan Rohani, Warga Negara"
}

// === DEFAULT TEXT JIKA TIDAK ADA MATCH ===
const defaultMateriIntegrasiKBC = "Materi pembelajaran diintegrasikan dengan konsep KBC (Kurikulum Berbasis Cinta) yang menekankan pada pengembangan holistik anak melalui pendekatan yang menyenangkan, bermakna, dan relevan dengan kehidupan sehari-hari. Anak belajar melalui eksplorasi, eksperimen, bermain, dan berkarya dengan bimbingan guru yang hangat dan penuh kasih sayang. Nilai-nilai keagamaan, karakter, dan kecakapan hidup diintegrasikan secara alami dalam setiap aktivitas pembelajaran untuk membentuk anak yang beriman, berkarakter, kreatif, dan siap menghadapi tantangan masa depan."

const defaultTujuanPembelajaran = "Melalui pembelajaran ini, anak diharapkan dapat mengembangkan potensi diri secara optimal dalam berbagai aspek perkembangan (kognitif, afektif, psikomotorik, sosial-emosional, dan spiritual), membangun karakter yang kuat, serta memiliki kecakapan hidup yang diperlukan untuk tumbuh dan berkembang sebagai pribadi yang beriman, cerdas, kreatif, dan mandiri."

async function main() {
  console.log('🚀 Memulai seeding Ultimate Complete RPP Templates...')
  console.log('')

  // === 1. HAPUS SEMUA TEMPLATE LAMA ===
  console.log('🗑️  Menghapus semua template lama...')
  await prisma.rPPTemplate.deleteMany({})
  console.log('✓ Semua template lama telah dihapus')
  console.log('')

  // === 2. PROSES DAN INSERT TEMPLATE ===
  console.log('📝 Memproses dan menambahkan 15 template...')

  let successCount = 0

  for (const template of kbcTemplates) {
    try {
      // Cari materiIntegrasiKBC dan tujuanPembelajaran dari templatesWithFields berdasarkan tema
      const matchedField = templatesWithFields.find(t => t.tema === template.tema)

      // Ambil atau gunakan default
      const materiIntegrasiKBC = matchedField?.materiIntegrasiKBC || defaultMateriIntegrasiKBC
      const tujuanPembelajaran = matchedField?.tujuanPembelajaran || defaultTujuanPembelajaran

      // Ambil profilLulusan dari mapping atau buat dari topikKBC
      let profilLulusan = template.profilLulusan
      if (!profilLulusan && template.topikKBC) {
        profilLulusan = profilLulusanMapping[template.topikKBC] || ""
      }

      // Pastikan profilLulusan terisi
      if (!profilLulusan) {
        profilLulusan = "Beriman dan Berakhlak Mulia, Berkebinekaan Global, Gotong Royong, Mandiri dan Kreatif, Bernalar Kritis, Sehat Jasmani dan Rohani, Warga Negara"
      }

      // Siapkan data untuk insert
      const templateData: any = {
        tema: template.tema,
        topikKBC: template.topikKBC,
        profilLulusan: profilLulusan,
        tujuanKBC: template.tujuanKBC,
        tujuanProfilLulusan: JSON.stringify(template.tujuanProfilLulusan),
        tujuanPembelajaranMendalam: template.tujuanPembelajaranMendalam,
        materiIntegrasiKBC: materiIntegrasiKBC,
        tujuanPembelajaran: tujuanPembelajaran,
        kerangkaPembelajaran: JSON.stringify(template.kerangkaPembelajaran),
        kegiatanPembelajaran: JSON.stringify(template.kegiatanPembelajaran),
        isActive: true
      }

      // Insert ke database
      await prisma.rPPTemplate.create({
        data: templateData
      })

      console.log(`✓ Template "${template.tema}" (Topik: ${template.topikKBC})`)
      console.log(`  - profilLulusan: ✓`)
      console.log(`  - materiIntegrasiKBC: ✓`)
      console.log(`  - tujuanPembelajaran: ✓`)
      successCount++

    } catch (error) {
      console.error(`✗ Gagal membuat template "${template.tema}":`, error)
    }
  }

  console.log('')
  console.log(`✅ Berhasil membuat ${successCount} dari ${kbcTemplates.length} template!`)
  console.log('')

  // === 3. VERIFIKASI HASIL ===
  console.log('🔍 Memverifikasi hasil...')

  const allTemplates = await prisma.rPPTemplate.findMany({
    orderBy: { tema: 'asc' }
  })

  console.log(`Total template di database: ${allTemplates.length}`)
  console.log('')

  // Cek field yang penting
  let withProfilLulusan = 0
  let withMateriIntegrasi = 0
  let withTujuanPembelajaran = 0
  let withLampiran = 0

  allTemplates.forEach((t: any) => {
    if (t.profilLulusan && t.profilLulusan.length > 0) withProfilLulusan++
    if (t.materiIntegrasiKBC && t.materiIntegrasiKBC.length > 0) withMateriIntegrasi++
    if (t.tujuanPembelajaran && t.tujuanPembelajaran.length > 0) withTujuanPembelajaran++
    if (t.lampiran && t.lampiran.length > 0) withLampiran++
  })

  console.log('Statistik field:')
  console.log(`  ✓ profilLulusan terisi: ${withProfilLulusan}/${allTemplates.length}`)
  console.log(`  ✓ materiIntegrasiKBC terisi: ${withMateriIntegrasi}/${allTemplates.length}`)
  console.log(`  ✓ tujuanPembelajaran terisi: ${withTujuanPembelajaran}/${allTemplates.length}`)
  console.log(`  ✗ lampiran (seharusnya kosong): ${withLampiran}/${allTemplates.length}`)
  console.log('')

  // Tampilkan daftar template
  console.log('Daftar template:')
  allTemplates.forEach((t: any, index: number) => {
    console.log(`  ${index + 1}. ${t.tema}`)
    console.log(`     Topik: ${t.topikKBC}`)
    console.log(`     Profil: ${t.profilLulusan ? '✓' : '✗'}`)
    console.log(`     Materi: ${t.materiIntegrasiKBC ? '✓' : '✗'}`)
    console.log(`     Tujuan: ${t.tujuanPembelajaran ? '✓' : '✗'}`)
  })
  console.log('')

  console.log('✨ Selesai! Semua data telah di-seed dengan sukses!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
