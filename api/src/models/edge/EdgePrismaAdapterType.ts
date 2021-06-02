import { BatchPayload } from "@prisma/client";

export interface EdgePrismaAdapterType {
  deleteMany(edgeIds: string[]): Promise<BatchPayload>;
}