import { mailService } from "../services/mailings/MailService"
import { LoginService } from "../models/auth/LoginService"
import UserService from "../models/users/UserService"
import { APIServiceContainer } from "../types/APIContext"
import { PrismaClient } from "@prisma/client"
import { PrismaClientOptions } from "@prisma/client/runtime"

export const bootstrapServices = (prisma: PrismaClient<PrismaClientOptions, never>): APIServiceContainer => {
  const loginService = new LoginService(mailService);
  const userService = new UserService(prisma);
  return {
    userService,
    loginService,
    mailService
  }
}