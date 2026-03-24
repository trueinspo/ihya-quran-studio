import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const AdminProfile = () => {
  const { t } = useTranslation()
  const { user, profile } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < 8) {
      setError(t('admin.password_min'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('admin.password_mismatch'))
      return
    }

    setSaving(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setSaving(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setPassword('')
    setConfirmPassword('')
    setSuccess(t('admin.password_updated'))
  }

  return (
    <div dir="rtl" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-arabic">{t('admin.profile')}</h1>
        <p className="text-sm text-muted-foreground font-arabic mt-1">{t('admin.profile_subtitle')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <section className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-base font-semibold text-foreground font-arabic mb-4">
            {t('admin.account_info')}
          </h2>

          <div className="space-y-4">
            <div>
              <Label className="font-arabic mb-2 inline-block">{t('admin.full_name')}</Label>
              <div className="h-11 rounded-xl border border-border bg-muted/40 px-4 flex items-center text-sm text-foreground">
                {profile?.full_name ?? '—'}
              </div>
            </div>

            <div>
              <Label className="font-arabic mb-2 inline-block">{t('admin.email_address')}</Label>
              <div className="h-11 rounded-xl border border-border bg-muted/40 px-4 flex items-center text-sm text-foreground" dir="ltr">
                {user?.email ?? '—'}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-base font-semibold text-foreground font-arabic mb-4">
            {t('admin.change_password')}
          </h2>

          {error && (
            <div className="mb-4 rounded-xl bg-destructive/10 text-destructive px-4 py-3 text-sm font-arabic">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-xl bg-primary/10 text-primary px-4 py-3 text-sm font-arabic">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handlePasswordUpdate}>
            <div>
              <Label htmlFor="password" className="font-arabic mb-2 inline-block">
                {t('admin.new_password')}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="font-arabic mb-2 inline-block">
                {t('admin.confirm_new_password')}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                dir="ltr"
              />
            </div>

            <Button type="submit" disabled={saving} className="font-arabic">
              {saving ? '...' : t('admin.update_password')}
            </Button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default AdminProfile
