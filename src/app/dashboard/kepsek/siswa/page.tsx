"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, UserCheck, UserX, Search, Baby, Loader2, Eye, Mail, Phone, MapPin, Calendar, User, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Student {
  id: string
  name: string
  nis: string
  birthDate: string
  gender: string
  address: string | null
  status: string
  photo: string | null
  class: {
    name: string | null
    ageGroup: string | null
  } | null
  parent: {
    fatherName: string | null
    fatherOccupation: string | null
    fatherPhone: string | null
    fatherEmail: string | null
    motherName: string | null
    motherOccupation: string | null
    motherPhone: string | null
    motherEmail: string | null
    address: string | null
    occupation: string | null
  } | null
}

export default function KepsekSiswaPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterKelas, setFilterKelas] = useState("semua")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/students')
      const data = await response.json()
      setStudents(data.students || [])
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.nis.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesClass = filterKelas === "semua" ||
                        student.class?.ageGroup?.toLowerCase() === filterKelas.toLowerCase() ||
                        student.class?.name?.toLowerCase() === filterKelas.toLowerCase()
    return matchesSearch && matchesClass
  })

  const totalStudents = students.length
  const activeStudents = students.filter(s => s.status === 'aktif').length
  const inactiveStudents = students.filter(s => s.status !== 'aktif').length

  const studentsByClass = students.reduce((acc, student) => {
    const className = student.class?.name || 'Tanpa Kelas'
    if (!acc[className]) {
      acc[className] = []
    }
    acc[className].push(student)
    return acc
  }, {} as Record<string, Student[]>)

  return (
    <DashboardLayout role="kepsek" userName="Kepala Sekolah">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Data Siswa</h1>
            <p className="text-muted-foreground mt-2">
              Monitoring data siswa seluruh kelas dari database
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari siswa..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterKelas} onValueChange={setFilterKelas}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Kelas</SelectItem>
                <SelectItem value="A">Kelas A</SelectItem>
                <SelectItem value="B">Kelas B</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchStudents}>
              <Loader2 className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">Semua kelas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Siswa Aktif</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0}% siswa aktif
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jumlah Kelas</CardTitle>
              <Baby className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{Object.keys(studentsByClass).length}</div>
              <p className="text-xs text-muted-foreground mt-1">Kelas terisi</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tidak Aktif</CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{inactiveStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalStudents > 0 ? Math.round((inactiveStudents / totalStudents) * 100) : 0}% dari total
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Jumlah Siswa Per Kelas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(studentsByClass).length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Belum ada data kelas</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Object.entries(studentsByClass).map(([className, classStudents]) => {
                  const percentage = Math.min((classStudents.length / 20) * 100, 100)
                  const ageGroup = classStudents[0]?.class?.ageGroup || '-'
                  return (
                    <div key={className} className="p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <Baby className={`h-5 w-5 ${ageGroup === 'A' ? 'text-blue-600' : 'text-green-600'}`} />
                        <h3 className="font-semibold">Kelas {className}</h3>
                      </div>
                      <div className="text-2xl font-bold">{classStudents.length} siswa</div>
                      <p className="text-sm text-muted-foreground mt-1">Kapasitas: 20</p>
                      <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${ageGroup === 'A' ? 'bg-blue-600' : 'bg-green-600'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Siswa {filterKelas === 'semua' ? 'Semua Kelas' : filterKelas}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Belum ada data siswa di database</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Tidak ada siswa yang cocok dengan filter</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>NIS</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Jenis Kelamin</TableHead>
                    <TableHead>Tanggal Masuk</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.nis}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.class?.name || 'Tanpa Kelas'}</Badge>
                      </TableCell>
                      <TableCell>{student.gender}</TableCell>
                      <TableCell>{student.birthDate}</TableCell>
                      <TableCell>
                        <Badge className={student.status === 'aktif' ? 'bg-green-600' : 'bg-red-600'}>
                          {student.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(student)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-green-600" />
                Siswa Aktif
              </CardTitle>
            </CardHeader>
            <CardContent>
              {students.filter(s => s.status === 'aktif').length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Tidak ada siswa aktif</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Orang Tua</TableHead>
                      <TableHead>Kontak</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students
                      .filter(s => s.status === 'aktif')
                      .slice(0, 5)
                      .map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{student.class?.name || '-'}</Badge>
                          </TableCell>
                          <TableCell>
                            {student.parent?.fatherName || student.parent?.motherName || '-'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {student.parent?.fatherPhone || student.parent?.motherPhone || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserX className="h-5 w-5 text-red-600" />
                Siswa Tidak Aktif/Keluar
              </CardTitle>
            </CardHeader>
            <CardContent>
              {students.filter(s => s.status !== 'aktif').length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Tidak ada siswa keluar</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Kelas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students
                      .filter(s => s.status !== 'aktif')
                      .slice(0, 5)
                      .map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>
                            <Badge className="bg-red-600">{student.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{student.class?.name || '-'}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Detail Siswa
              </DialogTitle>
              <DialogDescription>
                Informasi lengkap data siswa dan orang tua
              </DialogDescription>
            </DialogHeader>
            {selectedStudent && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedStudent.name}</h3>
                    <Badge className={selectedStudent.status === 'aktif' ? 'bg-green-600' : 'bg-red-600'}>
                      {selectedStudent.status === 'aktif' ? 'Aktif' : selectedStudent.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground w-28">NIS</span>
                    <span className="font-medium">{selectedStudent.nis}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground w-28">Tanggal Lahir</span>
                    <span className="font-medium">{selectedStudent.birthDate}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground w-28">Jenis Kelamin</span>
                    <span className="font-medium">{selectedStudent.gender}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Baby className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground w-28">Kelas</span>
                    <span className="font-medium">{selectedStudent.class?.name ? `Kelas ${selectedStudent.class.name}` : 'Tanpa Kelas'}</span>
                  </div>
                  {selectedStudent.address && (
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="text-muted-foreground w-28">Alamat</span>
                      <span className="font-medium">{selectedStudent.address}</span>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <h4 className="text-sm font-semibold">Data Ayah</h4>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground w-28">Nama</span>
                      <span className="font-medium">{selectedStudent.parent?.fatherName || '-'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground w-28">Pekerjaan</span>
                      <span className="font-medium">{selectedStudent.parent?.fatherOccupation || '-'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground w-28">No. HP</span>
                      {selectedStudent.parent?.fatherPhone ? (
                        <a href={`tel:${selectedStudent.parent.fatherPhone}`} className="font-medium text-primary hover:underline">{selectedStudent.parent.fatherPhone}</a>
                      ) : (
                        <span className="font-medium">-</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground w-28">Email</span>
                      {selectedStudent.parent?.fatherEmail ? (
                        <a href={`mailto:${selectedStudent.parent.fatherEmail}`} className="font-medium text-primary hover:underline break-all">{selectedStudent.parent.fatherEmail}</a>
                      ) : (
                        <span className="font-medium">-</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <h4 className="text-sm font-semibold">Data Ibu</h4>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground w-28">Nama</span>
                      <span className="font-medium">{selectedStudent.parent?.motherName || '-'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground w-28">Pekerjaan</span>
                      <span className="font-medium">{selectedStudent.parent?.motherOccupation || '-'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground w-28">No. HP</span>
                      {selectedStudent.parent?.motherPhone ? (
                        <a href={`tel:${selectedStudent.parent.motherPhone}`} className="font-medium text-primary hover:underline">{selectedStudent.parent.motherPhone}</a>
                      ) : (
                        <span className="font-medium">-</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground w-28">Email</span>
                      {selectedStudent.parent?.motherEmail ? (
                        <a href={`mailto:${selectedStudent.parent.motherEmail}`} className="font-medium text-primary hover:underline break-all">{selectedStudent.parent.motherEmail}</a>
                      ) : (
                        <span className="font-medium">-</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <h4 className="text-sm font-semibold">Alamat Orang Tua</h4>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span className="font-medium">{selectedStudent.parent?.address || '-'}</span>
                  </div>
                </div>

                <Button variant="outline" onClick={() => setSelectedStudent(null)} className="w-full">
                  Tutup
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}