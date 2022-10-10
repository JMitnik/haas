import { PrismaClient, Prisma } from 'prisma/prisma-client';
import { CreateDialogueScheduleInput } from './DialogueSchedule.types';

export class DialogueSchedulePrismaAdapter {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async create(
    input: CreateDialogueScheduleInput
  ) {
    let query: Prisma.DialogueScheduleCreateArgs = {
      data: {
        dataPeriodSchedule: {
          create: {
            startDateExpression: input.dataPeriod.startDateExpression,
            endDateExpression: input.dataPeriod.endDateExpression,
          },
        },
        workspace: {
          connect: { id: input.workspaceId }
        }
      }
    };

    // Optionally, add an evaluation period
    if (input.evaluationPeriod) {
      query.data.evaluationPeriodSchedule = {
        create: {
          startDateExpression: input.evaluationPeriod.startDateExpression,
          endDateExpression: input.evaluationPeriod.endDateExpression || '',
        }
      }
    }

    return this.prisma.dialogueSchedule.create({ ...query });
  }
}
