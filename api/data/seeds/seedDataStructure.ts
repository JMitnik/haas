/* eslint-disable max-len */
import { NodeType } from '../../src/generated/prisma-client/index';

export const multiChoiceType: NodeType = 'MULTI_CHOICE';
export const socialShareType: NodeType = 'SOCIAL_SHARE';
export const sliderType: NodeType = 'SLIDER';
export const textboxType: NodeType = 'TEXTBOX';
export const registrationType: NodeType = 'REGISTRATION';

// # Create 5 node entries:
// 1. Entry gekoppeld aan edge van Questionnaire #1 Mediamarkt met een node entry value uit slider (getal)
// 2. Entry gekoppeld aan edge van Questionnaire #2 Mediamarkt met een node entry value uit slider (getal)
// 2. Entry gekoppeld aan edge van Mediamarkt met een node entry value met multi choice (string)
// 3. 2 entries gekoppeld aan edge van Starbucks met een node entry value uit slider

export const getStandardEdgeData = (customerName: string) => [
  {
    parentQuestionContains: `How do you feel about ${customerName}`, // hardcode company name?
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

export const positiveSubChildren = [
  {
    title: 'What exactly did you like about website?',
    overrideLeafContains: 'Instagram',
    type: multiChoiceType,
    relatedOptionValue: 'Website/Mobile app',
    childrenNodes: [
      { value: 'Design', type: multiChoiceType },
      { value: 'Functionality', type: multiChoiceType },
      { value: 'Informative', type: multiChoiceType },
      { value: 'Other', type: multiChoiceType },
    ],
  },
  {
    title: 'What exactly did you like about the facilities?',
    overrideLeafContains: 'newsletter',
    type: multiChoiceType,
    relatedOptionValue: 'Website/Mobile app',
    childrenNodes: [
      {
        value: 'Cleanliness',
        type: multiChoiceType,
        overrideLeafContains: 'Come and join us',
      },
      {
        value: 'Atmosphere',
        type: multiChoiceType,
        overrideLeafContains: 'Come and join us',
      },
      {
        value: 'Location',
        type: multiChoiceType,
        overrideLeafContains: 'Come and join us',
      },
      { value: 'Other', type: multiChoiceType },
    ],
  },
  {
    title: 'What exactly did you like about the product?',
    overrideLeafContains: 'see you soon',
    type: multiChoiceType,
    relatedOptionValue: 'Product / Services',
    childrenNodes: [
      {
        value: 'Quality',
        type: multiChoiceType,
        overrideLeafContains: 'We think you might like',
      },
      {
        value: 'Price',
        type: multiChoiceType,
        overrideLeafContains: 'We think you might like',
      },
      {
        value: 'Friendliness',
        type: multiChoiceType,
        overrideLeafContains: 'We think you might like',
      },
      { value: 'Other', type: multiChoiceType },
    ],
  },
  {
    title: 'What exactly did you like about the customer support?',
    overrideLeafContains: 'team is on it',
    type: multiChoiceType,
    relatedOptionValue: 'Customer Support',
    childrenNodes: [
      {
        value: 'Friendliness',
        type: multiChoiceType,
        overrideLeafContains: 'Leave your email below to receive our',
      },
      {
        value: 'Competence',
        type: multiChoiceType,
        overrideLeafContains: 'Leave your email below to receive our',
      },
      {
        value: 'Speed',
        type: multiChoiceType,
        overrideLeafContains: 'Leave your email below to receive our',
      },
      { value: 'Other', type: multiChoiceType },
    ],
  },
];

export const neutralSubChildren = [
  {
    title: 'Please specify.',
    overrideLeafContains: 'receive our newsletter',
    type: multiChoiceType,
    relatedOptionValue: 'Facilities',
    childrenNodes: [
      { value: 'Design', type: multiChoiceType },
      { value: 'Functionality', type: multiChoiceType },
      { value: 'Informative', type: multiChoiceType },
      { value: 'Other', type: multiChoiceType },
    ],
  },
  {
    title: 'Please specify.',
    overrideLeafContains: 'receive our newsletter',
    type: multiChoiceType,
    relatedOptionValue: 'Website/Mobile app',
    childrenNodes: [
      { value: 'Cleanliness', type: multiChoiceType },
      { value: 'Atmosphere', type: multiChoiceType },
      { value: 'Location', type: multiChoiceType },
      { value: 'Other', type: multiChoiceType },
    ],
  },
  {
    title: 'Please specify.',
    overrideLeafContains: 'receive our newsletter',
    type: multiChoiceType,
    relatedOptionValue: 'Product / Services',
    childrenNodes: [
      { value: 'Quality', type: multiChoiceType },
      { value: 'Price', type: multiChoiceType },
      { value: 'Friendliness', type: multiChoiceType },
      { value: 'Other', type: multiChoiceType },
    ],
  },
  {
    title: 'Please specify',
    overrideLeafContains: 'receive our newsletter',
    type: multiChoiceType,
    relatedOptionValue: 'Customer Support',
    childrenNodes: [
      { value: 'Friendliness', type: multiChoiceType },
      { value: 'Competence', type: multiChoiceType },
      { value: 'Speed', type: multiChoiceType },
      { value: 'Options', type: multiChoiceType },
    ],
  },
];

export const negativeSubChildren = [
  {
    title: 'Please elaborate.',
    overrideLeafContains: 'with a solution',
    type: multiChoiceType,
    relatedOptionValue: 'Website/Mobile app',
    childrenNodes: [
      {
        value: 'Design',
        type: multiChoiceType,
        overrideLeafContains: 'click on the Whatsapp',
      },
      {
        value: 'Functionality',
        type: multiChoiceType,
        overrideLeafContains: 'click on the Whatsapp',
      },
      {
        value: 'Informative',
        type: multiChoiceType,
        overrideLeafContains: 'click on the Whatsapp',
      },
      { value: 'Other', type: multiChoiceType },
    ],
  },
  {
    title: 'Please elaborate.',
    overrideLeafContains: 'with a solution',
    type: multiChoiceType,
    relatedOptionValue: 'Facilities',
    childrenNodes: [
      {
        value: 'Cleanliness',
        type: multiChoiceType,
        overrideLeafContains: 'Our team is on it',
      },
      {
        value: 'Atmosphere',
        type: multiChoiceType,
        overrideLeafContains: 'Our team is on it',
      },
      {
        value: 'Location',
        type: multiChoiceType,
        overrideLeafContains: 'Our team is on it',
      },
      { value: 'Other', type: multiChoiceType },
    ],
  },
  {
    title: 'Please elaborate.',
    overrideLeafContains: 'with a solution',
    type: multiChoiceType,
    relatedOptionValue: 'Product / Services',
    childrenNodes: [
      {
        value: 'Quality',
        type: multiChoiceType,
        overrideLeafContains: 'Click below for your',
      },
      {
        value: 'Price',
        type: multiChoiceType,
        overrideLeafContains: 'Click below for your',
      },
      {
        value: 'Friendliness',
        type: multiChoiceType,
        overrideLeafContains: 'Click below for your',
      },
      { value: 'Other', type: multiChoiceType },
    ],
  },
  {
    title: 'Please elaborate',
    overrideLeafContains: 'with a solution',
    type: multiChoiceType,
    relatedOptionValue: 'Customer Support',
    childrenNodes: [
      {
        value: 'Friendliness',
        type: multiChoiceType,
        overrideLeafContains: 'Our customer experience supervisor',
      },
      {
        value: 'Competence',
        type: multiChoiceType,
        overrideLeafContains: 'Our customer experience supervisor',
      },
      {
        value: 'Speed',
        type: multiChoiceType,
        overrideLeafContains: 'Our customer experience supervisor',
      },
      { value: 'Other', type: multiChoiceType },
    ],
  },
];

export const standardSubChildren = [
  {
    title: 'What exactly did you like about facilities?',
    overrideLeafContains: 'Instagram',
    type: multiChoiceType,
    relatedOptionValue: 'Facilities',
    childrenNodes: [
      { value: 'Design', type: multiChoiceType },
      { value: 'Functionality', type: multiChoiceType },
      { value: 'Informative', type: multiChoiceType },
      { value: 'Other', type: multiChoiceType },
    ],
  },
  {
    title: 'What exactly did you like about the website?',
    overrideLeafContains: 'newsletter',
    type: multiChoiceType,
    relatedOptionValue: 'Website/Mobile app',
    childrenNodes: [
      { value: 'Cleanliness', type: multiChoiceType },
      { value: 'Atmosphere', type: multiChoiceType },
      { value: 'Location', type: multiChoiceType },
      { value: 'Other', type: multiChoiceType },
    ],
  },
  {
    title: 'What exactly did you like about the product?',
    overrideLeafContains: 'see you soon',
    type: multiChoiceType,
    relatedOptionValue: 'Product / Services',
    childrenNodes: [
      { value: 'Quality', type: multiChoiceType },
      { value: 'Price', type: multiChoiceType },
      { value: 'Friendliness', type: multiChoiceType },
      { value: 'Other', type: multiChoiceType },
    ],
  },
  {
    title: 'What exactly did you like about the customer support?',
    overrideLeafContains: 'team is on it',
    type: multiChoiceType,
    relatedOptionValue: 'Customer Support',
    childrenNodes: [
      { value: 'Friendliness', type: multiChoiceType },
      { value: 'Competence', type: multiChoiceType },
      { value: 'Speed', type: multiChoiceType },
      { value: 'Other', type: multiChoiceType },
    ],
  },
];

export const standardRootChildren = [
  {
    title: 'What did you like?',
    type: multiChoiceType,
    overrideLeafContains: 'Instagram',
    options: positiveSubChildren.map((child) => child.relatedOptionValue),
    children: positiveSubChildren,
  },
  {
    title: 'What would you like to talk about?',
    type: multiChoiceType,
    options: neutralSubChildren.map((child) => child.relatedOptionValue),
    children: neutralSubChildren,
  },
  {
    title: 'We are sorry to hear that! Where can we improve?',
    type: multiChoiceType,
    options: negativeSubChildren.map((child) => child.relatedOptionValue),
    children: negativeSubChildren,
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
