import { PrismaClient } from 'prisma/prisma-client';

import { DialogueSchedulePrismaAdapter } from './DialogueSchedulePrismaAdapter';
import { CreateDialogueScheduleInput, CreateDialogueScheduleOutput } from './DialogueSchedule.types';

export class DialogueScheduleService {
  private prisma: PrismaClient;
  private prismaAdapter: DialogueSchedulePrismaAdapter;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.prismaAdapter = new DialogueSchedulePrismaAdapter(prisma);
  }

  /**
   * Create a dialogue schedule.
   */
  public async create(
    input: CreateDialogueScheduleInput
  ): Promise<CreateDialogueScheduleOutput> {
    const schedule = await this.prismaAdapter.create(input);

    return { dialogueSchedule: schedule };
  }
}
