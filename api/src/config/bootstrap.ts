import { PrismaClient } from "@prisma/client";

import { mailService } from "../services/mailings/MailService"
import { LoginService } from "../models/auth/LoginService"
import { APIServiceContainer } from "../types/APIContext"
import { CampaignService } from "../models/Campaigns/CampaignService";
import { CampaignPrismaAdapter } from "../models/Campaigns/CampaignPrismaAdapter";

export const bootstrapServices = (prisma: PrismaClient): APIServiceContainer => {
  const loginService = new LoginService(mailService);

  const campaignPrismaAdapter = new CampaignPrismaAdapter(prisma);
  const campaignService = new CampaignService(prisma, campaignPrismaAdapter);

  return {
    loginService,
    mailService,
    campaignService
  }
}