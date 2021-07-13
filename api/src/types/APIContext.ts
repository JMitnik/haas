import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { PrismaClient } from '@prisma/client';

import { ContextSessionType } from '../models/auth/ContextSessionType';
// import { MailServiceType } from '../services/mailings/MailServiceTypes';
// import { LoginServiceType } from '../models/auth/LoginServiceType';
// import { UserServiceType } from '../models/users/UserServiceTypes';
// import { CustomerServiceType } from '../models/customer/CustomerServiceType';
// import { AutodeckServiceType } from '../models/autodeck/AutodeckServiceType';
// import { DialogueServiceType } from '../models/questionnaire/DialogueServiceType';
// import { AuthServiceType } from '../models/auth/AuthServiceType';
// import { NodeServiceType } from '../models/QuestionNode/NodeServiceType';
// import { EdgeServiceType } from '../models/edge/EdgeServiceType';
// import { NodeEntryServiceType } from '../models/node-entry/NodeEntryServiceType';
// import { PermissionServiceType } from '../models/permission/PermissionServiceType';
// import { RoleServiceType } from '../models/role/RoleServiceType';
// import { SessionServiceType } from '../models/session/SessionTypes';
// import { TagServiceType } from '../models/tag/TagServiceType';
// import { TriggerServiceType } from '../models/trigger/TriggerServiceType';
import UserService from '../models/users/UserService';
import CustomerService from '../models/customer/CustomerService';
import MailService from '../services/mailings/MailService';
import { LoginService } from '../models/auth/LoginService';
import AutodeckService from '../models/autodeck/AutodeckService';
import DialogueService from '../models/questionnaire/DialogueService';
import AuthService from '../models/auth/AuthService';
import NodeService from '../models/QuestionNode/NodeService';
import NodeEntryService from '../models/node-entry/NodeEntryService';
import PermissionService from '../models/permission/PermissionService';
import RoleService from '../models/role/RoleService';
import SessionService from '../models/session/SessionService';
import TagService from '../models/tag/TagService';
import TriggerService from '../models/trigger/TriggerService';
import EdgeService from '../models/edge/EdgeService';

export interface APIServiceContainer {
  userService: UserService;
  customerService: CustomerService;
  mailService: MailService;
  loginService: LoginService;
  autodeckService: AutodeckService;
  dialogueService: DialogueService;
  authService: AuthService;
  nodeService: NodeService;
  edgeService: EdgeService;
  nodeEntryService: NodeEntryService;
  permissionService: PermissionService;
  roleService: RoleService;
  sessionService: SessionService;
  tagService: TagService;
  triggerService: TriggerService;
}

export interface APIContext extends ExpressContext {
  prisma: PrismaClient;
  session: ContextSessionType | null;
  services: APIServiceContainer;
}
