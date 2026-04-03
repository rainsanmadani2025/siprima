"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Eye, EyeOff, LogIn, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const loginSchema = z.object({
  role: z.enum(["admin", "kepsek", "guru", "ortu"], {
    required_error: "Silakan pilih peran Anda",
  }),
  username: z.string().min(3, {
    message: "Username minimal 3 karakter",
  }),
  password: z.string().min(6, {
    message: "Password minimal 6 karakter",
  }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: undefined,
      username: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        const roleNames: Record<string, string> = {
          admin: "Admin",
          kepsek: "Kepala Sekolah",
          guru: "Guru",
          ortu: "Orang Tua",
        }

        // Simpan role ke localStorage untuk digunakan di dashboard
        localStorage.setItem('userRole', data.role)
        localStorage.setItem('userName', result.user.name)
        localStorage.setItem('userId', result.user.id)

        toast({
          title: "Login Berhasil! ✅",
          description: `Selamat datang, ${roleNames[data.role]}!`,
          variant: "default",
        })

        // Redirect ke dashboard sesuai role
        const dashboardPaths: Record<string, string> = {
          admin: "/dashboard/admin",
          kepsek: "/dashboard/kepsek",
          guru: "/dashboard/guru",
          ortu: "/dashboard/ortu",
        }

        router.push(dashboardPaths[data.role] || "/")
      } else {
        toast({
          title: "Login Gagal ❌",
          description: result.message || "Username atau password salah",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat login. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-2 shadow-xl">
      <div className="text-center -mt-10">
        <div className="flex justify-center -mb-4">
          <div className="relative w-40 h-40 overflow-hidden">
            <Image
              src="/logo-ra.png"
              alt="Logo RA Insan Madani"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Form Login</h2>
        <p className="text-sm text-muted-foreground">
          Silakan pilih peran Anda untuk masuk ke sistem
        </p>
      </div>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peran</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih peran Anda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="kepsek">Kepala Sekolah</SelectItem>
                      <SelectItem value="guru">Guru</SelectItem>
                      <SelectItem value="ortu">Orang Tua</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan username"
                      {...field}
                      disabled={isLoading}
                      className="transition-all focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        {...field}
                        disabled={isLoading}
                        className="pr-10 transition-all focus:ring-2 focus:ring-primary"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <div className="flex justify-end mt-1">
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-sm text-primary hover:text-primary/80"
                      onClick={() => {
                        toast({
                          title: "Lupa Password",
                          description: "Fitur ini akan segera tersedia. Silakan hubungi admin.",
                          variant: "default",
                        })
                      }}
                    >
                      Lupa Password?
                    </Button>
                  </div>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full gradient-green text-white hover:opacity-90 transition-all mb-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
