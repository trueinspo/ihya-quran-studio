import { useTranslation } from 'react-i18next'
import { useAdminStudents } from '@/lib/queries/admin'
import { Badge } from '@/components/ui/badge'

const AdminStudents = () => {
  const { t } = useTranslation()
  const { data: students = [], isLoading } = useAdminStudents()

  return (
    <div dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground font-arabic">{t('admin.students')}</h1>
        <p className="text-sm text-muted-foreground font-arabic mt-1">
          {t('admin.total_students')}: {students.length}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground font-arabic">
          {t('admin.no_students')}
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-right px-5 py-3 font-medium text-muted-foreground font-arabic">
                  {t('admin.student_name')}
                </th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground font-arabic">
                  {t('admin.enrolled_count')}
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground font-arabic">
                  {t('admin.joined_date')}
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {student.full_name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <p className="font-medium text-foreground font-arabic">
                        {student.full_name ?? '—'}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <Badge variant="secondary" className="tabular-nums">
                      {(student.enrollments as { course_id: string }[] | null)?.length ?? 0}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground text-xs font-arabic">
                    {new Date(student.created_at).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminStudents
