import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

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
    .select('id, full_name, role, created_at, enrollments(id, course_id, status, enrolled_at, courses(id, title_ar, title_en, access_type))')
    .eq('role', 'student')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const useAdminStats = () =>
  useQuery({ queryKey: ['admin', 'stats'], queryFn: fetchStats })

export const useAdminStudents = () =>
  useQuery({ queryKey: ['admin', 'students'], queryFn: fetchStudents })

export const useAssignCourseToStudent = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ studentId, courseId }: { studentId: string; courseId: string }) => {
      const existing = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', studentId)
        .eq('course_id', courseId)
        .maybeSingle()

      if (existing.error) throw existing.error
      if (existing.data) return existing.data

      const { data, error } = await supabase
        .from('enrollments')
        .insert({ user_id: studentId, course_id: courseId, status: 'assigned', assigned_by: user?.id ?? null })
        .select('id')
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'students'] })
    },
  })
}

export const useRemoveStudentEnrollment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (enrollmentId: string) => {
      const { error } = await supabase.from('enrollments').delete().eq('id', enrollmentId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'students'] })
    },
  })
}

