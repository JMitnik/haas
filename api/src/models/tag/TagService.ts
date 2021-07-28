import { PrismaClient, Tag } from "@prisma/client";

import TagPrismaAdapter from "./TagPrismaAdapter";
import { CreateTagInput } from "./TagPrismaAdapterType";
import { CustomerPrismaAdapter } from "../customer/CustomerPrismaAdapter";

class TagService {
  tagPrismaAdapter: TagPrismaAdapter;
  customerPrismaAdapter: CustomerPrismaAdapter;

  constructor(prismaClient: PrismaClient) {
    this.tagPrismaAdapter = new TagPrismaAdapter(prismaClient);
    this.customerPrismaAdapter = new CustomerPrismaAdapter(prismaClient);
  };

  deleteTag(tagId: string): Promise<Tag> {
    return this.tagPrismaAdapter.delete(tagId);
  };

  async createTag(customerSlug: string, name: string, type: "DEFAULT" | "AGENT" | "LOCATION"): Promise<Tag> {
    const customer = await this.customerPrismaAdapter.findWorkspaceBySlug(customerSlug);
    const createTagInput: CreateTagInput = {
      name,
      type: type || "DEFAULT",
      customerId: customer?.id || '-1',
    };

    return this.tagPrismaAdapter.createTag(createTagInput);
  };

  getAllTagsByCustomerSlug(customerSlug: string): Promise<Tag[]> {
    return this.customerPrismaAdapter.getTagsByCustomerSlug(customerSlug);
  };

  getAllTagsOfDialogue(dialogueId: string): Promise<Tag[]> {
    return this.tagPrismaAdapter.findTagsByDialogueId(dialogueId);
  };

};

export default TagService;
