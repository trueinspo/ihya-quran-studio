import { Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, BookOpen, Users, LogOut, ExternalLink } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const AdminLayout = () => {
  const { t } = useTranslation()
  const { user, profile, loading, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (profile?.role !== 'admin') return <Navigate to="/" replace />

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const navItems = [
    { to: '/admin', label: t('admin.dashboard'), icon: LayoutDashboard, end: true },
    { to: '/admin/courses', label: t('admin.courses'), icon: BookOpen, end: false },
    { to: '/admin/students', label: t('admin.students'), icon: Users, end: false },
  ]

  return (
    <div className="min-h-screen flex bg-background" dir="rtl">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 border-l border-border bg-card flex flex-col h-screen sticky top-0">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-border gap-2">
          <span className="text-xl font-bold text-primary font-arabic">إحياء</span>
          <span className="text-xs text-muted-foreground font-arabic bg-muted px-2 py-0.5 rounded-full">إدارة</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors font-arabic ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/60 hover:text-foreground hover:bg-muted'
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">
              {profile?.full_name?.[0] ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate font-arabic">{profile?.full_name}</p>
              <p className="text-xs text-primary font-arabic">{t('admin.admin_role')}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <a
              href="/"
              className="flex-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-muted"
            >
              <ExternalLink size={11} />
              <span className="font-arabic">{t('admin.back_to_site')}</span>
            </a>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors px-2 py-1.5 rounded-lg hover:bg-muted"
            >
              <LogOut size={11} />
              <span className="font-arabic">{t('nav.logout')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
