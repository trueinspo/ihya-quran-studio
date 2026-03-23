import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import IslamicPattern from '@/components/IslamicPattern';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient text-primary-foreground">
      {/* Pattern overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <IslamicPattern className="text-primary-foreground" opacity={0.06} />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="particle absolute w-1.5 h-1.5 rounded-full bg-brand-gold/30"
          style={{
            left: `${15 + i * 14}%`,
            animationDuration: `${12 + i * 3}s`,
            animationDelay: `${i * 2}s`,
          }}
        />
      ))}

      <div className="container mx-auto px-4 text-center relative z-10 pt-20">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="h-px w-12 bg-brand-gold/50" />
          <span className="text-brand-gold text-sm font-semibold tracking-wide font-arabic">
            {t('hero.label')}
          </span>
          <div className="h-px w-12 bg-brand-gold/50" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight font-arabic"
          style={{ lineHeight: 1.3 }}
        >
          {t('hero.title')}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto font-arabic"
          style={{ lineHeight: 1.9 }}
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/courses"
            className="px-8 py-3.5 rounded-xl bg-primary-foreground text-primary font-semibold text-base hover:bg-primary-foreground/90 transition-all duration-200 active:scale-[0.97] shadow-lg shadow-black/10"
          >
            {t('hero.cta_courses')}
          </Link>
          <a
            href="#about"
            className="px-8 py-3.5 rounded-xl border-2 border-brand-gold/50 text-brand-gold font-semibold text-base hover:bg-brand-gold/10 transition-all duration-200 active:scale-[0.97]"
          >
            {t('hero.cta_sheikh')}
          </a>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
