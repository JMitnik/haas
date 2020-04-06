/* eslint-disable max-len */
import { NodeType } from '../../src/generated/prisma-client/index';

export const multiChoiceType: NodeType = 'MULTI_CHOICE';
export const socialShareType: NodeType = 'SOCIAL_SHARE';
export const sliderType: NodeType = 'SLIDER';
export const textboxType: NodeType = 'TEXTBOX';
export const registrationType: NodeType = 'REGISTRATION';

export const makeEdges = (customerName: string) => [
  {
    parentQuestionContains: `How do you feel about ${customerName}`,
    childQuestionContains: 'What did you like?',
    conditions: [
      {
        conditionType: 'valueBoundary',
        renderMin: 70,
        renderMax: 100,
        matchValue: null,
      },
    ],
  },

  {
    parentQuestionContains: 'What did you like?',
    childQuestionContains: 'What exactly did you like about facilities?',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Facilities',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: 'What did you like?',
    childQuestionContains: 'What exactly did you like about the website',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: 'What did you like?',
    childQuestionContains: 'What exactly did you like about the product?',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Product / Services',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: 'What did you like?',
    childQuestionContains:
      'What exactly did you like about the customer support?',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Customer Support',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: `How do you feel about ${customerName}`,
    childQuestionContains: 'What would you like to talk about?',
    conditions: [
      {
        conditionType: 'valueBoundary',
        renderMin: 50,
        renderMax: 70,
        matchValue: null,
      },
    ],
  },

  {
    parentQuestionContains: 'What would you like to talk about?',
    childQuestionContains: 'What exactly did you like about facilities?',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Facilities',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: 'What would you like to talk about?',
    childQuestionContains: 'What exactly did you like about the website',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: 'What would you like to talk about?',
    childQuestionContains: 'What exactly did you like about the product?',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Product / Services',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: 'What would you like to talk about?',
    childQuestionContains:
      'What exactly did you like about the customer support?',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Customer Support',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: `How do you feel about ${customerName}`,
    childQuestionContains: 'We are sorry to hear that',
    conditions: [
      {
        conditionType: 'valueBoundary',
        renderMin: 0,
        renderMax: 50,
        matchValue: null,
      },
    ],
  },

  {
    parentQuestionContains: 'We are sorry to hear that',
    childQuestionContains: 'What exactly did you like about facilities?',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Facilities',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: 'We are sorry to hear that',
    childQuestionContains: 'What exactly did you like about the website',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Website/Mobile app',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: 'We are sorry to hear that',
    childQuestionContains: 'What exactly did you like about the product?',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Product / Services',
        renderMin: null,
        renderMax: null,
      },
    ],
  },

  {
    parentQuestionContains: 'We are sorry to hear that',
    childQuestionContains:
      'What exactly did you like about the customer support?',
    conditions: [
      {
        conditionType: 'match',
        matchValue: 'Customer Support',
        renderMin: null,
        renderMax: null,
      },
    ],
  },
];

export const leafNodes = [
  {
    title:
      'We are happy about your positive feedback. You matter to us! Leave your email below to receive our newsletter.',
    type: textboxType,
  },
  {
    title: 'Thank you for your elaborate feedback. Kindly appreciated bruv!',
    type: socialShareType,
  },
  {
    title:
      'Thank you for your feedback on our facilities. We hope to see you soon again!',
    type: socialShareType,
  },
  {
    title:
      'Thank you for your feedback on our website. We hope to hear from you again!',
    type: socialShareType,
  },
  {
    title:
      'Thank you for your positive feedback. Follow us on Instagram and stay updated.',
    type: socialShareType,
  },
  {
    title:
      'Thank you for your positive feedback. Come and join us on 1st April for our great event. Leave your email address below to register.',
    type: registrationType,
  },
  {
    title:
      'Thank you for your positive feedback. We think you might like this as well.',
    type: socialShareType,
  },
  {
    title:
      'We are happy about your positive feedback. You matter to us! Leave your email below to receive our newsletter.',
    type: registrationType,
  },
  {
    title:
      'Thank you for your feedback. You matter to us! Leave your email below to receive our newsletter.',
    type: registrationType,
  },
  {
    title: 'Thank you! Leave your email below to subscribe to our newsletter.',
    type: registrationType,
  },
  {
    title:
      'Thank you for your feedback. Our customer experience supervisor is informed. Please leave your number below so we can solve the issue.',
    type: registrationType,
  },
  {
    title:
      'Thank you for your feedback. You matter to us! Click below for your refund.',
    type: registrationType,
  },
  {
    title:
      'Thank you for your feedback. Please click on the Whatsapp link below so our service team can fix the issue.',
    type: registrationType,
  },
  {
    title:
      'Thank you for your feedback. Our team is on it. If you leave your email below we will keep you updated.',
    type: registrationType,
  },
  {
    title:
      'Thank you! Please leave your number below so we can reach out to you with a solution.',
    type: registrationType,
  },
];

export const standardOptions = [{ value: 'Facilities' }, { value: 'Website/Mobile app' }, { value: 'Product/Services' }, { value: 'Customer Support' }];
export const facilityOptions = [{ value: 'Cleanliness' }, { value: 'Atmosphere' }, { value: 'Location' }, { value: 'Other' }];
export const websiteOptions = [{ value: 'Design' }, { value: 'Functionality' }, { value: 'Informative' }, { value: 'Other' }];
export const customerSupportOptions = [{ value: 'Friendliness' }, { value: 'Competence' }, { value: 'Speed' }, { value: 'Other' }];
export const productServicesOptions = [{ value: 'Quality' }, { value: 'Price' }, { value: 'Friendliness' }, { value: 'Other' }];
