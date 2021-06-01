import { mailService } from "../services/mailings/MailService"
import { LoginService } from "../models/auth/LoginService"
import UserService from "../models/users/UserService"
import { APIServiceContainer } from "../types/APIContext"
import { PrismaClient } from "@prisma/client"
import { PrismaClientOptions } from "@prisma/client/runtime"
import CustomerService from "../models/customer/CustomerService"
import AutodeckService from "../models/autodeck/AutodeckService"

export const bootstrapServices = (prisma: PrismaClient<PrismaClientOptions, never>): APIServiceContainer => {
  const loginService = new LoginService(mailService);
  const userService = new UserService(prisma);
  const customerService = new CustomerService(prisma);
  // TODO: Dependency injection of customer service into autodeck service as paramater?
  const autodeckService = new AutodeckService(prisma);
  return {
    autodeckService,
    customerService,
    userService,
    loginService,
    mailService
  }
}