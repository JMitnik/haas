import { mailService } from "../services/mailings/MailService"
import { LoginService } from "../models/auth/LoginService"
import UserService from "../models/users/UserService"
import { APIServiceContainer } from "../types/APIContext"
import { PrismaClient } from "@prisma/client"
import { PrismaClientOptions } from "@prisma/client/runtime"
import CustomerService from "../models/customer/CustomerService"
import AutodeckService from "../models/autodeck/AutodeckService"
import DialogueService from "../models/questionnaire/DialogueService"
import AuthService from "../models/auth/AuthService"
import NodeService from "../models/QuestionNode/NodeService"
import EdgeService from "../models/edge/EdgeService"
import NodeEntryService from "../models/node-entry/NodeEntryService"
import PermissionService from "../models/permission/PermissionService"
import RoleService from "../models/role/RoleService"
import SessionService from "../models/session/SessionService"
import TagService from "../models/tag/TagService"

export const bootstrapServices = (prisma: PrismaClient<PrismaClientOptions, never>): APIServiceContainer => {
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

  return {
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
    mailService
  }
}