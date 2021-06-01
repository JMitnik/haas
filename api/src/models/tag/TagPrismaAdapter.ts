import { TagPrismaAdapterType } from "./TagPrismaAdapterType";
import { PrismaClient } from "@prisma/client";

class TagPrismaAdapter implements TagPrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  // FIXME: Cannot used this in prisma.transaction
  async deleteAllByCustomerId(customerId: string) {
    return this.prisma.tag.deleteMany({ where: { customerId } });
  }

  
}

export default TagPrismaAdapter;
