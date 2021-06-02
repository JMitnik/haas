import { CustomFieldPrismaAdapterType } from "./CustomFieldPrismaAdapterType";
import { PrismaClient, FindManyCustomFieldArgs } from "@prisma/client";

class CustomFieldPrismaAdapter implements CustomFieldPrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  findMany(args: FindManyCustomFieldArgs): Promise<import("@prisma/client").CustomField[]> {
    return this.prisma.customField.findMany(args);
  }


}

export default CustomFieldPrismaAdapter;
