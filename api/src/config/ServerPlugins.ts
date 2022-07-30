import { FastifyInstance } from 'fastify';
import CookiePlugin from 'fastify-cookie';
import MultiPartPlugin from 'fastify-multipart';
import { processRequest } from 'graphql-upload';

/**
 * Register plugins for the server instance.
 * @param app
 * @returns
 */
export const registerPlugins = async (app: FastifyInstance): Promise<any> => {
  // Support reading and setting cookies
  await app.register(CookiePlugin);

  // Parse streams, and other multiple types
  await app.register(MultiPartPlugin);


  // Format the request body to follow graphql-upload's
  app.addHook('preValidation', async function (request, reply) {
    if (!request.isMultipart()) {
      return;
    }

    request.body = await processRequest(request.raw, reply.raw);
  });
}
