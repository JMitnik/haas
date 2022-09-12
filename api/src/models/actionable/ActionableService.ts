import {
  Dialogue,
  PrismaClient,
} from '@prisma/client';

import { IssueService } from '../Issue/IssueService';
import DialogueService from '../questionnaire/DialogueService';
import QuestionNodePrismaAdapter from '../QuestionNode/QuestionNodePrismaAdapter';
import { SessionWithNodeEntries } from '../session/Session.types';
import { logger } from '../../config/logger';
import { ActionablePrismaAdapter } from './ActionablePrismaAdapter';
import DialoguePrismaAdapter from '../questionnaire/DialoguePrismaAdapter';
import IssuePrismaAdapter from '../Issue/IssuePrismaAdapter';
import { ActionableFilterInput, AssignUserToActionableInput } from './Actionable.types';

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

  public async assignUserToActionable(input: AssignUserToActionableInput) {
    const result = await this.actionablePrismaAdapter.assignUserToActionable(input);
    return result;
  };

  public async findActionablesByIssueId(issueId: string, filter?: ActionableFilterInput) {
    return this.actionablePrismaAdapter.findActionablesByIssue(issueId, filter);
  }

}

export default ActionableService;
