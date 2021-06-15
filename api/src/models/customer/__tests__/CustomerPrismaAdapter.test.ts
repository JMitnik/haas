import { makeTestPrisma } from "../../../test/utils/makeTestPrisma";
import { CustomerPrismaAdapter } from "../CustomerPrismaAdapter";
import { CustomerCreateInput } from "@prisma/client";
import { NexusGenInputs } from "../../../generated/nexus";
import CustomerService from "../CustomerService";
import { clearCustomerDatabase } from './testUtils';

const prisma = makeTestPrisma();
const customerPrismaAdapter = new CustomerPrismaAdapter(prisma);

const defaultCustomerInput: NexusGenInputs['CreateWorkspaceInput'] = {
  name: 'default workspace',
  slug: 'customerSlug',
  primaryColour: '#1333337',
  logo: 'https://fake-input/logo.png',
};

describe('CustomerPrismaAdapter', () => {
  // beforeEach(async () => {
  //   await seedWorkspace(prisma, workspaceId, dialogueId);
  // });

  afterEach(async () => {
    await clearCustomerDatabase(prisma);
    prisma.$disconnect();
  });

  test('customerPrismaAdapter.createWorkspace', async () => {
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

    // tags

    const tags = await prisma.tag.findMany({
      where: {
        customerId: customer.id,
      }
    });

    expect(tags.length).not.toEqual(0);
  });

  test('customerPrismaAdapter.delete', async () => {
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

    const customerPostDelete = await prisma.customer.findOne({
      where: {
        id: customer.id,
      },
    });

    expect(customerPostDelete).toBeNull();
  });

  test('customerPrismaAdapter.exists', async () => {
    const customer = await customerPrismaAdapter.createWorkspace(defaultCustomerInput);
    const customerExists = await customerPrismaAdapter.exists(customer.id);

    expect(customerExists).toBe(true);

    await clearCustomerDatabase(prisma);

    const customerExistsPostDelete = await customerPrismaAdapter.exists(customer.id);

    expect(customerExistsPostDelete).toBe(false);
  });

  test('customerPrismaAdapter.findAll', async () => {
    const customers = await customerPrismaAdapter.findAll();
    expect(customers).toHaveLength(0);

    await customerPrismaAdapter.createWorkspace(defaultCustomerInput);

    const customersPostCreate = await customerPrismaAdapter.findAll();
    expect(customersPostCreate).toHaveLength(1);
  });

  test('customerPrismaAdapter.findManyTagsByCustomerSlug', async () => {
    await customerPrismaAdapter.createWorkspace(defaultCustomerInput);
    const customerInputTwo = { ...defaultCustomerInput, slug: 'customerSlugTwo', name: 'workspaceTwo' };
    await customerPrismaAdapter.createWorkspace(customerInputTwo);
    const tags = await customerPrismaAdapter.findManyTagsByCustomerSlug(customerInputTwo.slug);
    expect(tags).toHaveLength(3);

    const allTags = await prisma.tag.findMany({});
    expect(allTags).toHaveLength(6);
  });

  test('customerPrismaAdapter.findWorkspaceById', async () => {
    const createdCustomer = await customerPrismaAdapter.createWorkspace(defaultCustomerInput);
    const foundCustomer = await customerPrismaAdapter.findWorkspaceById(createdCustomer.id);
    expect(foundCustomer).not.toBeNull();

    const notFoundCustomer = await customerPrismaAdapter.findWorkspaceById('-1');
    expect(notFoundCustomer).toBeNull();
  });

  test('customerPrismaAdapter.findWorkspaceBySlug', async () => {
    const createdCustomer = await customerPrismaAdapter.createWorkspace(defaultCustomerInput);
    const foundCustomer = await customerPrismaAdapter.findWorkspaceBySlug(createdCustomer.slug);
    expect(foundCustomer).not.toBeNull();

    const notFoundCustomer = await customerPrismaAdapter.findWorkspaceBySlug('nonExistingSlug');
    expect(notFoundCustomer).toBeNull();
  });

  test('customerPrismaAdapter.findWorkspaceBySlugs', async () => {
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

  test('customerPrismaAdapter.getAllCustomersBySlug', async () => {
    const createdCustomer = await customerPrismaAdapter.createWorkspace(defaultCustomerInput);
    const customerInputTwo = { ...defaultCustomerInput, slug: 'customerSlugTwo', name: 'workspaceTwo' };
    
    await customerPrismaAdapter.createWorkspace(customerInputTwo);

    const customers = await customerPrismaAdapter.getAllCustomersBySlug(createdCustomer.slug);
    expect(customers).toHaveLength(1);
  });

  test('customerPrismaAdapter.findWorkspaceSettings', async () => {
    const createdCustomer = await customerPrismaAdapter.createWorkspace(defaultCustomerInput);
    const settingsNotFound = await customerPrismaAdapter.findWorkspaceSettings('NOT_FOUND');

    expect(settingsNotFound).toBeNull();

    const settingsFound = await customerPrismaAdapter.findWorkspaceSettings(createdCustomer.id);
    expect(settingsFound).not.toBeNull();
  })

});