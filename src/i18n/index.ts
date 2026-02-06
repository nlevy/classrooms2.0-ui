import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enGrid from './locales/en/grid.json';
import enResults from './locales/en/results.json';
import enErrors from './locales/en/errors.json';

import heCommon from './locales/he/common.json';
import heGrid from './locales/he/grid.json';
import heResults from './locales/he/results.json';
import heErrors from './locales/he/errors.json';

const savedLanguage = localStorage.getItem('language') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      grid: enGrid,
      results: enResults,
      errors: enErrors,
    },
    he: {
      common: heCommon,
      grid: heGrid,
      results: heResults,
      errors: heErrors,
    },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'grid', 'results', 'errors'],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
