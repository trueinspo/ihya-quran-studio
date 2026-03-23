import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import IslamicPattern from '@/components/IslamicPattern';

const CTASection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-20 md:py-28 bg-cta-gradient text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <IslamicPattern className="text-primary-foreground" opacity={0.05} />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-gold font-arabic mb-6"
          style={{ lineHeight: 1.5 }}
        >
          {t('cta.ayah')}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto font-arabic"
          style={{ lineHeight: 1.9 }}
        >
          {t('cta.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            to="/register"
            className="inline-flex px-8 py-3.5 rounded-xl bg-primary-foreground text-primary font-semibold text-base hover:bg-primary-foreground/90 transition-all duration-200 active:scale-[0.97] shadow-lg shadow-black/10"
          >
            {t('cta.button')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
