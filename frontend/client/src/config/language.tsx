/* eslint-disable max-len */
const language = {
  general: {
    leave_your_details: {
      en: 'Leave your details',
      de: 'Hinterlassen Sie Ihre Daten',
      nl: 'Laat uw gegevens achter',
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

export default language;
