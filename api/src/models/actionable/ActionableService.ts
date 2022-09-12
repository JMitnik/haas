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
   * NOTE: only supports creation of actionable based on first choice layer
   * 
   * @param entries 
   * @param dialogueId 
   */
  public async createSessionActionable(
    session: SessionWithNodeEntries,
    dialogueId: string,
  ) {
    // NOTE: only supports creation of actionable based on first choice layer
    const entry = session.nodeEntries.find((nodeEntry) => nodeEntry.choiceNodeEntry);

    if (entry?.choiceNodeEntry?.value) {
      const optionValue = entry?.choiceNodeEntry?.value;
      const targetOption = entry.relatedNode?.options.find((option) => option.value === optionValue);
      const topicId = targetOption?.topicId;

      if (!topicId) {
        logger.log(
          `Trying to create actionable with topic value ${optionValue} 
            for dialogue ${dialogueId}, but no option(s) with such a topic found in database`
        );
        return;
      }

      const dialogue = await this.dialoguePrismaAdapter.getDialogueById(dialogueId) as Dialogue;
      const issue = await this.issuePrismaAdapter.upsertIssueByTopicId(dialogue.customerId, topicId);
      await this.actionablePrismaAdapter.createActionableFromChoice(dialogueId, issue.id);
    }

  }

}

export default ActionableService;
