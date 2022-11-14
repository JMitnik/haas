import {
  Prisma,
  PrismaClient,
} from '@prisma/client';
import { ActionRequestConnectionFilterInput, ActionRequestFilterInput, AssignUserToActionRequestInput } from './ActionRequest.types';
import { buildFindActionRequestsByWorkspaceWhereInput, buildFindActionRequestsWhereInput, buildOrderByQuery, buildupdateActionRequestAssignee } from './ActionRequestPrismaAdapter.helpers';

export class ActionRequestPrismaAdapter {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // TODO: Add AuditEventService & Adapter so can actually get an auditEventId
  public createAuditEventOfActionRequest(
    actionRequestId: string,
    auditEventId: string,
  ) {
    return this.prisma.auditEventOfActionRequest.create({
      data: {
        actionRequestId,
        auditEventId,
      },
    })
  }

  public async updateMany(
    whereInput: Prisma.ActionRequestWhereInput,
    updateManyInput: Prisma.ActionRequestUpdateManyMutationInput
  ) {
    return this.prisma.actionRequest.updateMany({
      data: updateManyInput,
      where: whereInput,
    })
  }

  public async findMany(where: Prisma.ActionRequestWhereInput) {
    return this.prisma.actionRequest.findMany({
      where,
    });
  };

  public async findById(actionRequestId: string) {
    return this.prisma.actionRequest.findUnique({
      where: {
        id: actionRequestId,
      },
    });
  };

  public async updateActionRequest(actionRequestId: string, update: Prisma.ActionRequestUpdateInput) {
    return this.prisma.actionRequest.update({
      data: update,
      where: {
        id: actionRequestId,
      },
    })
  }

  public async findActionRequestBySessionId(sessionId: string) {
    return this.prisma.actionRequest.findFirst({
      where: {
        session: {
          id: sessionId,
        },
      },
    });
  }

  public async assignUserToActionRequest(input: AssignUserToActionRequestInput) {
    return this.prisma.actionRequest.update({
      where: {
        id: input.actionRequestId,
      },
      data: {
        assignee: buildupdateActionRequestAssignee(input),
      },
      include: {
        assignee: true,
      },
    })
  };

  public async countActionRequests(issueId: string, filter?: ActionRequestConnectionFilterInput) {
    return this.prisma.actionRequest.count({
      where: buildFindActionRequestsWhereInput(issueId, filter),
    })
  };

  public async countActionRequestsByWorkspace(
    workspaceId: string,
    userId: string,
    canAccessAllActionables: boolean,
    filter?: ActionRequestConnectionFilterInput
  ) {
    return this.prisma.actionRequest.count({
      where: buildFindActionRequestsByWorkspaceWhereInput(workspaceId, userId, canAccessAllActionables, filter),
    })
  };

  public async findPaginatedActionRequestsByWorkspace(
    workspaceId: string,
    userId: string,
    canAccessAllActionables: boolean,
    filter?: ActionRequestConnectionFilterInput) {
    return this.prisma.actionRequest.findMany({
      where: buildFindActionRequestsByWorkspaceWhereInput(workspaceId, userId, canAccessAllActionables, filter),
      take: filter?.perPage,
      skip: filter?.offset,
      orderBy: buildOrderByQuery(filter),
      include: {
        assignee: true,
        comments: true,
        dialogue: true,
        session: true,
        issue: {
          include: {
            topic: true,
          },
        },
      },
    })
  }

  public async findPaginatedActionRequests(issueId: string, filter?: ActionRequestConnectionFilterInput) {
    return this.prisma.actionRequest.findMany({
      where: buildFindActionRequestsWhereInput(issueId, filter),
      take: filter?.perPage,
      skip: filter?.offset,
      orderBy: buildOrderByQuery(filter),
      include: {
        assignee: true,
        comments: true,
        dialogue: true,
        session: true,
      },
    })
  }

  public async findActionRequestsByIssue(issueId: string, filter?: ActionRequestFilterInput) {
    return this.prisma.actionRequest.findMany({
      where: buildFindActionRequestsWhereInput(issueId, filter),
      include: {
        assignee: true,
        comments: true,
        dialogue: true,
        session: true,
      },
    })
  }

  public async createActionRequest(
    issueId: string,
    sessionId: string,
    data: Prisma.ActionRequestCreateInput
  ) {
    return this.prisma.actionRequest.create({
      data: {
        ...data,
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
