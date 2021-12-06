import { AutomationType, ConditionPropertyAggregateType, Prisma, PrismaClient, QuestionAspect } from '@prisma/client';
import { NexusGenEnums, NexusGenInputs } from '../../generated/nexus';

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

/**
 * XOR is needed to have a real mutually exclusive union type
 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
 */
type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export interface ConditionPropertAggregateInput {
  endDate?: string | null; // String
  latest?: number | null; // Int
  startDate?: string | null; // String
  type: NexusGenEnums['ConditionPropertyAggregateType']; // ConditionPropertyAggregateType
}

export interface CreateDialogueScopeInput {
  aggregate: ConditionPropertAggregateInput;
  aspect: NexusGenEnums['DialogueAspectType']; // DialogueAspectType
}

export interface CreateQuestionScopeInput {
  aggregate: ConditionPropertAggregateInput;
  aspect: NexusGenEnums['QuestionAspectType']; // DialogueAspectType
}

export interface CreateWorkspaceScopeInput {
  aggregate: ConditionPropertAggregateInput;
  aspect: NexusGenEnums['WorkspaceAspectType']; // DialogueAspectType
}

export interface CreateAutomationConditionScopeInput {
  dialogueScope?: CreateDialogueScopeInput | null; // ConditionDialogueScopeInput
  questionScope?: CreateQuestionScopeInput | null; // ConditionQuestionScopeInput
  type: NexusGenEnums['AutomationConditionScopeType']; // AutomationConditionScopeType
  workspaceScope?: CreateWorkspaceScopeInput | null; // ConditionWorkspaceScopeInput
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
};

export type MoreXOR = CreateQuestionScopeInput['aspect'] | CreateDialogueScopeInput['aspect'] | CreateWorkspaceScopeInput['aspect']

export interface CreateScopeDataInput {
  aspect: any // TODO: Turn this into MoreXOR 
  aggregate: ConditionPropertAggregateInput;
}

export class AutomationPrismaAdapter {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  constructCreateAutomationConditionScopeData = (scope: CreateAutomationConditionScopeInput): CreateScopeDataInput | undefined => {
    if (scope.type === 'QUESTION' && scope.questionScope) {
      return {
        aspect: scope.questionScope.aspect,
        aggregate: {
          type: scope.questionScope.aggregate.type,
          startDate: scope.questionScope.aggregate.startDate,
          endDate: scope.questionScope.aggregate.endDate,
          latest: scope.questionScope.aggregate.latest,
        },
      };
    };

    if (scope.type === 'DIALOGUE' && scope.dialogueScope) {
      return {
        aspect: scope.dialogueScope.aspect,
        aggregate: {
          type: scope.dialogueScope.aggregate.type,
          startDate: scope.dialogueScope.aggregate.startDate,
          endDate: scope.dialogueScope.aggregate.endDate,
          latest: scope.dialogueScope.aggregate.latest,
        },
      }
    }

    if (scope.type === 'WORKSPACE' && scope.workspaceScope) {
      return {
        aspect: scope.workspaceScope.aspect,
        aggregate: {
          type: scope.workspaceScope.aggregate.type,
          startDate: scope.workspaceScope.aggregate.startDate,
          endDate: scope.workspaceScope.aggregate.endDate,
          latest: scope.workspaceScope.aggregate.latest,
        },
      }
    }

    return undefined;
  }

  constructCreateAutomationConditionData = (conditions: CreateAutomationInput['conditions']): Prisma.AutomationConditionCreateNestedManyWithoutAutomationTriggerInput => {
    return {
      create: conditions.map((condition) => {
        const { dialogueId, scope, questionId, matchValue, operator } = condition;
        // TODO: Introduce workspace-wide condition
        const mappedScope = this.constructCreateAutomationConditionScopeData(scope);
        return {
          scope: scope.type,
          operator,
          matchValue: {
            create: {
              type: matchValue.type
            },
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
          questionScope: (scope.type === 'QUESTION' && mappedScope) ? {
            create: {
              aggregate: {
                create: mappedScope.aggregate,
              },
              aspect: mappedScope.aspect,
            }
          } : undefined,
          dialogueScope: (scope.type === 'DIALOGUE' && mappedScope) ? {
            create: {
              aggregate: {
                create: mappedScope.aggregate,
              },
              aspect: mappedScope.aspect,
            }
          } : undefined,
          workspaceScope: (scope.type === 'WORKSPACE' && mappedScope) ? {
            create: {
              aggregate: {
                create: mappedScope.aggregate,
              },
              aspect: mappedScope.aspect,
            }
          } : undefined,
        };
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
    return this.prisma.automation.create({
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
