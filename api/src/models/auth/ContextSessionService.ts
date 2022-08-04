import jwt from 'jsonwebtoken';
import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';

import { ContextSessionType } from './ContextSessionType';
import config from '../../config/config';
import readBearerToken from './readBearerToken';
import { fetchTunnelUrl } from '../../utils/fetchTunnelUrl';
import CustomerService from '../customer/CustomerService';
import UserService from '../users/UserService';
import { logger } from '../../config/logger';
import { UnauthenticatedError } from '../Common/Errors/UnauthenticatedError';

interface GraphQLBody {
  variables?: any;
}

interface IncomingContext {
  req: FastifyRequest<any>;
  reply: FastifyReply;
}

class ContextSessionService {
  customerService: CustomerService;
  userService: UserService;
  context: IncomingContext;

  constructor(context: IncomingContext, prismaClient: PrismaClient) {
    this.customerService = new CustomerService(prismaClient);
    this.userService = new UserService(prismaClient);
    this.context = context;
  }

  /**
   * Finds a matching workspace based on either the workspace slug or id in the current request body
   * @returns A workspace
   */
  getWorkSpaceFromReq = async () => {
    const body = this.context.req.body as GraphQLBody;
    const vars = body?.variables;

    if (vars?.customerSlug || vars?.input?.customerSlug) {
      const customerSlug = vars?.customerSlug || vars?.input?.customerSlug;
      const customer = await this.customerService.findWorkspaceBySlug(customerSlug);
      return customer;
    };

    if (vars?.customerId || vars?.input?.customerId || vars?.workspaceId || vars?.input?.workspaceId) {
      const customerId = vars?.customerId
        || vars?.input?.customerId
        || vars?.workspaceId
        || vars?.input?.workspaceId
      const customer = await this.customerService.findWorkspaceById(customerId);
      return customer;
    };

    return null;
  };

  /**
   * Creates a context session used for every GraphQL call
   * @returns ContextSession
   */
  constructContextSession = async (): Promise<ContextSessionType | null> => {
    // Support auth use-case if a token is supported using cookie (should be HTTP-only)
    const request = this.context.req as any;
    const cookieToken: string | null = request.cookies?.access_token;

    // Support auth-use case if a token is submitted using a Bearer token
    const authHeader = this.context.req.headers['authorization'];
    const bearerToken = readBearerToken(authHeader);

    // Prefer cookie-token over bearer-token
    const authToken = cookieToken || bearerToken || null;
    if (!authToken) return null;
    let isValid = null;

    try {
      isValid = jwt.verify(authToken, config.jwtSecret);
    } catch (e) {
      logger.error('Error parsing JWT Token', e);
      Promise.resolve(this.context.reply.cookie('access_token', '')).catch(() => { return });
      throw new UnauthenticatedError();
    }

    if (!isValid) return null;

    const decodedUser = jwt.decode(authToken) as any;
    const decodedUserId = decodedUser?.id;
    const decodedExpAt = decodedUser?.iat;

    if (!decodedUserId) return null;
    if (!decodedExpAt) return null;

    const user = await this.userService.findUserContext(decodedUserId);

    const customersAndPermissions = user?.customers.map((customer) => ({
      permissions: customer.role.permissions,
      id: customer.customer.id,
    }));

    const workspace = await this.getWorkSpaceFromReq();
    const activeWorkspace = customersAndPermissions?.find((userCustomer) => userCustomer.id === workspace?.id) || null;

    const baseUrl = process.env.ENVIRONMENT === 'local' ? await fetchTunnelUrl() : config.baseUrl;
    const session = {
      user,
      baseUrl,
      customersAndPermissions,
      expiresAt: decodedExpAt,
      globalPermissions: user?.globalPermissions || [],
      token: authToken,
      activeWorkspace,
    };

    return session;
  };

}

export default ContextSessionService;
