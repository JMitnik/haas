import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

import language from './language';

const lang = i18n.use(initReactI18next);
lang.init({
  resources: language,
  lng: 'en',
  ns: ['general', 'customer'],
  defaultNS: 'general',

  keySeparator: false, // we do not use keys in form messages.welcome

  interpolation: { escapeValue: false },
});

export default lang;
