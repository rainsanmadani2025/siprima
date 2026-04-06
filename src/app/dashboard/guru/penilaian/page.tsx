"use client"

import React, { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, Star, FileText, Camera, MessageSquare, Download, Save, Loader2, Edit, Upload, CheckCircle2, RefreshCw, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface Student {
  id: string
  name: string
  nis: string
  className: string
  classId?: string
}

interface AssessmentStatistics {
  totalStudents: number
  assessedStudents: number
  progress: string
  averageScore: string
  anecdotalNotesCount: number
  documentationCount: number
  scoreCounts: {
    BB: number
    MB: number
    BSH: number
    BSB: number
  }
}

const scoreLabels: Record<string, string> = {
  BB: 'Belum Berkembang',
  MB: 'Mulai Berkembang',
  BSH: 'Berkembang Sesuai Harapan',
  BSB: 'Berkembang Sangat Baik'
}

// Template styles
const templateStyles = ['Formal', 'Ramah', 'Lengkap'] as const

// Template narasi untuk setiap aspek, nilai, dan style
const narrativeTemplates: Record<string, Record<string, string[]>> = {
  agama_budi_pekerti: {
    BB: [
      "Ananda belum menunjukkan kemampuan dalam memahami dan mengamalkan nilai-nilai agama dan budi pekerti dasar. Perlu bimbingan intensif dan pendampingan berkelanjutan dari guru serta dukungan penuh dari orang tua untuk membantu perkembangan karakter ananda.",
      "Ananda masih perlu belajar lebih banyak tentang nilai-nilai agama dan budi pekerti. Jangan khawatir, ini adalah proses belajar yang wajar. Mari kita bantu ananda bersama-sama untuk mulai mengenal dan mempraktikkan nilai-nilai baik dalam kehidupan sehari-hari.",
      "Berdasarkan hasil penilaian, ananda belum menunjukkan kemampuan dalam aspek Nilai Agama dan Budi Pekerti. Hal ini dapat terlihat dari kesulitan ananda dalam memahami konsep dasar nilai keagamaan dan mengamalkannya dalam perilaku sehari-hari. Diperlukan bimbingan khusus dan dukungan yang konsisten dari guru di sekolah serta orang tua di rumah. Diharapkan melalui latihan rutin, penguatan berulang, dan contoh konkret yang baik, ananda dapat mulai mengembangkan pemahaman tentang nilai-nilai agama dan budi pekerti yang baik."
    ],
    MB: [
      "Ananda mulai menunjukkan pemahaman tentang nilai-nilai agama dan budi pekerti, namun masih memerlukan bimbingan dan arahan yang lebih terarah. Diharapkan ananda terus berlatih agar pemahaman dan penerapannya lebih konsisten.",
      "Hebat! Ananda mulai mengenal nilai-nilai agama dan budi pekerti. Kadang-kadang masih perlu diingatkan, tapi itu sangat wajar. Mari kita terus dukung ananda agar makin paham dan bisa menerapkannya setiap hari.",
      "Ananda mulai menunjukkan kemampuan dalam aspek Nilai Agama dan Budi Pekerti. Pemahaman ananda tentang nilai-nilai keagamaan sudah mulai muncul, meskipun penerapannya masih belum konsisten. Dalam beberapa situasi, ananda sudah bisa menunjukkan perilaku yang baik, namun masih memerlukan pengingat dan bimbingan dari guru maupun orang tua. Diharapkan dengan latihan yang terus-menerus dan contoh yang baik dari lingkungan sekitar, ananda akan semakin mahir dalam memahami dan mengamalkan nilai-nilai agama dan budi pekerti dalam kehidupan sehari-hari."
    ],
    BSH: [
      "Ananda telah mampu menunjukkan pemahaman dan penerapan nilai-nilai agama dan budi pekerti dengan baik. Kemampuan ini sudah konsisten dan sesuai dengan harapan perkembangan untuk usianya. Diharapkan ananda terus mempertahankan dan meningkatkannya.",
      "Alhamdulillah! Ananda sudah cukup baik dalam memahami dan menerapkan nilai-nilai agama dan budi pekerti. Terus dipertahankan ya, biar makin baik lagi. Kami sangat bangga dengan perkembangan ananda!",
      "Berdasarkan hasil penilaian, ananda telah menunjukkan kemampuan yang baik dalam aspek Nilai Agama dan Budi Pekerti. Pemahaman ananda tentang nilai-nilai keagamaan sudah baik dan penerapannya dalam perilaku sehari-hari sudah konsisten. Ananda mampu menunjukkan sikap yang baik seperti saling menghargai, jujur, peduli terhadap teman, serta menghormati guru dan orang tua. Kemampuan ini sudah sesuai dengan harapan perkembangan untuk usia ananda. Diharapkan ananda terus mempertahankan dan meningkatkan kemampuan ini dengan terus berlatih dan menjadi teladan bagi teman-temannya."
    ],
    BSB: [
      "Ananda menunjukkan kemampuan yang sangat baik dalam memahami dan mengamalkan nilai-nilai agama dan budi pekerti. Kemampuan yang dimiliki sudah melampaui harapan perkembangan untuk usianya. Ananda dapat menjadi teladan bagi teman-temannya.",
      "Masya Allah, luar biasa! Ananda sangat baik dalam memahami dan menerapkan nilai-nilai agama dan budi pekerti. Ananda sering menjadi contoh yang baik untuk teman-teman. Teruslah menjadi anak yang berakhlak mulia ya!",
      "Alhamdulillah, ananda menunjukkan kemampuan yang sangat baik dalam aspek Nilai Agama dan Budi Pekerti. Pemahaman ananda tentang nilai-nilai keagamaan sangat mendalam dan penerapannya dalam perilaku sehari-hari sangat konsisten, bahkan melampaui harapan untuk usia ananda. Ananda tidak hanya memahami konsep nilai-nilai agama, tetapi juga secara aktif mengamalkannya dalam berbagai situasi. Ananda sering menunjukkan sikap kepemimpinan positif, saling membantu teman, dan menjadi teladan dalam perilaku yang baik. Diharapkan ananda terus mengembangkan potensi ini dan menjadi inspirasi bagi teman-teman lainnya."
    ]
  },
  jati_diri: {
    BB: [
      "Ananda belum menunjukkan kemampuan dalam mengenali dan mengekspresikan jati diri. Perlu bimbingan intensif untuk membantu ananda membangun kepercayaan diri dan kemampuan ekspresi diri yang sehat.",
      "Ananda masih agak ragu untuk menunjukkan diri sendiri. Tidak apa-apa, setiap anak punya waktunya masing-masing. Mari kita bantu ananda pelan-pelan agar makin berani dan percaya diri.",
      "Berdasarkan hasil penilaian, ananda belum menunjukkan kemampuan dalam aspek Jati Diri. Ananda masih mengalami kesulitan dalam mengenali diri sendiri, mengekspresikan perasaan dan pendapat, serta membangun kepercayaan diri. Dalam berbagai aktivitas, ananda cenderung pasif dan enggan untuk terlibat atau menunjukkan kemampuan yang dimiliki. Diperlukan bimbingan yang intensif dan dukungan penuh dari guru di sekolah serta orang tua di rumah. Melalui penguatan positif, kesempatan untuk mencoba hal baru, dan lingkungan yang mendukung, diharapkan ananda dapat mulai mengembangkan kepercayaan diri dan kemampuan ekspresi diri yang lebih baik."
    ],
    MB: [
      "Ananda mulai mengenali dan mengekspresikan jati diri, namun masih ragu-ragu. Perlu dukungan dan penguatan untuk membangun kepercayaan diri. Latihan berbicara dan ekspresi diri perlu terus dilatih.",
      "Bagus! Ananda mulai berani menunjukkan diri sendiri. Kadang masih malu-malu, tapi itu normal. Mari kita dukung terus ananda agar makin berani berbicara dan mengekspresikan diri ya.",
      "Ananda mulai menunjukkan kemampuan dalam aspek Jati Diri. Pengenalan terhadap diri sendiri sudah mulai muncul, dan ananda sudah mencoba untuk mengekspresikan perasaan dan pendapat, meskipun masih dengan ragu-ragu. Dalam beberapa situasi, ananda sudah bisa berpartisipasi dalam aktivitas, namun masih memerlukan dorongan dan dukungan dari guru maupun orang tua. Kepercayaan diri ananda masih berkembang dan perlu terus dipupuk. Diharapkan dengan latihan yang terus-menerus dalam berbicara di depan teman-teman, memberikan pendapat, dan mencoba hal baru, ananda akan semakin percaya diri dan mampu mengekspresikan jati diri dengan baik."
    ],
    BSH: [
      "Ananda telah mampu mengenali dan mengekspresikan jati diri dengan baik. Kepercayaan diri sudah terbentuk dengan baik dan sesuai dengan harapan perkembangan untuk usianya. Ananda dapat berpartisipasi aktif dalam berbagai aktivitas.",
      "Hebat! Ananda sudah cukup percaya diri dan berani menunjukkan diri sendiri. Ananda sering ikut serta dalam kegiatan dan tidak takut untuk berbicara. Terus dipertahankan ya!",
      "Berdasarkan hasil penilaian, ananda telah menunjukkan kemampuan yang baik dalam aspek Jati Diri. Pengenalan terhadap diri sendiri sudah baik dan ananda mampu mengekspresikan perasaan, pendapat, dan kemampuan dengan percaya diri. Ananda berpartisipasi aktif dalam berbagai aktivitas kelas, berani berbicara di depan teman-teman, dan mampu menunjukkan minat dan bakat yang dimiliki. Kepercayaan diri ananda sudah terbentuk dengan baik dan sesuai dengan harapan perkembangan untuk usia ananda. Diharapkan ananda terus mempertahankan dan meningkatkan kemampuan ini dengan terus mencoba hal baru dan mengembangkan potensi yang dimiliki."
    ],
    BSB: [
      "Ananda menunjukkan kemampuan yang sangat baik dalam mengenali dan mengekspresikan jati diri. Kepercayaan diri sangat kuat dan kemampuan ekspresi diri sudah melampaui harapan perkembangan untuk usianya.",
      "Wow, luar biasa! Ananda sangat percaya diri dan berani menunjukkan diri sendiri. Ananda sering jadi pemimpin dalam kegiatan dan tidak takut untuk berbicara di depan banyak orang. Keren!",
      "Alhamdulillah, ananda menunjukkan kemampuan yang sangat baik dalam aspek Jati Diri. Pengenalan terhadap diri sendiri sangat baik dan ananda memiliki kepercayaan diri yang kuat. Ananda tidak hanya mampu mengekspresikan perasaan dan pendapat dengan percaya diri, tetapi juga mampu menunjukkan kepemimpinan positif dalam berbagai aktivitas. Ananda sering mengambil inisiatif, berani tampil di depan, dan mampu menginspirasi teman-teman lainnya. Kemampuan ekspresi diri ananda sudah melampaui harapan untuk usia ananda. Diharapkan ananda terus mengembangkan potensi ini dan menjadi teladan bagi teman-teman lainnya dalam mengekspresikan jati diri dengan positif."
    ]
  },
  literasi_sains: {
    BB: [
      "Ananda belum menunjukkan kemampuan dalam dasar-dasar literasi, matematika, sains, teknologi, rekayasa, dan seni. Perlu bimbingan intensif dan latihan rutin untuk membantu perkembangan kemampuan kognitif dan kreatif ananda.",
      "Ananda masih perlu belajar banyak tentang membaca, menghitung, dan hal-hal seru lainnya. Tidak apa-apa, setiap anak punya waktunya sendiri untuk belajar. Mari kita bantu ananda pelan-pelan ya.",
      "Berdasarkan hasil penilaian, ananda belum menunjukkan kemampuan dalam aspek Dasar-dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni. Ananda masih mengalami kesulitan dalam memahami konsep dasar membaca, mengenal huruf dan angka, serta memahami konsep sederhana sains dan matematika. Kemampuan motorik halus untuk kegiatan seni juga masih perlu dikembangkan. Diperlukan bimbingan intensif, latihan rutin yang menyenangkan, dan dukungan penuh dari guru di sekolah serta orang tua di rumah. Melalui pembelajaran yang berbasis permainan, eksperimen sederhana, dan kegiatan seni yang menarik, diharapkan ananda dapat mulai mengembangkan kemampuan literasi, matematika, sains, dan kreativitasnya."
    ],
    MB: [
      "Ananda mulai menunjukkan kemampuan dalam dasar-dasar literasi, matematika, sains, teknologi, rekayasa, dan seni, namun masih memerlukan bimbingan dan latihan lebih lanjut untuk konsistensi.",
      "Bagus! Ananda mulai bisa membaca huruf, mengenal angka, dan suka hal-hal tentang sains. Kadang masih butuh bantuan, tapi itu sangat wajar. Terus berlatih ya!",
      "Ananda mulai menunjukkan kemampuan dalam aspek Dasar-dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni. Kemampuan membaca ananda sudah mulai berkembang, ananda mulai mengenal huruf dan beberapa kata sederhana. Dalam matematika, ananda sudah mulai mengenal angka dan konsep berhitung dasar, meskipun masih memerlukan bantuan. Ketertarikan ananda terhadap sains dan eksplorasi alam sekitar mulai muncul, dan ananda mulai mencoba kegiatan seni dan rekayasa sederhana. Namun, kemampuan ini belum konsisten dan masih memerlukan bimbingan serta latihan lebih lanjut. Diharapkan dengan pembelajaran yang menyenangkan dan berbasis pengalaman langsung, ananda akan semakin mahir dalam literasi, matematika, sains, dan kreativitasnya."
    ],
    BSH: [
      "Ananda telah mampu menunjukkan kemampuan yang baik dalam dasar-dasar literasi, matematika, sains, teknologi, rekayasa, dan seni. Kemampuan kognitif dan kreatif sudah sesuai dengan harapan perkembangan untuk usianya.",
      "Hebat! Ananda sudah cukup pandai membaca, menghitung, dan banyak tahu tentang sains. Ananda juga suka membuat karya seni yang bagus. Terus dipertahankan ya!",
      "Berdasarkan hasil penilaian, ananda telah menunjukkan kemampuan yang baik dalam aspek Dasar-dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni. Kemampuan literasi ananda sudah baik, ananda mampu membaca kata-kata sederhana dan memahami isinya. Dalam matematika, ananda menguasai konsep dasar berhitung dan mampu menyelesaikan soal sederhana. Ananda menunjukkan ketertarikan yang baik terhadap sains dan eksplorasi alam sekitar. Kemampuan kreatif dalam seni dan rekayasa sederhana juga sudah berkembang dengan baik. Ananda mampu mengikuti instruksi dan menyelesaikan tugas-tugas yang diberikan. Kemampuan ini sudah sesuai dengan harapan perkembangan untuk usia ananda. Diharapkan ananda terus mempertahankan dan meningkatkan kemampuan ini dengan terus belajar dan bereksperimen."
    ],
    BSB: [
      "Ananda menunjukkan kemampuan yang sangat baik dalam dasar-dasar literasi, matematika, sains, teknologi, rekayasa, dan seni. Kemampuan kognitif dan kreatif sudah melampaui harapan perkembangan untuk usianya.",
      "Wow, luar biasa! Ananda sangat pintar membaca dan menghitung. Ananda juga sangat suka hal-hal tentang sains dan sering membuat karya seni yang kreatif. Keren sekali!",
      "Alhamdulillah, ananda menunjukkan kemampuan yang sangat baik dalam aspek Dasar-dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni. Kemampuan literasi ananda sangat baik, ananda mampu membaca dengan lancar dan memahami teks yang dibaca. Dalam matematika, ananda menguasai konsep dasar dengan baik dan mampu menyelesaikan soal yang lebih kompleks. Ananda menunjukkan rasa ingin tahu yang tinggi terhadap sains dan mampu menjelaskan fenomena sederhana dengan logis. Kemampuan kreatif dalam seni dan rekayasa juga sangat baik, ananda mampu membuat karya yang orisinal dan menarik. Ananda sering mengajukan pertanyaan yang baik dan mampu berpikir kritis. Kemampuan ini sudah melampaui harapan untuk usia ananda. Diharapkan ananda terus mengembangkan potensi ini dan menjadi inspirasi bagi teman-teman lainnya dalam belajar."
    ]
  }
}

// Template Observasi Kegiatan
const observationTemplates = [
  // Template 1 - Formal
  "Dalam periode pembelajaran ini, ananda menunjukkan partisipasi yang baik dalam berbagai kegiatan pembelajaran. Ananda aktif mengikuti kegiatan bermain sambil belajar, berdiskusi dengan teman, dan menyelesaikan tugas-tugas yang diberikan. Dalam kegiatan kelompok, ananda mampu berkomunikasi dengan baik dan bekerja sama dengan teman-teman. Ananda juga menunjukkan rasa ingin tahu yang tinggi dengan sering mengajukan pertanyaan terkait materi yang dipelajari. Kemampuan motorik kasar dan halus ananda berkembang dengan baik, terlihat dari kegiatan berolahraga dan membuat karya seni.",

  // Template 2 - Ramah
  "Ananda sangat aktif dan antusias dalam mengikuti kegiatan-kegiatan di kelas! Saya senang melihat ananda selalu bersemangat saat bermain sambil belajar. Ananda suka berbagi dengan teman-teman dan tidak segan untuk membantu yang lain. Dalam kegiatan bermain, ananda sering jadi inisiator yang kreatif. Teruslah menjadi anak yang aktif dan ceria ya! Kami bangga melihat antusiasme ananda dalam setiap kegiatan.",

  // Template 3 - Lengkap
  "Berdasarkan observasi selama periode pembelajaran ini, ananda menunjukkan perkembangan yang sangat baik dalam partisipasi kegiatan. Ananda aktif terlibat dalam berbagai aktivitas pembelajaran, mulai dari kegiatan bermain peran, bernyanyi, menari, hingga kegiatan eksplorasi sains sederhana. Dalam kegiatan kelompok, ananda mampu bekerja sama dengan baik, menghargai pendapat teman, dan berkontribusi secara aktif. Ananda juga menunjukkan kemampuan komunikasi yang baik, mampu menyampaikan ide dan perasaan dengan jelas.\n\nDalam aspek motorik, ananda menunjukkan koordinasi yang baik dalam kegiatan fisik seperti berlari, melompat, dan bermain bola. Kemampuan motorik halus juga berkembang baik, terlihat dari kegiatan menggambar, mewarnai, dan membuat karya kerajinan tangan. Ananda juga menunjukkan kemampuan memecahkan masalah sederhana dan berpikir kritis dalam kegiatan eksplorasi. Secara sosial, ananda mampu berteman dan berinteraksi dengan baik dengan teman-teman sekelas."
]

// Template Catatan Anekdot
const anecdotalNotesTemplates = [
  // Template 1 - Formal
  "Pada suatu kesempatan saat kegiatan bermain peran, ananda secara sukarela membagikan mainan kepada teman yang tidak memilikinya. Ananda menunjukkan empati dan kepedulian terhadap teman tanpa diminta. Kejadian ini menunjukkan bahwa nilai-nilai sosial dan empati ananda sudah berkembang dengan baik.",

  // Template 2 - Ramah
  "Hari ini ada momen yang sangat menyentuh hati! Saat teman ananda menangis karena jatuh, ananda langsung mendekati dan menolongnya bangun. Ananda juga menghibur temannya dengan berkata 'jangan sedih ya, aku temani'. Alhamdulillah, ananda sudah mulai belajar untuk peduli terhadap perasaan teman-temannya.",

  // Template 3 - Lengkap
  "Catatan anekdot: Pada tanggal hari ini, terjadi kejadian yang menarik selama kegiatan bercerita. Saat guru meminta siswa untuk maju ke depan dan menceritakan pengalaman liburan, ananda yang awalnya tampak ragu, akhirnya berani maju setelah mendapat dukungan dari guru dan teman-teman.\n\nDengan percaya diri, ananda menceritakan pengalaman liburan keluarga ke rumah nenek di desa. Ananda menceritakan dengan detail tentang bermain di sawah, memetik buah, dan membantu nenek menyiram tanaman. Cerita ananda mengalir dengan lancar dan menggunakan bahasa yang jelas. Teman-teman lain terlihat antusias mendengarkan cerita ananda.\n\nKejadian ini menunjukkan perkembangan yang baik dalam aspek kepercayaan diri dan kemampuan berbicara di depan umum. Ananda mampu mengatasi rasa takut dan ragu, serta berani mengekspresikan diri. Hal ini juga menunjukkan memori yang baik dan kemampuan mengorganisasi cerita secara runtut."
]

const aspects = [
  { key: 'agama_budi_pekerti', label: 'Nilai Agama dan Budi Pekerti', shortLabel: 'agama' },
  { key: 'jati_diri', label: 'Jati Diri', shortLabel: 'jati_diri' },
  { key: 'literasi_sains', label: 'Dasar-dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, Seni', shortLabel: 'literasi_sains' }
]

export default function GuruPenilaianPage() {
  const [stats, setStats] = useState<AssessmentStatistics | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedSemester, setSelectedSemester] = useState('Ganjil')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)
  const { toast } = useToast()

  // Form state for each aspect
  const [formValues, setFormValues] = useState<Record<string, {
    score: string
    notes: string
  }>>({})

  // Template management state
  const [templateIndices, setTemplateIndices] = useState<Record<string, number>>({})
  const [observationTemplateIndex, setObservationTemplateIndex] = useState<number>(-1)
  const [anecdotalTemplateIndex, setAnecdotalTemplateIndex] = useState<number>(-1)

  // Form state for shared observations and documentation
  const [sharedNotes, setSharedNotes] = useState({
    observation: '',
    anecdotalNotes: ''
  })
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchStatistics()
    fetchStudents()
  }, [selectedSemester])

  // Reset form values when semester changes
  useEffect(() => {
    setFormValues({})
    setSharedNotes({ observation: '', anecdotalNotes: '' })
    setTemplateIndices({})
    setObservationTemplateIndex(-1)
    setAnecdotalTemplateIndex(-1)
    setUploadedPhotos([])
  }, [selectedSemester])

  const fetchStatistics = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        console.warn('[Statistics] No userId found')
        return
      }

      const response = await fetch(`/api/guru/assessment-statistics?userId=${userId}&semester=${selectedSemester}`)

      if (!response.ok) {
        console.warn('[Statistics] Response not OK:', response.status)
        return
      }

      let data
      try {
        const responseText = await response.text()
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('[Statistics] JSON Parse Error:', parseError)
        return
      }

      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        console.warn('[Students] No userId found')
        return
      }

      const response = await fetch(`/api/guru/students-list?userId=${userId}`)

      if (!response.ok) {
        console.warn('[Students] Response not OK:', response.status)
        return
      }

      let data
      try {
        const responseText = await response.text()
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('[Students] JSON Parse Error:', parseError)
        return
      }

      if (data.success && data.students.length > 0) {
        setStudents(data.students)
        setSelectedStudent(data.students[0])
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStudentChange = (studentId: string) => {
    const student = students.find(s => s.id === studentId)
    if (student) {
      setSelectedStudent(student)
      setFormValues({})
      setSharedNotes({ observation: '', anecdotalNotes: '' })
      setTemplateIndices({})
      setObservationTemplateIndex(-1)
      setAnecdotalTemplateIndex(-1)
      setUploadedPhotos([])
    }
  }

  const handleFormChange = (aspect: string, field: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [aspect]: {
        ...prev[aspect],
        [field]: value
      }
    }))
  }

  const handleSharedNotesChange = (field: string, value: string) => {
    setSharedNotes(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle score change and select random template
  const handleScoreChange = (aspect: string, score: string) => {
    handleFormChange(aspect, 'score', score)

    const templates = narrativeTemplates[aspect]?.[score]
    if (templates && templates.length > 0) {
      const randomIndex = Math.floor(Math.random() * templates.length)
      setTemplateIndices(prev => ({ ...prev, [aspect]: randomIndex }))
      setFormValues(prev => ({
        ...prev,
        [aspect]: { ...prev[aspect], notes: templates[randomIndex] }
      }))
    }
  }

  // Handle template change (cycle through available templates)
  const handleChangeTemplate = (aspect: string) => {
    const currentScore = formValues[aspect]?.score
    if (!currentScore) return

    const templates = narrativeTemplates[aspect]?.[currentScore]
    if (!templates || templates.length === 0) return

    const currentIndex = templateIndices[aspect] || 0
    const nextIndex = (currentIndex + 1) % templates.length

    setTemplateIndices(prev => ({ ...prev, [aspect]: nextIndex }))
    setFormValues(prev => ({
      ...prev,
      [aspect]: { ...prev[aspect], notes: templates[nextIndex] }
    }))
  }

  // Handle observation template change
  const handleLoadObservationTemplate = () => {
    const randomIndex = Math.floor(Math.random() * observationTemplates.length)
    setObservationTemplateIndex(randomIndex)
    setSharedNotes(prev => ({
      ...prev,
      observation: observationTemplates[randomIndex]
    }))
  }

  const handleChangeObservationTemplate = () => {
    const nextIndex = (observationTemplateIndex + 1) % observationTemplates.length
    setObservationTemplateIndex(nextIndex)
    setSharedNotes(prev => ({
      ...prev,
      observation: observationTemplates[nextIndex]
    }))
  }

  // Handle anecdotal notes template change
  const handleLoadAnecdotalTemplate = () => {
    const randomIndex = Math.floor(Math.random() * anecdotalNotesTemplates.length)
    setAnecdotalTemplateIndex(randomIndex)
    setSharedNotes(prev => ({
      ...prev,
      anecdotalNotes: anecdotalNotesTemplates[randomIndex]
    }))
  }

  const handleChangeAnecdotalTemplate = () => {
    const nextIndex = (anecdotalTemplateIndex + 1) % anecdotalNotesTemplates.length
    setAnecdotalTemplateIndex(nextIndex)
    setSharedNotes(prev => ({
      ...prev,
      anecdotalNotes: anecdotalNotesTemplates[nextIndex]
    }))
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    Array.from(files).forEach(file => {
      // Convert file to base64 for preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        setUploadedPhotos(prev => [...prev, base64])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemovePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSaveAssessment = async (aspect: string) => {
    if (!selectedStudent) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Silakan pilih siswa terlebih dahulu"
      })
      return
    }

    const formValue = formValues[aspect]
    if (!formValue || !formValue.score) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Silakan pilih nilai penilaian terlebih dahulu"
      })
      return
    }

    try {
      setSaving(true)
      const userId = localStorage.getItem('userId')

      // Generate date from selected semester
      const date = selectedSemester === 'Ganjil' ? '2025-01-01' : '2025-07-01'

      const response = await fetch('/api/guru/save-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: userId,
          studentId: selectedStudent.id,
          aspect: aspect,
          score: formValue.score,
          observation: formValue.notes || '',
          notes: sharedNotes.anecdotalNotes || '',
          semester: selectedSemester,
          academicYear: '2025/2026',
          date: date
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Gagal menyimpan penilaian`)
      }

      let data
      try {
        const responseText = await response.text()
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('[Save Assessment] JSON Parse Error:', parseError)
        throw new Error('Gagal memproses respon server')
      }

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Penilaian berhasil disimpan"
        })
        fetchStatistics()
      } else {
        throw new Error(data.error || 'Gagal menyimpan penilaian')
      }
    } catch (error: any) {
      console.error('Error saving assessment:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menyimpan penilaian"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedStudent) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Silakan pilih siswa terlebih dahulu"
      })
      return
    }

    if (!sharedNotes.observation && !sharedNotes.anecdotalNotes && uploadedPhotos.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Silakan isi Observasi Kegiatan, Catatan Anekdot, atau unggah Foto terlebih dahulu"
      })
      return
    }

    try {
      setSavingNotes(true)
      const userId = localStorage.getItem('userId')

      // Generate date from selected semester
      const date = selectedSemester === 'Ganjil' ? '2025-01-01' : '2025-07-01'

      // Get existing assessment data to preserve attendance and educatorNotes
      let existingDocData: any = {}
      try {
        const getAssessResponse = await fetch(`/api/guru/get-assessment?teacherId=${userId}&studentId=${selectedStudent.id}&date=${selectedSemester === 'Ganjil' ? '2025-01' : '2025-07'}`)
        if (getAssessResponse.ok) {
          const getAssessData = await getAssessResponse.json()
          if (getAssessData.success && getAssessData.assessments) {
            const catatanAssessment = getAssessData.assessments.find((a: any) => a.aspect === 'catatan_perkembangan')
            if (catatanAssessment?.documentation) {
              existingDocData = JSON.parse(catatanAssessment.documentation)
            }
          }
        }
      } catch (e) {
        console.warn('Failed to fetch existing assessment data')
      }

      // Merge existing documentation data with new data
      const documentation = {
        ...existingDocData,
        photos: uploadedPhotos,
        attendance: existingDocData.attendance || { sakit: 0, izin: 0, alpa: 0 },
        educatorNotes: existingDocData.educatorNotes || ''
      }

      // Save observation, anecdotal notes, and photos
      const response = await fetch('/api/guru/save-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: userId,
          studentId: selectedStudent.id,
          aspect: 'catatan_perkembangan',
          score: 'BSH',
          observation: sharedNotes.observation || '',
          notes: sharedNotes.anecdotalNotes || '',
          documentation: JSON.stringify(documentation),
          semester: selectedSemester,
          academicYear: '2025/2026',
          date: date
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Gagal menyimpan catatan`)
      }

      let data
      try {
        const responseText = await response.text()
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('[Save Notes] JSON Parse Error:', parseError)
        throw new Error('Gagal memproses respon server')
      }

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Observasi dan Catatan Anekdot berhasil disimpan"
        })
        fetchStatistics()
      } else {
        throw new Error(data.error || 'Gagal menyimpan catatan')
      }
    } catch (error: any) {
      console.error('Error saving notes:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menyimpan catatan"
      })
    } finally {
      setSavingNotes(false)
    }
  }

  const getSemesterLabel = (semester: string) => {
    return semester === 'Ganjil' ? 'Semester 1 (Ganjil)' : 'Semester 2 (Genap)'
  }

  const getCurrentTemplateStyle = (aspect: string) => {
    const score = formValues[aspect]?.score
    const index = templateIndices[aspect]
    if (!score || index === undefined) return null
    return templateStyles[index]
  }

  const getRemainingTemplatesCount = (aspect: string) => {
    const score = formValues[aspect]?.score
    if (!score) return 0
    const templates = narrativeTemplates[aspect]?.[score]
    if (!templates) return 0
    return templates.length - 1
  }

  if (loading) {
    return (
      <DashboardLayout role="guru" userName="Memuat...">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="guru" userName="Ibu Guru">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Penilaian Perkembangan Anak</h1>
            <p className="text-muted-foreground mt-2">
              Catat penilaian perkembangan siswa berdasarkan 3 aspek perkembangan anak
            </p>
          </div>

        </div>

        {/* Statistik Penilaian */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Siswa Dinilai</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.assessedStudents || 0}/{stats?.totalStudents || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stats?.progress || '0%'} selesai</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Nilai</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats?.averageScore || '-'}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.averageScore ? scoreLabels[stats.averageScore] : 'Belum ada data'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Catatan Anekdot</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats?.anecdotalNotesCount || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Catatan bulan ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dokumentasi</CardTitle>
              <Camera className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats?.documentationCount || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Foto & video</p>
            </CardContent>
          </Card>
        </div>

        {/* Form Penilaian per Siswa */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Form Penilaian
              </CardTitle>
              {students.length > 0 && (
                <div className="flex gap-2">
                  <Select
                    value={selectedStudent?.id || ''}
                    onValueChange={handleStudentChange}
                  >
                    <SelectTrigger className="w-80">
                      <SelectValue placeholder="Pilih Siswa" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} ({student.nis})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Pilih Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ganjil">Semester 1 (Ganjil)</SelectItem>
                      <SelectItem value="Genap">Semester 2 (Genap)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedStudent ? (
              <>
                <div className="mb-6 p-4 rounded-lg bg-muted/50">
                  <h3 className="font-semibold mb-1">
                    Siswa: {selectedStudent.name} ({selectedStudent.nis})
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Kelas {selectedStudent.className} • Periode: {getSemesterLabel(selectedSemester)}
                  </p>
                </div>

                {/* Form Sections with Cards - Like RPP Layout */}
                <div className="space-y-6">
                  {aspects.map((aspect, index) => (
                    <Card key={aspect.key}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">
                            {String.fromCharCode(65 + index)}
                          </span>
                          {aspect.label}
                          {formValues[aspect.key]?.score && (
                            <Badge className="ml-2 bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Sudah Dinilai
                            </Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Nilai Penilaian */}
                        <div>
                          <Label className="font-medium">Nilai Penilaian</Label>
                          <div className="flex gap-4 mt-2">
                            {['BB', 'MB', 'BSH', 'BSB'].map((nilai) => (
                              <label key={nilai} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`${aspect.shortLabel}-nilai`}
                                  value={nilai}
                                  checked={formValues[aspect.key]?.score === nilai}
                                  onChange={(e) => handleScoreChange(aspect.key, e.target.value)}
                                  className="w-4 h-4"
                                />
                                <span className="text-sm">{scoreLabels[nilai]}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Catatan Perkembangan */}
                        <div>
                          <Label className="font-medium">Catatan Perkembangan</Label>
                          <Textarea
                            placeholder="Catatan perkembangan siswa pada aspek ini..."
                            rows={3}
                            value={formValues[aspect.key]?.notes || ''}
                            onChange={(e) => handleFormChange(aspect.key, 'notes', e.target.value)}
                            className="mt-2"
                          />
                          {formValues[aspect.key]?.score && (
                            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                              <span className="text-muted-foreground">📝 Style:</span>
                              <Badge variant="outline" className="bg-blue-50">
                                {getCurrentTemplateStyle(aspect.key) || '-'}
                              </Badge>
                              {getRemainingTemplatesCount(aspect.key) > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleChangeTemplate(aspect.key)}
                                  className="h-7 text-xs"
                                >
                                  <RefreshCw className="mr-1 h-3 w-3" />
                                  Ganti ({getRemainingTemplatesCount(aspect.key)} tersisa)
                                </Button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2 pt-4 border-t">
                          {formValues[aspect.key]?.score ? (
                            <Button variant="outline" size="sm">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                          ) : null}
                          <Button
                            onClick={() => handleSaveAssessment(aspect.key)}
                            disabled={saving}
                          >
                            {saving ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="mr-2 h-4 w-4" />
                            )}
                            {saving ? "Menyimpan..." : "Simpan Penilaian"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Card Observasi & Catatan - Shared Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">
                          D
                        </span>
                        Observasi Kegiatan & Catatan Perkembangan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Observasi Kegiatan */}
                      <div>
                        <Label className="font-medium">Observasi Kegiatan</Label>
                        <Textarea
                          placeholder="Deskripsikan kegiatan perkembangan siswa secara umum..."
                          rows={3}
                          value={sharedNotes.observation}
                          onChange={(e) => handleSharedNotesChange('observation', e.target.value)}
                          className="mt-2"
                        />
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                          {observationTemplateIndex >= 0 ? (
                            <>
                              <span className="text-muted-foreground">📝 Style:</span>
                              <Badge variant="outline" className="bg-blue-50">
                                {observationTemplateIndex === 0 ? 'Formal' : observationTemplateIndex === 1 ? 'Ramah' : 'Lengkap'}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleChangeObservationTemplate}
                                className="h-7 text-xs"
                              >
                                <RefreshCw className="mr-1 h-3 w-3" />
                                Ganti ({observationTemplates.length - 1} tersisa)
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleLoadObservationTemplate}
                              className="h-7 text-xs"
                            >
                              <ClipboardList className="mr-1 h-3 w-3" />
                              Gunakan Template
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Catatan Anekdot */}
                      <div>
                        <Label className="font-medium">Catatan Anekdot</Label>
                        <Textarea
                          placeholder="Catatan insidental tentang perilaku dan perkembangan siswa..."
                          rows={3}
                          value={sharedNotes.anecdotalNotes}
                          onChange={(e) => handleSharedNotesChange('anecdotalNotes', e.target.value)}
                          className="mt-2"
                        />
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                          {anecdotalTemplateIndex >= 0 ? (
                            <>
                              <span className="text-muted-foreground">📝 Style:</span>
                              <Badge variant="outline" className="bg-blue-50">
                                {anecdotalTemplateIndex === 0 ? 'Formal' : anecdotalTemplateIndex === 1 ? 'Ramah' : 'Lengkap'}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleChangeAnecdotalTemplate}
                                className="h-7 text-xs"
                              >
                                <RefreshCw className="mr-1 h-3 w-3" />
                                Ganti ({anecdotalNotesTemplates.length - 1} tersisa)
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleLoadAnecdotalTemplate}
                              className="h-7 text-xs"
                            >
                              <ClipboardList className="mr-1 h-3 w-3" />
                              Gunakan Template
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Dokumentasi Foto */}
                      <div>
                        <Label className="font-medium">Dokumentasi Foto</Label>
                        <div className="mt-2 space-y-3">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Unggah Foto
                          </Button>
                          
                          {/* Preview Foto */}
                          {uploadedPhotos.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {uploadedPhotos.map((photo, index) => (
                                <div key={index} className="relative group">
                                  <div className="aspect-square rounded-lg overflow-hidden border border-border">
                                    <img
                                      src={photo}
                                      alt={`Dokumentasi ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleRemovePhoto(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tombol Simpan untuk Observasi & Catatan */}
                      <div className="flex justify-end pt-4 border-t">
                        <Button
                          onClick={handleSaveNotes}
                          disabled={savingNotes}
                        >
                          {savingNotes ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="mr-2 h-4 w-4" />
                          )}
                          {savingNotes ? "Menyimpan..." : "Simpan Observasi & Catatan"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : students.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Tidak ada siswa di kelas Anda</p>
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
