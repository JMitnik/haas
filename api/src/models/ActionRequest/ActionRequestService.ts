import {
  Prisma,
  PrismaClient,
} from '@prisma/client';

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

  public async verifyActionRequest(input: VerifyActionRequestInput) {
    const actionable = await this.actionRequestPrismaAdapter.findById(input.actionRequestId);

    if (!actionable) return null;

    const updateArgs: Prisma.ActionRequestUpdateInput = { isVerified: !!input.actionRequestId ? true : false };
    return this.actionRequestPrismaAdapter.updateActionRequest(input.actionRequestId, updateArgs);
  }

  /**
   * Sets the status of an actionable
   */
  public async setActionRequestStatus(input: SetActionRequestStatusInput) {
    const updateArgs: Prisma.ActionRequestUpdateInput = { status: input.status };
    const result = await this.actionRequestPrismaAdapter.updateActionRequest(input.actionRequestId, updateArgs);
    return result;
  };

  /**
   * Assigns a user to an actionable
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
  public async findActionablesByIssueId(issueId: string, filter?: ActionRequestFilterInput) {
    return this.actionRequestPrismaAdapter.findActionRequestsByIssue(issueId, filter);
  }

  /**
   * Finds all actionRequests assigned to a user within a workspace.
   * @param workspaceId 
   * @param userId - id of the user requesting the function
   * @param canAccessAllActionables - if set to true, can see all actionRequests no matter whether you are assigned
   * @param filter 
   * @returns a paginated subset of actionRequests
   */
  public async findPaginatedWorkspaceActionables(
    workspaceId: string,
    userId: string,
    canAccessAllActionables: boolean,
    filter?: ActionRequestConnectionFilterInput,
  ) {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const actionRequests = await this.actionRequestPrismaAdapter.findPaginatedActionRequestsByWorkspace(
      workspaceId, userId, canAccessAllActionables, filter,
    );
    const totalActionables = await this.actionRequestPrismaAdapter.countActionRequestsByWorkspace(
      workspaceId, userId, canAccessAllActionables, filter
    );

    const { totalPages, ...pageInfo } = offsetPaginate(totalActionables, offset, perPage);

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
  public async findPaginatedActionables(issueId: string, filter?: ActionRequestConnectionFilterInput) {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const actionRequests = await this.actionRequestPrismaAdapter.findPaginatedActionRequests(issueId, filter);
    const totalActionables = await this.actionRequestPrismaAdapter.countActionRequests(issueId, filter);

    const { totalPages, ...pageInfo } = offsetPaginate(totalActionables, offset, perPage);

    return {
      actionRequests: actionRequests,
      totalPages,
      pageInfo,
    };
  }

}

export default ActionRequestService;
