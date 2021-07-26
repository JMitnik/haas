import { PrismaClient, JobProcessLocationCreateInput, JobProcessLocationUpdateInput, FindFirstJobProcessLocationArgs, CustomField, JobProcessLocation } from "@prisma/client";

class JobProcessLocationPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  getJobProcessLocationByJobId = (jobId: string) => {
    return this.prisma.jobProcessLocation.findFirst({
      where: {
        job: {
          some: {
            id: jobId,
          },
        },
      },
      include: {
        fields: true,
      }
    })
  }

  findFirst(args: FindFirstJobProcessLocationArgs): Promise<JobProcessLocation & { fields: CustomField[]; }> {
    return this.prisma.jobProcessLocation.findFirst({
      where: args.where, include: {
        fields: true,
      }
    });
  }

  addNewCustomFields = (
    jobProcessLocationId: string,
    newCustomFields: {
      key: string;
      value: string;
    }[]) => {
    return this.prisma.jobProcessLocation.update({
      where: {
        id: jobProcessLocationId,
      },
      data: {
        fields: {
          create: newCustomFields,
        }
      }
    })
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
