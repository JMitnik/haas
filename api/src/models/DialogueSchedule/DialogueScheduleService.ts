import { AutomationType, PrismaClient } from 'prisma/prisma-client';

import { DialogueSchedulePrismaAdapter } from './DialogueSchedulePrismaAdapter';
import {
  CreateDialogueScheduleInput,
  CreateDialogueScheduleOutput,
} from './DialogueSchedule.types';
import { DialogueSchedule } from './DialogueSchedule.helper';
import AutomationService from '../automations/AutomationService';
import { Cron } from './Cron.helper';

export class DialogueScheduleService {
  private prisma: PrismaClient;
  private prismaAdapter: DialogueSchedulePrismaAdapter;
  private automationService: AutomationService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.prismaAdapter = new DialogueSchedulePrismaAdapter(prisma);
    this.automationService = new AutomationService(prisma);
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
    // const eventBridgeCRON = new Cron(input.dataPeriod.startDateExpression);
    // await this.automationService.createAutomation({
    //   schedule: {
    //     ...eventBridgeCRON.toSplitted(),
    //     type: 'CUSTOM',
    //   },
    //   automationType: AutomationType.SCHEDULED,
    //   label: 'Dialogue Link',
    //   description: 'Sends a dialogue link to team owners when dialogue opens',
    //   workspaceId: input.workspaceId,
    //   actions: [{
    //     type: 'SEND_DIALOGUE_LINK',

    //   }]
    // })

    return { dialogueSchedule: schedule };
  }
}
