import { PrismaClient } from "@prisma/client";
import { LinkPrismaAdapterType } from "./LinkPrismaAdapterType";

class LinkPrismaAdapter implements LinkPrismaAdapterType {
  prisma: PrismaClient
  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }
  deleteMany(linkIds: string[]) {
    return this.prisma.link.deleteMany({ where: { id: { in: linkIds } } });
  }

  
  
}

export default LinkPrismaAdapter;
