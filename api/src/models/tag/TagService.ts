import { TagServiceType } from "./TagServiceType";
import { PrismaClient, TagCreateInput } from "@prisma/client";
import { TagPrismaAdapterType } from "./TagPrismaAdapterType";
import TagPrismaAdapter from "./TagPrismaAdapter";
import { CustomerServiceType } from "../customer/CustomerServiceType";
import CustomerService from "../customer/CustomerService";
import { CustomerPrismaAdapterType } from "../customer/CustomerPrismaAdapterType";
import { CustomerPrismaAdapter } from "../customer/CustomerPrismaAdapter";

class TagService implements TagServiceType {
  tagPrismaAdapter: TagPrismaAdapterType;
  customerPrismaAdapter: CustomerPrismaAdapterType;

  constructor(prismaClient: PrismaClient) {
    this.tagPrismaAdapter = new TagPrismaAdapter(prismaClient);
    this.customerPrismaAdapter = new CustomerPrismaAdapter(prismaClient);
  }
  deleteTag(tagId: string): Promise<import("@prisma/client").Tag> {
    return this.tagPrismaAdapter.delete(tagId);
  }

  async createTag(customerSlug: string, name: string, type: "DEFAULT" | "AGENT" | "LOCATION"): Promise<import("@prisma/client").Tag> {
    const customer = await this.customerPrismaAdapter.findWorkspaceBySlug(customerSlug);
    const createTagInput: TagCreateInput = {
      name, 
      type: type || "DEFAULT", 
      customer: {
        connect: {
          id: customer?.id,
        }
      }
    }
    return this.tagPrismaAdapter.create(createTagInput);
  }
  getAllTagsByCustomerSlug(customerSlug: string): Promise<import("@prisma/client").Tag[]> {
    return this.customerPrismaAdapter.findManyTagsByCustomerSlug(customerSlug);
  }

  getAllTagsOfDialogue(dialogueId: string): Promise<import("@prisma/client").Tag[]> {
    return this.tagPrismaAdapter.findManyByDialogueId(dialogueId);
  }

}

export default TagService;
