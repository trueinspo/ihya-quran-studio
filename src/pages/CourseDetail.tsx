import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, PlayCircle, CheckCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCourse } from '@/lib/queries/courses';
import { useLessons } from '@/lib/queries/lessons';
import { useEnrollment, useEnroll } from '@/lib/queries/enrollments';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { isArabic } = useLanguage();
  const { user } = useAuth();
  const [tab, setTab] = useState<'overview' | 'content' | 'enroll'>('overview');

  const { data: course, isLoading: courseLoading } = useCourse(id ?? '');
  const { data: lessons = [], isLoading: lessonsLoading } = useLessons(id ?? '');
  const { data: enrollment } = useEnrollment(id ?? '');
  const enroll = useEnroll(id ?? '');

  const tabs = [
    { key: 'overview' as const, label: t('course_detail.overview') },
    { key: 'content' as const, label: t('course_detail.content') },
    { key: 'enroll' as const, label: t('course_detail.enroll') },
  ];

  if (courseLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-16 bg-hero-gradient h-60 animate-pulse" />
        <div className="container mx-auto px-4 py-8 space-y-4">
          <div className="h-8 bg-muted rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground font-arabic">الدورة غير موجودة</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero banner */}
      <div className="pt-16 bg-hero-gradient text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-4xl font-bold font-arabic"
          >
            {isArabic ? course.title_ar : course.title_en}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-primary-foreground/80 font-arabic max-w-2xl"
            style={{ lineHeight: 1.9 }}
          >
            {isArabic ? course.description_ar : course.description_en}
          </motion.p>
          <div className="flex gap-6 mt-4 text-sm text-primary-foreground/60">
            <span>{course.lesson_count} {t('course_detail.lessons_count')}</span>
            <span>{course.student_count} {t('courses_section.students')}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-8 max-w-md">
          {tabs.map((tab_item) => (
            <button
              key={tab_item.key}
              onClick={() => setTab(tab_item.key)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === tab_item.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab_item.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl"
          >
            <p className="text-foreground/80 font-arabic" style={{ lineHeight: 1.9 }}>
              {isArabic ? course.description_ar : course.description_en}
            </p>
          </motion.div>
        )}

        {tab === 'content' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl space-y-2"
          >
            {lessonsLoading ? (
              [1,2,3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
              ))
            ) : (
              lessons.map((lesson, i) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 bg-card rounded-xl border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {i + 1}
                    </span>
                    <span className="font-arabic text-foreground">
                      {isArabic ? lesson.title_ar : lesson.title_en}
                    </span>
                  </div>
                  {enrollment ? (
                    <PlayCircle className="w-4 h-4 text-primary" />
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              ))
            )}
            {!enrollment && (
              <p className="text-sm text-muted-foreground text-center mt-4 font-arabic">
                {t('course_detail.locked')}
              </p>
            )}
          </motion.div>
        )}

        {tab === 'enroll' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md text-center mx-auto py-8"
          >
            {enrollment ? (
              <>
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground font-arabic">
                  {isArabic ? 'أنت مسجّل في هذه الدورة' : 'You are enrolled in this course'}
                </h3>
              </>
            ) : (
              <>
                <PlayCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2 font-arabic">
                  {t('course_detail.enroll_free')}
                </h3>
                {!user ? (
                  <Link
                    to="/register"
                    className="inline-flex mt-4 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 active:scale-[0.97]"
                  >
                    {t('nav.register')}
                  </Link>
                ) : (
                  <button
                    onClick={() => enroll.mutate()}
                    disabled={enroll.isPending}
                    className="mt-4 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {enroll.isPending ? '...' : t('course_detail.enroll_free')}
                  </button>
                )}
              </>
            )}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetail;
