import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from '@/locales/ar.json';
import en from '@/locales/en.json';

const savedLang = localStorage.getItem('ihya-lang') || 'ar';

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    en: { translation: en },
  },
  lng: savedLang,
  fallbackLng: 'ar',
  interpolation: { escapeValue: false },
});

// Set initial direction
document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = savedLang;

export default i18n;
