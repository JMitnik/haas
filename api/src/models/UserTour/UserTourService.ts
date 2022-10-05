import { PrismaClient } from '@prisma/client';
import { UserTourPrismaAdapter } from './UserTourPrismaAdapter';

export class UserTourService {
  private userTourPrismaAdapter: UserTourPrismaAdapter

  constructor(prisma: PrismaClient) {
    this.userTourPrismaAdapter = new UserTourPrismaAdapter(prisma);
  }

}
