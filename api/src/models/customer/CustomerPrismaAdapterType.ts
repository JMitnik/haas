import { CustomerSettings, Customer, Role } from "@prisma/client";

import { NexusGenInputs } from "../../generated/nexus";

export interface CustomerPrismaAdapterType {
  findWorkspaceSettings(customerId: string): Promise<CustomerSettings | null>;
  createWorkspace(input: NexusGenInputs['CreateWorkspaceInput']): Promise<(Customer & {
    roles: Role[];
  })>
}