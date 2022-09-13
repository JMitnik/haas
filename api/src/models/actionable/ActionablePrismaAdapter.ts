import {
  Prisma,
  PrismaClient,
} from '@prisma/client';
import { ActionableFilterInput, AssignUserToActionableInput } from './Actionable.types';
import { buildFindActionablesWhereInput, buildUpdateActionableAssignee } from './ActionablePrismaAdapter.helper';

export class ActionablePrismaAdapter {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async updateActionable(actionableId: string, update: Prisma.ActionableUpdateInput) {
    return this.prisma.actionable.update({
      data: update,
      where: {
        id: actionableId,
      },
    })
  }

  public async findActionableBySessionId(sessionId: string) {
    return this.prisma.actionable.findFirst({
      where: {
        session: {
          id: sessionId,
        },
      },
    });
  }

  public async assignUserToActionable(input: AssignUserToActionableInput) {
    return this.prisma.actionable.update({
      where: {
        id: input.actionableId,
      },
      data: {
        assignee: buildUpdateActionableAssignee(input),
      },
      include: {
        assignee: true,
      },
    })
  };

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
