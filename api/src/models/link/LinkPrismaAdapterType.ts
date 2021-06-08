import { BatchPayload } from "@prisma/client";

export interface LinkPrismaAdapterType {
  deleteMany(linkIds: string[]): Promise<BatchPayload>;
}