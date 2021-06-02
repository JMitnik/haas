import { PrismaClient } from "@prisma/client";

import { EdgePrismaAdapterType } from "./EdgePrismaAdapterType";

class EdgePrismaAdapter implements EdgePrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }
  
  deleteMany(edgeIds: string[]): Promise<import("@prisma/client").BatchPayload> {
    return this.prisma.edge.deleteMany(
      {
        where: {
          id: {
            in: edgeIds,
          },
        },
      },
    );
  }

}

export default EdgePrismaAdapter;
