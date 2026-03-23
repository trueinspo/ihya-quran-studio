import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Leaf } from 'lucide-react';

const ValuesSection = () => {
  const { t } = useTranslation();

  const values = [
    { icon: BookOpen, titleKey: 'values.value_1_title', descKey: 'values.value_1_desc' },
    { icon: GraduationCap, titleKey: 'values.value_2_title', descKey: 'values.value_2_desc' },
    { icon: Leaf, titleKey: 'values.value_3_title', descKey: 'values.value_3_desc' },
  ];

  return (
    <section className="py-20 md:py-28 bg-brand-beige">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-4xl font-bold text-secondary text-center mb-12 font-arabic"
        >
          {t('values.title')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-card rounded-2xl p-8 text-center shadow-sm border border-border/50 card-hover"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3 font-arabic">{t(item.titleKey)}</h3>
              <p className="text-sm text-muted-foreground font-arabic" style={{ lineHeight: 1.9 }}>
                {t(item.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
