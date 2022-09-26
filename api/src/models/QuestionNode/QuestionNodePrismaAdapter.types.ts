import { Prisma } from '@prisma/client';

const edge = Prisma.validator<Prisma.EdgeArgs>()({
  include: {
    conditions: true,
  },
});

export type EdgeWithConditions = Prisma.EdgeGetPayload<typeof edge>;
