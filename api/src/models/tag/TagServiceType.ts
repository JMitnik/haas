import { Tag, TagEnum } from "@prisma/client";

export interface TagServiceType {
  getAllTagsOfDialogue(dialogueId: string): Promise<Tag[]>;
  getAllTagsByCustomerSlug(customerSlug: string): Promise<Tag[]>;
  createTag(customerSlug: string, name: string, type: TagEnum): Promise<Tag>;
  deleteTag(tagId: string): Promise<Tag>;
}