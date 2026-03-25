import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Enrollment } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

const fetchEnrollment = async (userId: string, courseId: string) => {
  const { data } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle()
  return data as Enrollment | null
}

export const useEnrollment = (courseId: string) => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['enrollment', user?.id, courseId],
    queryFn: () => fetchEnrollment(user!.id, courseId),
    enabled: !!user && !!courseId,
  })
}

export const useEnroll = (courseId: string) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase
        .from('enrollments')
        .insert({ user_id: user.id, course_id: courseId, status: 'active' })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollment', user?.id, courseId] })
      queryClient.invalidateQueries({ queryKey: ['my-courses', user?.id] })
    },
  })
}

export const useUnenroll = (courseId: string) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', courseId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollment', user?.id, courseId] })
      queryClient.invalidateQueries({ queryKey: ['my-courses', user?.id] })
    },
  })
}
