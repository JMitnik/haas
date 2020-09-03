import { de, enUS } from 'date-fns/locale';

const getLocale = (): Locale => {
  if (localStorage.getItem('language') === 'de') {
    return de;
  }

  return enUS;
};

export default getLocale;
