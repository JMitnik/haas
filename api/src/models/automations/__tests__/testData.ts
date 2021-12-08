import { Customer, Dialogue, Prisma, QuestionNode } from "@prisma/client";
import { NexusGenInputs } from "../../../generated/nexus";

export const constructValidCreateAutomationInputData = (workspace: Customer, dialogue: Dialogue, question: QuestionNode): NexusGenInputs['CreateAutomationResolverInput'] => {
  return {
    "label": "CREATE AUTOMATION TRIGGER TEST",
    "workspaceId": workspace.id,
    "automationType": "TRIGGER",
    "event": {
      "eventType": "NEW_INTERACTION_QUESTION",
      "questionId": question.id,
    },
    "actions": [{ "type": "SEND_SMS" }, { "type": "GENERATE_REPORT" }],
    "conditions": [
      {
        "scope": {
          "type": "QUESTION",
          "questionScope": {
            "aspect": "NODE_VALUE",
            "aggregate": {
              "type": "AVG",
              "latest": 10
            }
          }
        },
        "operator": "SMALLER_THAN",
        "matchValue": {
          "matchValueType": "INT",
          "numberValue": 50
        },
        "questionId": question.id,
      },
    ],
  };
}