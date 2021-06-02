import { PrismaClient, JobProcessLocationCreateInput, JobProcessLocationUpdateInput } from "@prisma/client";

import { JobProcessLocationPrismaAdapterType } from "./JobProcessLocationPrismaAdapterType";


class JobProcessLocationPrismaAdapter implements JobProcessLocationPrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
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
