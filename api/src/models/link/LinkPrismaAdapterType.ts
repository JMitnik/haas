import { BatchPayload, LinkCreateInput, LinkUpdateInput, Link } from "@prisma/client";

export interface LinkPrismaAdapterType {
  deleteMany(linkIds: string[]): Promise<BatchPayload>;
  upsert(id: string | null | undefined, create: LinkCreateInput, update: LinkUpdateInput): Promise<Link>;
  findManyByParentId(parentId: string): Promise<Link[]>;
}