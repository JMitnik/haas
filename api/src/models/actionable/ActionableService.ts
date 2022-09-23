import {
  Prisma,
  PrismaClient,
} from '@prisma/client';

import QuestionNodePrismaAdapter from '../QuestionNode/QuestionNodePrismaAdapter';
import { ActionablePrismaAdapter } from './ActionablePrismaAdapter';
import DialoguePrismaAdapter from '../questionnaire/DialoguePrismaAdapter';
import IssuePrismaAdapter from '../Issue/IssuePrismaAdapter';
import { ActionableConnectionFilterInput, ActionableFilterInput, AssignUserToActionableInput, SetActionableStatusInput } from './Actionable.types';
import { offsetPaginate } from '../general/PaginationHelpers';

class ActionableService {
  private actionablePrismaAdapter: ActionablePrismaAdapter;
  private questionNodePrismaAdapter: QuestionNodePrismaAdapter;
  private dialoguePrismaAdapter: DialoguePrismaAdapter;
  private issuePrismaAdapter: IssuePrismaAdapter;

  constructor(prisma: PrismaClient) {
    this.actionablePrismaAdapter = new ActionablePrismaAdapter(prisma);
    this.questionNodePrismaAdapter = new QuestionNodePrismaAdapter(prisma);
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prisma);
    this.issuePrismaAdapter = new IssuePrismaAdapter(prisma);
  }

  /**
   * Sets the status of an actionable
   */
  public async setActionableStatus(input: SetActionableStatusInput) {
    const updateArgs: Prisma.ActionableUpdateInput = { status: input.status };
    const result = await this.actionablePrismaAdapter.updateActionable(input.actionableId, updateArgs);
    return result;
  };

  /**
   * Assigns a user to an actionable
   */
  public async assignUserToActionable(input: AssignUserToActionableInput) {
    const result = await this.actionablePrismaAdapter.assignUserToActionable(input);
    return result;
  };

  /**
   * Finds all actionables of an specific issue based on a filter
   * @param issueId 
   * @param filter 
   */
  public async findActionablesByIssueId(issueId: string, filter?: ActionableFilterInput) {
    return this.actionablePrismaAdapter.findActionablesByIssue(issueId, filter);
  }

  /**
   * Finds all actionables assigned to a user within a workspace.
   * @param workspaceId 
   * @param userId - id of the user requesting the function
   * @param canAccessAllActionables - if set to true, can see all actionables no matter whether you are assigned
   * @param filter 
   * @returns a paginated subset of actionables
   */
  public async findPaginatedWorkspaceActionables(
    workspaceId: string,
    userId: string,
    canAccessAllActionables: boolean,
    filter?: ActionableConnectionFilterInput,
  ) {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const actionables = await this.actionablePrismaAdapter.findPaginatedActionablesByWorkspace(
      workspaceId, userId, canAccessAllActionables, filter,
    );
    const totalActionables = await this.actionablePrismaAdapter.countActionablesByWorkspace(
      workspaceId, userId, canAccessAllActionables, filter
    );

    const { totalPages, ...pageInfo } = offsetPaginate(totalActionables, offset, perPage);

    return {
      actionables: actionables,
      totalPages,
      pageInfo,
    };
  }

  /**
   * Finds all actionables of a specific issue based on a filter.
   * @returns a paginated subset of actionables
   */
  public async findPaginatedActionables(issueId: string, filter?: ActionableConnectionFilterInput) {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const actionables = await this.actionablePrismaAdapter.findPaginatedActionables(issueId, filter);
    const totalActionables = await this.actionablePrismaAdapter.countActionables(issueId, filter);

    const { totalPages, ...pageInfo } = offsetPaginate(totalActionables, offset, perPage);

    return {
      actionables: actionables,
      totalPages,
      pageInfo,
    };
  }

}

export default ActionableService;
