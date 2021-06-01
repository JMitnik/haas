import { Tag, BatchPayload } from "@prisma/client";

export interface TagPrismaAdapterType {
  deleteAllByCustomerId(customerId: string): Promise<BatchPayload>;
}