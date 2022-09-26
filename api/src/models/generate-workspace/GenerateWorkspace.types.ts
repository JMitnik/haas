import { Prisma } from 'prisma/prisma-client';
import { NexusGenInputs } from '../../generated/nexus';

export type GenerateWorkspaceCSVInput = NexusGenInputs['GenerateWorkspaceCSVInputType'];

const workspace = Prisma.validator<Prisma.CustomerArgs>()({
  include: {
    roles: true,
  },
});

export type Workspace = Prisma.CustomerGetPayload<typeof workspace>;
