import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Lesson } from '@/lib/supabase'

type LessonInsert = Omit<Lesson, 'id' | 'created_at'>
type LessonUpdate = Partial<LessonInsert> & { id: string; course_id: string }

const fetchLessons = async (courseId: string) => {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order', { ascending: true })
  if (error) throw error
  return data as Lesson[]
}

const fetchLesson = async (courseId: string, lessonId: string) => {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .eq('id', lessonId)
    .single()
  if (error) throw error
  return data as Lesson
}

export const useLessons = (courseId: string) =>
  useQuery({
    queryKey: ['lessons', courseId],
    queryFn: () => fetchLessons(courseId),
    enabled: !!courseId,
  })

export const useLesson = (courseId: string, lessonId: string) =>
  useQuery({
    queryKey: ['lesson', courseId, lessonId],
    queryFn: () => fetchLesson(courseId, lessonId),
    enabled: !!courseId && !!lessonId,
  })

export const useCreateLesson = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: LessonInsert) => {
      const { data, error } = await supabase.from('lessons').insert(input).select().single()
      if (error) throw error
      return data as Lesson
    },
    onSuccess: (_data, { course_id }) => qc.invalidateQueries({ queryKey: ['lessons', course_id] }),
  })
}

export const useUpdateLesson = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, course_id, ...input }: LessonUpdate) => {
      const { data, error } = await supabase.from('lessons').update(input).eq('id', id).select().single()
      if (error) throw error
      return data as Lesson
    },
    onSuccess: (_data, { course_id }) => qc.invalidateQueries({ queryKey: ['lessons', course_id] }),
  })
}

export const useDeleteLesson = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id }: { id: string; course_id: string }) => {
      const { error } = await supabase.from('lessons').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: (_data, { course_id }) => qc.invalidateQueries({ queryKey: ['lessons', course_id] }),
  })
}
