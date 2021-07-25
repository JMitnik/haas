import { PrismaClient } from '@prisma/client';

import { mailService } from '../services/mailings/MailService';
import { LoginService } from '../models/auth/LoginService';
import UserService from '../models/users/UserService';
import { APIServiceContainer } from '../types/APIContext';
import { SubscriptionService } from '../models/Subscription/SubscriptionService';
import { SubscriptionPrismaAdapter } from '../models/Subscription/SubscriptionPrismaAdapter';

export const bootstrapServices = (prisma: PrismaClient): APIServiceContainer => {
  const loginService = new LoginService(mailService);
  const userService = new UserService(prisma);
  const subscriptionPrismaAdapter = new SubscriptionPrismaAdapter(prisma);
  const subscriptionService = new SubscriptionService(prisma, subscriptionPrismaAdapter);

  return {
    userService,
    loginService,
    mailService,
    subscriptionService
  }
}
