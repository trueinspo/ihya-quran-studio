import { useQuery } from '@tanstack/react-query'
import { supabase, Course, Enrollment, LessonProgress } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export interface MyCourseItem {
  enrollment: Enrollment
  course: Course
  completedLessons: number
  progressPercent: number
}

const fetchMyCourses = async (userId: string): Promise<MyCourseItem[]> => {
  const [enrollmentsResult, progressResult] = await Promise.all([
    supabase
      .from('enrollments')
      .select('id, user_id, course_id, status, assigned_by, enrolled_at, courses(*)')
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false }),
    supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .not('completed_at', 'is', null),
  ])

  if (enrollmentsResult.error) throw enrollmentsResult.error
  if (progressResult.error) throw progressResult.error

  const completedByCourse = new Map<string, number>()
  for (const row of (progressResult.data as LessonProgress[]) ?? []) {
    completedByCourse.set(row.course_id, (completedByCourse.get(row.course_id) ?? 0) + 1)
  }

  return ((enrollmentsResult.data as Array<Enrollment & { courses: Course }>) ?? []).map((row) => {
    const course = row.courses as Course
    const completedLessons = completedByCourse.get(row.course_id) ?? 0
    const progressPercent = course.lesson_count > 0
      ? Math.round((completedLessons / course.lesson_count) * 100)
      : 0

    return {
      enrollment: {
        id: row.id,
        user_id: row.user_id,
        course_id: row.course_id,
        status: row.status,
        assigned_by: row.assigned_by,
        enrolled_at: row.enrolled_at,
      },
      course,
      completedLessons,
      progressPercent,
    }
  })
}

export const useMyCourses = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['my-courses', user?.id],
    queryFn: () => fetchMyCourses(user!.id),
    enabled: !!user,
  })
}