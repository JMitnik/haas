import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

import language, { parseLanguages } from './language';

// let storedLanguage = localStorage.getItem('language');
// if (!storedLanguage) {
//   storedLanguage = 'en';
// }

const lang = i18n.use(initReactI18next);
lang.init({
  resources: {
    de: {
      ...parseLanguages('de', language),
    },
    en: {
      ...parseLanguages('en', language),
    },
    nl: {
      ...parseLanguages('nl', language),
    },
  },
  fallbackLng: 'en',
  // lng: storedLanguage,
  ns: ['general', 'customer'],
  defaultNS: 'general',

  keySeparator: false, // we do not use keys in form messages.welcome

  interpolation: { escapeValue: false },
});

export default lang;
