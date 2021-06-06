import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { PrismaClient } from '@prisma/client';

import { ContextSessionType } from '../models/auth/ContextSessionType';
import { MailServiceType } from '../services/mailings/MailServiceTypes';
import { LoginServiceType } from '../models/auth/LoginServiceType';
import { UserServiceType } from '../models/users/UserServiceTypes';
import { CustomerServiceType } from '../models/customer/CustomerServiceType';
import { AutodeckServiceType } from '../models/autodeck/AutodeckServiceType';
import { DialogueServiceType } from '../models/questionnaire/DialogueServiceType';
import { AuthServiceType } from '../models/auth/AuthServiceType';

export interface APIServiceContainer {
  userService: UserServiceType;
  customerService: CustomerServiceType;
  mailService: MailServiceType;
  loginService: LoginServiceType;
  autodeckService: AutodeckServiceType;
  dialogueService: DialogueServiceType;
  authService: AuthServiceType;
}

export interface APIContext extends ExpressContext {
  prisma: PrismaClient;
  session: ContextSessionType | null;
  services: APIServiceContainer;
}
