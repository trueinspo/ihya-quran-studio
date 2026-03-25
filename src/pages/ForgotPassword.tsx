import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import IslamicPattern from '@/components/IslamicPattern'
import { useAuth } from '@/contexts/AuthContext'

const ForgotPassword = () => {
  const { t } = useTranslation()
  const { requestPasswordReset } = useAuth()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: resetError } = await requestPasswordReset(email)
    setLoading(false)

    if (resetError) {
      setError(t('auth.reset_request_error'))
      return
    }

    setSuccess(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      <div className="absolute inset-0 pointer-events-none">
        <IslamicPattern className="text-primary" opacity={0.03} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md mx-4 relative z-10"
      >
        <div className="bg-primary rounded-t-2xl p-6 text-center">
          <Link to="/" className="text-3xl font-bold text-primary-foreground font-arabic">إحياء</Link>
          <p className="text-primary-foreground/70 text-sm mt-1 font-arabic">لتعليم القرآن الكريم</p>
        </div>

        <div className="bg-card rounded-b-2xl p-6 shadow-lg border border-border/50 border-t-0">
          <h2 className="text-xl font-bold text-foreground mb-2 font-arabic">{t('auth.forgot_password_title')}</h2>
          <p className="text-sm text-muted-foreground mb-6 font-arabic">{t('auth.forgot_password_subtitle')}</p>

          {success ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-primary/10 text-primary text-sm font-arabic text-center">
                {t('auth.reset_request_success')}
              </div>
              <Link to="/login" className="block text-center text-sm font-semibold text-primary hover:underline font-arabic">
                {t('auth.back_to_login')}
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-arabic">
                  {error}
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? '...' : t('auth.send_reset_link')}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword