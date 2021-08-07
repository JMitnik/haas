import CustomerService from '../../models/customer/CustomerService';
import DialogueService from '../../models/questionnaire/DialogueService';
import config from '../../config/config';
import prisma from '../../config/prisma';

export const clearDatabase = async (): Promise<void> => {
  if (config.env === 'prod') return;

  const dialogues = await prisma.dialogue.findMany();
  const dialogueService = new DialogueService(prisma);
  const customerService = new CustomerService(prisma);

  await Promise.all(dialogues.map(async (dialogue) => dialogueService.deleteDialogue(dialogue.id)));
  const customers = await prisma.customer.findMany();
  await Promise.all(customers.map((customer) => customerService.deleteWorkspace(customer.id)));
};
