import { PrismaClient } from "@prisma/client";

import { mailService } from "../services/mailings/MailService"
import { LoginService } from "../models/auth/LoginService"
import { APIServiceContainer } from "../types/APIContext"
import { CampaignService } from "../models/Campaigns/CampaignService";

export const bootstrapServices = (prisma: PrismaClient): APIServiceContainer => {
  const loginService = new LoginService(mailService);
  const campaignService = new CampaignService(prisma);

  return {
    loginService,
    mailService,
    campaignService
  }
}