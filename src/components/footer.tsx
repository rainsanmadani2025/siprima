import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Globe } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t bg-background mt-auto">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-8 md:gap-16">
          {/* Left Side - Logo and Links */}
          <div className="flex-1 space-y-4 min-w-0 max-w-md">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="RA Insan Madani Logo"
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-sm font-bold text-foreground leading-tight">
                  APLIKASI KURIKULUM PEMBELAJARAN
                </h3>
                <p className="text-xs text-muted-foreground leading-tight">RA INSAN MADANI</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Link Terkait:</p>
              <div className="flex flex-wrap gap-4">
                <Link href="#" className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="h-4 w-4 flex-shrink-0" />
                  <span>Facebook</span>
                </Link>
                <Link href="#" className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-4 w-4 flex-shrink-0" />
                  <span>Instagram</span>
                </Link>
                <Link href="#" className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Youtube className="h-4 w-4 flex-shrink-0" />
                  <span>YouTube</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Information */}
          <div className="w-full md:w-auto space-y-4 min-w-0">
            <h3 className="text-sm font-medium text-muted-foreground">Hubungi Kami:</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-2 text-sm text-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                <span className="break-words">Jl. Pendidikan No. 123, Kota</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-foreground">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                <span className="break-all">info@rainsanmadani.sch.id</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-foreground">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                <span className="break-all">+62 812-3456-7890</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-foreground">
                <Globe className="h-4 w-4 flex-shrink-0 text-primary" />
                <span className="break-all">www.rainsanmadani.sch.id</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Aplikasi Kurikulum Pembelajaran RA Insan Madani. All rights reserved. | Deployed by Yana Mulyana, S.K.M
          </p>
        </div>
      </div>
    </footer>
  )
}
