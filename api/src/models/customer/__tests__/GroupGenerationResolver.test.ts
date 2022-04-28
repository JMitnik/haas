import { createReadStream } from 'fs';

import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import { clearDatabase, prepDefaultCreateData } from './testUtils';
import AuthService from '../../auth/AuthService';

jest.setTimeout(30000);

const prisma = makeTestPrisma();
const ctx = makeTestContext(prisma);

afterEach(async () => {
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

});

