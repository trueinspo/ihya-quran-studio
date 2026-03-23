import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, PlayCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const coursesData: Record<string, { key: string; lessons: { titleKey: string }[] }> = {
  '1': {
    key: 'course_1',
    lessons: [
      { titleKey: 'مقدمة في تحفة الأطفال' },
      { titleKey: 'أحكام النون الساكنة والتنوين' },
      { titleKey: 'الإظهار الحلقي' },
      { titleKey: 'الإدغام بغنة وبدون غنة' },
      { titleKey: 'الإقلاب والإخفاء' },
    ],
  },
  '2': {
    key: 'course_2',
    lessons: [
      { titleKey: 'تعريف علم القراءات' },
      { titleKey: 'الفرق بين القراءة والرواية والطريق' },
      { titleKey: 'أسانيد القراء العشرة' },
    ],
  },
  '3': {
    key: 'course_3',
    lessons: [
      { titleKey: 'آداب حامل القرآن' },
      { titleKey: 'آداب المعلم والمتعلم' },
      { titleKey: 'فضائل تلاوة القرآن' },
    ],
  },
};

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [tab, setTab] = useState<'overview' | 'content' | 'enroll'>('overview');

  const course = coursesData[id || '1'] || coursesData['1'];

  const tabs = [
    { key: 'overview' as const, label: t('course_detail.overview') },
    { key: 'content' as const, label: t('course_detail.content') },
    { key: 'enroll' as const, label: t('course_detail.enroll') },
  ];

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
            {t(`sample_courses.${course.key}_title`)}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-primary-foreground/80 font-arabic max-w-2xl"
            style={{ lineHeight: 1.9 }}
          >
            {t(`sample_courses.${course.key}_desc`)}
          </motion.p>
          <div className="flex gap-6 mt-4 text-sm text-primary-foreground/60">
            <span>{course.lessons.length} {t('course_detail.lessons_count')}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-8 max-w-md">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === t.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
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
              {t(`sample_courses.${course.key}_desc`)}
            </p>
          </motion.div>
        )}

        {tab === 'content' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl space-y-2"
          >
            {course.lessons.map((lesson, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-card rounded-xl border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span className="font-arabic text-foreground">{lesson.titleKey}</span>
                </div>
                <Lock className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
            <p className="text-sm text-muted-foreground text-center mt-4 font-arabic">
              {t('course_detail.locked')}
            </p>
          </motion.div>
        )}

        {tab === 'enroll' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md text-center mx-auto py-8"
          >
            <PlayCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2 font-arabic">
              {t('course_detail.enroll_free')}
            </h3>
            <Link
              to="/register"
              className="inline-flex mt-4 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 active:scale-[0.97]"
            >
              {t('nav.register')}
            </Link>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetail;
