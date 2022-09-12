import {
  PrismaClient,
} from '@prisma/client';

export class ActionablePrismaAdapter {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async createActionable(
    dialogueId: string,
    issueId: string,
    sessionId: string,
  ) {
    return this.prisma.actionable.create({
      data: {
        dialogue: {
          connect: {
            id: dialogueId,
          },
        },
        issue: {
          connect: {
            id: issueId,
          },
        },
        session: {
          connect: {
            id: sessionId,
          },
        },
      },
    })
  }

}
