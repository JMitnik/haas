import fetch from 'node-fetch';
import { makeRestServer } from '../../../test/utils/makeRestServer';
import { makeTestPrisma } from '../../../test/utils/makeTestPrisma';

const prisma = makeTestPrisma();
const server = makeRestServer(prisma);


test('webhook requires updates', async () => {
  const { port } = server;
  const res = await fetch(`http://localhost:${port}/webhooks/delivery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  expect(res.status).toBe(400);
  expect(res.statusText).toContain('Input invalid');
  expect(JSON.stringify(await res.json())).toContain('Updates required');
});

test('webhook requires updates', async () => {
  const { port } = server;
  const res = await fetch(`http://localhost:${port}/webhooks/delivery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  expect(res.status).toBe(400);
  expect(res.statusText).toContain('Input invalid');
  expect(JSON.stringify(await res.json())).toContain('Updates required');
});
