import { Customer, Dialogue, Prisma, QuestionNode } from '@prisma/client';
import { NexusGenInputs } from '../../../generated/nexus';
import { FullAutomationWithRels } from '../AutomationTypes';

export const constructValidUpdateAutomationInputData = (workspace: Customer, dialogue: Dialogue, question: QuestionNode, automation: FullAutomationWithRels): NexusGenInputs['CreateAutomationResolverInput'] => {
  const { event, actions, conditions } = automation.automationTrigger;

  // Get actions ids 
  const sendSmsAction = actions.find((action) => action.type === 'SEND_EMAIL');
  const generateReportAction = actions.find((action) => action.type === 'GENERATE_REPORT');

  // Get condition ids
  const questionCondition = conditions.find((condition) => condition.scope === 'QUESTION');
  const dialogueCondition = conditions.find((condition) => condition.scope === 'DIALOGUE');

  return {
    id: automation.id,
    'label': 'UPDATED AUTOMATION TRIGGER TEST',
    'workspaceId': workspace.id,
    'automationType': 'TRIGGER',
    'event': {
      id: event.id,
      'eventType': 'NEW_INTERACTION_DIALOGUE',
      dialogueId: dialogue.id,
    },
    'actions': [{ id: sendSmsAction?.id, 'type': 'SEND_SMS' }, { id: generateReportAction?.id, 'type': 'GENERATE_REPORT' }],
    'conditions': [
      {
        id: questionCondition?.id,
        'questionId': question.id,
        'scope': {
          // TODO: I think scope id shouldn't exist in CreateAutomationResolverInput as it is not a model. if not, remove
          'type': 'QUESTION',
          'questionScope': {
            id: questionCondition?.questionScope?.id,
            'aspect': 'NODE_VALUE',
            'aggregate': {
              id: questionCondition?.questionScope?.aggregateId,
              'type': 'AVG',
              'latest': 10
            }
          }
        },
        'operator': 'SMALLER_THAN',
        'matchValue': {
          id: questionCondition?.matchValue?.id,
          'matchValueType': 'INT',
          'numberValue': 50
        },
      },
      {
        id: dialogueCondition?.id,
        dialogueId: dialogue.id,
        operator: 'GREATER_THAN',
        matchValue: {
          id: dialogueCondition?.matchValue?.id,
          matchValueType: 'INT',
          numberValue: 10,
        },
        scope: {
          type: 'DIALOGUE',
          dialogueScope: {
            id: dialogueCondition?.dialogueScope?.id,
            aspect: 'NR_INTERACTIONS',
            aggregate: {
              id: dialogueCondition?.dialogueScope?.aggregateId,
              type: 'COUNT',
              latest: 10,
            }
          },
        }
      }
    ],
  };
}

export const constructValidCreateAutomationInputData = (workspace: Customer, dialogue: Dialogue, question: QuestionNode): NexusGenInputs['CreateAutomationResolverInput'] => {
  return {
    'label': 'CREATE AUTOMATION TRIGGER TEST',
    'workspaceId': workspace.id,
    'automationType': 'TRIGGER',
    'event': {
      'eventType': 'NEW_INTERACTION_QUESTION',
      'questionId': question.id,
    },
    'actions': [{ 'type': 'SEND_SMS' }, { 'type': 'GENERATE_REPORT' }],
    'conditions': [
      {
        'scope': {
          'type': 'QUESTION',
          'questionScope': {
            'aspect': 'NODE_VALUE',
            'aggregate': {
              'type': 'AVG',
              'latest': 10
            }
          }
        },
        'operator': 'SMALLER_THAN',
        'matchValue': {
          'matchValueType': 'INT',
          'numberValue': 50
        },
        'questionId': question.id,
      },
    ],
  };
}