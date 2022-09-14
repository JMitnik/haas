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

  public async setActionableStatus(input: SetActionableStatusInput) {
    const updateArgs: Prisma.ActionableUpdateInput = { status: input.status };
    const result = await this.actionablePrismaAdapter.updateActionable(input.actionableId, updateArgs);
    return result;
  };

  public async assignUserToActionable(input: AssignUserToActionableInput) {
    const result = await this.actionablePrismaAdapter.assignUserToActionable(input);
    return result;
  };

  public async findActionablesByIssueId(issueId: string, filter?: ActionableFilterInput) {
    return this.actionablePrismaAdapter.findActionablesByIssue(issueId, filter);
  }

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
