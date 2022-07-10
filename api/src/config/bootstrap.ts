import { PrismaClient, Prisma } from '@prisma/client'

import { mailService } from '../services/mailings/MailService'
import { LoginService } from '../models/auth/LoginService'
import UserService from '../models/users/UserService'
import { APIServiceContainer } from '../types/APIContext'
import CustomerService from '../models/customer/CustomerService'
import AutodeckService from '../models/autodeck/AutodeckService'
import DialogueService from '../models/questionnaire/DialogueService'
import AuthService from '../models/auth/AuthService'
import NodeService from '../models/QuestionNode/NodeService'
import EdgeService from '../models/edge/EdgeService'
import NodeEntryService from '../models/node-entry/NodeEntryService'
import PermissionService from '../models/permission/PermissionService'
import RoleService from '../models/role/RoleService'
import SessionService from '../models/session/SessionService'
import TagService from '../models/tag/TagService'
import TriggerService from '../models/trigger/TriggerService'
import { CampaignService } from '../models/Campaigns/CampaignService'
import DynamoScheduleService from '../services/DynamoScheduleService'
import { redis } from './redis';
import LinkService from '../models/link/LinkService';
import AutomationService from '../models/automations/AutomationService'
import DialogueStatisticsService from '../models/questionnaire/DialogueStatisticsService'
import QuestionStatisticsService from '../models/QuestionNode/QuestionStatisticsService'
import GenerateWorkspaceService from '../models/generate-workspace/GenerateWorkspaceService'
import TemplateService from '../models/templates/TemplateService'
import { TopicService } from '../models/Topic/TopicService'
import { RedisService } from '../models/general/cache/RedisService'

export const bootstrapServices = (prisma: PrismaClient<Prisma.PrismaClientOptions, never>): APIServiceContainer => {
  const loginService = new LoginService(mailService);
  const userService = new UserService(prisma);
  const customerService = new CustomerService(prisma);
  // TODO: Dependency injection of customer service into autodeck service as paramater?
  const autodeckService = new AutodeckService(prisma);
  const dialogueService = new DialogueService(prisma);
  const authService = new AuthService(prisma);
  const nodeService = new NodeService(prisma);
  const edgeService = new EdgeService(prisma);
  const nodeEntryService = new NodeEntryService(prisma);
  const permissionService = new PermissionService(prisma);
  const roleService = new RoleService(prisma);
  const sessionService = new SessionService(prisma);
  const tagService = new TagService(prisma);
  const triggerService = new TriggerService(prisma);
  const dynamoScheduleService = new DynamoScheduleService();
  const campaignService = new CampaignService(prisma, dynamoScheduleService);
  const linkService = new LinkService(prisma);
  const automationService = new AutomationService(prisma);
  const dialogueStatisticsService = new DialogueStatisticsService(prisma);
  const questionStatisticsService = new QuestionStatisticsService(prisma);
  const generateWorkspaceService = new GenerateWorkspaceService(prisma);
  const templateService = new TemplateService(prisma);
  const topicService = new TopicService(prisma);
  const redisService = new RedisService(redis);

  return {
    redisService,
    templateService,
    generateWorkspaceService,
    questionStatisticsService,
    dialogueStatisticsService,
    automationService,
    triggerService,
    tagService,
    sessionService,
    roleService,
    permissionService,
    nodeEntryService,
    edgeService,
    nodeService,
    authService,
    dialogueService,
    autodeckService,
    customerService,
    userService,
    loginService,
    mailService,
    campaignService,
    linkService,
    topicService,
  }
}
