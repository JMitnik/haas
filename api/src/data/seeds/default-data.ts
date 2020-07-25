/* eslint-disable max-len */
import { LinkCreateInput } from '@prisma/client';

import { NodeType } from '../../generated/prisma-client/index';

export const multiChoiceType: NodeType = 'MULTI_CHOICE';
export const socialShareType: NodeType = 'SOCIAL_SHARE';
export const sliderType: NodeType = 'SLIDER';
export const textboxType: NodeType = 'TEXTBOX';
export const registrationType: NodeType = 'REGISTRATION';

export const STANDARD_LINKS: LinkCreateInput[] = [
  { url: 'https://facebook.com', type: 'FACEBOOK', backgroundColor: '#1877f2' },
  { url: 'https://twitter.com', type: 'TWITTER', backgroundColor: '#1da1f2' },
  { url: 'https://instagram.com', type: 'INSTAGRAM', backgroundColor: '#c32aa3' },
  { url: 'https://linkedin.com', type: 'LINKEDIN', backgroundColor: '#007bb5' },
];

export const leafNodes = [
  {
    title:
      'We are happy about your positive feedback. You matter to us! Leave your contact details below to receive our newsletter.',
    type: textboxType,
    links: [],
  },
  {
    title: 'Thank you for your elaborate feedback. Kindly appreciated!',
    type: socialShareType,
    links: STANDARD_LINKS,
  },
  {
    title:
      'Thank you for your feedback on our facilities. We hope to see you soon again!',
    type: socialShareType,
    links: STANDARD_LINKS,
  },
  {
    title:
      'Thank you for your feedback on our website. We hope to hear from you again!',
    type: socialShareType,
    links: STANDARD_LINKS,
  },
  {
    title:
      'Thank you for your positive feedback. Follow us on Instagram and stay updated.',
    type: socialShareType,
    links: STANDARD_LINKS,
  },
  {
    title:
      'Thank you for your positive feedback. Come and join us on 1st April for our great event. Leave your email address below to register.',
    type: registrationType,
    links: [],
  },
  {
    title:
      'Thank you for your feedback. Would you like to say anything else?',
    type: textboxType,
    links: [],
  },
  {
    title:
      'We are happy about your positive feedback. You matter to us! Leave your email below to receive our newsletter.',
    type: registrationType,
    links: [],
  },
  {
    title:
      'Thank you for your feedback. You matter to us! Leave your email below to receive our newsletter.',
    type: registrationType,
    links: [],
  },
  {
    title: 'Thank you! Leave your email below to subscribe to our newsletter.',
    type: registrationType,
    links: [],
  },
  {
    title:
      'Thank you for your feedback. Our customer experience supervisor is informed. Please leave your email below so we can solve the issue.',
    type: registrationType,
    links: [],
  },
  {
    title:
      'Thank you for your feedback. You matter to us! Click below for your refund.',
    type: registrationType,
    links: [],
  },
  {
    title:
      'Thank you for your feedback. Please click on the Whatsapp link below so our service team can fix the issue.',
    type: registrationType,
    links: [],
  },
  {
    title:
      'Thank you for your feedback. Our team is on it. If you leave your email below we will keep you updated.',
    type: registrationType,
    links: [],
  },
  {
    title:
      'Thank you! Please leave your contact details below so we can reach out to you with a solution.',
    type: registrationType,
    links: [],
  },
];
