import { CustomFieldPrismaAdapterType } from "./CustomFieldPrismaAdapterType";
import { PrismaClient, FindManyCustomFieldArgs, CustomField } from "@prisma/client";

class CustomFieldPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  getCustomFieldsByJobProcessLocationId(jobProcessLocationId: string) {
    return this.prisma.customField.findMany({
      where: {
        jobProcessLocationId: jobProcessLocationId,
      },
    });
  }

  findMany(args: FindManyCustomFieldArgs): Promise<CustomField[]> {
    return this.prisma.customField.findMany(args);
  }


}

export default CustomFieldPrismaAdapter;
