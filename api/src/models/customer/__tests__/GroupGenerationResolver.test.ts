import { createReadStream } from 'fs';

import { makeTestContext } from '../../../test/utils/makeTestContext';
import { prepDefaultCreateData } from './testUtils';
import AuthService from '../../auth/AuthService';
import { prisma } from '../../../test/setup/singletonDeps';

import { clearDatabase } from '../../../test/utils/clearDatabase';

jest.setTimeout(30000);

const ctx = makeTestContext(prisma);


afterEach(async () => {
  await clearDatabase(prisma);
  await prisma.$disconnect();
});

afterAll(async () => {
  await clearDatabase(prisma);
  await prisma.$disconnect();
});

it('Group generation using CSV', async () => {
  const { user } = await prepDefaultCreateData(prisma);
  await prisma.user.update({
    data: {
      globalPermissions: ['CAN_ACCESS_ADMIN_PANEL'],
    },
    where: {
      id: user.id,
    },
  })
  // Generate token for API access
  const token = AuthService.createUserToken(user.id, 22);

  const file = createReadStream(`${__dirname}/testCsv.csv`);
  file.addListener('end', async () => {
    const res = await ctx.client.request(`
    mutation GenerateWorkspaceFromCSV($input: GenerateWorkspaceCSVInputType) {
      generateWorkspaceFromCSV(input: $input) {
        id
        slug
      }
    }
  `,
    {
      input: {
        uploadedCsv: file,
        workspaceSlug: 'newWorkspaceSlug',
        workspaceTitle: 'newWorkspaceTitle',
      },
    },
    {
      'Authorization': `Bearer ${token}`,
    }
    );

    expect(res).toMatchObject({
      generateWorkspaceFromCSV: {
        slug: 'newWorkspaceSlug',
      },
    });

  })

});

