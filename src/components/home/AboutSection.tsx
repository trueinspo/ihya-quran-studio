import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const CountUp = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const steps = 40;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-primary font-arabic">+{count}</div>
      <div className="text-sm text-muted-foreground mt-1 font-arabic">{suffix}</div>
    </div>
  );
};

const AboutSection = () => {
  const { t } = useTranslation();

  const bioPoints = [
    t('about.bio_1'),
    t('about.bio_2'),
    t('about.bio_3'),
    t('about.bio_4'),
    t('about.bio_5'),
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Photo placeholder */}
          <div className="flex justify-center order-2 md:order-1">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center ring-4 ring-primary/20 ring-offset-4 ring-offset-card shadow-2xl shadow-primary/10">
                <span className="text-5xl md:text-6xl font-bold text-primary font-arabic">ق.ب</span>
              </div>
              {/* Gold glow */}
              <div className="absolute -inset-4 rounded-3xl bg-brand-gold/5 -z-10 blur-xl" />
            </div>
          </div>

          {/* Bio text */}
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 font-arabic">
              {t('about.title')}
            </h2>
            <p className="text-lg font-semibold text-primary mb-6 font-arabic">
              {t('about.name')}
            </p>
            <ul className="space-y-3">
              {bioPoints.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-3 text-foreground/80 font-arabic"
                  style={{ lineHeight: 1.9 }}
                >
                  <span className="mt-2 w-2 h-2 rounded-full bg-brand-gold shrink-0" />
                  <span>{point}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
        >
          <CountUp target={13} suffix={t('about.stat_years')} />
          <CountUp target={500} suffix={t('about.stat_students')} />
          <CountUp target={10} suffix={t('about.stat_courses')} />
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
