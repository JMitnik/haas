import { ChoiceNodeEntry, DialogueImpactScore, NodeEntry, PrismaClient, QuestionImpactScore, Session, VideoNodeEntry } from '@prisma/client';
import { isPresent } from 'ts-is-present';
import { mean, countBy } from 'lodash';

import SessionService from '../session/SessionService';
import NodeService from './NodeService';
import DialoguePrismaAdapter from '../questionnaire/DialoguePrismaAdapter';
import { addDays, differenceInHours } from 'date-fns';
import QuestionNodePrismaAdapter from './QuestionNodePrismaAdapter';
import DialogueStatisticsService from '../questionnaire/DialogueStatisticsService';

interface InitiateInput {
  dialogueId: string;
  questionId: string;
  type: QuestionImpactScore;
  impactTreshold?: number;
  startDateTime: Date;
  endDateTime?: Date;
  refresh?: boolean;
}

class QuestionStatisticsService {
  dialoguePrismaAdapter: DialoguePrismaAdapter;
  questionPrismaAdapter: QuestionNodePrismaAdapter;
  nodeService: NodeService;
  sessionService: SessionService;
  prisma: PrismaClient;
  dialogueStatistcsService: DialogueStatisticsService;

  constructor(prismaClient: PrismaClient) {
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prismaClient);
    this.nodeService = new NodeService(prismaClient);
    this.sessionService = new SessionService(prismaClient);
    this.questionPrismaAdapter = new QuestionNodePrismaAdapter(prismaClient);
    this.prisma = prismaClient;
    this.dialogueStatistcsService = new DialogueStatisticsService(prismaClient);
  }

  /**
   * Finds sessions and number of votes based on provided start/end date
   * @param dialogueId 
   * @param startDateTime 
   * @param endDateTime 
   * @param refresh Boolean - if set to true will update cached version within database 
   * @returns 
   */
  indepthAnalysis = async (
    input: InitiateInput
  ) => {
    const {
      dialogueId,
      startDateTime,
      endDateTime,
      type,
      questionId,
      impactTreshold,
      refresh = false,
    } = input;
    // console.log('INput: ', input);
    const endDateTimeSet = !endDateTime ? addDays(startDateTime, 7) : endDateTime;

    // const scopedSessions = await this.sessionService.findSessionsBetweenDates(
    //   dialogueId,
    //   startDateTime,
    //   endDateTimeSet,
    //   impactTreshold,
    // );

    // console.log()

    const scopedSesh = await this.prisma.session.findMany({
      where: {
        dialogueId,
        createdAt: {
          gte: startDateTime,
          lte: endDateTimeSet,
        },
        nodeEntries: {
          some: {
            sliderNodeEntry: {
              value: {
                lte: impactTreshold,
              },
            },
            NOT: {
              inputSource: 'INIT_GENERATED',
            },
          },
        },
      },
      include: {
        nodeEntries: {
          where: {
            relatedNodeId: questionId,
          },
          include: {
            choiceNodeEntry: true,
            videoNodeEntry: true,
          },
        },
      },
    });

    const impactScores = await this.calculateImpactScore(type, questionId, scopedSesh);

    // const statisticsSummary = await this.dialoguePrismaAdapter.upsertDialogueStatisticsSummary(
    //   prevStatistics?.id || '-1',
    //   {
    //     dialogueId: dialogueId,
    //     impactScore: impactScore || 0,
    //     nrVotes: scopedSessions.length,
    //     impactScoreType: type,
    //     startDateTime: startDateTime,
    //     endDateTime: endDateTimeSet,
    //   });

    return impactScores || [];
  }

  /**
   * Calculates impact score of a list of sessions
   * @param type an impact score type 
   * @param sessions a list of sessions
   * @returns an impact score or null if no sessions/type are provided
   */
  calculateImpactScore = async (type: QuestionImpactScore, questionId: string, sessions: (Session & {
    nodeEntries: (NodeEntry & {
      choiceNodeEntry: ChoiceNodeEntry | null;
      videoNodeEntry: VideoNodeEntry | null;
    })[];
  })[]) => {
    switch (type) {
      case QuestionImpactScore.PERCENTAGE:
        const totalSessionEntries = sessions.map((session) => {
          const nodeEntries = session.nodeEntries;
          const targetEntry = nodeEntries.find((entry) => entry.relatedNodeId === questionId);
          return targetEntry?.choiceNodeEntry?.value || targetEntry?.videoNodeEntry?.value || undefined;
        }).filter(isPresent);
        const counted = countBy(totalSessionEntries);
        const percentageArray: { option: string; impactScore: number; nrVotes: number }[]
          = Object.entries(counted).map((entry) =>
            ({ option: entry[0], impactScore: entry[1] / totalSessionEntries.length, nrVotes: entry[1] })
          );
        return percentageArray;

      default:
        return [];
    }
  }

}

export default QuestionStatisticsService;
