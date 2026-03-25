import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase, LessonProgress } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

const fetchCourseProgress = async (userId: string, courseId: string) => {
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)

  if (error) throw error
  return data as LessonProgress[]
}

export const useCourseProgress = (courseId: string) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['course-progress', user?.id, courseId],
    queryFn: () => fetchCourseProgress(user!.id, courseId),
    enabled: !!user && !!courseId,
  })
}

export const useUpsertLessonProgress = (courseId: string) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ lessonId, completed }: { lessonId: string; completed: boolean }) => {
      if (!user) throw new Error('Not authenticated')

      const payload = {
        user_id: user.id,
        course_id: courseId,
        lesson_id: lessonId,
        completed_at: completed ? new Date().toISOString() : null,
        last_viewed_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('lesson_progress')
        .upsert(payload, { onConflict: 'user_id,lesson_id' })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-progress', user?.id, courseId] })
      queryClient.invalidateQueries({ queryKey: ['my-courses', user?.id] })
    },
  })
}