import { mailService } from "../services/mailings/MailService"
import { LoginService } from "../models/auth/LoginService"
import { APIServiceContainer } from "../types/APIContext"

export const bootstrapServices = (): APIServiceContainer => {
  const loginService = new LoginService(mailService);
  return {
    loginService,
    mailService
  }
}