import { NexusGenInputs } from "../../generated/nexus";
import { Role, Customer, Dialogue, CustomerSettings, ColourSettings, FontSettings } from "@prisma/client";
import { WorkspaceTemplate } from "../templates/defaultWorkspaceTemplate";

export interface CustomerServiceType {
  createWorkspace(input: NexusGenInputs['CreateWorkspaceInput'], createdUserId?: string): Promise<(Customer & {
    roles: Role[];
  }) | null>;
  editWorkspace(input: NexusGenInputs['EditWorkspaceInput']): Promise<Customer>;
  getDialogueBySlug(customerId: string, dialogueSlug: string): Promise<Dialogue | undefined>;
  getDialogueById(customerId: string, dialogueId: string): Promise<Dialogue | undefined>;
  deleteWorkspace(customerId: string): Promise<(Customer & { settings: (CustomerSettings & { colourSettings: ColourSettings | null; fontSettings: FontSettings | null; }) | null; }) | null>;
}