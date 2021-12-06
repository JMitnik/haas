import { AutomationType, DeliveryStatusTypeEnum, Prisma, PrismaClient } from '@prisma/client';
import { isPresent } from 'ts-is-present';
import { NexusGenEnums, NexusGenInputs } from '../../generated/nexus';

export interface CreateAutomationConditionScopeInput {
  dialogueScope?: NexusGenInputs['ConditionDialogueScopeInput'] | null; // ConditionDialogueScopeInput
  questionScope?: NexusGenInputs['ConditionQuestionScopeInput'] | null; // ConditionQuestionScopeInput
  type: NexusGenEnums['AutomationConditionScopeType']; // AutomationConditionScopeType
  workspaceScope?: NexusGenInputs['ConditionWorkspaceScopeInput'] | null; // ConditionWorkspaceScopeInput
}

export interface CreateConditionMatchValueInput {
  dateTimeValue?: string | null; // String
  type: NexusGenEnums['MatchValueType']; // MatchValueType
  numberValue?: number | null; // Int
  textValue?: string | null; // String
}

export interface CreateAutomationConditionInput {
  dialogueId?: string | null; // String
  matchValue: CreateConditionMatchValueInput; // MatchValueInput
  operator: NexusGenEnums['AutomationConditionOperatorType']; // AutomationConditionOperatorType
  questionId?: string | null; // String
  scope: CreateAutomationConditionScopeInput; // ConditionScopeInput
  workspaceId?: string | null; // String
}

export interface CreateAutomationInput {
  label: string;
  workspaceId: string;
  automationType: AutomationType;
  description?: string | null;

  event: {
    dialogueId?: string | null; // String
    eventType: NexusGenEnums['AutomationEventType']; // AutomationEventType
    questionId?: string | null; // String
  };
  conditions: CreateAutomationConditionInput[];
  actions: {
    type: NexusGenEnums['AutomationActionType'];
  }[];
}

export class AutomationPrismaAdapter {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  constructCreateAutomationConditionScopeData = (scope: CreateAutomationConditionScopeInput) => {

  }

  constructCreateAutomationConditionData = (conditions: CreateAutomationInput['conditions']): Prisma.AutomationConditionCreateNestedManyWithoutAutomationTriggerInput => {
    return {
      create: conditions.map((condition) => {
        const { dialogueId, workspaceId, scope, questionId, matchValue, operator } = condition;

        return {
          scope: scope.type,
          operator,
          matchValue: {
            create: matchValue,
          },
          question: questionId ? {
            connect: {
              id: questionId,
            },
          } : undefined,
          dialogue: dialogueId ? {
            connect: {
              id: dialogueId,
            }
          } : undefined,
        }
      }),
    }
  }

  constructCreateAutomationEventData = (event: CreateAutomationInput['event']): Prisma.AutomationEventCreateNestedOneWithoutAutomationTriggerInput => {
    return {
      create: {
        type: event.eventType || null,
        dialogue: event.dialogueId ? {
          connect: {
            id: event.dialogueId,
          },
        } : undefined,
        question: event.questionId ? {
          connect: {
            id: event.questionId,
          }
        } : undefined,
      },
    }
  }

  constructConnectAutomationActionData = (actions: CreateAutomationInput['actions']): Prisma.AutomationActionCreateNestedManyWithoutAutomationTriggerInput => {
    return {
      create: actions,
    }
  }

  buildCreateAutomationTriggerData = (input: CreateAutomationInput): Prisma.AutomationTriggerCreateWithoutAutomationInput => {
    const { event, actions, conditions } = input;

    return {
      event: this.constructCreateAutomationEventData(event),
      conditions: this.constructCreateAutomationConditionData(conditions),
      actions: this.constructConnectAutomationActionData(actions),
    }
  }

  createAutomation = async (input: CreateAutomationInput) => {
    const { description, workspaceId, label, automationType } = input;
    this.prisma.automation.create({
      data: {
        label: label,
        type: automationType,
        description,
        automationTrigger: {
          create: this.buildCreateAutomationTriggerData(input),
        },
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
      },
    });
  };

  findAutomationById = async (automationId: string) => {
    return this.prisma.automation.findUnique({
      where: {
        id: automationId,
      },
      include: {
        workspace: true,
        automationTrigger: {
          include: {
            event: {
              include: {
                question: true,
                dialogue: true,
              }
            },
            conditions: {
              include: {
                questionScope: true,
                dialogueScope: true,
                matchValue: true,
                workspaceScope: true,
                dialogue: true,
                question: true,
              }
            },
            actions: true,
          },
        },
      },
    });
  }

  findWorkspaceByAutomationId = async (automationId: string) => {
    const automation = await this.prisma.automation.findUnique({
      where: {
        id: automationId,
      },
      include: {
        workspace: true,
      },
    });
    return automation?.workspace || null;
  }

  findAutomationsByWorkspaceId = async (workspaceId: string) => {
    const workspace = await this.prisma.customer.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        automations: true,
      }
    });
    return workspace?.automations || [];
  };

}
