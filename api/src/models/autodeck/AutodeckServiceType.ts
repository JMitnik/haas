import { CreateWorkspaceJob, JobProcessLocation, CustomField } from "@prisma/client";

import { NexusGenInputs } from "../../generated/nexus";
import { CreateWorkspaceJobProps } from "./AutodeckService";

export interface AutodeckServiceType {
  confirmWorkspaceJob: (input: NexusGenInputs['GenerateAutodeckInput'], userId?: string | undefined) => Promise<CreateWorkspaceJob & {
    processLocation: JobProcessLocation;
  }>;
  getJobProcessLocations(): Promise<JobProcessLocation[]>;
  createJobProcessLocation: (input: any) => Promise<JobProcessLocation & {
    fields: CustomField[];
  }>;
  createWorkspaceJob: (input: CreateWorkspaceJobProps) => Promise<CreateWorkspaceJob & {
    processLocation: JobProcessLocation;
  }>;
  retryJob: (jobId: string) => Promise<CreateWorkspaceJob & {
    processLocation: JobProcessLocation;
  }>;
  paginatedAutodeckJobs(paginationOpts: NexusGenInputs['PaginationWhereInput']): Promise<{
    entries: any[];
    pageInfo: {
      nrPages: number;
      pageIndex: number;
    };
  }>;
} 