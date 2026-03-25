import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useMyCourses } from '@/lib/queries/student';
import { Progress } from '@/components/ui/progress';

const StudentDashboard = () => {
  const { t } = useTranslation();
  const { user, profile, loading } = useAuth();
  const { data: courses = [], isLoading } = useMyCourses();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (profile?.role === 'admin') return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground font-arabic">{t('student_dashboard.title')}</h1>
          <p className="mt-2 text-muted-foreground font-arabic">{t('student_dashboard.subtitle')}</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((item) => <div key={item} className="h-40 rounded-2xl bg-muted animate-pulse" />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="font-arabic text-lg text-foreground">{t('student_dashboard.empty_title')}</p>
            <p className="mt-2 font-arabic text-muted-foreground">{t('student_dashboard.empty_subtitle')}</p>
            <Link to="/courses" className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 font-arabic font-semibold text-primary-foreground hover:bg-primary/90">
              {t('student_dashboard.browse_courses')}
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((item) => (
              <div key={item.enrollment.id} className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-arabic text-lg font-semibold text-foreground">{item.course.title_ar}</p>
                    <p className="text-xs text-muted-foreground">{item.course.title_en}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-arabic text-primary">
                    {t(`course.access_${item.course.access_type}`)}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground font-arabic">
                    <span>{t('student_dashboard.progress')}</span>
                    <span>{item.completedLessons}/{item.course.lesson_count}</span>
                  </div>
                  <Progress value={item.progressPercent} />
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-arabic">
                    <span>{t(`student_dashboard.status_${item.enrollment.status}`)}</span>
                    <span>{item.progressPercent}%</span>
                  </div>
                </div>
                <Link to={`/courses/${item.course.id}`} className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 font-arabic font-semibold text-primary-foreground hover:bg-primary/90">
                  {t('student_dashboard.open_course')}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default StudentDashboard;