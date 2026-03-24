import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Database type definitions ────────────────────────────────────────────────

export type Role = 'student' | 'admin'
export type CourseCategory = 'tajweed' | 'qiraat' | 'adab'

export interface Profile {
  id: string
  full_name: string | null
  role: Role
  avatar_url: string | null
  created_at: string
}

export interface Course {
  id: string
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
  category: CourseCategory
  is_free: boolean
  lesson_count: number
  student_count: number
  image_url: string | null
  created_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title_ar: string
  title_en: string
  order: number
  duration: string | null
  created_at: string
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
}
