import { PrismaClient, Customer } from '@prisma/client';
import CustomerResolver from './customer-resolver';

const prisma = new PrismaClient();

test('CRUD customer without seed', async () => {
  const args = {
    name: 'testCustomer',
    options: {
      isSeed: false,
      logo: 'https://fake_logo_url.png',
      primaryColour: '#12345',
      slug: 'testCustomerSlug',
    },
  };

  // CREATE
  const createCustomer = await CustomerResolver.createCustomer(args);
  expect(typeof createCustomer).toBe('object');

  // READ
  const readCustomer = await prisma.customer.findOne({
    where: {
      id: createCustomer.id,
    },
    include: {
      settings: {
        include: {
          colourSettings: true,
        },
      },
    },
  });
  expect(readCustomer?.name).toBe(args.name);
  expect(readCustomer?.slug).toBe(args.options.slug);
  expect(readCustomer?.settings?.logoUrl).toBe(args.options.logo);
  expect(readCustomer?.settings?.colourSettings?.primary).toBe(args.options.primaryColour);

  // UPDATE
  const updatedArgs = {
    id: readCustomer?.id,
    options: {
      isSeed: false,
      name: 'testEditCustomer',
      logo: 'https://fake_logo_url_edit.png',
      primaryColour: '#54321',
      slug: 'testCustomerSlugEdit',
    },
  };
  const updateCustomer = await CustomerResolver.editCustomer(updatedArgs);

  expect(updateCustomer.name).toBe(updatedArgs.options.name);
  expect(updateCustomer?.slug).toBe(updatedArgs.options.slug);

  // DELETE

  await prisma.customer.delete({
    where: {
      id: createCustomer.id,
    },
  });

  expect(await prisma.customer.findOne({ where: { id: createCustomer.id } })).toBe(null);
});

