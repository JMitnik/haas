import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { PrismaClient } from '@prisma/client';

import { ContextSessionType } from '../models/auth/ContextSessionType';
import { MailServiceType } from '../services/mailings/MailServiceTypes';
import { LoginServiceType } from '../models/auth/LoginServiceType';
import { UserServiceType } from '../models/users/UserServiceTypes';

export interface APIServiceContainer {
  userService: UserServiceType;
  mailService: MailServiceType;
  loginService: LoginServiceType;
}

export interface APIContext extends ExpressContext {
  prisma: PrismaClient;
  session: ContextSessionType | null;
  services: APIServiceContainer;
}
