import { clearDatabase } from '../../test/utils/clearDatabase';
import { initSampleFullCustomer } from '../../test/data/SampleCustomer';
import RoleService from './RoleService';
import prisma from '../../config/prisma';

describe('RoleService tests', () => {
  // TODO: Ensure this never runs on production!
  beforeEach(async () => {
    await clearDatabase();
  });

  afterEach(() => {
    prisma.disconnect();
  });

  it('Creates customer with roles, get the connetion', async () => {
    const customer = await initSampleFullCustomer();

    expect(customer?.roles.length).toBeGreaterThan(0);

    // Test number of limits
    const roleConnectionMax3 = await RoleService.paginatedRoles(customer.id, {
      limit: 3,
    });
    expect(roleConnectionMax3.roles.length).toEqual(3);

    // Test that nothing equals all
    const roleConnectionAll = await RoleService.paginatedRoles(customer.id, {});
    expect(roleConnectionAll.roles.length).toBeGreaterThan(3);

    // Test that a higher offset and limit returns an incomplete list
    const roleConnectionNotAll = await RoleService.paginatedRoles(customer.id, {
      offset: 4,
      limit: 3,
    });

    expect(roleConnectionNotAll.roles.length).toBeLessThan(3);
    expect(roleConnectionNotAll.roles[0].name).toContain('Business');
  });
});
