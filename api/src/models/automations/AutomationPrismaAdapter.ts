import { AutomationActionType, AutomationConditionMatchValue, AutomationConditionOperatorType, AutomationConditionScopeType, AutomationEvent, AutomationEventType, AutomationType, ConditionPropertyAggregate, ConditionPropertyAggregateType, Customer, Dialogue, DialogueConditionScope, MatchValueType, Prisma, PrismaClient, QuestionAspect, QuestionConditionScope, QuestionNode, WorkspaceConditionScope } from '@prisma/client';
import { isPresent } from 'ts-is-present';
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

export interface UpdateConditionPropertyAggregateInput extends ConditionPropertAggregateInput {
  id?: string;
}

export interface CreateDialogueScopeInput {
  aggregate: ConditionPropertAggregateInput;
  aspect: NexusGenEnums['DialogueAspectType']; // DialogueAspectType
}

export interface UpdateDialogueScopeInput extends CreateDialogueScopeInput {
  id?: string;
}

export interface CreateQuestionScopeInput {
  aggregate: ConditionPropertAggregateInput;
  aspect: NexusGenEnums['QuestionAspectType']; // DialogueAspectType
}

export interface UpdateQuestionScopeInput extends CreateQuestionScopeInput {
  id?: string;
}

export interface CreateWorkspaceScopeInput {
  aggregate: ConditionPropertAggregateInput;
  aspect: NexusGenEnums['WorkspaceAspectType']; // DialogueAspectType
}

export interface UpdateWorkspaceScopeInput extends CreateWorkspaceScopeInput {
  id?: string;
}

export interface CreateAutomationConditionScopeInput {
  dialogueScope?: CreateDialogueScopeInput | null; // ConditionDialogueScopeInput
  questionScope?: CreateQuestionScopeInput | null; // ConditionQuestionScopeInput
  type: NexusGenEnums['AutomationConditionScopeType']; // AutomationConditionScopeType
  workspaceScope?: CreateWorkspaceScopeInput | null; // ConditionWorkspaceScopeInput
}

export interface UpdateAutomationConditionScopeInput {
  id?: string;
}

export interface CreateConditionMatchValueInput {
  dateTimeValue?: string | null; // String
  type: NexusGenEnums['MatchValueType']; // MatchValueType
  numberValue?: number | null; // Int
  textValue?: string | null; // String
}

export interface UpdateConditionMatchValueInput {
  id?: string;
}

export interface CreateAutomationConditionInput {
  dialogueId?: string | null; // String
  matchValue: CreateConditionMatchValueInput; // MatchValueInput
  operator: NexusGenEnums['AutomationConditionOperatorType']; // AutomationConditionOperatorType
  questionId?: string | null; // String
  scope: CreateAutomationConditionScopeInput; // ConditionScopeInput
  workspaceId?: string | null; // String
}

export interface UpdateAutomationConditionInput extends CreateAutomationConditionInput {
  id?: string;
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
  actions: CreateAutomationActionInput[];
};

export interface CreateAutomationActionInput {
  type: NexusGenEnums['AutomationActionType'];
}

export interface UpdateAutomationActionInput extends CreateAutomationActionInput {
  id?: string;
}

export interface UpdateAutomationInput extends CreateAutomationInput {
  id: string;
  automationTriggerId?: string;
  automationCampaignId?: string;
  actions: UpdateAutomationActionInput[];
  conditions: UpdateAutomationConditionInput[];
}

export type MoreXOR = CreateQuestionScopeInput['aspect'] | CreateDialogueScopeInput['aspect'] | CreateWorkspaceScopeInput['aspect']

export interface CreateScopeDataInput {
  aspect: any // TODO: Turn this into MoreXOR 
  aggregate: ConditionPropertAggregateInput;
}

export interface UpdateScopeDataInput extends CreateScopeDataInput {
  id?: string;
}

export interface AutomationEventWithRels extends AutomationEvent {
  question: QuestionNode | null,
  dialogue: Dialogue | null
}

export interface AutomationTrigger {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  event: AutomationEventWithRels;
  conditions: {
    id: string;
    scope: AutomationConditionScopeType;
    operator: AutomationConditionOperatorType;
    matchValue: AutomationConditionMatchValue,
    questionScope: (QuestionConditionScope
      & {
        aggregate: ConditionPropertyAggregate | null;
      }) | null,
    dialogueScope: (DialogueConditionScope
      & {
        aggregate: ConditionPropertyAggregate | null;
      }) | null,
    workspaceScope: (WorkspaceConditionScope
      & {
        aggregate: ConditionPropertyAggregate | null;
      }) | null,
    dialogue: Dialogue | null;
    question: QuestionNode | null;
  }[];
  actions: {
    id: string;
    type: AutomationActionType;
  }[];
}

// TODO: Add fields which are not relationships!!!
export interface FullAutomationWithRels {
  id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  description?: string | null;
  type: AutomationType;
  workspace: Customer;
  automationTrigger: AutomationTrigger;
}

export class AutomationPrismaAdapter {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  findAutomationById = async (automationId: string): Promise<FullAutomationWithRels | null> => {
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
                questionScope: {
                  include: {
                    aggregate: true,
                  }
                },
                dialogueScope: {
                  include: {
                    aggregate: true,
                  }
                },
                matchValue: true,
                workspaceScope: {
                  include: {
                    aggregate: true,
                  }
                },
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

  constructUpdateAutomationConditionData = (condition: UpdateAutomationConditionInput): Prisma.AutomationConditionUpdateWithoutAutomationTriggerInput => {
    const { dialogueId, scope, questionId, matchValue, operator } = condition;
    const mappedScope = this.constructCreateAutomationConditionScopeData(scope);
    return {
      scope: scope.type,
      operator,
      matchValue: {
        update: {
          type: matchValue.type,
          textValue: matchValue.textValue,
          dateTimeValue: matchValue.dateTimeValue,
          numberValue: matchValue.numberValue,
        }
      },
      question: questionId ? {
        connect: {
          id: questionId,
        },
      } : { disconnect: true },
      dialogue: dialogueId ? {
        connect: {
          id: dialogueId,
        }
      } : { disconnect: true },
      questionScope: (scope.type === 'QUESTION' && mappedScope) ? {
        update: {
          aggregate: {
            update: mappedScope.aggregate,
          },
          aspect: mappedScope.aspect,
        }
      } : { disconnect: true }, // TODO: For all scopes If 1-1 do delete, else disconnect
      dialogueScope: (scope.type === 'DIALOGUE' && mappedScope) ? {
        update: {
          aggregate: {
            update: mappedScope.aggregate,
          },
          aspect: mappedScope.aspect,
        }
      } : { disconnect: true },
      workspaceScope: (scope.type === 'WORKSPACE' && mappedScope) ? {
        update: {
          aggregate: {
            update: mappedScope.aggregate,
          },
          aspect: mappedScope.aspect,
        }
      } : { disconnect: true },
    }
  }

  constructCreateAutomationConditionData = (condition: CreateAutomationConditionInput): Prisma.AutomationConditionCreateWithoutAutomationTriggerInput => {
    const { dialogueId, scope, questionId, matchValue, operator } = condition;
    // TODO: Introduce workspace-wide condition
    const mappedScope = this.constructCreateAutomationConditionScopeData(scope);
    return {
      scope: scope.type,
      operator,
      matchValue: {
        create: {
          type: matchValue.type,
          textValue: matchValue.textValue,
          dateTimeValue: matchValue.dateTimeValue,
          numberValue: matchValue.numberValue,
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
  }

  constructCreateAutomationConditionsData = (conditions: CreateAutomationInput['conditions']): Prisma.AutomationConditionCreateNestedManyWithoutAutomationTriggerInput => {
    return {
      create: conditions.map((condition) => this.constructCreateAutomationConditionData(condition)),
    }
  }

  constructConnectAutomationActionData = (actions: CreateAutomationInput['actions']): Prisma.AutomationActionCreateNestedManyWithoutAutomationTriggerInput => {
    return {
      create: actions,
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

  buildCreateAutomationTriggerData = (input: CreateAutomationInput): Prisma.AutomationTriggerCreateWithoutAutomationInput => {
    const { event, actions, conditions } = input;

    return {
      event: this.constructCreateAutomationEventData(event),
      conditions: this.constructCreateAutomationConditionsData(conditions),
      actions: this.constructConnectAutomationActionData(actions),
    }
  }

  buildUpdateAutomationTriggerData = (input: UpdateAutomationInput, automationTrigger: AutomationTrigger): Prisma.AutomationTriggerUpdateInput => {
    const { event, actions: inputActions, conditions: inputConditions } = input;
    const { actions: dbActions } = automationTrigger;

    const inputActionIds = inputActions.map((action) => action.id).filter(isPresent);
    const dbActionIds = dbActions.map((action) => action.id);
    const inputConditionIds = inputConditions.map((condition) => condition.id).filter(isPresent);

    const deleteActionIds = dbActionIds.filter((actionId) => !inputActionIds.includes(actionId));
    console.log('inputActionIds: ', inputActionIds);

    return {
      event: {
        update: {
          type: event.eventType,
          dialogue: event.dialogueId ? {
            connect: {
              id: event.dialogueId,
            },
          } : { disconnect: true },
          question: event.questionId ? {
            connect: {
              id: event.questionId,
            }
          } : { disconnect: true },
        }
      },
      actions: {
        // Remove actions which are not selected in front-end
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
            },
            update: {
              type: action.type,
            },
          };
        }),
      },
      conditions: {
        deleteMany: {
          id: {
            notIn: inputConditionIds,
          },
        },
        upsert: inputConditions.map((condition) => {
          return {
            where: {
              id: condition?.id || '-1',
            },
            create: this.constructCreateAutomationConditionData(condition),
            update: this.constructUpdateAutomationConditionData(condition),
          }
        })
      }
    }
  }

  updateAutomation = async (input: UpdateAutomationInput) => {
    const { description, label, automationType } = input;
    const automation = await this.findAutomationById(input.id);
    return this.prisma.automation.update({
      where: {
        id: input.id,
      },
      data: {
        label: label,
        type: automationType,
        description,
        // TODO: Upgrade this when campaignAutomation is introduced (delete other automation entry on swap)
        automationTrigger: automation ? {
          update: this.buildUpdateAutomationTriggerData(input, automation.automationTrigger),
        } : undefined,
      }
    });
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
