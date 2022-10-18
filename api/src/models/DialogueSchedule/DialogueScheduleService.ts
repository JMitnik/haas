import { PrismaClient } from 'prisma/prisma-client';

import { DialogueSchedulePrismaAdapter } from './DialogueSchedulePrismaAdapter';
import {
  CreateDialogueScheduleInput,
  CreateDialogueScheduleOutput,
} from './DialogueSchedule.types';
import { DialogueSchedule } from './DialogueSchedule.helper';
import { AutomationPrismaAdapter } from '../automations/AutomationPrismaAdapter';
import { EventBridge } from '../automations/EventBridge.helper';
import UserService from '../users/UserService';
import CustomerService from '../customer/CustomerService';
import { assertNonNullish } from '../../utils/assertNonNullish';
import DialogueService from '../questionnaire/DialogueService';
import { AutomationWithSchedule } from 'models/automations/AutomationService.types';

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

    const scheduleWrapper = new DialogueSchedule(schedule);
    // TODO: Actually create 1-1 relation with automation but for now they will have same ID as DialogueSchedule
    let automation: AutomationWithSchedule | null = await this.automationPrismaAdapter.findAutomationById(schedule.id);

    if (!automation) {
      const automationInput = scheduleWrapper.constructDialogueLinkCreateAutomationInput(
        schedule.id, input.workspaceId
      );
      automation = await this.automationPrismaAdapter.createAutomation(automationInput);
    } else {
      const automationInput = scheduleWrapper.constructDialogueLinkUpdateAutomationInput();
      automation = await this.automationPrismaAdapter.update(automation.id, automationInput);
    }

    const eventBridgeWrapper = new EventBridge(automation, this.prisma);
    await eventBridgeWrapper.upsert();

    return { dialogueSchedule: schedule };
  }
}