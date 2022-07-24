import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

import { ContextSessionType } from './ContextSessionType';
import config from '../../config/config';
import readBearerToken from './readBearerToken';
import { fetchTunnelUrl } from '../../utils/fetchTunnelUrl';
import CustomerService from '../customer/CustomerService';
import UserService from '../users/UserService';
import { GraphQLYogaError } from '@graphql-yoga/node';

class ContextSessionService {
  customerService: CustomerService;
  userService: UserService;
  context: ExpressContext;

  constructor(context: ExpressContext, prismaClient: PrismaClient) {
    this.customerService = new CustomerService(prismaClient);
    this.userService = new UserService(prismaClient);
    this.context = context;
  }

  /**
   * Finds a matching workspace based on either the workspace slug or id in the current request body
   * @returns A workspace
   */
  getWorkSpaceFromReq = async () => {
    const vars = this.context?.req?.body?.variables;
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
    const cookieToken: string | null = this.context.req.cookies?.access_token;

    // Support auth-use case if a token is submitted using a Bearer token
    const authHeader = this.context.req.headers.authorization || '';
    const bearerToken = readBearerToken(authHeader);

    // Prefer cookie-token over bearer-token
    const authToken = cookieToken || bearerToken || null;
    if (!authToken) return null;

    let isValid = null;
    try {
      isValid = jwt.verify(authToken, config.jwtSecret);
    } catch (e) {
      console.log('Error: ', e);
      this.context.res.cookie('access_token', '');
      throw new GraphQLYogaError('UNAUTHENTICATED');
    }

    if (!isValid) return null;

    const decodedUser = jwt.decode(authToken);
    // @ts-ignore
    const decodedUserId = decodedUser?.id;
    // @ts-ignore
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
