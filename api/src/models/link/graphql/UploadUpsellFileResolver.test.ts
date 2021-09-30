import fetch from 'node-fetch';
import { makeTestContext } from '../../../test/utils/makeTestContext';
import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';

const FormData = require('form-data');

const prisma = makeTestPrisma();
const ctx = makeTestContext(prisma);

describe('UploadUpsellFileResolver', () => {
  test(`Uploads upsell file to cloudinary`, async () => {
    const body = new FormData();

    body.append(
      'operations',
      JSON.stringify({
        query: `
            mutation uploadUpsellImage($file: Upload!) {
              uploadUpsellImage(file: $file) {
                url
              } 
            }
          `,
        variables: {
          file: null
        }
      })
    )
    body.append('map', JSON.stringify({ 1: ['variables.file'] }));
    body.append('1', 'a', 'a.txt');

    const res = await fetch(`http://localhost:${ctx.port}/graphql`, { method: 'POST', body })
      .then(response => response.json());

    expect(res?.data?.uploadUpsellImage?.url).not.toBeNull();
    expect(res?.data?.uploadUpsellImage?.url).not.toBeUndefined();
    expect(res?.data?.uploadUpsellImage?.url).toContain('http');
  });

});