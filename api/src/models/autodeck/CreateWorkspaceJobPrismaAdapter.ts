import { Prisma, PrismaClient, CreateWorkspaceJob, JobProcessLocation, JobStatusType } from "@prisma/client";

import { ConfirmWorkspaceJobCreateInput } from "./CreateWorkspaceJobPrismaAdapterType";

class CreateWorkspaceJobPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async getJobById(jobId: string) {
    return this.prisma.createWorkspaceJob.findUnique({
      where: {
        id: jobId,
      }
    });
  };

  create(data: ConfirmWorkspaceJobCreateInput) {
    const { processLocationId, ...rest } = data;
    return this.prisma.createWorkspaceJob.create({
      data: {
        ...rest,
        processLocation: {
          connect: {
            id: processLocationId,
          },
        },
      },
      include: {
        processLocation: true,
      },
    });
  };

  upsert(
    jobId: string | undefined,
    create: ConfirmWorkspaceJobCreateInput,
    update: Prisma.CreateWorkspaceJobUpdateInput
  ): Promise<CreateWorkspaceJob & { processLocation: JobProcessLocation; }> {
    const { processLocationId, ...rest } = create;
    return this.prisma.createWorkspaceJob.upsert({
      where: {
        id: jobId || '-1',
      },
      include: {
        processLocation: true,
      },
      create: {
        ...rest,
        processLocation: {
          connect: {
            id: processLocationId,
          },
        },
      },
      update,
    });
  };

  updateStatus(jobId: string, status: JobStatusType) {
    return this.prisma.createWorkspaceJob.update({
      where: {
        id: jobId,
      },
      data: {
        status,
      },
      include: {
        processLocation: true,
      },
    });
  };

  async update(jobId: string, data: Prisma.CreateWorkspaceJobUpdateInput) {
    return this.prisma.createWorkspaceJob.update({
      where: {
        id: jobId,
      },
      data,
      include: {
        processLocation: true,
      },
    });
  };

  getJobs(args: Prisma.CreateWorkspaceJobFindManyArgs) {
    return this.prisma.createWorkspaceJob.findMany(args);
  };

  count(args: Prisma.CreateWorkspaceJobCountArgs) {
    return this.prisma.createWorkspaceJob.count(args);
  };
}

export default CreateWorkspaceJobPrismaAdapter;
