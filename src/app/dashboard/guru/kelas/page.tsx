"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, GraduationCap, Baby, Loader2 } from "lucide-react"

interface Class {
  id: string
  name: string
  ageGroup: string
  capacity: number
  teacherId: string | null
  teacherName: string | null
  studentCount: number
  isMyClass?: boolean
}

interface Student {
  id: string
  name: string
  nis: string
  gender: string
  birthDate: string
}

export default function GuruKelasPage() {
  const router = useRouter()
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [teacherClasses, setTeacherClasses] = useState<Class[]>([])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null

      if (!userId) {
        console.error('No userId found in localStorage')
        // Fallback to old API if no userId
        const response = await fetch('/api/classes')
        const data = await response.json()
        if (data.success) {
          setClasses(data.classes)
          setTeacherClasses(data.classes)
        }
        return
      }

      // Use new API with userId
      const response = await fetch(`/api/classes/teacher?userId=${userId}`)
      const data = await response.json()

      if (data.success) {
        setClasses(data.allClasses)
        setTeacherClasses(data.teacherClasses)
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  const handleViewDetail = async (cls: Class) => {
    setSelectedClass(cls)
    setShowDetailModal(true)
    setLoadingStudents(true)
    
    try {
      const response = await fetch(`/api/students?classId=${cls.id}`)
      const data = await response.json()
      if (data.students) {
        setStudents(data.students)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoadingStudents(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Calculate statistics based on teacher's classes only
  const totalClasses = teacherClasses.length
  const totalStudents = teacherClasses.reduce((sum, cls) => sum + cls.studentCount, 0)
  const totalCapacity = teacherClasses.reduce((sum, cls) => sum + cls.capacity, 0)
  const capacityPercentage = totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0
  const classesA = teacherClasses.filter(c => c.ageGroup === 'A').length
  const classesB = teacherClasses.filter(c => c.ageGroup === 'B').length
  if (loading) {
    return (
      <DashboardLayout role="guru" userName="Ibu Guru">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="guru" userName="Ibu Guru">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Kelas</h1>
          <p className="text-muted-foreground mt-2">
            Statistik kelas yang Anda ampu, daftar semua kelas sekolah
          </p>
        </div>

        {/* Statistik Kelas */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="card-gradient-1 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClasses}</div>
              <p className="text-xs opacity-80 mt-1">{classesA} Kelas A, {classesB} Kelas B</p>
            </CardContent>
          </Card>

          <Card className="card-gradient-2 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs opacity-80 mt-1">
                {totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0} siswa/kelas rata-rata
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient-3 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Kapasitas</CardTitle>
              <GraduationCap className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCapacity} siswa</div>
              <p className="text-xs opacity-80 mt-1">
                {capacityPercentage}% terisi • {totalCapacity - totalStudents} slot kosong
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabel Data Kelas */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Kelas</CardTitle>
          </CardHeader>
          <CardContent>
            {classes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Belum ada data kelas
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Kelas</TableHead>
                    <TableHead>Kelompok Usia</TableHead>
                    <TableHead>Wali Kelas</TableHead>
                    <TableHead>Jumlah Siswa</TableHead>
                    <TableHead>Kapasitas</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((cls) => (
                    <TableRow key={cls.id} className={cls.isMyClass ? "bg-primary/5" : ""}>
                      <TableCell className="font-medium">
                        {cls.name}
                        {cls.isMyClass && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                            Kelas Anda
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Baby className="h-4 w-4 text-primary" />
                          {cls.ageGroup} ({cls.ageGroup === 'A' ? '4-5' : '5-6'} Tahun)
                        </div>
                      </TableCell>
                      <TableCell>{cls.teacherName || '-'}</TableCell>
                      <TableCell>{cls.studentCount} siswa</TableCell>
                      <TableCell>{cls.capacity} siswa</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetail(cls)}
                        >
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
      </div>

      {/* Detail Kelas Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Detail Kelas {selectedClass?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedClass && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Nama Kelas</p>
                    <p className="font-semibold">{selectedClass.name}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Kelompok Usia</p>
                    <p className="font-semibold">{selectedClass.ageGroup} ({selectedClass.ageGroup === 'A' ? '4-5' : '5-6'} Tahun)</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Wali Kelas</p>
                    <p className="font-semibold">{selectedClass.teacherName || '-'}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Kapasitas</p>
                    <p className="font-semibold">{selectedClass.studentCount}/{selectedClass.capacity} siswa</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Daftar Siswa ({students.length} siswa)
                  </h3>
                  {loadingStudents ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : students.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border rounded-lg">
                      Belum ada siswa di kelas ini
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {students.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-semibold text-sm">{student.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{student.name}</p>
                              <p className="text-xs text-muted-foreground">NIS: {student.nis} • {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Tanggal Lahir</p>
                            <p className="text-sm font-medium">{formatDate(student.birthDate)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
