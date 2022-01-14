import { AutomationActionType, AutomationConditionBuilderType, AutomationEventType, Customer, Dialogue, QuestionNode } from "@prisma/client";
import { NexusGenInputs } from "../../../generated/nexus";
import { AutomationCondition, AutomationTrigger, FullAutomationWithRels, SetupQuestionCompareDataInput } from "../AutomationTypes";

export const conditionInput: AutomationCondition = {
  dialogue: null,
  dialogueScope: null,
  id: "",
  scope: "QUESTION",
  operator: "SMALLER_OR_EQUAL_THAN",
  workspaceScope: null,
  operands: [
    {
      numberValue: 80,
      type: "INT",
      automationConditionId: "",
      createdAt: new Date(Date.now()),
      dateTimeValue: null,
      textValue: null,
      updatedAt: null,
      id: "",
    },
  ],
  question: {
    id: "SLIDER_ID",
    title: "slider",
    type: "SLIDER",
    creationDate: new Date(Date.now()),
    edgeId: "",
    formNodeId: "",
    isLeaf: false,
    isRoot: true,
    videoEmbeddedNodeId: null,
    updatedAt: new Date(Date.now()),
    overrideLeafId: null,
    questionDialogueId: "DIALOGUE_ID",
    sliderNodeId: null,
  },
  questionScope: {
    aggregate: {
      type: "AVG",
      latest: 4,
      startDate: null,
      endDate: null,
      createdAt: new Date(Date.now()),
      dialogueConditionScopeId: null,
      id: "",
      questionConditionScopeId: "",
      workspaceConditionScopeId: null,
      updatedAt: null,
    },
    aspect: "NODE_VALUE",
    automationConditionId: "",
    createdAt: new Date(Date.now()),
    id: "",
    updatedAt: null,
  },

}

export const automationTriggerInput: AutomationTrigger = {
  id: "",
  updatedAt: new Date(Date.now()),
  createdAt: new Date(Date.now()),
  event: {
    createdAt: new Date(Date.now()),
    dialogue: null,
    dialogueId: "",
    endDate: null,
    startDate: null,
    id: "",
    periodType: null,
    updatedAt: new Date(Date.now()),
    type: AutomationEventType.NEW_INTERACTION_QUESTION,
    questionId: "SLIDER_ID",
    question: {
      id: "SLIDER_ID",
      title: "slider",
      type: "SLIDER",
      creationDate: new Date(Date.now()),
      edgeId: "",
      formNodeId: "",
      isLeaf: false,
      isRoot: true,
      videoEmbeddedNodeId: null,
      updatedAt: new Date(Date.now()),
      overrideLeafId: null,
      questionDialogueId: "DIALOGUE_ID",
      sliderNodeId: null,
    },
  },
  conditionBuilder: {
    id: "",
    childConditionBuilderId: null,
    type: AutomationConditionBuilderType.AND,
    conditions: [conditionInput]
  },
  actions: [
    {
      id: "",
      type: AutomationActionType.GENERATE_REPORT,
    },
  ],
}

export const choiceQuestionCompareDataInput: SetupQuestionCompareDataInput = {
  type: "CHOICE",
  aspect: "NODE_VALUE",
  operands: [
    {
      numberValue: 2,
      type: "INT",
      automationConditionId: "",
      createdAt: new Date(Date.now()),
      dateTimeValue: null,
      textValue: null,
      updatedAt: null,
      id: "",
    }, {
      numberValue: null,
      type: "STRING",
      automationConditionId: "",
      createdAt: new Date(Date.now()),
      dateTimeValue: null,
      textValue: "Facilities",
      updatedAt: null,
      id: "",
    }],
  questionId: "CHOICE_ID",
  aggregate: {
    type: "COUNT",
    latest: 3,
    startDate: null,
    endDate: null,
    createdAt: new Date(Date.now()),
    dialogueConditionScopeId: null,
    id: "",
    questionConditionScopeId: "",
    workspaceConditionScopeId: null,
    updatedAt: null,
  },
}

export const sliderQuestionCompareDataInput: SetupQuestionCompareDataInput = {
  type: "SLIDER",
  aspect: "NODE_VALUE",
  operands: [{
    numberValue: 50,
    type: "INT",
    automationConditionId: "",
    createdAt: new Date(Date.now()),
    dateTimeValue: null,
    textValue: null,
    updatedAt: null,
    id: "",
  }],
  questionId: "SLIDER_ID",
  aggregate: {
    type: "AVG",
    latest: 3,
    startDate: null,
    endDate: null,
    createdAt: new Date(Date.now()),
    dialogueConditionScopeId: null,
    id: "",
    questionConditionScopeId: "",
    workspaceConditionScopeId: null,
    updatedAt: null,
  },
}

export const constructValidUpdateAutomationInputData = (
  workspace: Customer, dialogue: Dialogue, question: QuestionNode, automation: FullAutomationWithRels
): NexusGenInputs['CreateAutomationInput'] => {
  if (!automation.automationTrigger) throw Error("No automation trigger to be updated provided!");

  const { event, actions, conditionBuilder }: AutomationTrigger = automation.automationTrigger;

  // Get actions ids
  const sendSmsAction = actions.find((action) => action.type === "SEND_EMAIL");
  const generateReportAction = actions.find((action) => action.type === "GENERATE_REPORT");

  const condition = conditionBuilder.conditions?.[0];

  return {
    "id": automation.id,
    "label": "QQ builder",
    "workspaceId": workspace.id,
    "automationType": "TRIGGER",
    "event": {
      "id": event.id,
      "eventType": "NEW_INTERACTION_QUESTION",
      "questionId": question.id,
    },
    "actions": [{ id: sendSmsAction?.id, "type": "SEND_SMS", apiKey: "API_KEY", endpoint: "ENDPOINT", payload: { "targets": ["+3167654321", "+12345675423"] } }, { id: generateReportAction?.id, "type": "GENERATE_REPORT" }],
    "conditionBuilder": {
      "id": conditionBuilder.id,
      "type": "OR",
      "conditions": [
        {
          "id": condition.id,
          "scope": {
            "type": "QUESTION",
            "questionScope": {
              "id": condition?.questionScope?.id,
              "aspect": "NODE_VALUE",
              "aggregate": {
                "id": condition?.questionScope?.aggregate?.id,
                "type": "AVG",
                "latest": 1
              }
            }
          },
          "operator": "SMALLER_OR_EQUAL_THAN",
          "operands": [
            {
              "id": condition.operands?.[0]?.id,
              "operandType": "INT",
              "numberValue": 7331
            }
          ],
          "questionId": question.id,
        }
      ],
      "childConditionBuilder": {
        "type": "AND",
        "conditions": [
          {
            "scope": {
              "type": "QUESTION",
              "questionScope": {
                "aspect": "NODE_VALUE",
                "aggregate": {
                  "type": "AVG",
                  "latest": 1
                }
              }
            },
            "operator": "SMALLER_OR_EQUAL_THAN",
            "operands": [
              {
                "operandType": "INT",
                "numberValue": 7331
              }
            ],
            "questionId": question.id,
          }
        ]
      }
    }
  }
}

// export const constructValidUpdateAutomationInputData = (workspace: Customer, dialogue: Dialogue, question: QuestionNode, automation: FullAutomationWithRels): NexusGenInputs["CreateAutomationResolverInput"] => {
//   if (!automation.automationTrigger) throw Error("No automation trigger to be updated provided!");

//   const { event, actions, conditionBuilder }: AutomationTrigger = automation.automationTrigger;

//   // Get actions ids
//   const sendSmsAction = actions.find((action) => action.type === "SEND_EMAIL");
//   const generateReportAction = actions.find((action) => action.type === "GENERATE_REPORT");

//   // Get condition ids
//   const questionCondition = conditionBuilder.conditions.find((condition) => condition.scope === "QUESTION");
//   const dialogueCondition = conditionBuilder.conditions.find((condition) => condition.scope === "DIALOGUE");

//   return {
//     id: automation.id,
//     "label": "UPDATED AUTOMATION TRIGGER TEST",
//     "workspaceId": workspace.id,
//     "automationType": "TRIGGER",
//     "event": {
//       id: event.id,
//       "eventType": "NEW_INTERACTION_DIALOGUE",
//       dialogueId: dialogue.id,
//     },
//     "actions": [{ id: sendSmsAction?.id, "type": "SEND_SMS", apiKey: "API_KEY", endpoint: "ENDPOINT", payload: { "targets": ["+3167654321", "+12345675423"] } }, { id: generateReportAction?.id, "type": "GENERATE_REPORT" }],
//     "conditions": [
//       {
//         id: questionCondition?.id,
//         "questionId": question.id,
//         "scope": {
//           // TODO: I think scope id shouldn"t exist in CreateAutomationResolverInput as it is not a model. if not, remove
//           "type": "QUESTION",
//           "questionScope": {
//             id: questionCondition?.questionScope?.id,
//             "aspect": "NODE_VALUE",
//             "aggregate": {
//               id: questionCondition?.questionScope?.aggregate?.id,
//               "type": "AVG",
//               "latest": 10,
//             },
//           },
//         },
//         "operator": "SMALLER_THAN",
//         "operands": [
//           {
//             id: questionCondition?.operands?.[0]?.id,
//             "operandType": "INT",
//             "numberValue": 50,
//           },
//         ],
//       },
//       {
//         id: dialogueCondition?.id,
//         questionId: question.id,
//         operator: "GREATER_THAN",
//         operands: [
//           {
//             id: dialogueCondition?.operands?.[0]?.id,
//             operandType: "INT",
//             numberValue: 10,
//           },
//         ],
//         scope: {
//           type: "QUESTION",
//           questionScope: {
//             "aspect": "NODE_VALUE",
//             "aggregate": {
//               id: questionCondition?.questionScope?.aggregate?.id,
//               "type": "AVG",
//               "latest": 10,
//             },
//           },
//           // dialogueScope: {
//           //   id: dialogueCondition?.dialogueScope?.id,
//           //   aspect: "NR_INTERACTIONS",
//           //   aggregate: {
//           //     id: dialogueCondition?.dialogueScope?.aggregate?.id,
//           //     type: "COUNT",
//           //     latest: 10,
//           //   }
//           // },
//         },
//       },
//     ],
//   };
// }

export const constructValidCreateAutomationInputData = (
  workspace: Customer,
  dialogue: Dialogue,
  question: QuestionNode
): NexusGenInputs["CreateAutomationInput"] => {
  return {
    "label": "QQ builder",
    "workspaceId": workspace.id,
    "automationType": "TRIGGER",
    "event": {
      "eventType": "NEW_INTERACTION_QUESTION",
      "questionId": question.id,
    },
    "actions": [
      {
        "type": AutomationActionType.SEND_SMS,
        "apiKey": "API_KEY",
        "endpoint": "ENDPOINT",
        "payload": { "targets": ["+3161234567"] }
      },
      {
        "type": "GENERATE_REPORT"
      }
    ],
    "conditionBuilder": {
      "type": "AND",
      "conditions": [
        {
          "scope": {
            "type": "QUESTION",
            "questionScope": {
              "aspect": "NODE_VALUE",
              "aggregate": {
                "type": "AVG",
                "latest": 5
              }
            }
          },
          "operator": "SMALLER_OR_EQUAL_THAN",
          "operands": [
            {
              "operandType": "INT",
              "numberValue": 69
            }
          ],
          "questionId": question.id,
        }
      ]
    }
  }
}
