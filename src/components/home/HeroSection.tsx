import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import IslamicPattern from '@/components/IslamicPattern';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen overflow-hidden bg-hero-gradient text-primary-foreground">
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

      <div className="relative z-10 min-h-screen pt-20">
        <div className="container mx-auto grid min-h-[calc(100vh-5rem)] grid-cols-1 items-stretch gap-10 px-4 pb-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-0">
          <motion.div
            initial={{ opacity: 0, x: -24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 flex items-center justify-center lg:order-1 lg:justify-start"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.025 }}
              className="group relative w-full max-w-xl self-stretch lg:h-full"
            >
              <div className="absolute -inset-3 rounded-[2rem] bg-white/14 blur-2xl" />
              <div className="absolute inset-0 rounded-[2rem] border border-white/35 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_22px_60px_rgba(255,255,255,0.12)]" />
              <div className="relative h-[320px] overflow-hidden rounded-[2rem] border border-white/20 bg-white/8 backdrop-blur-[2px] md:h-[440px] lg:h-full lg:min-h-[620px]">
                <motion.img
                  src="/hero-image.png"
                  alt={t('hero.title')}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/12 via-transparent to-white/8" />
              </div>
            </motion.div>
          </motion.div>

          <div className="order-2 flex items-center lg:order-2">
            <div className="w-full py-6 text-center lg:text-right">
              <motion.div
                initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mb-6 flex items-center justify-center gap-3 lg:justify-start"
              >
                <div className="h-px w-12 bg-brand-gold/50" />
                <span className="text-brand-gold text-sm font-semibold tracking-wide font-arabic">
                  {t('hero.label')}
                </span>
                <div className="h-px w-12 bg-brand-gold/50" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="font-arabic text-4xl font-bold leading-[1.25] sm:text-5xl md:text-6xl lg:text-[4.2rem]"
              >
                <span className="block">{t('hero.title_line_1')}</span>
                <span className="mt-1 block text-brand-gold">{t('hero.title_line_2')}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/82 font-arabic md:text-xl lg:mx-0"
                style={{ lineHeight: 1.9 }}
              >
                {t('hero.subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
              >
                <Link
                  to="/courses"
                  className="inline-flex min-w-[180px] items-center justify-center rounded-xl bg-primary-foreground px-8 py-3.5 text-base font-semibold text-primary shadow-lg shadow-black/10 transition-all duration-200 hover:bg-primary-foreground/92 active:scale-[0.97]"
                >
                  {t('hero.cta_courses')}
                </Link>
                <a
                  href="#about"
                  className="inline-flex min-w-[180px] items-center justify-center rounded-xl border-2 border-primary-foreground/45 bg-white/5 px-8 py-3.5 text-base font-semibold text-primary-foreground transition-all duration-200 hover:bg-white/10 hover:border-primary-foreground/65 active:scale-[0.97]"
                >
                  {t('hero.cta_sheikh')}
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
