import { Prisma, PrismaClient } from '@prisma/client';

export class UserTourPrismaAdapter {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async updateTourOfUser(userTourId: string, userId: string, data: Prisma.TourOfUserUpdateInput) {
    return this.prisma.tourOfUser.update({
      where: {
        userId_userTourId: {
          userId,
          userTourId,
        },
      },
      data,
    })
  }

  public async createManyTourOfUser(data: Prisma.TourOfUserCreateManyInput[]) {
    return this.prisma.tourOfUser.createMany({
      data,
    })
  }

  public async createUserTour(data: Prisma.UserTourCreateInput) {
    return this.prisma.userTour.create({
      data,
    })
  }

  public async findManyTourSteps(where: Prisma.TourStepWhereInput) {
    return this.prisma.tourStep.findMany({
      where,
    });
  };

  public async findUserTour(userTourId: string) {
    return this.prisma.userTour.findUnique({
      where: {
        id: userTourId,
      },
    });
  };

  public async findManyToursOfUser(where: Prisma.TourOfUserWhereInput) {
    return this.prisma.tourOfUser.findMany({
      where,
      include: {
        userTour: {
          include: {
            steps: true,
          },
        },
      },
    });
  };

  public async findManyUserTours(where: Prisma.UserTourWhereInput) {
    return this.prisma.userTour.findMany({
      where,
    });
  }

}
