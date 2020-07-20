import CustomerService from './CustomerService';
import prisma from '../../prisma';

import { sampleCustomerWithoutDialogue, sampleFullCustomer } from '../../test/data/SampleCustomer';
import DialogueService from '../questionnaire/DialogueService';

describe('CustomerService tests', () => {
  // TODO: Ensure this never runs on production!
  beforeEach(async () => {
    const dialogues = await prisma.dialogue.findMany();
  //   await Promise.all(dialogues.map(async (dialogue) => DialogueService.deleteDialogue(dialogue.id)));
  //   const customers = await prisma.customer.findMany();
  //   await Promise.all(await customers.map((customer) => CustomerService.deleteCustomer(customer.id)));
  //   // Delete all dialogues
  //   // await prisma.dialogue.deleteMany({
  //   //   where: {
  //   //     id: {
  //   //       not: undefined,
  //   //     },
  //   //   },
  //   // });
  });

  it('Creates customer', async () => {
    const customer = await prisma.customer.create({
      ...sampleCustomerWithoutDialogue,
    });

    expect(await prisma.customer.count()).toBe(1);
  });

  it('Deletes customer', async () => {
    const customer = await prisma.customer.create({
      ...sampleCustomerWithoutDialogue,
    });

    expect(await prisma.customer.count()).toBe(1);

    await CustomerService.deleteCustomer(customer.id);

    expect(await prisma.customer.count()).toBe(0);
  });

  it('Creates customer with dialogues, then deletes them all', async () => {
    const customer = await prisma.customer.create({
      ...sampleFullCustomer,
    });

    // Seed customer
    await CustomerService.seed(customer);

    const seededCustomer = await prisma.customer.findOne({ where: { id: customer.id }, include: { dialogues: true } });
  });
});
