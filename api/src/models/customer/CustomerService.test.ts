import { assertAbsolutePath } from '@nexus/schema/dist/core';
import CustomerService from './CustomerService';
import prisma from '../../prisma';

import { sampleFullCustomer } from '../../test/data/SampleCustomer';
import DialogueService from '../questionnaire/DialogueService';

describe('CustomerService tests', () => {
  // TODO: Ensure this never runs on production!
  beforeEach(async () => {
    const dialogues = await prisma.dialogue.findMany();
    await Promise.all(dialogues.map(async (dialogue) => DialogueService.deleteDialogue(dialogue.id)));
    const customers = await prisma.customer.findMany();
    await Promise.all(await customers.map((customer) => CustomerService.deleteCustomer(customer.id)));
  });

  afterEach(() => {
    prisma.disconnect();
  });

  it('Creates customer with dialogues, then deletes them all', async () => {
    const customer = await prisma.customer.create({
      ...sampleFullCustomer,
    });

    // Seed customer
    await CustomerService.seed(customer);

    const seededCustomer = await prisma.customer.findOne({
      where: { id: customer.id },
      include: {
        dialogues: {
          include: {
            questions: true,
          },
        },
      },
    });

    // TODO: Smarter assertions?
    expect(seededCustomer?.dialogues[0].questions.length).toEqual(31);

    if (!seededCustomer?.id) throw new Error('ID cant be found');

    await CustomerService.deleteCustomer(seededCustomer?.id);

    // We assume that after deleting, the following things are true (empty database, essentially)
    expect(await prisma.dialogue.count()).toEqual(0);
    expect(await prisma.customer.count()).toEqual(0);
    expect(await prisma.role.count()).toEqual(0);
    expect(await prisma.permission.count()).toEqual(0);
    expect(await prisma.nodeEntry.count()).toEqual(0);
  });
});
