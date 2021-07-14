import { PrismaClient, FindManyCreateWorkspaceJobArgs, CreateWorkspaceJobUpdateInput, CreateWorkspaceJob, CreateWorkspaceJobCreateInput, FindOneCreateWorkspaceJobArgs, JobProcessLocation, JobStatusType, CloudReferenceType } from "@prisma/client";

type ConfirmWorkspaceJobCreateInput = {
  id?: string
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  referenceId?: string | null
  message?: string | null
  errorMessage?: string | null
  referenceType: CloudReferenceType
  status?: JobStatusType
  resourcesUrl?: string | null
  requiresRembg?: boolean
  requiresScreenshot?: boolean
  requiresColorExtraction?: boolean
  processLocationId: string
}

type ConfirmWorkspaceJobUpdateInput = {
  status: JobStatusType
}

class CreateWorkspaceJobPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async getJobById(jobId: string) {
    return this.prisma.createWorkspaceJob.findOne({
      where: {
        id: jobId,
      }
    });
  }
  create(data: ConfirmWorkspaceJobCreateInput) {
    const inputCreate: ConfirmWorkspaceJobCreateInput = { ...data, processLocationId: data.processLocationId }
    return this.prisma.createWorkspaceJob.create({
      data: {
        ...data,
        processLocation: {
          connect: {
            id: inputCreate.processLocationId,
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
    update: CreateWorkspaceJobUpdateInput
  ): Promise<CreateWorkspaceJob & { processLocation: JobProcessLocation; }> {
    const inputCreate: ConfirmWorkspaceJobCreateInput = { ...create, processLocationId: create.processLocationId }
    return this.prisma.createWorkspaceJob.upsert({
      where: {
        id: jobId || '-1',
      },
      include: {
        processLocation: true,
      },
      create: {
        ...create,
        processLocation: {
          connect: {
            id: inputCreate.processLocationId,
          }
        }
      },
      update,
    })
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
      }
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
