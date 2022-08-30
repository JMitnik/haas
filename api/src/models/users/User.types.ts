import { Prisma } from '@prisma/client';

const defaultUserFields = Prisma.validator<Prisma.UserArgs>()({
  include: {
    customers: {
      include: {
        customer: true,
        role: true,
        user: true,
      },
    },
  },
});

export type User = Prisma.UserGetPayload<typeof defaultUserFields>;
