import { JobProcessLocation, CustomField, JobProcessLocationCreateInput, JobProcessLocationUpdateInput, FindFirstJobProcessLocationArgs } from "@prisma/client";

export interface JobProcessLocationPrismaAdapterType {
  findAll(): Promise<(JobProcessLocation & {
    fields: CustomField[];
  })[]>;
  create(data: JobProcessLocationCreateInput): Promise<(JobProcessLocation & {
    fields: CustomField[];
  })>;
  update(JobProcessLocationId: string, data: JobProcessLocationUpdateInput): Promise<(JobProcessLocation & {
    fields: CustomField[];
  })>;
  findFirst(args: FindFirstJobProcessLocationArgs): Promise<(JobProcessLocation & {
    fields: CustomField[];
  })>;
}