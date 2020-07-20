import { PrismaClient } from '@prisma/client';
import CustomerService from './CustomerService';
import prisma from '../../prisma';

describe('CustomerService tests', () => {
  beforeEach(async () => {
    // Delete all dialogues
    await prisma.dialogue.deleteMany({
      where: {
        id: {
          not: undefined,
        },
      },
    });

    await prisma.customer.deleteMany({
      where: {
        id: {
          not: undefined,
        },
      },
    });
  });

  it('Creates customer', async () => {
    const customer = await prisma.customer.create({
      data: { name: 'Starbucks', slug: 'starbucks' },
    });

    expect(await prisma.customer.count()).toBe(1);
  });

  it('Deletes customer', async () => {
    const customer = await prisma.customer.create({
      data: { name: 'Starbucks', slug: 'starbucks' },
    });

    expect(await prisma.customer.count()).toBe(1);

    await CustomerService.deleteCustomer(customer.id);

    expect(await prisma.customer.count()).toBe(0);
  });

  it('Gets customer by slug', async () => {
    const customer = await prisma.customer.create({
      data: { name: 'Starbucks', slug: 'starbucks' },
    });

    const fetchedCustomer = await CustomerService.customerBySlug('starbucks');

    expect(fetchedCustomer.name).toEqual('Starbucks');
  });
});
