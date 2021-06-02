import { CreateWorkspaceJobPrismaAdapterType } from "./CreateWorkspaceJobPrismaAdapterType";
import { PrismaClient, FindManyCreateWorkspaceJobArgs, CreateWorkspaceJobUpdateInput, CreateWorkspaceJobInclude, CreateWorkspaceJob, CreateWorkspaceJobCreateInput, FindOneCreateWorkspaceJobArgs } from "@prisma/client";

class CreateWorkspaceJobPrismaAdapter implements CreateWorkspaceJobPrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async findOne(args: FindOneCreateWorkspaceJobArgs) {
    return this.prisma.createWorkspaceJob.findOne(args);
  }
  create(data: CreateWorkspaceJobCreateInput) {
    return this.prisma.createWorkspaceJob.create({
      data,
      include: {
        processLocation: true,
      }
    })
  }
  upsert(jobId: string | undefined, create: CreateWorkspaceJobCreateInput, update: CreateWorkspaceJobUpdateInput): Promise<CreateWorkspaceJob & { processLocation: import("@prisma/client").JobProcessLocation; }> {
    return this.prisma.createWorkspaceJob.upsert({
      where: {
        id: jobId || '-1',
      },
      include: {
        processLocation: true,
      },
      create,
      update,
    })
  }
  async update(jobId: string, data: CreateWorkspaceJobUpdateInput) {
    return this.prisma.createWorkspaceJob.update({
      where: {
        id: jobId,
      },
      data,
      include: {
        processLocation: true,
      }
    });
  }
  findMany(args: FindManyCreateWorkspaceJobArgs) {
    return this.prisma.createWorkspaceJob.findMany(args);
  }

  count(args: FindManyCreateWorkspaceJobArgs) {
    return this.prisma.createWorkspaceJob.count(args);
  }

  
}

export default CreateWorkspaceJobPrismaAdapter;
