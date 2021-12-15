import { Customer, Dialogue, Prisma, QuestionNode } from '@prisma/client';
import { NexusGenInputs } from '../../../generated/nexus';
import { AutomationTrigger, FullAutomationWithRels } from '../AutomationTypes';

export const constructValidUpdateAutomationInputData = (workspace: Customer, dialogue: Dialogue, question: QuestionNode, automation: FullAutomationWithRels): NexusGenInputs['CreateAutomationResolverInput'] => {
  if (!automation.automationTrigger) throw Error('No automation trigger to be updated provided!');

  const { event, actions, conditions }: AutomationTrigger = automation.automationTrigger;

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
              id: questionCondition?.questionScope?.aggregate?.id,
              'type': 'AVG',
              'latest': 10
            }
          }
        },
        'operator': 'SMALLER_THAN',
        'matchValues': [
          {
            id: questionCondition?.matchValues?.[0]?.id,
            'matchValueType': 'INT',
            'numberValue': 50
          }
        ],
      },
      {
        id: dialogueCondition?.id,
        questionId: question.id,
        operator: 'GREATER_THAN',
        matchValues: [
          {
            id: dialogueCondition?.matchValues?.[0]?.id,
            matchValueType: 'INT',
            numberValue: 10,
          },
        ],
        scope: {
          type: 'QUESTION',
          questionScope: {
            'aspect': 'NODE_VALUE',
            'aggregate': {
              id: questionCondition?.questionScope?.aggregate?.id,
              'type': 'AVG',
              'latest': 10
            }
          },
          // dialogueScope: {
          //   id: dialogueCondition?.dialogueScope?.id,
          //   aspect: 'NR_INTERACTIONS',
          //   aggregate: {
          //     id: dialogueCondition?.dialogueScope?.aggregate?.id,
          //     type: 'COUNT',
          //     latest: 10,
          //   }
          // },
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
    actions: [{ 'type': 'SEND_SMS', apiKey: 'API_KEY', endpoint: 'ENDPOINT', payload: { "key": "value" } }, { 'type': 'GENERATE_REPORT' }],
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
        'matchValues': [
          {
            'matchValueType': 'INT',
            'numberValue': 50
          }
        ],
        'questionId': question.id,
      },
    ],
  };
}