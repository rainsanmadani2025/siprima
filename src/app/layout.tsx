import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aplikasi Kurikulum Pembelajaran RA Insan Madani",
  description: "Sistem kurikulum berbasis cinta untuk RA Insan Madani - Platform pembelajaran modern untuk guru dan kepala sekolah",
  keywords: ["RA Insan Madani", "Kurikulum", "Pembelajaran", "Pendidikan", "Guru", "Kepala Sekolah"],
  authors: [{ name: "Yana Mulyana, S.K.M" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Aplikasi Kurikulum Pembelajaran RA Insan Madani",
    description: "Sistem kurikulum berbasis cinta untuk RA Insan Madani",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

