/* eslint-disable max-len */
const language = {
  general: {
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
    leave_your_details: {
      en: 'Let us know',
      de: 'Hinterlassen Sie Ihre Daten',
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
