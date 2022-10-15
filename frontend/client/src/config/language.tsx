/* eslint-disable max-len */
const language = {
  general: {
    closed_title: {
      en: 'We are closed today!',
      de: 'Wir sind heute geschlossen!',
      nl: 'Wij zijn vandaag gesloten!',
    },
    closed_description: {
      en: 'This dialogue has been closed for today. Check back again later.',
      de: 'Dieser Dialog wurde für heute geschlossen. Schauen Sie später noch einmal vorbei.',
      nl: 'Deze dialoog is gesloten voor vandaag. Kom later nog eens terug.',
    },
    slide_explainer: {
      en: 'Slide left or right',
      de: 'Nach links oder rechts schieben',
      nl: 'Sleep links of rechts',
    },
    slide_explainer_helper: {
      en: 'to let us know how you feel',
      de: 'um dir zu sagen, wie du dich fühlst',
      nl: 'om te vertellen hoe het gaat',
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
      en: 'Stay anonymous',
      de: 'Anonym bleiben',
      nl: 'Anoniem blijven',
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
    illegal_back_title: {
      en: 'Try again?',
      de: 'Erneut versuchen?',
      nl: 'Nog een keer?',
    },
    illegal_back_description: {
      en: 'It seems that you tried to go back after our last question.\nWe want to ensure that you do not fill in your answers twice.',
      de: 'Es scheint, als hätten Sie versucht, nach unserer letzten Frage zurückzugehen.\nWir möchten sicherstellen, dass Sie Ihre Antworten nicht zweimal ausfüllen.',
      nl: 'Het lijkt erop dat je probeerdere terug te gaan na onze laatste vraag.\nWe willen zeker zijn dat je niet twee keer hetzelfde anstwoord geeft.',
    },
    illegal_back_go_back: {
      en: 'Back to the last question',
      de: 'Zurück zur letzten Frage',
      nl: 'Terug naar de laatste vraag',
    },
    illegal_back_restart: {
      en: 'Restart from the beginning',
      de: 'Neustart von Anfang an',
      nl: 'Opnieuw beginnen',
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
