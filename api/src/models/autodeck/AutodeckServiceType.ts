import { CreateWorkspaceJob, JobProcessLocation, CustomField, JobStatusType } from "@prisma/client";

import { NexusGenInputs } from "../../generated/nexus";
import { CreateWorkspaceJobProps } from "./AutodeckService";

export interface AutodeckServiceType {
  getJobById(jobId: string): Promise<CreateWorkspaceJob | null>;
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
  getCustomFieldsOfJobProcessLocation(jobProcessLocationId: string): Promise<CustomField[]>;
  getJobProcessLocationOfJob(createWorkspaceJobId: string): Promise<JobProcessLocation>;
  update(input: {
    id: string;
    resourceUrl: string | null | undefined;
    status: JobStatusType;
    errorMessage: string | undefined;
  }): Promise<CreateWorkspaceJob>
} 