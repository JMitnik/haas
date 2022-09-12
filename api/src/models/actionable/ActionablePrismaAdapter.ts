import {
  PrismaClient,
} from '@prisma/client';
import { ActionableFilterInput } from './Actionable.types';
import { buildFindActionablesWhereInput } from './ActionablePrismaAdapter.helper';

export class ActionablePrismaAdapter {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async findActionablesByIssue(issueId: string, filter?: ActionableFilterInput) {
    return this.prisma.actionable.findMany({
      where: buildFindActionablesWhereInput(issueId, filter),
      include: {
        assignee: true,
        comments: true,
        dialogue: true,
        session: true,
      },
    })
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
