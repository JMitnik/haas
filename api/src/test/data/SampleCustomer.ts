import { CustomerCreateArgs } from '@prisma/client';

export const sampleCustomerWithDialogue: CustomerCreateArgs = {
  data: {
    name: 'HAAS Org',
    slug: 'haas-org',
    dialogues: {
      create: {
        title: 'How do you feel about HAAS?',
        description: 'Default template for HAAS',
        slug: 'default',
      },
    },
  },
};
