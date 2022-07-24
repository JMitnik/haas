import { createReadStream } from 'fs';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import AuthService from '../../auth/AuthService';
import { prepDefaultData } from './testUtils';
import { prisma } from '../../../test/setup/singletonDeps';

const ctx = makeTestContext(prisma);


describe('UploadUpsellFileResolver', () => {
  test('Unable to upload upsell image unauthorized', async () => {
    const { user, workspace, userRole } = await prepDefaultData(prisma);
    const image = createReadStream(`${__dirname}/earbuds.webp`);
    await prisma.role.update({
      where: { id: userRole.id },
      data: {
        permissions: [],
      },
    })

    // Generate token for API access
    const token = AuthService.createUserToken(user.id, 22);

    await ctx.client.request(`
    mutation uploadUpsellImage($input: UploadSellImageInputType) {
      uploadUpsellImage(input: $input) {
          url
      }
    }
  `,
    {
      input: {
        workspaceId: workspace.id,
        file: image,
      },
    },
    {
      'Authorization': `Bearer ${token}`,
    }
    )
      .catch((reason) => expect(reason.message).toContain('Not Authorised!'));
  });

});
