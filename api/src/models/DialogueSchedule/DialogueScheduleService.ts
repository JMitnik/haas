import { PrismaClient } from 'prisma/prisma-client';

import { DialogueSchedulePrismaAdapter } from './DialogueSchedulePrismaAdapter';
import {
  CreateDialogueScheduleInput,
  CreateDialogueScheduleOutput,
} from './DialogueSchedule.types';
import { DialogueSchedule } from './DialogueSchedule.helper';
import { AutomationPrismaAdapter } from '../automations/AutomationPrismaAdapter';
import { EventBridge } from '../automations/EventBridge.helper';
import { AutomationWithSchedule } from '../automations/AutomationService.types';
import { constructDialogueLinkCreateAutomationInput, constructDialogueLinkUpdateAutomationInput } from './DialogueSchedulePrismaAdapter.helper';

export class DialogueScheduleService {
  private prisma: PrismaClient;
  private prismaAdapter: DialogueSchedulePrismaAdapter;
  private automationPrismaAdapter: AutomationPrismaAdapter;


  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.prismaAdapter = new DialogueSchedulePrismaAdapter(prisma);
    this.automationPrismaAdapter = new AutomationPrismaAdapter(prisma);
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

    // TODO: Actually create 1-1 relation with automation but for now they will have same ID as DialogueSchedule
    let automation: AutomationWithSchedule | null = await this.automationPrismaAdapter.findAutomationById(schedule.id);

    if (!automation) {
      const automationInput = constructDialogueLinkCreateAutomationInput(
        schedule.id, input.workspaceId, schedule.evaluationPeriodSchedule?.startDateExpression
      );
      automation = await this.automationPrismaAdapter.createAutomation(automationInput);
    } else {
      const automationInput = constructDialogueLinkUpdateAutomationInput(
        schedule.evaluationPeriodSchedule?.startDateExpression
      );
      automation = await this.automationPrismaAdapter.update(automation.id, automationInput);
    }

    const eventBridge = new EventBridge(automation, this.prisma);
    await eventBridge.upsert();

    return { dialogueSchedule: schedule };
  }
}
