import { QuestionNode, Dialogue, TriggerCondition, Trigger, TriggerUpdateInput, TriggerConditionUpdateInput, TriggerCreateInput } from "@prisma/client";
import { NexusGenInputs } from "../../generated/nexus";

export interface TriggerServiceType {
  getQuestionOfTrigger(triggerId: string, triggerConditionId: number): Promise<QuestionNode | null>;
  getDialogueOfTrigger(triggerId: string): Promise<Dialogue | null>;
  getConditionsOfTrigger(triggerId: string): Promise<TriggerCondition[]>;
  deleteTrigger(triggerId: string): Promise<Trigger | null>;
  editTrigger(triggerId: string, triggerUpdateInput: TriggerUpdateInput, recipientIds: string[], conditions: Array<NexusGenInputs['TriggerConditionInputType']>): Promise<Trigger | null>;
  createTrigger(triggerCreateArgs: TriggerCreateInput, conditions: Array<NexusGenInputs['TriggerConditionInputType']>): Promise<Trigger>;
  getTriggerById(triggerId: string): Promise<Trigger | null>;
}