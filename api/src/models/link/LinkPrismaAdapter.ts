import { PrismaClient, LinkCreateInput, LinkUpdateInput } from "@prisma/client";
import { LinkPrismaAdapterType } from "./LinkPrismaAdapterType";

class LinkPrismaAdapter implements LinkPrismaAdapterType {
  prisma: PrismaClient
  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }
  upsert(id: string | null | undefined, create: LinkCreateInput, update: LinkUpdateInput) {
    return this.prisma.link.upsert({
      where: { id: id || '-1' },
      create,
      update,
    })
  };
  
  deleteMany(linkIds: string[]) {
    return this.prisma.link.deleteMany({ where: { id: { in: linkIds } } });
  }

  
  
}

export default LinkPrismaAdapter;
