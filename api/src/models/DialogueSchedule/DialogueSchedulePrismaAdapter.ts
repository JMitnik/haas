import { PrismaClient, Prisma } from 'prisma/prisma-client';
import { CreateDialogueScheduleInput, defaultDialogueSchedule } from './DialogueSchedule.types';

export class DialogueSchedulePrismaAdapter {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async findByWorkspaceID(
    workspaceID: string
  ) {
    return this.prisma.dialogueSchedule.findUnique({
      where: { workspaceID },
      include: { ...defaultDialogueSchedule.include },
    })
  }

  public async create(
    input: CreateDialogueScheduleInput
  ) {
    let query: Prisma.DialogueScheduleCreateArgs = {
      data: {
        isEnabled: true,
        dataPeriodSchedule: {
          create: {
            startDateExpression: input.dataPeriod.startDateExpression,
            endInDeltaMinutes: input.dataPeriod.endInDeltaMinutes,
          },
        },
        workspace: {
          connect: { id: input.workspaceId },
        },
      },
      include: { ...defaultDialogueSchedule.include },
    };

    // Optionally, add an evaluation period
    if (input.evaluationPeriod) {
      query.data.evaluationPeriodSchedule = {
        create: {
          startDateExpression: input.evaluationPeriod.startDateExpression,
          endInDeltaMinutes: input.evaluationPeriod.endInDeltaMinutes || -1,
        },
      }
    }

    return this.prisma.dialogueSchedule.upsert({
      create: query.data,
      where: { workspaceID: input.workspaceId },
      update: {
        isEnabled: query.data.isEnabled,
        dataPeriodSchedule: {
          update: {
            startDateExpression: query.data.dataPeriodSchedule?.create?.startDateExpression,
            endInDeltaMinutes: query.data.dataPeriodSchedule?.create?.endInDeltaMinutes,
          },
        },
        evaluationPeriodSchedule: query.data.evaluationPeriodSchedule?.create ? {
          upsert: {
            create: {
              startDateExpression: query.data.evaluationPeriodSchedule?.create?.startDateExpression,
              endInDeltaMinutes: query.data.evaluationPeriodSchedule?.create?.endInDeltaMinutes,
            },
            update: {
              startDateExpression: query.data.evaluationPeriodSchedule?.create?.startDateExpression,
              endInDeltaMinutes: query.data.evaluationPeriodSchedule?.create?.endInDeltaMinutes,
            },
          },
        } : undefined,
      },
    })
  }
}
