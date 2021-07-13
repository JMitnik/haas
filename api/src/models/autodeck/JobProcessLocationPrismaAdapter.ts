import { PrismaClient, JobProcessLocationCreateInput, JobProcessLocationUpdateInput, FindFirstJobProcessLocationArgs, CustomField, JobProcessLocation } from "@prisma/client";

import { JobProcessLocationPrismaAdapterType } from "./JobProcessLocationPrismaAdapterType";


class JobProcessLocationPrismaAdapter implements JobProcessLocationPrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  findFirst(args: FindFirstJobProcessLocationArgs): Promise<JobProcessLocation & { fields: CustomField[]; }> {
    return this.prisma.jobProcessLocation.findFirst({
      where: args.where, include: {
        fields: true,
      }
    });
  }
  update(jobProcessLocationId: string, data: JobProcessLocationUpdateInput) {
    return this.prisma.jobProcessLocation.update({
      where: {
        id: jobProcessLocationId,
      },
      data,
      include: {
        fields: true,
      }
    })
  }
  async create(data: JobProcessLocationCreateInput) {
    return this.prisma.jobProcessLocation.create({
      data,
      include: {
        fields: true,
      }
    })
  }

  async findAll() {
    return this.prisma.jobProcessLocation.findMany({
      include: {
        fields: true,
      }
    })
  }
}

export default JobProcessLocationPrismaAdapter;
