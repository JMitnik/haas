import { TagEnum } from "@prisma/client";

export interface CreateTagInput {
  name: string;
  type: TagEnum,
  customerId: string;
}