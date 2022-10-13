import { Prisma } from 'prisma/prisma-client';
import { NexusGenInputs } from '../../generated/nexus';

export type CreateUserTourInput = NexusGenInputs['CreateUserTourInput'];

export const createUserTourInclude = (
  userId: string,
) => {
  return Prisma.validator<Prisma.UserTourArgs>()({
    include: {
      steps: true,
      usersOfTour: {
        where: {
          userId,
          seenAt: null,
        },
      },
    },
  })
}


export const defaultUserTourFields = Prisma.validator<Prisma.UserTourArgs>()({
  include: {
    steps: true,
    usersOfTour: {
      where: {
        seenAt: null,
      },
    },
  },
});

export type UserTour = Prisma.UserTourGetPayload<typeof defaultUserTourFields>;