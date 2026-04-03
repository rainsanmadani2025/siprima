"use client"
// Landing page for RA Insan Madani

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Heart, Users, Calendar, CheckCircle, Award, ArrowRight, LogIn } from "lucide-react"
import { useTheme } from "next-themes"
import { LoginForm } from "@/components/login-form"
import { useState, useEffect } from "react"

export default function Home() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Login Form */}
        <section className="relative py-8 md:py-12 px-6 md:px-12 lg:px-16 overflow-hidden">
          <div 
            className={`absolute inset-0 ${mounted && resolvedTheme === 'dark' ? 'gradient-hero-dark' : 'gradient-hero'}`} 
            suppressHydrationWarning
          />
          <div className="absolute inset-0 bg-background/80" />

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left Side - Hero Content */}
              <div className="flex-1 text-center lg:text-left space-y-6 max-w-2xl lg:max-w-none">
                <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                  <Heart className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Kurikulum Berbasis Cinta</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                  Selamat Datang di
                  <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Aplikasi Kurikulum Pembelajaran
                  </span>
                  <span className="block text-2xl md:text-3xl lg:text-4xl mt-2 text-muted-foreground">
                    RA INSAN MADANI
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground">
                  Platform pembelajaran modern yang dirancang dengan pendekatan kasih sayang untuk membentuk
                  generasi cerdas, berakhlak mulia, dan berkarakter
                </p>

                <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mt-8">
                  <Button
                    size="lg"
                    className="gradient-green hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    onClick={() => {
                      const loginForm = document.querySelector('[role="tablist"]')
                      loginForm?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }}
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Masuk Sekarang
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="hover:bg-primary/10 transition-all duration-300 hover:scale-105"
                  >
                    Pelajari Lebih Lanjut
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Right Side - Login Form */}
              <div className="w-full max-w-md lg:ml-8">
                <LoginForm />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-8 md:py-12 px-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Fitur Unggulan
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Sistem pembelajaran terintegrasi dengan berbagai fitur modern untuk mendukung kegiatan belajar mengajar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature Card 1 */}
              <Card className="group card-gradient-1 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent">
                <CardHeader>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Manajemen Kurikulum</CardTitle>
                  <CardDescription className="text-white/90">
                    Kelola kurikulum pembelajaran dengan mudah dan terstruktur sesuai standar pendidikan
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature Card 2 */}
              <Card className="group card-gradient-2 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent">
                <CardHeader>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Heart className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Pendekatan Berbasis Cinta</CardTitle>
                  <CardDescription className="text-white/90">
                    Metode pembelajaran yang menekankan pada kasih sayang dan perhatian individual
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature Card 3 */}
              <Card className="group card-gradient-3 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent">
                <CardHeader>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Manajemen Siswa</CardTitle>
                  <CardDescription className="text-white/90">
                    Pantau perkembangan setiap siswa secara real-time dan personal
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature Card 4 */}
              <Card className="group card-gradient-4 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent">
                <CardHeader>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Calendar className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Jadwal Pelajaran</CardTitle>
                  <CardDescription className="text-white/90">
                    Atur dan kelola jadwal kegiatan belajar mengajar dengan fleksibel
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature Card 5 */}
              <Card className="group card-gradient-5 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent">
                <CardHeader>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <CheckCircle className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Evaluasi & Laporan</CardTitle>
                  <CardDescription className="text-white/90">
                    Sistem penilaian otomatis dengan laporan yang komprehensif dan detail
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature Card 6 */}
              <Card className="group card-gradient-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent">
                <CardHeader>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Award className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Sertifikat Digital</CardTitle>
                  <CardDescription className="text-white/90">
                    Buat dan kelola sertifikat pencapaian siswa dengan mudah
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
