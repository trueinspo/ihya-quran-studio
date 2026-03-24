import { useQuery } from '@tanstack/react-query'
import { supabase, Course, CourseCategory } from '@/lib/supabase'

const fetchCourses = async (category?: CourseCategory) => {
  let query = supabase.from('courses').select('*').order('created_at', { ascending: true })
  if (category) query = query.eq('category', category)
  const { data, error } = await query
  if (error) throw error
  return data as Course[]
}

const fetchCourse = async (id: string) => {
  const { data, error } = await supabase.from('courses').select('*').eq('id', id).single()
  if (error) throw error
  return data as Course
}

export const useCourses = (category?: CourseCategory) =>
  useQuery({
    queryKey: ['courses', category ?? 'all'],
    queryFn: () => fetchCourses(category),
  })

export const useCourse = (id: string) =>
  useQuery({
    queryKey: ['course', id],
    queryFn: () => fetchCourse(id),
    enabled: !!id,
  })
