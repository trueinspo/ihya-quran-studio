import { useQuery } from '@tanstack/react-query'
import { supabase, Lesson } from '@/lib/supabase'

const fetchLessons = async (courseId: string) => {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order', { ascending: true })
  if (error) throw error
  return data as Lesson[]
}

export const useLessons = (courseId: string) =>
  useQuery({
    queryKey: ['lessons', courseId],
    queryFn: () => fetchLessons(courseId),
    enabled: !!courseId,
  })
