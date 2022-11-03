import {
  Prisma,
  PrismaClient,
} from '@prisma/client';
import { differenceInDays, sub, subDays } from 'date-fns'

import { ActionRequestPrismaAdapter } from './ActionRequestPrismaAdapter';
import {
  ActionRequestConnectionFilterInput,
  ActionRequestFilterInput,
  AssignUserToActionRequestInput,
  SetActionRequestStatusInput,
  VerifyActionRequestInput,
} from './ActionRequest.types';
import { offsetPaginate } from '../general/PaginationHelpers';

class ActionRequestService {
  private actionRequestPrismaAdapter: ActionRequestPrismaAdapter;

  constructor(prisma: PrismaClient) {
    this.actionRequestPrismaAdapter = new ActionRequestPrismaAdapter(prisma);
  }

  public async updateLastRemindedStaleRequests(requestIds: string[]) {
    const updateManyInput: Prisma.ActionRequestUpdateManyMutationInput = {
      lastRemindedAt: new Date(),
    };

    const whereInput: Prisma.ActionRequestWhereInput = {
      id: {
        in: requestIds,
      },
    };

    return this.actionRequestPrismaAdapter.updateMany(whereInput, updateManyInput);
  }

  public async findStaleWorkspaceActionRequests(workspaceId: string, daysNoAction: number) {
    const currentDate = new Date();
    const isStaleDate = subDays(currentDate, daysNoAction);

    const whereInput: Prisma.ActionRequestWhereInput = {
      dialogue: {
        customerId: workspaceId,
      },
      status: {
        notIn: ['DROPPED', 'COMPLETED'],
      },
      assigneeId: {
        not: null,
      },
      OR: [
        {
          updatedAt: {
            lte: isStaleDate,
          },
        },
        {
          lastRemindedAt: {
            lte: isStaleDate,
          },
        },
      ],
    };

    return this.actionRequestPrismaAdapter.findMany(whereInput);
  }

  public async verifyActionRequest(input: VerifyActionRequestInput) {
    const actionRequest = await this.actionRequestPrismaAdapter.findById(input.actionRequestId);

    if (!actionRequest) return null;

    const updateArgs: Prisma.ActionRequestUpdateInput = { isVerified: !!input.actionRequestId ? true : false };
    return this.actionRequestPrismaAdapter.updateActionRequest(input.actionRequestId, updateArgs);
  }

  /**
   * Sets the status of an actionRequest
   */
  public async setActionRequestStatus(input: SetActionRequestStatusInput) {
    const updateArgs: Prisma.ActionRequestUpdateInput = { status: input.status };
    const result = await this.actionRequestPrismaAdapter.updateActionRequest(input.actionRequestId, updateArgs);
    return result;
  };

  /**
   * Assigns a user to an actionRequest
   */
  public async assignUserToActionRequest(input: AssignUserToActionRequestInput) {
    const result = await this.actionRequestPrismaAdapter.assignUserToActionRequest(input);
    return result;
  };

  /**
   * Finds all actionRequests of an specific issue based on a filter
   * @param issueId 
   * @param filter 
   */
  public async findActionRequestsByIssueId(issueId: string, filter?: ActionRequestFilterInput) {
    return this.actionRequestPrismaAdapter.findActionRequestsByIssue(issueId, filter);
  }

  /**
   * Finds all actionRequests assigned to a user within a workspace.
   * @param workspaceId 
   * @param userId - id of the user requesting the function
   * @param canAccessAllactionRequests - if set to true, can see all actionRequests no matter whether you are assigned
   * @param filter 
   * @returns a paginated subset of actionRequests
   */
  public async findPaginatedWorkspaceActionRequests(
    workspaceId: string,
    userId: string,
    canAccessAllactionRequests: boolean,
    filter?: ActionRequestConnectionFilterInput,
  ) {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const actionRequests = await this.actionRequestPrismaAdapter.findPaginatedActionRequestsByWorkspace(
      workspaceId, userId, canAccessAllactionRequests, filter,
    );
    const totalactionRequests = await this.actionRequestPrismaAdapter.countActionRequestsByWorkspace(
      workspaceId, userId, canAccessAllactionRequests, filter
    );

    const { totalPages, ...pageInfo } = offsetPaginate(totalactionRequests, offset, perPage);

    return {
      actionRequests: actionRequests,
      totalPages,
      pageInfo,
    };
  }

  /**
   * Finds all actionRequests of a specific issue based on a filter.
   * @returns a paginated subset of actionRequests
   */
  public async findPaginatedactionRequests(issueId: string, filter?: ActionRequestConnectionFilterInput) {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const actionRequests = await this.actionRequestPrismaAdapter.findPaginatedActionRequests(issueId, filter);
    const totalactionRequests = await this.actionRequestPrismaAdapter.countActionRequests(issueId, filter);

    const { totalPages, ...pageInfo } = offsetPaginate(totalactionRequests, offset, perPage);

    return {
      actionRequests: actionRequests,
      totalPages,
      pageInfo,
    };
  }

}

export default ActionRequestService;
