import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import IslamicPattern from '@/components/IslamicPattern';
import { useAuth } from '@/contexts/AuthContext';

type LoginErrorState =
  | { kind: 'invalid-credentials'; message: string }
  | { kind: 'user-not-found'; message: string }
  | null;

const Login = () => {
  const { t } = useTranslation();
  const { signIn, emailAccountExists } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<LoginErrorState>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error, profile } = await signIn(email, password);
      if (error) {
        const invalidCredentialsError = /invalid login credentials/i.test(error.message);
        const emailConfirmedError = /email not confirmed/i.test(error.message);

        if (invalidCredentialsError || emailConfirmedError) {
          const accountExists = await emailAccountExists(email);

          if (accountExists) {
            setError({ kind: 'invalid-credentials', message: t('auth.login_incorrect_password') });
          } else {
            setError({ kind: 'user-not-found', message: t('auth.user_not_found') });
          }
        } else {
          setError({ kind: 'invalid-credentials', message: t('auth.login_error') });
        }
      } else {
        navigate(profile?.role === 'admin' ? '/admin' : from, { replace: true });
      }
    } catch {
      setError({ kind: 'invalid-credentials', message: t('auth.generic_error') });
    } finally {
      setLoading(false);
    }
  };

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

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-arabic">
              <p>{error.message}</p>
              {error.kind === 'invalid-credentials' && (
                <Link to={`/forgot-password?email=${encodeURIComponent(email)}`} className="mt-2 inline-flex text-primary font-semibold hover:underline">
                  {t('auth.forgot_password_cta')}
                </Link>
              )}
              {error.kind === 'user-not-found' && (
                <Link to={`/register?email=${encodeURIComponent(email)}`} className="mt-2 inline-flex text-primary font-semibold hover:underline">
                  {t('auth.create_account_cta')}
                </Link>
              )}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
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
                required
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <label className="block text-sm font-medium text-foreground font-arabic">
                  {t('auth.password')}
                </label>
                <Link to={`/forgot-password?email=${encodeURIComponent(email)}`} className="text-xs font-semibold text-primary hover:underline font-arabic">
                  {t('auth.forgot_password')}
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                dir="ltr"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? '...' : t('auth.login_btn')}
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
