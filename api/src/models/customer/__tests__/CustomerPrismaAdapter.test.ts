import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';
import { CustomerPrismaAdapter } from '../CustomerPrismaAdapter';
import { NexusGenInputs } from '../../../generated/nexus';
import { clearCustomerDatabase } from './testUtils';
import { UpdateCustomerInput } from '../CustomerServiceType';

const prisma = makeTestPrisma();
const customerPrismaAdapter = new CustomerPrismaAdapter(prisma);

const defaultCustomerInput: NexusGenInputs['CreateWorkspaceInput'] = {
  name: 'default workspace',
  slug: 'customerSlug',
  primaryColour: '#1333337',
  logo: 'https://fake-input/logo.png',
};

describe('CustomerPrismaAdapter', () => {
  afterEach(async () => {
    await clearCustomerDatabase(prisma);
    await prisma.$disconnect();
  });

  afterAll(async () => {
    await clearCustomerDatabase(prisma);
    await prisma.$disconnect();
  });

  test('Creates a workspace', async () => {
    const createdCustomer = await customerPrismaAdapter.createWorkspace(defaultCustomerInput);

    // customer
    expect(createdCustomer.name).toBe(defaultCustomerInput.name);
    expect(createdCustomer.slug).toBe(defaultCustomerInput.slug);

    // standard role should be made for customer
    expect(createdCustomer.roles.length).not.toEqual(0);

    // settings (main & colour settings)

    const customerSettings = await prisma.customerSettings.findUnique({
      where: {
        customerId: createdCustomer.id,
      },
      include: {
        colourSettings: true,
      },
    });

    expect(customerSettings).not.toBeNull();

    expect(customerSettings?.logoUrl).toBe(defaultCustomerInput.logo);
    expect(customerSettings?.colourSettings?.primary).toBe(defaultCustomerInput.primaryColour);

    // tags
    const tags = await prisma.tag.findMany({
      where: {
        customerId: createdCustomer.id,
      },
    });

    expect(tags.length).not.toEqual(0);
  });

  test('Deletes a workspace (INCOMPLETE)', async () => {
    const customer = await customerPrismaAdapter.createWorkspace(defaultCustomerInput);
    const deleteTags = prisma.tag.deleteMany({});
    const deleteRoles = prisma.role.deleteMany({});
    const colourSettings = prisma.colourSettings.deleteMany({});
    const fontSettings = prisma.fontSettings.deleteMany({});
    const customerSettings = prisma.customerSettings.deleteMany({});

    await prisma.$transaction([
      deleteTags,
      deleteRoles,
      colourSettings,
      fontSettings,
      customerSettings,
    ]);

    await customerPrismaAdapter.delete(customer.id);

    const customerPostDelete = await prisma.customer.findUnique({
      where: {
        id: customer.id,
      },
    });

    expect(customerPostDelete).toBeNull();
  });

  test('Checks whether customer exits based on a workspace ID', async () => {
    const customer = await customerPrismaAdapter.createWorkspace(defaultCustomerInput);
    const customerExists = await customerPrismaAdapter.exists(customer.id);

    expect(customerExists).toBe(true);

    await clearCustomerDatabase(prisma);

    const customerExistsPostDelete = await customerPrismaAdapter.exists(customer.id);

    expect(customerExistsPostDelete).toBe(false);
  });

  test('Finds all workspaces', async () => {
    const customers = await customerPrismaAdapter.findAll();
    expect(customers).toHaveLength(0);

    await customerPrismaAdapter.createWorkspace(defaultCustomerInput);

    const customersPostCreate = await customerPrismaAdapter.findAll();
    expect(customersPostCreate).toHaveLength(1);
  });

  test('Finds all tags of a workspace', async () => {
    await customerPrismaAdapter.createWorkspace(defaultCustomerInput);
    const customerInputTwo = { ...defaultCustomerInput, slug: 'customerSlugTwo', name: 'workspaceTwo' };
    await customerPrismaAdapter.createWorkspace(customerInputTwo);
    const tags = await customerPrismaAdapter.getTagsByCustomerSlug(customerInputTwo.slug);
    expect(tags).toHaveLength(3);

    const allTags = await prisma.tag.findMany({});
    expect(allTags).toHaveLength(6);
  });

  test('Finds workspace by ID', async () => {
    const createdCustomer = await customerPrismaAdapter.createWorkspace(defaultCustomerInput);
    const foundCustomer = await customerPrismaAdapter.findWorkspaceById(createdCustomer.id);
    expect(foundCustomer).not.toBeNull();
    expect(foundCustomer?.slug).toBe(defaultCustomerInput.slug);
    expect(foundCustomer?.settings?.colourSettings?.primary).toBe(defaultCustomerInput.primaryColour);
    expect(foundCustomer?.settings?.logoUrl).toBe(defaultCustomerInput.logo);

    const notFoundCustomer = await customerPrismaAdapter.findWorkspaceById('-1');
    expect(notFoundCustomer).toBeNull();
  });

  test('Finds workspace by slug', async () => {
    const createdCustomer = await customerPrismaAdapter.createWorkspace(defaultCustomerInput);

    // Expect workspace to be found with existing slug
    const foundCustomer = await customerPrismaAdapter.findWorkspaceBySlug(createdCustomer.slug);
    expect(foundCustomer).not.toBeNull();
    expect(foundCustomer?.slug).toBe(defaultCustomerInput.slug);

    // Expect no workspace to be found with non-existing slug
    const notFoundCustomer = await customerPrismaAdapter.findWorkspaceBySlug('nonExistingSlug');
    expect(notFoundCustomer).toBeNull();
  });

  test('Finds workspace by either slug or ID ', async () => {
    const createdCustomer = await customerPrismaAdapter.createWorkspace(defaultCustomerInput);

    // Find by id in list
    const notFoundlist = ['no', 'nope'];
    const foundListById = [...notFoundlist, createdCustomer.id];
    const foundListBySlug = [createdCustomer.slug, ...notFoundlist];

    // Not found by id or slug in list
    const notFoundCustomer = await customerPrismaAdapter.findWorkspaceBySlugs(notFoundlist);
    expect(notFoundCustomer).toBeNull();
    // Find by slug in list
    const foundBySlugCustomer = await customerPrismaAdapter.findWorkspaceBySlugs(foundListBySlug);
    expect(foundBySlugCustomer).not.toBeNull();

    // Not find by id in list
    const foundByIdCustomer = await customerPrismaAdapter.findWorkspaceBySlugs(foundListById);
    expect(foundByIdCustomer).not.toBeNull();
  });

  test('Finds all workspaces by slug', async () => {
    const createdCustomer = await customerPrismaAdapter.createWorkspace(defaultCustomerInput);
    const customerInputTwo = { ...defaultCustomerInput, slug: 'customerSlugTwo', name: 'workspaceTwo' };

    await customerPrismaAdapter.createWorkspace(customerInputTwo);

    const customers = await customerPrismaAdapter.getAllCustomersBySlug(createdCustomer.slug);
    expect(customers).toHaveLength(1);
  });

  test('Finds a dialogue by workspace + dialogue ID', async () => {
    const customer = await prisma.customer.create({
      data: {
        name: 'workspace',
        slug: 'sluggy',
        dialogues: {
          create: [
            {
              title: 'dialogueOne',
              slug: 'dialogueOneSlug',
              description: 'description #1',
            },
            {
              title: 'dialogueTwo',
              slug: 'dialogueTwoSlug',
              description: 'description #1',
            },
          ],
        },
      },
      include: {
        dialogues: true,
      },
    });

    expect(customer.dialogues).toHaveLength(2);

    const dialogueId = customer.dialogues[0].id;

    const notFoundDialogue = await customerPrismaAdapter.getDialogueById(customer.id, '-1');
    expect(notFoundDialogue).toBeUndefined();

    const foundDialogue = await customerPrismaAdapter.getDialogueById(customer.id, dialogueId);
    expect(foundDialogue).not.toBeUndefined();
  });

  test('Finds dialogue by workspace ID + customer slug', async () => {
    const customer = await prisma.customer.create({
      data: {
        name: 'workspace',
        slug: 'sluggy',
        dialogues: {
          create: [
            {
              title: 'dialogueOne',
              slug: 'dialogueOneSlug',
              description: 'description #1',
            },
            {
              title: 'dialogueTwo',
              slug: 'dialogueTwoSlug',
              description: 'description #1',
            },
          ],
        },
      },
      include: {
        dialogues: true,
      },
    });

    const dialogueSlug = customer.dialogues[0].slug;

    const notFoundDialogue = await customerPrismaAdapter.getDialogueBySlug(customer.id, '-1');
    expect(notFoundDialogue).toBeUndefined();

    const foundDialogue = await customerPrismaAdapter.getDialogueBySlug(customer.id, dialogueSlug);
    expect(foundDialogue).not.toBeUndefined();
  });

  test('Finds tags of dialogue by workspace ID + dialogue slug', async () => {
    const customer = await prisma.customer.create({
      data: {
        name: 'workspace',
        slug: 'sluggy',
        dialogues: {
          create: [
            {
              title: 'dialogueOne',
              slug: 'dialogueOneSlug',
              description: 'description #1',
              tags: {
                create: [
                  {
                    name: 'tag1',
                    type: 'AGENT',
                    customer: {
                      connect: {
                        slug: 'sluggy',
                      },
                    },
                  },
                  {
                    name: 'tag2',
                    type: 'DEFAULT',
                    customer: {
                      connect: {
                        slug: 'sluggy',
                      },
                    },
                  },
                  {
                    name: 'tag3',
                    type: 'LOCATION',
                    customer: {
                      connect: {
                        slug: 'sluggy',
                      },
                    },
                  },
                ],
              },
            },
            {
              title: 'dialogueTwo',
              slug: 'dialogueTwoSlug',
              description: 'description #1',
            },
          ],
        },
      },
      include: {
        dialogues: true,
      },
    });

    const dialogueSlugOne = customer.dialogues[0].slug;
    const dialogueSlugTwo = customer.dialogues[1].slug;

    // no tags
    const dialogueWithoutTags = await customerPrismaAdapter.getDialogueTags(customer.slug, dialogueSlugTwo);
    expect(dialogueWithoutTags?.tags).toHaveLength(0);

    const dialogueWithTags = await customerPrismaAdapter.getDialogueTags(customer.slug, dialogueSlugOne);
    expect(dialogueWithTags?.tags).toHaveLength(3);
  });

  test('Updates a workspace', async () => {
    const customer = await customerPrismaAdapter.createWorkspace(defaultCustomerInput);
    const customerUpdateInput: UpdateCustomerInput = { name: 'newName', slug: 'newSlug' }
    const updatedCustomer = await customerPrismaAdapter.updateCustomer(customer.id, customerUpdateInput);
    expect(updatedCustomer?.name).toBe(customerUpdateInput.name);
    expect(updatedCustomer?.slug).toBe(customerUpdateInput.slug);
    expect(updatedCustomer?.settings?.logoUrl).toBe(defaultCustomerInput.logo);
    expect(updatedCustomer?.settings?.colourSettings?.primary).toBe(defaultCustomerInput.primaryColour);
  });

});
