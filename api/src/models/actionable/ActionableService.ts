import {
  Dialogue,
  PrismaClient,
} from '@prisma/client';

import { IssueService } from '../Issue/IssueService';
import DialogueService from '../questionnaire/DialogueService';
import QuestionNodePrismaAdapter from '../QuestionNode/QuestionNodePrismaAdapter';
import { SessionWithNodeEntries } from '../session/Session.types';
import { TopicService } from '../Topic/TopicService';
import { logger } from '../../config/logger';
import { ActionablePrismaAdapter } from './ActionablePrismaAdapter';

class ActionableService {
  actionablePrismaAdapter: ActionablePrismaAdapter;
  topicService: TopicService;
  questionNodePrismaAdapter: QuestionNodePrismaAdapter;
  dialogueService: DialogueService;
  issueService: IssueService;

  constructor(prisma: PrismaClient) {
    this.actionablePrismaAdapter = new ActionablePrismaAdapter(prisma);
    this.topicService = new TopicService(prisma);
    this.questionNodePrismaAdapter = new QuestionNodePrismaAdapter(prisma);
    this.dialogueService = new DialogueService(prisma);
    this.issueService = new IssueService(prisma);
  }

  /**
   * NOTE: only supports creation of actionable based on first choice layer
   * 
   * @param entries 
   * @param dialogueId 
   */
  public async createActionableFromSession(
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

      const dialogue = await this.dialogueService.getDialogueById(dialogueId) as Dialogue;
      const issue = await this.issueService.createIssueIfNotExists(dialogue.customerId, topicId);

      await this.actionablePrismaAdapter.createActionableFromChoice(dialogueId, issue.id);
    }

  }

}

export default ActionableService;
