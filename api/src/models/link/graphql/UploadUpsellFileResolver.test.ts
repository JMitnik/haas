import fetch from 'node-fetch';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';
import AuthService from '../../auth/AuthService';
import { clearDatabase, prepDefaultData } from './testUtils';

const FormData = require('form-data');

const prisma = makeTestPrisma();
const ctx = makeTestContext(prisma);

describe('UploadUpsellFileResolver', () => {

  afterEach(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  test(`Uploads upsell file to cloudinary`, async () => {
    const { user, workspace } = await prepDefaultData(prisma);

    // Generate token for API access
    const token = AuthService.createUserToken(user.id, 22);
    const body = new FormData();

    body.append(
      'operations',
      JSON.stringify({
        query: `
          mutation uploadUpsellImage($file: Upload!, $workspaceId: String) {
            uploadUpsellImage(file: $file, workspaceId: $workspaceId) {
                url
            }
          }
          `,
        variables: {
          file: null,
          workspaceId: workspace.id
        }
      })
    )
    body.append('map', JSON.stringify({ 1: ['variables.file'] }));
    body.append('1', 'a', 'a.txt');

    const res = await fetch(`http://localhost:${ctx.port}/graphql`, {
      method: 'POST',
      body,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => response.json()).catch((reason) => console.log('Something WENT WRONG: ', reason));

    expect(res?.data?.uploadUpsellImage?.url).not.toBeNull();
    expect(res?.data?.uploadUpsellImage?.url).not.toBeUndefined();
    expect(res?.data?.uploadUpsellImage?.url).toContain('http');
  });

  test('Unable to upload upsell image unauthorized', async () => {
    const { user, workspace, userRole } = await prepDefaultData(prisma);

    await prisma.role.update({
      where: { id: userRole.id },
      data: {
        permissions: []
      }
    })

    // Generate token for API access
    const token = AuthService.createUserToken(user.id, 22);
    const body = new FormData();

    body.append(
      'operations',
      JSON.stringify({
        query: `
          mutation uploadUpsellImage($file: Upload!, $workspaceId: String) {
            uploadUpsellImage(file: $file, workspaceId: $workspaceId) {
                url
            }
          }
          `,
        variables: {
          file: null,
          workspaceId: workspace.id
        }
      })
    )
    body.append('map', JSON.stringify({ 1: ['variables.file'] }));
    body.append('1', 'a', 'a.txt');

    await fetch(`http://localhost:${ctx.port}/graphql`, {
      method: 'POST',
      body,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .catch((reason) => expect(reason.message).toContain('Not Authorised!'));
  });

});