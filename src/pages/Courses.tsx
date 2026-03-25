import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCourses } from '@/lib/queries/courses';
import { useLanguage } from '@/hooks/useLanguage';
import { Course, CourseCategory } from '@/lib/supabase';

const categories = ['all', 'tajweed', 'qiraat', 'adab'] as const;

const Courses = () => {
  const { t } = useTranslation();
  const { isArabic } = useLanguage();
  const [filter, setFilter] = useState<string>('all');

  const category = filter === 'all' ? undefined : (filter as CourseCategory);
  const { data: courses = [], isLoading } = useCourses(category);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-secondary font-arabic mb-3">
              {t('courses_page.title')}
            </h1>
            <p className="text-muted-foreground font-arabic">{t('courses_page.subtitle')}</p>
          </motion.div>

          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                  filter === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-foreground/70 border border-border hover:bg-muted'
                }`}
              >
                {t(`courses_page.filter_${cat}`)}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border/50 animate-pulse">
                  <div className="h-44 bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <p className="text-center text-muted-foreground font-arabic py-20">{t('courses_page.no_courses')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(courses as Course[]).map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 card-hover">
                    <div className="h-44 bg-hero-gradient relative">
                      <div className="absolute top-3 start-3 flex gap-2 flex-wrap">
                        <span className="bg-brand-gold text-secondary text-xs font-semibold px-3 py-1 rounded-full">
                          {t(`course.access_${course.access_type}`)}
                        </span>
                        <span className="bg-card/90 text-secondary text-xs font-semibold px-3 py-1 rounded-full">
                          {course.access_type === 'paid' ? `$${course.price_usd}` : t('course.price_free')}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-foreground mb-2 font-arabic leading-relaxed">
                        {isArabic ? course.title_ar : course.title_en}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 font-arabic" style={{ lineHeight: 1.9 }}>
                        {isArabic ? course.description_ar : course.description_en}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>{course.lesson_count} {t('courses_section.lessons')}</span>
                          <span>{course.student_count} {t('courses_section.students')}</span>
                        </div>
                        <Link
                          to={`/courses/${course.id}`}
                          className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                        >
                          {t('courses_section.details')} ←
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Courses;
