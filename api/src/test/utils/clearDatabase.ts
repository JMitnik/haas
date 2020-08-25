import CustomerService from '../../models/customer/CustomerService';
import DialogueService from '../../models/questionnaire/DialogueService';
import config from '../../config/config';
import prisma from '../../config/prisma';

export const clearDatabase = async (): Promise<void> => {
  if (config.env === 'prod') return;

  const dialogues = await prisma.dialogue.findMany();
  await Promise.all(dialogues.map(async (dialogue) => DialogueService.deleteDialogue(dialogue.id)));
  const customers = await prisma.customer.findMany();
  await Promise.all(await customers.map((customer) => CustomerService.deleteCustomer(customer.id)));
};
