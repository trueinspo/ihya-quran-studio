import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useCourses } from '@/lib/queries/courses'
import { useAdminStudents, useAssignCourseToStudent, useRemoveStudentEnrollment } from '@/lib/queries/admin'
import { Course, CourseAccessType } from '@/lib/supabase'

interface StudentEnrollmentItem {
  id: string
  course_id: string
  status: string
  enrolled_at: string
  courses?: {
    id: string
    title_ar: string
    title_en: string
    access_type: CourseAccessType
  }[] | null
}

interface StudentRow {
  id: string
  full_name: string | null
  created_at: string
  enrollments?: StudentEnrollmentItem[] | null
}

const AdminStudents = () => {
  const { t } = useTranslation()
  const { data: students = [], isLoading } = useAdminStudents()
  const { data: courses = [] } = useCourses()
  const assignCourse = useAssignCourseToStudent()
  const removeEnrollment = useRemoveStudentEnrollment()
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(null)

  const enrollmentMap = new Map(((students as unknown as StudentRow[]).find((student) => student.id === selectedStudent?.id)?.enrollments ?? []).map((enrollment) => [enrollment.course_id, enrollment]))

  return (
    <div dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground font-arabic">{t('admin.students')}</h1>
        <p className="text-sm text-muted-foreground font-arabic mt-1">{t('admin.total_students')}: {students.length}</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((item) => <div key={item} className="h-16 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : students.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground font-arabic">{t('admin.no_students')}</div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-right px-5 py-3 font-medium text-muted-foreground font-arabic">{t('admin.student_name')}</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground font-arabic">{t('admin.enrolled_count')}</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground font-arabic">{t('admin.joined_date')}</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground font-arabic">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {(students as StudentRow[]).map((student) => (
                <tr key={student.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">{student.full_name?.[0]?.toUpperCase() ?? '?'}</div>
                      <p className="font-medium text-foreground font-arabic">{student.full_name ?? '—'}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center"><Badge variant="secondary" className="tabular-nums">{(student.enrollments ?? []).length}</Badge></td>
                  <td className="px-4 py-3.5 text-muted-foreground text-xs font-arabic">{new Date(student.created_at).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  <td className="px-4 py-3.5 text-center"><Button size="sm" variant="outline" className="font-arabic" onClick={() => setSelectedStudent(student)}>{t('admin.manage_assignments')}</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <SheetContent side="left" className="w-[560px] sm:max-w-[560px] overflow-y-auto" dir="rtl">
          <SheetHeader>
            <SheetTitle className="font-arabic">{t('admin.manage_assignments')}</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-border bg-muted/40 p-4">
              <p className="font-arabic font-semibold text-foreground">{selectedStudent?.full_name}</p>
              <p className="mt-1 text-sm text-muted-foreground font-arabic">{t('admin.assignment_hint')}</p>
            </div>

            {(courses as Course[]).map((course) => {
              const enrollment = enrollmentMap.get(course.id)
              return (
                <div key={course.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-arabic font-medium text-foreground">{course.title_ar}</p>
                      <p className="text-xs text-muted-foreground">{course.title_en}</p>
                      <div className="flex gap-2 pt-1">
                        <Badge variant="outline" className="font-arabic">{t(`course.access_${course.access_type}`)}</Badge>
                        {enrollment && <Badge variant="secondary" className="font-arabic">{enrollment.status === 'assigned' ? t('student_dashboard.status_assigned') : t('student_dashboard.status_active')}</Badge>}
                      </div>
                    </div>
                    {enrollment ? (
                      <Button variant="ghost" className="font-arabic text-destructive hover:text-destructive" onClick={() => removeEnrollment.mutate(enrollment.id)} disabled={removeEnrollment.isPending}>{t('admin.remove_assignment')}</Button>
                    ) : (
                      <Button className="font-arabic" onClick={() => selectedStudent && assignCourse.mutate({ studentId: selectedStudent.id, courseId: course.id })} disabled={assignCourse.isPending}>{t('admin.assign_course')}</Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default AdminStudents
