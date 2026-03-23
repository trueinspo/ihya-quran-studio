import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const sampleCourses = [
  { id: '1', key: 'course_1', category: 'tajweed', lessons: 12, students: 147 },
  { id: '2', key: 'course_2', category: 'qiraat', lessons: 8, students: 89 },
  { id: '3', key: 'course_3', category: 'adab', lessons: 6, students: 203 },
];

const categories = ['all', 'tajweed', 'qiraat', 'adab'] as const;

const Courses = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? sampleCourses : sampleCourses.filter(c => c.category === filter);

  const filterLabels: Record<string, string> = {
    all: t('courses_page.filter_all'),
    tajweed: t('courses_page.filter_tajweed'),
    qiraat: t('courses_page.filter_qiraat'),
    adab: t('courses_page.filter_adab'),
  };

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

          {/* Filter */}
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
                {filterLabels[cat]}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 card-hover">
                  <div className="h-44 bg-hero-gradient relative">
                    <div className="absolute top-3 start-3">
                      <span className="bg-brand-gold text-secondary text-xs font-semibold px-3 py-1 rounded-full">
                        {t('courses_section.free')}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-foreground mb-2 font-arabic leading-relaxed">
                      {t(`sample_courses.${course.key}_title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 font-arabic" style={{ lineHeight: 1.9 }}>
                      {t(`sample_courses.${course.key}_desc`)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>{course.lessons} {t('courses_section.lessons')}</span>
                        <span>{course.students} {t('courses_section.students')}</span>
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Courses;
