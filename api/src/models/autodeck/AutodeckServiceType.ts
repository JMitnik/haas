import { CreateWorkspaceJob, JobProcessLocation } from "@prisma/client";

import { NexusGenInputs } from "../../generated/nexus";

export interface AutodeckServiceType {
  confirmWorkspaceJob: (input: NexusGenInputs['GenerateAutodeckInput'], userId?: string | undefined) => Promise<CreateWorkspaceJob & {
    processLocation: JobProcessLocation;
}>
}