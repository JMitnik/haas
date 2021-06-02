import { FindManyCustomFieldArgs, CustomField } from "@prisma/client";

export interface CustomFieldPrismaAdapterType {
  findMany(args: FindManyCustomFieldArgs): Promise<CustomField[]>
}