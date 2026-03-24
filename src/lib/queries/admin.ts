import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface AdminStats {
  courseCount: number
  studentCount: number
  enrollmentCount: number
}

const fetchStats = async (): Promise<AdminStats> => {
  const [courses, students, enrollments] = await Promise.all([
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
  ])
  return {
    courseCount: courses.count ?? 0,
    studentCount: students.count ?? 0,
    enrollmentCount: enrollments.count ?? 0,
  }
}

const fetchStudents = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at, enrollments(course_id)')
    .eq('role', 'student')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const useAdminStats = () =>
  useQuery({ queryKey: ['admin', 'stats'], queryFn: fetchStats })

export const useAdminStudents = () =>
  useQuery({ queryKey: ['admin', 'students'], queryFn: fetchStudents })
