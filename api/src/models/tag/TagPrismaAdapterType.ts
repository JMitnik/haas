import { Tag, BatchPayload, TagCreateInput } from "@prisma/client";

export interface TagPrismaAdapterType {
  deleteAllByCustomerId(customerId: string): Promise<BatchPayload>;
  findManyByDialogueId(dialogueId: string): Promise<Tag[]>;
  create(data: TagCreateInput): Promise<Tag>;
  delete(tagId: string): Promise<Tag>
}