import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { PrismaClient } from '@prisma/client';

import { ContextSessionType } from '../models/auth/ContextSessionType';
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
import { CampaignService } from '../models/Campaigns/CampaignService';
import LinkService from '../models/link/LinkService';

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
  campaignService: CampaignService;
  linkService: LinkService;
}

export interface APIContext extends ExpressContext {
  prisma: PrismaClient;
  session: ContextSessionType | null;
  services: APIServiceContainer;
}
