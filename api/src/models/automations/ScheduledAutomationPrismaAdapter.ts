
import {
  AutomationActionChannelType,
  Prisma, PrismaClient,
} from '@prisma/client';
import { isPresent } from 'ts-is-present';

import {
  UpdateAutomationInput,
  CreateAutomationInput,
} from './AutomationTypes';

export class ScheduledAutomationPrismaAdapter {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Finds all AutomationAction Channels by an automation action ID
   * @param automationActionId 
   * @returns 
   */
  findChannelsByAutomationActionId = async (automationActionId: string) => {
    return this.prisma.automationActionChannel.findMany({
      where: {
        automationActionId,
      },
    });
  };

  /**
   * Finds a scheduled automation by its id
   * @param automationScheduledId 
   * @returns 
   */
  findScheduledAutomationById = async (automationScheduledId: string) => {
    const automationScheduled = await this.prisma.automationScheduled.findUnique({
      where: {
        id: automationScheduledId,
      },
      include: {
        actions: {
          include: {
            channels: true,
          },
        },
      },
    });
    return automationScheduled;
  };

  /**
   * Creates a prisma-ready data object for creation of an AutomationScheduled
   * @param input an object containing all information necessary to create an AutomationScheduled
   * @returns a Prisma-ready data object for creation of an AutomationScheduled
   */
  buildCreateAutomationScheduleData = (
    input: CreateAutomationInput
  ): Prisma.AutomationScheduledCreateWithoutAutomationsInput => {
    const { actions, schedule } = input;

    return {
      ...schedule as Prisma.AutomationScheduledCreateInput,
      actions: {
        create: actions.map((action) => ({
          type: action.type,
          apiKey: action.apiKey,
          endpoint: action.endpoint,
          channels: {
            create: {
              type: AutomationActionChannelType.EMAIL, // TODO: Change this based on front-end
              payload: action.payload as Prisma.InputJsonObject || Prisma.JsonNull, // TODO: payload based on channel type
            },
          },
        })),
      },
    }
  }

  /**
   * Constructs a prisma-ready data object for updating of an AutomationScheduled
   * @param input the update input data
   * @returns A prisma-ready object used to update an AutomationScheduled
   */
  buildUpdateAutomationScheduledData(
    input: UpdateAutomationInput
  ): Prisma.AutomationScheduledUpdateInput {
    const { actions: inputActions, schedule } = input;

    const inputActionIds = inputActions.map((action) => action.id).filter(isPresent);

    return {
      ...schedule,
      dialogueScope: schedule?.dialogueScope || {
        disconnect: true,
      },
      minutes: schedule?.minutes,
      hours: schedule?.hours,
      dayOfMonth: schedule?.dayOfMonth,
      dayOfWeek: schedule?.dayOfWeek,
      month: schedule?.month,
      type: schedule?.type,
      actions: {
        deleteMany: {
          id: {
            notIn: inputActionIds,
          },
        },
        upsert: inputActions.map((action) => {
          return {
            where: {
              id: action?.id || '-1',
            },
            create: {
              type: action.type,
              apiKey: action?.apiKey,
              endpoint: action?.endpoint,
              channels: { // TODO: Handle this better when we support multiple channels
                create: {
                  type: AutomationActionChannelType.EMAIL,
                  payload: action?.payload as Prisma.InputJsonObject || Prisma.JsonNull,
                },
              },
            },
            update: {
              type: action.type,
              apiKey: action?.apiKey,
              endpoint: action?.endpoint,
              channels: { // TODO: Handle this better when we support multiple channels
                update: {
                  where: {
                    id: action.channels?.[0].id,
                  },
                  data: {
                    type: AutomationActionChannelType.EMAIL,
                    payload: action?.payload as Prisma.InputJsonObject || Prisma.JsonNull,
                  },
                },
              },
            },
          };
        }),
      },
    }
  }

}
