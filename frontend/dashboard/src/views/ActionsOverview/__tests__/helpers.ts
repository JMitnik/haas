import { createEvent, fireEvent, server } from 'test';
import { graphql } from 'msw';

import {
  DialogueConnectionQuery,
  DialogueConnectionQueryVariables,
} from 'types/generated-types';

export const pasteWysiwyg = (html: string, element: Element) => {
  const text = html.replace('<[^>]*>', '');

  const eventProperties = {
    clipboardData: {
      types: ['text/plain', 'text/html'],
      getData: (type: any) => (type === 'text/plain' ? text : html),
    },
  };

  const pasteEvent = createEvent.paste(element, eventProperties);
  fireEvent(element, pasteEvent);
};

export const includesText = (text: string, target: string) => text.toLowerCase().includes(target.toLowerCase());

/**
 * Mock: getCTANodesOfDialogueQuery
 *
 * Origin: Generated
 */
// eslint-disable-next-line
export const getCTANodesOfDialogueResponse: any = JSON.parse('{"customer":{"id":"cl6w9ingo00117loi9ifi58ws","dialogue":{"id":"cl6w9jj7e193657loiyrhluv8r","slug":"Female-U18-Team3","title":"Female - U18 - Team3","leafs":[{"id":"cl6w9jjgk194067loidxsh4mwk","title":"Your feedback will always remain anonymous, unless you want to talk to someone.","type":"FORM","links":[],"share":null,"form":{"id":"cl6w9jjgk194077loi0twn18ww","helperText":null,"steps":[{"id":"cl6wah2n444038zoia43dp8mb","header":"Contact detail","helper":"Let us know","subHelper":"Please choose a person","position":1,"type":"GENERIC_FIELDS","fields":[{"id":"cl6wah2nm44248zoi8vf748z3","label":"Contacts","type":"contacts","placeholder":null,"isRequired":false,"position":1,"contacts":[{"id":"cl6w9hwy1000044oijt6jwqg5","email":"daan@haas.live","firstName":"Daan","lastName":"Helsloot","__typename":"UserType"}],"__typename":"FormNodeField"}],"__typename":"FormNodeStep"}],"fields":[{"id":"cl6w9jjgk194087loi8o4tt6g2","label":"Leave your email address and a senior leader will contact you ⇣","type":"email","placeholder":null,"isRequired":true,"position":-1,"contacts":[],"__typename":"FormNodeField"}],"__typename":"FormNodeType"},"__typename":"QuestionNode"}],"__typename":"Dialogue"},"__typename":"Customer"}}')

export const mockQueryGetCTANodesOfDialogue = (
  createResponse: (res: any) => any,
) => (
  server.use(
    graphql.query<any, any>(
      'getCTANodesOfDialogue',
      (req, res, ctx) => res(ctx.data(createResponse(getCTANodesOfDialogueResponse))),
    ),
  )
);
