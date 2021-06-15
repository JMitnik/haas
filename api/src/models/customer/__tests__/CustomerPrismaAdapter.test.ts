import { makeTestPrisma } from "../../../test/utils/makeTestPrisma";
import { CustomerPrismaAdapter } from "../CustomerPrismaAdapter";
import { CustomerCreateInput } from "@prisma/client";
import { NexusGenInputs } from "../../../generated/nexus";
import CustomerService from "../CustomerService";
import { clearCustomerDatabase } from './testUtils';

const prisma = makeTestPrisma();
const customerPrismaAdapter = new CustomerPrismaAdapter(prisma);
const customerService = new CustomerService(prisma);

describe('CustomerPrismaAdapter', () => {
  // beforeEach(async () => {
  //   await seedWorkspace(prisma, workspaceId, dialogueId);
  // });

  afterEach(async () => {
    await clearCustomerDatabase(prisma);
    prisma.$disconnect();
  });

  test('creates customer in database', async () => {
    const defaultCustomerInput: NexusGenInputs['CreateWorkspaceInput'] = {
      name: 'default workspace',
      slug: 'customerSlug',
      primaryColour: '#1333337',
      logo: 'https://fake-input/logo.png',
    }

    const customer = await customerPrismaAdapter.createWorkspace(defaultCustomerInput);
    const { name, slug, roles, id } = customer;

    // customer 
    expect(name).toBe(defaultCustomerInput.name);
    expect(slug).toBe(defaultCustomerInput.slug);

    // standard role should be made for customer
    expect(roles.length).not.toEqual(0);

    // settings (main & colour settings)

    const customerSettings = await prisma.customerSettings.findOne({
      where: {
        customerId: id,
      },
      include: {
        colourSettings: true,
      },
    });

    expect(customerSettings).not.toBeNull();

    expect(customerSettings?.logoUrl).toBe(defaultCustomerInput.logo);
    expect(customerSettings?.colourSettings?.primary).toBe(defaultCustomerInput.primaryColour);
  });
})