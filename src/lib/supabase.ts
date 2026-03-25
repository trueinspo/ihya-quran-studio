import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Database type definitions ────────────────────────────────────────────────

export type Role = 'student' | 'admin'
export type CourseCategory = 'tajweed' | 'qiraat' | 'adab'
export type CourseAccessType = 'public' | 'free' | 'paid' | 'private' | 'assigned'
export type EnrollmentStatus = 'active' | 'assigned' | 'pending_payment' | 'completed'

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
  access_type: CourseAccessType
  price_usd: number
  is_free: boolean
  is_published: boolean
  available_from: string | null
  available_until: string | null
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
  summary_ar: string
  summary_en: string
  content_ar: string
  content_en: string
  video_url: string | null
  resource_url: string | null
  resource_label_ar: string
  resource_label_en: string
  is_preview: boolean
  order: number
  duration: string | null
  created_at: string
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  status: EnrollmentStatus
  assigned_by: string | null
  enrolled_at: string
}

export interface LessonProgress {
  id: string
  user_id: string
  course_id: string
  lesson_id: string
  completed_at: string | null
  last_viewed_at: string
  created_at: string
}
