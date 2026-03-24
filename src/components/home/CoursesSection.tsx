import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCourses } from '@/lib/queries/courses';
import { useLanguage } from '@/hooks/useLanguage';

const CoursesSection = () => {
  const { t } = useTranslation();
  const { isArabic } = useLanguage();
  const { data: courses = [], isLoading } = useCourses();

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-4xl font-bold text-secondary text-center mb-12 font-arabic"
        >
          {t('courses_section.title')}
        </motion.h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 card-hover group">
                  <div className="h-44 bg-hero-gradient relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" className="text-primary-foreground/20">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                      </svg>
                    </div>
                    {course.is_free && (
                      <div className="absolute top-3 start-3">
                        <span className="bg-brand-gold text-secondary text-xs font-semibold px-3 py-1 rounded-full">
                          {t('courses_section.free')}
                        </span>
                      </div>
                    )}
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
    </section>
  );
};

export default CoursesSection;
