import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useMyCourses } from '@/lib/queries/student'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ImageUploadField from '@/components/ImageUploadField'

const StudentProfile = () => {
  const { t } = useTranslation()
  const { user, profile, loading, refreshProfile } = useAuth()
  const { data: courses = [] } = useMyCourses()
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    setFullName(profile?.full_name ?? '')
    setAvatarUrl(profile?.avatar_url ?? '')
  }, [profile?.avatar_url, profile?.full_name])

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (profile?.role === 'admin') return <Navigate to="/admin/profile" replace />

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSavingProfile(true)

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      })
      .eq('id', user.id)

    if (profileError) {
      setError(profileError.message)
    } else {
      await refreshProfile()
      setSuccess(t('student_profile.profile_updated'))
    }

    setSavingProfile(false)
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < 8) {
      setError(t('student_profile.password_min'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('student_profile.password_mismatch'))
      return
    }

    setSavingPassword(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
    } else {
      setPassword('')
      setConfirmPassword('')
      setSuccess(t('student_profile.password_updated'))
    }

    setSavingPassword(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-arabic">{t('student_profile.title')}</h1>
            <p className="mt-2 text-muted-foreground font-arabic">{t('student_profile.subtitle')}</p>
          </div>
          <Link to="/dashboard" className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-2.5 text-sm font-arabic text-foreground hover:bg-muted">
            {t('student_profile.back_to_dashboard')}
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive font-arabic">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary font-arabic">
            {success}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground font-arabic">{t('student_profile.account_info')}</h2>
            <form className="space-y-4" onSubmit={handleProfileUpdate}>
              <div>
                <Label htmlFor="student-fullName" className="mb-2 inline-block font-arabic">{t('student_profile.full_name')}</Label>
                <Input
                  id="student-fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="font-arabic"
                />
              </div>

              <div>
                <Label className="mb-2 inline-block font-arabic">{t('student_profile.email_address')}</Label>
                <div className="flex h-11 items-center rounded-xl border border-border bg-muted/40 px-4 text-sm text-foreground" dir="ltr">
                  {user.email}
                </div>
              </div>

              <ImageUploadField
                label={t('student_profile.avatar_upload')}
                folder={`avatars/${user.id}`}
                value={avatarUrl}
                onChange={setAvatarUrl}
                disabled={savingProfile}
              />

              <div className="flex items-center gap-4 rounded-2xl border border-border bg-muted/30 p-4">
                <img
                  src={avatarUrl || '/Ihya-logo-transparent.png'}
                  alt={profile?.full_name ?? user.email ?? 'Student avatar'}
                  className="h-20 w-20 rounded-2xl object-cover border border-border bg-background"
                />
                <div className="space-y-1">
                  <p className="font-arabic font-semibold text-foreground">{profile?.full_name ?? t('student_profile.default_name')}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <Button type="submit" disabled={savingProfile} className="font-arabic">
                {savingProfile ? '...' : t('student_profile.save_profile')}
              </Button>
            </form>
          </section>

          <div className="space-y-6">
            <section className="rounded-3xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground font-arabic">{t('student_profile.change_password')}</h2>
              <form className="space-y-4" onSubmit={handlePasswordUpdate}>
                <div>
                  <Label htmlFor="student-password" className="mb-2 inline-block font-arabic">{t('student_profile.new_password')}</Label>
                  <Input
                    id="student-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label htmlFor="student-confirmPassword" className="mb-2 inline-block font-arabic">{t('student_profile.confirm_new_password')}</Label>
                  <Input
                    id="student-confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    dir="ltr"
                  />
                </div>
                <Button type="submit" disabled={savingPassword} className="font-arabic">
                  {savingPassword ? '...' : t('student_profile.update_password')}
                </Button>
              </form>
            </section>

            <section className="rounded-3xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground font-arabic">{t('student_profile.learning_snapshot')}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-muted/40 p-4">
                  <p className="text-sm text-muted-foreground font-arabic">{t('student_profile.enrolled_courses')}</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{courses.length}</p>
                </div>
                <div className="rounded-2xl bg-muted/40 p-4">
                  <p className="text-sm text-muted-foreground font-arabic">{t('student_profile.member_since')}</p>
                  <p className="mt-2 text-lg font-semibold text-foreground font-arabic">{new Date(profile?.created_at ?? Date.now()).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default StudentProfile