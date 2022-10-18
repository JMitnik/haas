import { AutomationEventType, AutomationType, Prisma } from '@prisma/client';

import { constructCreateAutomationInput } from '../automations/AutomationService.helpers';
import { CreateAutomationInput } from '../automations/AutomationTypes';
import { Cron } from './Cron.helper';
import { assertNonNullish } from '../../utils/assertNonNullish';

export const constructDialogueLinkUpdateAutomationInput = (cronString?: string) => {
  assertNonNullish(cronString, 'No evaluation time available');
  const cron = new Cron(cronString);
  const updateAutomationInput: Prisma.AutomationUpdateInput = {
    automationScheduled: {
      update: {
        ...cron.toSplitted(),
      },
    },
  }
  return updateAutomationInput;
}

export const constructDialogueLinkCreateAutomationInput = (
  automationId: string,
  workspaceId: string,
  cronString?: string,
): CreateAutomationInput => {
  assertNonNullish(cronString, 'No evaluation time available');
  const cron = new Cron(cronString);

  const automationInput: CreateAutomationInput = constructCreateAutomationInput({
    id: automationId,
    schedule: {
      ...cron.toSplitted(),
      type: 'CUSTOM',
    },
    event: {
      eventType: AutomationEventType.RECURRING,
    },
    automationType: AutomationType.SCHEDULED,
    label: 'Dialogue Link',
    description: 'Sends a dialogue link to team owners',
    workspaceId: workspaceId,
    actions: [{
      type: 'SEND_DIALOGUE_LINK',
    }],
  });

  return { ...automationInput, isActive: true };
}