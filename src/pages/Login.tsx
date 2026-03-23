import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import IslamicPattern from '@/components/IslamicPattern';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <IslamicPattern className="text-primary" opacity={0.03} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md mx-4 relative z-10"
      >
        {/* Header */}
        <div className="bg-primary rounded-t-2xl p-6 text-center">
          <Link to="/" className="text-3xl font-bold text-primary-foreground font-arabic">إحياء</Link>
          <p className="text-primary-foreground/70 text-sm mt-1 font-arabic">لتعليم القرآن الكريم</p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-b-2xl p-6 shadow-lg border border-border/50 border-t-0">
          <h2 className="text-xl font-bold text-foreground mb-6 font-arabic">{t('auth.login_title')}</h2>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5 font-arabic">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5 font-arabic">
                {t('auth.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 active:scale-[0.97]"
            >
              {t('auth.login_btn')}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground font-arabic">
            {t('auth.no_account')}{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              {t('nav.register')}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
