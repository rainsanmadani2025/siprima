"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  Edit,
  X,
  Save,
  RotateCcw,
  Download,
  Users,
  School
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ClassItem {
  id: string
  name: string
  teacherName: string | null
  studentCount: number
}

interface Student {
  id: string
  name: string
  nis: string
  className: string
}

interface DayAttendance {
  day: number
  date: string
  checkIn?: string
  checkOut?: string
  status: 'hadir' | 'sakit' | 'izin' | 'alpha' | ''
  notes?: string
  isHoliday?: boolean
  isWeekend?: boolean
}

export default function AdminAbsensiPage() {
  const { toast } = useToast()
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const now = new Date()
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [selectedMonthNum, setSelectedMonthNum] = useState(now.getMonth() + 1)
  const selectedMonth = `${selectedYear}-${String(selectedMonthNum).padStart(2, '0')}`
  const [attendanceData, setAttendanceData] = useState<DayAttendance[]>([])
  const [originalData, setOriginalData] = useState<DayAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)

  const [editingDay, setEditingDay] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<{ checkIn: string; checkOut: string; status: string; notes: string; isHoliday: boolean }>({
    checkIn: '',
    checkOut: '',
    status: '',
    notes: '',
    isHoliday: false
  })

  const year = selectedYear
  const month = selectedMonthNum
  const daysInMonth = new Date(year, month, 0).getDate()

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchStudents()
    }
  }, [selectedClass])

  useEffect(() => {
    if (selectedStudent) {
      fetchAttendanceForStudent(selectedStudent.id)
    }
  }, [selectedStudent, selectedMonth])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      const data = await response.json()
      if (data.success && data.classes) {
        setClasses(data.classes)
        if (data.classes.length > 0) {
          setSelectedClass(data.classes[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch(`/api/admin/students-by-class?classId=${selectedClass}`)
      const data = await response.json()
      if (data.success && data.students) {
        setStudents(data.students)
        if (data.students.length > 0) {
          setSelectedStudent(data.students[0])
        } else {
          setSelectedStudent(null)
          setAttendanceData([])
          setOriginalData([])
        }
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const fetchAttendanceForStudent = async (studentId: string) => {
    try {
      const response = await fetch(`/api/admin/attendance/month?month=${selectedMonth}&studentId=${studentId}`)
      const data = await response.json()

      const days: DayAttendance[] = []
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day)
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const dayOfWeek = date.getDay()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

        const existingRecord = data.attendance?.find((a: any) => a.date === dateStr)

        days.push({
          day,
          date: dateStr,
          checkIn: existingRecord?.checkIn || '',
          checkOut: existingRecord?.checkOut || '',
          status: existingRecord?.status || '',
          notes: existingRecord?.notes || '',
          isHoliday: existingRecord?.isHoliday || false,
          isWeekend
        })
      }

      setAttendanceData(days)
      setOriginalData(JSON.parse(JSON.stringify(days)))
    } catch (error) {
      console.error('Error fetching attendance:', error)
    }
  }

  const handleStatusChange = (day: number, status: string) => {
    setAttendanceData(prev => prev.map(d => {
      if (d.day !== day) return d
      const updated = { ...d, status: status as any }
      if (status === 'hadir') {
        if (!updated.checkIn) updated.checkIn = '07:30'
        if (!updated.checkOut) updated.checkOut = '13:00'
      } else {
        updated.checkIn = ''
        updated.checkOut = ''
      }
      return updated
    }))
  }

  const handleTimeChange = (day: number, field: 'checkIn' | 'checkOut', value: string) => {
    setAttendanceData(prev => prev.map(d => {
      if (d.day !== day) return d
      if (value) {
        return { ...d, [field]: value, status: 'hadir' as any }
      }
      const updated = { ...d, [field]: value }
      if (!updated.checkIn && !updated.checkOut) {
        updated.status = ''
      }
      return updated
    }))
  }

  const handleHolidayChange = (day: number, isHoliday: boolean) => {
    setAttendanceData(prev => prev.map(d => {
      if (d.day !== day) return d
      return { ...d, isHoliday, status: '' as any, checkIn: '', checkOut: '', notes: '' }
    }))
  }

  const handleNotesChange = (day: number, notes: string) => {
    setAttendanceData(prev => prev.map(d => {
      if (d.day !== day) return d
      return { ...d, notes }
    }))
  }

  const hasUnsavedChanges = JSON.stringify(attendanceData) !== JSON.stringify(originalData)

  const handleSaveAll = async () => {
    if (!selectedStudent) return
    setSaving(true)
    try {
      const recordsToSave = attendanceData
        .filter(d => !d.isWeekend && (d.status || d.isHoliday || d.checkIn || d.checkOut))
        .map(d => ({
          studentId: selectedStudent.id,
          date: d.date,
          status: d.status || null,
          notes: d.notes || null,
          checkIn: d.checkIn || null,
          checkOut: d.checkOut || null,
          isHoliday: d.isHoliday || false
        }))

      const response = await fetch('/api/admin/attendance/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: selectedMonth, attendances: recordsToSave })
      })

      const data = await response.json()

      if (data.success) {
        toast({ title: "Berhasil", description: `Data absensi berhasil disimpan (${data.count} record)` })
        fetchAttendanceForStudent(selectedStudent.id)
      } else {
        throw new Error(data.error || 'Gagal menyimpan')
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Gagal menyimpan data absensi" })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setAttendanceData(JSON.parse(JSON.stringify(originalData)))
  }

  const handleExportPDF = async () => {
    if (!selectedClass) return
    setExporting(true)
    try {
      const response = await fetch('/api/admin/attendance/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId: selectedClass, month: selectedMonth })
      })

      if (!response.ok) throw new Error('Gagal mengunduh PDF')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `absensi-siswa-${selectedClass}-${selectedMonth}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast({ title: "Berhasil", description: "PDF berhasil diunduh" })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: "Gagal mengunduh PDF" })
    } finally {
      setExporting(false)
    }
  }

  const handleEditDay = (day: number) => {
    const dayData = attendanceData.find(d => d.day === day)
    if (dayData) {
      setEditingDay(day)
      setEditForm({
        checkIn: dayData.checkIn || '',
        checkOut: dayData.checkOut || '',
        status: dayData.status || '',
        notes: dayData.notes || '',
        isHoliday: dayData.isHoliday || false
      })
    }
  }

  const handleUpdateDay = () => {
    if (editingDay === null) return
    setAttendanceData(prev => prev.map(d => {
      if (d.day !== editingDay) return d
      return { ...d, ...editForm, status: editForm.status as any }
    }))
    setEditingDay(null)
  }

  const handleCancelEdit = () => {
    setEditingDay(null)
  }

  const effectiveDays = attendanceData.filter(d => !d.isWeekend && !d.isHoliday).length
  const hadirCount = attendanceData.filter(d => d.status === 'hadir' && !d.isWeekend && !d.isHoliday).length
  const sakitIzinCount = attendanceData.filter(d => (d.status === 'sakit' || d.status === 'izin') && !d.isWeekend && !d.isHoliday).length
  const alphaCount = attendanceData.filter(d => d.status === 'alpha' && !d.isWeekend && !d.isHoliday).length

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']