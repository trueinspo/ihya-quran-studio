import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const { t } = useTranslation();
  const { isArabic, toggleLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate('/', { replace: true });
  };

  const dashboardPath = profile?.role === 'admin' ? '/admin' : '/dashboard';
  const dashboardLabel = profile?.role === 'admin' ? t('admin.panel') : t('nav.dashboard');
  const profilePath = profile?.role === 'admin' ? '/admin/profile' : '/profile';
  const profileLabel = profile?.role === 'admin' ? t('admin.profile') : t('student_profile.settings');

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/courses', label: t('nav.courses') },
  ];

  const isActive = (path: string) => location.pathname === path;

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.[0].toUpperCase() ?? '?';

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/Ihya-logo-transparent.png"
            alt="Ihya Quran Studio"
            className="h-10 w-10 object-contain"
          />
          <div className="hidden sm:block">
            <p className="text-lg font-bold text-primary font-arabic leading-none">إحياء</p>
            <p className="text-[11px] text-secondary font-arabic mt-1 leading-none">لتعليم القرآن الكريم</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                isActive(link.to) ? 'text-primary' : 'text-foreground/70'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors"
          >
            {isArabic ? 'EN' : 'AR'}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {initials}
                </span>
                <span className="text-sm font-medium text-foreground/80 max-w-[100px] truncate">
                  {profile?.full_name ?? user.email}
                </span>
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute end-0 mt-2 w-48 bg-card border border-border/50 rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-border/50">
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      {profile?.role === 'admin' && (
                        <span className="text-xs text-primary font-semibold font-arabic">مدير النظام</span>
                      )}
                    </div>
                    <Link
                      to={dashboardPath}
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground/70 hover:bg-muted transition-colors"
                    >
                      <LayoutDashboard size={14} />
                      {dashboardLabel}
                    </Link>
                    <Link
                      to={profilePath}
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground/70 hover:bg-muted transition-colors"
                    >
                      <User size={14} />
                      {profileLabel}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground/70 hover:bg-muted transition-colors"
                    >
                      <LogOut size={14} />
                      {t('nav.logout')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden md:inline-flex text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
              >
                {t('nav.login')}
              </Link>

              <Link
                to="/register"
                className="hidden md:inline-flex text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors active:scale-[0.97]"
              >
                {t('nav.register')}
              </Link>
            </>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-card/95 backdrop-blur-lg overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-3">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                    isActive(link.to) ? 'bg-primary/10 text-primary' : 'text-foreground/70 hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-border" />
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2">
                    <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {initials}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{profile?.full_name ?? user.email}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to={dashboardPath}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-lg text-foreground/70 hover:bg-muted transition-colors"
                  >
                    <LayoutDashboard size={14} />
                    {dashboardLabel}
                  </Link>
                  <Link
                    to={profilePath}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-lg text-foreground/70 hover:bg-muted transition-colors"
                  >
                    <User size={14} />
                    {profileLabel}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-lg text-foreground/70 hover:bg-muted transition-colors"
                  >
                    <LogOut size={14} />
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium py-2 px-3 rounded-lg text-foreground/70 hover:bg-muted transition-colors"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium bg-primary text-primary-foreground py-2 px-3 rounded-lg text-center hover:bg-primary/90 transition-colors"
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
