import { CustomerSettings, Customer, Role, Dialogue, CustomerUpdateInput, ColourSettings, FontSettings, Tag } from "@prisma/client";

import { NexusGenInputs } from "../../generated/nexus";

export interface CustomerPrismaAdapterType {
  findWorkspaceSettings(customerId: string): Promise<CustomerSettings | null>;
  createWorkspace(input: NexusGenInputs['CreateWorkspaceInput']): Promise<(Customer & {
    roles: Role[];
  })>;
  getDialogueBySlug(customerId: string, dialogueSlug: string): Promise<Dialogue | undefined>;
  getDialogueById(customerId: string, dialogueId: string): Promise<Dialogue | undefined>;
  updateCustomer(customerId: string, input: CustomerUpdateInput): Promise<Customer>;
  getCustomer(customerId: string): Promise<(Customer & {
    settings: (CustomerSettings & { colourSettings: ColourSettings | null; fontSettings: FontSettings | null; }) | null;
  }) | null>;
  delete(customerId: string): Promise<Customer>;
  getDialogueTags(customerSlug: string, dialogueSlug: string): Promise<(Dialogue & {
    tags: Tag[];
  }) | undefined>;
}