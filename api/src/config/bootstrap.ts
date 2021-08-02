import { PrismaClient, Prisma } from "@prisma/client"

import { mailService } from "../services/mailings/MailService"
import { LoginService } from "../models/auth/LoginService"
import UserService from "../models/users/UserService"
import { APIServiceContainer } from "../types/APIContext"

export const bootstrapServices = (prisma: PrismaClient<Prisma.PrismaClientOptions, never>): APIServiceContainer => {
  const loginService = new LoginService(mailService);
  const userService = new UserService(prisma);
  return {
    userService,
    loginService,
    mailService
  }
}