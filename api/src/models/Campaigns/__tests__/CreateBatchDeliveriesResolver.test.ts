import { createReadStream } from 'fs';

import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import { clearDatabase, prepDefaultData } from './testUtils';
import AuthService from '../../auth/AuthService';

jest.setTimeout(30000);

import { prisma } from 'test/setup/singletonDeps';
const ctx = makeTestContext(prisma);


afterEach(async () => {
  await clearDatabase(prisma);
  await prisma.$disconnect();
});

afterAll(async () => {
  await clearDatabase(prisma);
  await prisma.$disconnect();
});

it('send deliveries', async () => {
  const { user, campaign, workspace } = await prepDefaultData(prisma);

  // Generate token for API access
  const token = AuthService.createUserToken(user.id, 22);

  const file = createReadStream(`${__dirname}/testCsv.csv`);

  const res = await ctx.client.request(`
    mutation CreateBatchDeliveries($input: CreateBatchDeliveriesInputType) {
      createBatchDeliveries(input: $input) {
        nrDeliveries
        failedDeliveries {
          record
          error
        }
      }
    }
  `,
    {
      input: {
        workspaceId: workspace.id,
        uploadedCsv: file,
        campaignId: campaign.id,
        batchScheduledAt: '2011-10-05T14:48:00.000Z',
      },
    },
    {
      'Authorization': `Bearer ${token}`,
    }
  );

  expect(res).toMatchObject({
    createBatchDeliveries: { failedDeliveries: [], nrDeliveries: 1 },
  });
})

it('unable to send deliveries unauthorized', async () => {
  const { user, campaign, workspace, userRole } = await prepDefaultData(prisma);

  await prisma.role.update({
    where: { id: userRole.id },
    data: {
      permissions: [],
    },
  })

  // Generate token for API access
  const token = AuthService.createUserToken(user.id, 22);

  const file = createReadStream(`${__dirname}/testCsv.csv`);

  try {
    await ctx.client.request(`
      mutation CreateBatchDeliveries($input: CreateBatchDeliveriesInputType) {
        createBatchDeliveries(input: $input) {
          nrDeliveries
          failedDeliveries {
            record
            error
          }
        }
      }
    `,
      {
        input: {
          workspaceId: workspace.id,
          uploadedCsv: file,
          campaignId: campaign.id,
          batchScheduledAt: '2011-10-05T14:48:00.000Z',
        },
      },
      {
        'Authorization': `Bearer ${token}`,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      expect(error.message).toContain('Not Authorised!');
    }
  }
})
