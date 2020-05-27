import { Dialogue } from 'types/generic';

export const mockEmptyDialogue: Dialogue = {
    questions: [],
    leafs: [],
    rootQuestion: {
        isRoot: true,
        id: '1',
        children: [],
        title: 'How do you feel about Mock',
        type: 'SLIDER',
    }
};

/**
 *       id
      title
      publicTitle
      creationDate
      updatedAt
      leafs {
        id
        title
        type
      }
      customerId
      questions {
        ...QuestionFragment
      }
      customer {
        ...CustomerFragment
      }
 */

export const mockFullDialogue: any = {
    id: '123',
    title: 'How do you feel?',
    publicTitle: 'good-day',
    creationDate: '22-8-2020',
    updatedAt: '22-8-2020',
    customerId: '123',
    questions: [],
    leafs: [],
    customer: {
        id: '123123',
        name: 'Customer X',
        slug: 'customer-x',
        settings: {
            id: '13123',
            logoUrl: 'https://www.google.com',
            colourSettings: {
                id: '12312',
                primary: '#ddd',
                primaryAlt: '#fff',
                secondary: 'red',
            }
        },
        dialogues: [{
            id: 1,
            description: "Working field",
            title: "Great to have you!",
            publicTitle: "Great-life"
        }]
    },
    rootQuestion: {
        id: '1',
        children: [],
        title: 'How do you feel about Mock',
        type: 'SLIDER',
    },
}
