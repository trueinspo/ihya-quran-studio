import { useTranslation } from 'react-i18next'
import { BookOpen, Users, GraduationCap } from 'lucide-react'
import { useAdminStats } from '@/lib/queries/admin'
import { useAuth } from '@/contexts/AuthContext'

const Dashboard = () => {
  const { t } = useTranslation()
  const { profile } = useAuth()
  const { data: stats, isLoading } = useAdminStats()

  const cards = [
    {
      label: t('admin.total_courses'),
      value: stats?.courseCount,
      icon: BookOpen,
      bg: 'bg-primary/10',
      text: 'text-primary',
    },
    {
      label: t('admin.total_students'),
      value: stats?.studentCount,
      icon: Users,
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      text: 'text-blue-600',
    },
    {
      label: t('admin.total_enrollments'),
      value: stats?.enrollmentCount,
      icon: GraduationCap,
      bg: 'bg-amber-100 dark:bg-amber-900/20',
      text: 'text-amber-600',
    },
  ]

  return (
    <div dir="rtl">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground font-arabic">
          أهلاً، {profile?.full_name?.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground text-sm font-arabic mt-1">{t('admin.dashboard_subtitle')}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="bg-card rounded-2xl border border-border p-6">
            <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
              <card.icon size={22} className={card.text} />
            </div>
            <p className="text-muted-foreground text-sm font-arabic">{card.label}</p>
            <p className="text-3xl font-bold text-foreground mt-1 tabular-nums">
              {isLoading ? (
                <span className="inline-block w-12 h-8 bg-muted rounded animate-pulse" />
              ) : (
                card.value ?? 0
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="text-base font-semibold text-foreground font-arabic mb-4">{t('admin.quick_actions')}</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/courses"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors font-arabic"
          >
            <BookOpen size={15} />
            {t('admin.manage_courses')}
          </a>
          <a
            href="/admin/students"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors font-arabic"
          >
            <Users size={15} />
            {t('admin.manage_students')}
          </a>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
