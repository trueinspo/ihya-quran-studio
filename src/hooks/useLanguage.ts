import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export function useLanguage() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const toggleLanguage = useCallback(() => {
    const newLang = isArabic ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    localStorage.setItem('ihya-lang', newLang);
  }, [isArabic, i18n]);

  return { isArabic, toggleLanguage, language: i18n.language };
}
