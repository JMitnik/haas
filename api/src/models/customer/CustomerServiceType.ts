import { NexusGenInputs } from "../../generated/nexus";
import { Role, Customer } from "@prisma/client";

export interface CustomerServiceType {
  createWorkspace(input: NexusGenInputs['CreateWorkspaceInput'], createdUserId?: string): Promise<(Customer & {
    roles: Role[];
  }) | null>
}