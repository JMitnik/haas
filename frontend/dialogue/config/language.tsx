import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';


/* eslint-disable max-len */
const language = {
  general: {
    copied: {
      en: 'Copied!',
      de: 'Kopiert!',
      nl: 'Gekopieerd!',
    },
    happy: {
      en: 'Happy',
      de: 'Glücklich',
      nl: 'Tevreden',
    },
    unhappy: {
      en: 'Unhappy',
      de: 'Unzufrieden',
      nl: 'Ontevreden',
    },
    go_back: {
      en: 'Go back',
      de: 'Geh zurück',
      nl: 'Ga terug',
    },
    leave_your_details: {
      en: 'Let us know',
      de: 'Lass uns wissen',
      nl: 'Laat het ons weten',
    },
    first_name: {
      en: 'First name',
      de: 'Vorname',
      nl: 'Voornaam',
    },
    do_not_share: {
      en: 'Do not share',
      de: 'Nicht teilen',
      nl: 'Niet delen',
    },
    submit: {
      en: 'Submit',
      de: 'Einreichen',
      nl: 'Verzenden',
    },
    quick_release_text: {
      en: 'That was quick!',
      de: 'Das war schnell!',
      nl: 'Dat was snel!',
    },
    quick_release_subtext: {
      en: 'Tap me again if you are sure.',
      de: 'Tippen Sie erneut auf mich, wenn Sie sicher sind.',
      nl: 'Druk op mij als je het zeker weet.',
    },
    thanks_for_voting: {
      en: 'Thanks for voting',
      de: 'Danke für das Abstimmen',
      nl: 'Bedankt voor het stemmen',
    },
    postleaf_default_title: {
      en: 'Thank you for reaching out to us!',
      de: 'Danke, dass Sie uns kontaktiert haben!',
      nl: 'Bedankt dat u ons heeft bereikt!',
    },
    postleaf_default_subtext: {
      en: 'We will strive towards making you happier.',
      de: 'Wir werden versuchen, Sie zu verärgern.',
      nl: 'We zullen ons best doen om uw feedback mee te nemen.',
    },
    whoops: {
      en: 'Whoops!',
      de: 'Oops!',
      nl: 'Oeps!',
    },
    whoops_description: {
      en: 'We lost you in our dialogue',
      nl: 'Wij zijn je kwijtgeraakt in ons dialoog',
      de: 'Wir haben Sie in unserem Dialog verloren',
    },
  },
};

export const parseLanguages = (lang: string, input: any, output?: any) => {
  output = output || {};

  Object.keys(input).forEach((key) => {
    const value = input[key];

    const leaf = typeof value[Object.keys(value)[0]] === 'string';

    if (leaf) {
      if (lang in value) {
        output[key] = value[lang];
      }
    } else {
      output[key] = {};

      parseLanguages(lang, value, output[key]);
    }
  });

  return output;
};

export const lang = i18n.use(initReactI18next);
// eslint-disable-next-line @typescript-eslint/no-floating-promises
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

export default language;
