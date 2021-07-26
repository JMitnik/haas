import { PrismaClient, Tag, TagCreateInput } from "@prisma/client";
import TagPrismaAdapter, { CreateTagInput } from "./TagPrismaAdapter";
import { CustomerPrismaAdapter } from "../customer/CustomerPrismaAdapter";

class TagService {
  tagPrismaAdapter: TagPrismaAdapter;
  customerPrismaAdapter: CustomerPrismaAdapter;

  constructor(prismaClient: PrismaClient) {
    this.tagPrismaAdapter = new TagPrismaAdapter(prismaClient);
    this.customerPrismaAdapter = new CustomerPrismaAdapter(prismaClient);
  }
  deleteTag(tagId: string): Promise<Tag> {
    return this.tagPrismaAdapter.delete(tagId);
  }

  async createTag(customerSlug: string, name: string, type: "DEFAULT" | "AGENT" | "LOCATION"): Promise<Tag> {
    const customer = await this.customerPrismaAdapter.findWorkspaceBySlug(customerSlug);
    const createTagInput: CreateTagInput = {
      name,
      type: type || "DEFAULT",
      customerId: customer?.id || '-1',
    }
    return this.tagPrismaAdapter.createTag(createTagInput);
  }
  getAllTagsByCustomerSlug(customerSlug: string): Promise<Tag[]> {
    return this.customerPrismaAdapter.findManyTagsByCustomerSlug(customerSlug);
  }

  getAllTagsOfDialogue(dialogueId: string): Promise<Tag[]> {
    return this.tagPrismaAdapter.findManyByDialogueId(dialogueId);
  }

}

export default TagService;
