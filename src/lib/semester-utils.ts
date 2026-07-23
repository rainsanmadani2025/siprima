/**
 * Semester & Academic Year Utilities
 * 
 * Logika tahun ajaran Indonesia:
 * - Semester Ganjil: Juli (7) - Desember (12) → Tahun: YYYY/YYYY+1
 * - Semester Genap: Januari (1) - Juni (6) → Tahun: (YYYY-1)/YYYY
 */

export function getCurrentSemester(): 'Ganjil' | 'Genap' {
  const month = new Date().getMonth() + 1 // 1-12
  return month >= 7 ? 'Ganjil' : 'Genap'
}

export function getCurrentAcademicYear(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  if (month >= 7) return `${year}/${year + 1}`
  return `${year - 1}/${year}`
}

export function getSemesterDateRange(semester: 'Ganjil' | 'Genap'): { start: string; month: string } {
  const year = new Date().getFullYear()
  if (semester === 'Ganjil') {
    return { start: `${year}-07-01`, month: `${year}-07` }
  }
  return { start: `${year}-01-01`, month: `${year}-01` }
}

export function getAcademicYearForSemester(semester: 'Ganjil' | 'Genap'): string {
  const year = new Date().getFullYear()
  if (semester === 'Ganjil') return `${year}/${year + 1}`
  return `${year - 1}/${year}`
}