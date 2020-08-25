import { clearDatabase } from '../../test/utils/clearDatabase';
import { initSampleFullCustomer } from '../../test/data/SampleCustomer';
import CustomerService from './CustomerService';
import prisma from '../../config/prisma';

describe('CustomerService tests', () => {
  // TODO: Ensure this never runs on production!
  beforeEach(async () => {
    await clearDatabase();
  });

  afterEach(() => {
    prisma.disconnect();
  });

  it('Creates customer with dialogues, then deletes them all', async () => {
    const customer = await initSampleFullCustomer();

    // TODO: Smarter assertions?
    expect(customer?.dialogues[0].questions.length).toEqual(31);

    if (!customer?.id) throw new Error('ID cant be found');

    await CustomerService.deleteCustomer(customer?.id);

    // We assume that after deleting, the following things are true (empty database, essentially)
    expect(await prisma.dialogue.count()).toEqual(0);
    expect(await prisma.customer.count()).toEqual(0);
    expect(await prisma.role.count()).toEqual(0);
    expect(await prisma.permission.count()).toEqual(0);
    expect(await prisma.nodeEntry.count()).toEqual(0);
  });
});
