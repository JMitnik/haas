import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { PrismaClient } from 'prisma/prisma-client';

import { OrganizationService } from '../models/Organization/OrganizationService';
import { ContextSessionType } from '../models/auth/ContextSessionType';
import UserService from '../models/users/UserService';
import CustomerService from '../models/customer/CustomerService';
import MailService from '../services/mailings/MailService';
import { LoginService } from '../models/auth/LoginService';
import AutodeckService from '../models/autodeck/AutodeckService';
import DialogueService from '../models/questionnaire/DialogueService';
import DialogueStatisticsService from '../models/questionnaire/DialogueStatisticsService';
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
import { TopicService } from '../models/Topic/TopicService';
import { RedisService } from '../models/general/cache/RedisService';
import AutomationService from '../models/automations/AutomationService';
import QuestionStatisticsService from '../models/QuestionNode/QuestionStatisticsService';
import GenerateWorkspaceService from '../models/generate-workspace/GenerateWorkspaceService';
import TemplateService from '../models/templates/TemplateService';
import { AutomationActionService } from '../models/automations/AutomationActionService';
import { IssueService } from '../models/Issue/IssueService';
import ScheduledAutomationService from '../models/automations/ScheduledAutomationService';
import { WorkspaceStatisticsService } from '../models/customer/WorkspaceStatisticsService';
import ActionRequestService from '../models/ActionRequest/ActionRequestService';

export interface APIServiceContainer {
  actionRequestService: ActionRequestService;
  scheduledAutomationService: ScheduledAutomationService;
  automationActionService: AutomationActionService;
  organizationService: OrganizationService;
  issueService: IssueService;
  templateService: TemplateService;
  generateWorkspaceService: GenerateWorkspaceService;
  automationService: AutomationService;
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
  topicService: TopicService;
  redisService: RedisService;
  dialogueStatisticsService: DialogueStatisticsService;
  questionStatisticsService: QuestionStatisticsService;
  workspaceStatisticsService: WorkspaceStatisticsService;
}

export interface APIContext extends ExpressContext {
  prisma: PrismaClient;
  session: ContextSessionType | null;
  services: APIServiceContainer;
}
