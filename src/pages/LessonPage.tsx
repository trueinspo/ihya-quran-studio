import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCourse } from '@/lib/queries/courses';
import { useLesson, useLessons } from '@/lib/queries/lessons';
import { useEnrollment } from '@/lib/queries/enrollments';
import { useCourseProgress, useUpsertLessonProgress } from '@/lib/queries/progress';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const LessonPage = () => {
  const { courseId = '', lessonId = '' } = useParams<{ courseId: string; lessonId: string }>();
  const { t } = useTranslation();
  const { isArabic } = useLanguage();
  const { user } = useAuth();
  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const { data: lesson, isLoading: lessonLoading } = useLesson(courseId, lessonId);
  const { data: lessons = [] } = useLessons(courseId);
  const { data: enrollment } = useEnrollment(courseId);
  const { data: progress = [] } = useCourseProgress(courseId);
  const upsertProgress = useUpsertLessonProgress(courseId);

  const currentIndex = lessons.findIndex((item) => item.id === lessonId);
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 ? lessons[currentIndex + 1] : null;
  const progressRow = progress.find((item) => item.lesson_id === lessonId);
  const hasAccess = !!enrollment || course?.access_type === 'public' || lesson?.is_preview;

  useEffect(() => {
    if (!user || !lesson || !hasAccess || !enrollment) return;
    upsertProgress.mutate({ lessonId: lesson.id, completed: !!progressRow?.completed_at });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, lesson?.id]);

  if (courseLoading || lessonLoading) {
    return <div className="min-h-screen"><Navbar /><div className="h-60 animate-pulse bg-hero-gradient pt-16" /></div>;
  }

  if (!course || !lesson) return <Navigate to={`/courses/${courseId}`} replace />;
  if (!hasAccess) return <Navigate to={`/courses/${courseId}`} replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground font-arabic">{isArabic ? course.title_ar : course.title_en}</p>
            <h1 className="mt-1 text-3xl font-bold text-foreground font-arabic">{isArabic ? lesson.title_ar : lesson.title_en}</h1>
          </div>
          {lesson.is_preview && <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-arabic text-primary">{t('lesson.preview')}</span>}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.8fr_0.9fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground font-arabic">{t('lesson.summary')}</h2>
              <p className="font-arabic text-muted-foreground" style={{ lineHeight: 1.9 }}>
                {isArabic ? lesson.summary_ar || lesson.content_ar.slice(0, 160) : lesson.summary_en || lesson.content_en.slice(0, 160)}
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground font-arabic">{t('lesson.content')}</h2>
              {lesson.video_url && (
                <a href={lesson.video_url} target="_blank" rel="noreferrer" className="mb-4 inline-flex text-sm font-medium text-primary hover:text-primary/80">
                  {t('lesson.watch_video')}
                </a>
              )}
              <div className="whitespace-pre-wrap font-arabic text-foreground/80" style={{ lineHeight: 1.95 }}>
                {isArabic ? lesson.content_ar : lesson.content_en}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="mb-3 text-base font-semibold text-foreground font-arabic">{t('lesson.progress')}</h2>
              <p className="text-sm font-arabic text-muted-foreground">{progressRow?.completed_at ? t('lesson.completed') : t('lesson.not_completed')}</p>
              {!!user && !!enrollment && (
                <Button className="mt-4 w-full font-arabic" onClick={() => upsertProgress.mutate({ lessonId, completed: !progressRow?.completed_at })} disabled={upsertProgress.isPending}>
                  {upsertProgress.isPending ? '...' : progressRow?.completed_at ? t('lesson.mark_incomplete') : t('lesson.mark_complete')}
                </Button>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <h2 className="text-base font-semibold text-foreground font-arabic">{t('lesson.lesson_navigation')}</h2>
              {previousLesson ? <Link to={`/courses/${courseId}/lessons/${previousLesson.id}`} className="block rounded-xl border border-border px-4 py-3 font-arabic hover:bg-muted">{t('lesson.previous_lesson')}</Link> : null}
              {nextLesson ? <Link to={`/courses/${courseId}/lessons/${nextLesson.id}`} className="block rounded-xl bg-primary px-4 py-3 font-arabic font-semibold text-primary-foreground hover:bg-primary/90">{t('lesson.next_lesson')}</Link> : null}
              <Link to={`/courses/${courseId}`} className="block rounded-xl border border-border px-4 py-3 text-center font-arabic hover:bg-muted">{t('lesson.back_to_course')}</Link>
            </section>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LessonPage;