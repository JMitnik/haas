import { Prisma, PrismaClient } from '@prisma/client';

import { SessionWithEntries, TopicCount } from '../session/SessionTypes';
import SessionService from '../session/SessionService';
import { CustomerService as WorkspaceService } from '../customer/CustomerService';
import { TopicFilterInput } from './Topic.types';
import { NexusGenInputs } from 'generated/nexus';
import DialogueService from '../../models/questionnaire/DialogueService';
import QuestionNodePrismaAdapter from '../../models/QuestionNode/QuestionNodePrismaAdapter';

export class TopicService {
  prisma: PrismaClient;
  sessionService: SessionService;
  workspaceService: WorkspaceService;
  dialogueService: DialogueService;
  questionNodePrismaAdapter: QuestionNodePrismaAdapter;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.sessionService = new SessionService(prisma);
    this.workspaceService = new WorkspaceService(prisma);
    this.dialogueService = new DialogueService(prisma);
    this.questionNodePrismaAdapter = new QuestionNodePrismaAdapter(prisma);
  }

  /**
   * Loop over all dialogues in a workspace and deselect the question options matching the topic name
   * @param input 
   * @returns boolean 
   */
  deselectTopic = async (input: NexusGenInputs['DeselectTopicInput']) => {
    const dialogues = await this.workspaceService.getDialogues(input.workspaceId);

    for (const dialogue of dialogues) {
      const questions = await this.dialogueService.getQuestionsByDialogueId(dialogue.id);
      for (const question of questions) {
        const option = question.options.find((option) => option.value === input.topic);
        if (option) {
          const newOption = {
            ...option,
            isTopic: false,
            overrideLeafId: option.overrideLeafId || undefined,
          };
          await this.questionNodePrismaAdapter.updateQuestionOptions([newOption]);
        }
      }
    }

    return true;
  }

  buildSessionFilter(topicFilter?: TopicFilterInput): Prisma.SessionWhereInput {
    let query: Prisma.SessionWhereInput = {};

    if (topicFilter?.topicStrings?.length) {
      query.nodeEntries = {
        some: {
          choiceNodeEntry: {
            value: {
              in: topicFilter.topicStrings,
            },
          },
        },
      };
    }

    if (topicFilter?.relatedSessionScoreLowerThreshold) {
      query.mainScore = {
        lte: topicFilter.relatedSessionScoreLowerThreshold,
      }
    }

    return query;
  }

  /**
   * Count topics and their frequencies for a given topic.
   */
  async countWorkspaceTopics(
    workspaceId: string,
    startDate: Date,
    endDate: Date,
    topicFilter?: TopicFilterInput
  ): Promise<Record<string, TopicCount>> {
    const dialogueIds = (
      await this.workspaceService.getDialogues(workspaceId, topicFilter?.dialogueStrings || undefined)
    ).map(dialogue => dialogue.id);

    // Fetch all sessions for the dialogues.
    const sessions = await this.sessionService.findSessionsForDialogues(
      dialogueIds,
      startDate,
      endDate,
      this.buildSessionFilter(topicFilter),
      {
        nodeEntries: {
          include: {
            choiceNodeEntry: true,
            relatedNode: {
              select: {
                options: {
                  select: {
                    value: true,
                    isTopic: true,
                  },
                },
              },
            },
          },
        },
      }
    ) as unknown as SessionWithEntries[];

    // Calculate all the candidate topic-counts.
    const topicCounts = this.sessionService.countTopicsFromSessions(sessions);

    return topicCounts;
  }
}
