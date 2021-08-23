import { PrismaClient, Prisma } from "@prisma/client"

import { mailService } from "../services/mailings/MailService"
import { LoginService } from "../models/auth/LoginService"
import UserService from "../models/users/UserService"
import { APIServiceContainer } from "../types/APIContext"
import CustomerService from "../models/customer/CustomerService"
import AutodeckService from "../models/autodeck/AutodeckService"
import DialogueService from "../models/questionnaire/DialogueService"
import { DialogueStatisticsService } from "../models/questionnaire/DialogueStatisticsService"
import AuthService from "../models/auth/AuthService"
import NodeService from "../models/QuestionNode/NodeService"
import EdgeService from "../models/edge/EdgeService"
import NodeEntryService from "../models/node-entry/NodeEntryService"
import PermissionService from "../models/permission/PermissionService"
import RoleService from "../models/role/RoleService"
import SessionService from "../models/session/SessionService"
import TagService from "../models/tag/TagService"
import TriggerService from "../models/trigger/TriggerService"
import { DialogueStatisticsPrismaAdapter } from "../models/questionnaire/DialogueStatisticsPrismaAdapter"
import { CampaignService } from "../models/Campaigns/CampaignService"
import DynamoScheduleService from "../services/DynamoScheduleService"
import { makeRedis } from './redis';
import config from "./config"

export const bootstrapServices = (prisma: PrismaClient<Prisma.PrismaClientOptions, never>): APIServiceContainer => {
  const loginService = new LoginService(mailService);
  const userService = new UserService(prisma);
  const customerService = new CustomerService(prisma);
  // TODO: Dependency injection of customer service into autodeck service as paramater?
  const autodeckService = new AutodeckService(prisma);
  const dialogueService = new DialogueService(prisma);
  const authService = new AuthService(prisma);
  const nodeService = new NodeService(prisma);
  const dialogueStatisticsServicePrismaAdapter = new DialogueStatisticsPrismaAdapter(prisma);

  const dialogueStatisticsService = new DialogueStatisticsService(
    prisma,
    dialogueStatisticsServicePrismaAdapter,
    makeRedis(config.redisUrl),
  );
  const edgeService = new EdgeService(prisma);
  const nodeEntryService = new NodeEntryService(prisma);
  const permissionService = new PermissionService(prisma);
  const roleService = new RoleService(prisma);
  const sessionService = new SessionService(prisma);
  const tagService = new TagService(prisma);
  const triggerService = new TriggerService(prisma);
  const dynamoScheduleService = new DynamoScheduleService();
  const campaignService = new CampaignService(prisma, dynamoScheduleService);

  return {
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
    dialogueStatisticsService,
    autodeckService,
    customerService,
    userService,
    loginService,
    mailService,
    campaignService,
  }
}
