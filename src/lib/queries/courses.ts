import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Course, CourseCategory } from '@/lib/supabase'

type CourseInsert = Omit<Course, 'id' | 'created_at'>
type CourseUpdate = Partial<CourseInsert> & { id: string }

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

export const useCreateCourse = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: CourseInsert) => {
      const { data, error } = await supabase.from('courses').insert(input).select().single()
      if (error) throw error
      return data as Course
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  })
}

export const useUpdateCourse = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: CourseUpdate) => {
      const { data, error } = await supabase.from('courses').update(input).eq('id', id).select().single()
      if (error) throw error
      return data as Course
    },
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['courses'] })
      qc.invalidateQueries({ queryKey: ['course', id] })
    },
  })
}

export const useDeleteCourse = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('courses').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  })
}
