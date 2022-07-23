import { createReadStream, existsSync } from 'fs';

import { makeTestContext } from '../../../test/utils/makeTestContext';
import AuthService from '../../auth/AuthService';
import { clearDatabase, prepDefaultData } from './testUtils';
import { prisma } from '../../../test/setup/singletonDeps';

jest.mock('../../Common/Upload/Cloudinary/uploadCloudinary', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({ url: 'https://cloudinary-url.mock' })),
    uploadCloudinary: jest.fn(() => ({ url: 'https://cloudinary-url.mock' })),
  }
});

const ctx = makeTestContext(prisma);

beforeEach(async () => {
  try {
    await clearDatabase(prisma);
  } catch (error) {}
});

describe('UploadUpsellFileResolver', () => {
  test('Uploads upsell file to cloudinary', async () => {
    const { user, workspace } = await prepDefaultData(prisma);

    const image = createReadStream(`${__dirname}/earbuds.webp`);
    const inputFileExists = existsSync(`${__dirname}/earbuds.webp`);
    expect(inputFileExists).toBe(true);

    // Generate token for API access
    const token = AuthService.createUserToken(user.id, 22);
    const res = await ctx.client.request(`
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
    );

    expect(res?.uploadUpsellImage?.url).not.toBeNull();
    expect(res?.uploadUpsellImage?.url).not.toBeUndefined();
    expect(res?.uploadUpsellImage?.url).toContain('http');
  });

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
