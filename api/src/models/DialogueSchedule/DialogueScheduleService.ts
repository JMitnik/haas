import { PrismaClient } from 'prisma/prisma-client';

import { DialogueSchedulePrismaAdapter } from './DialogueSchedulePrismaAdapter';
import {
  CreateDialogueScheduleInput,
  CreateDialogueScheduleOutput,
} from './DialogueSchedule.types';
import { DialogueSchedule } from './DialogueSchedule.helper';

export class DialogueScheduleService {
  private prisma: PrismaClient;
  private prismaAdapter: DialogueSchedulePrismaAdapter;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.prismaAdapter = new DialogueSchedulePrismaAdapter(prisma);
  }

  public async findByWorkspaceID(workspaceID: string): Promise<DialogueSchedule | null> {
    const fields = await this.prismaAdapter.findByWorkspaceID(workspaceID);

    return fields ? new DialogueSchedule(fields) : null;
  }

  public async toggleStatus(
    dialogueScheduleId: string,
    status: boolean
  ) {
    return this.prismaAdapter.toggleStatus(dialogueScheduleId, status);
  }

  /**
   * Create a dialogue schedule.
   */
  public async save(
    input: CreateDialogueScheduleInput
  ): Promise<CreateDialogueScheduleOutput> {
    const schedule = await this.prismaAdapter.save(input);

    return { dialogueSchedule: schedule };
  }
}
