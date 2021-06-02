import { CreateWorkspaceJob, FindManyCreateWorkspaceJobArgs, CreateWorkspaceJobUpdateInput, JobProcessLocation, CreateWorkspaceJobCreateInput } from "@prisma/client";
import { NexusGenInputs } from "../../generated/nexus";

export interface CreateWorkspaceJobPrismaAdapterType {
  findMany(args: FindManyCreateWorkspaceJobArgs): Promise<CreateWorkspaceJob[]>;
  count(args: FindManyCreateWorkspaceJobArgs): Promise<number>;
  update(jobId: string, data: CreateWorkspaceJobUpdateInput): Promise<CreateWorkspaceJob & {
    processLocation: JobProcessLocation;
  }>;
  upsert(jobId: string, create: CreateWorkspaceJobCreateInput, update: CreateWorkspaceJobUpdateInput): Promise<CreateWorkspaceJob & {
    processLocation: JobProcessLocation;
  }>;
  create(data: CreateWorkspaceJobCreateInput): Promise<CreateWorkspaceJob & {
    processLocation: JobProcessLocation;
  }>;
}