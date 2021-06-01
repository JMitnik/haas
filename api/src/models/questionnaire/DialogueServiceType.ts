import { Dialogue } from "@prisma/client";

export interface DialogueServiceType {
  findDialogueIdsByCustomerId(customerId: string): Promise<Array<string>>;
  delete(dialogueId: string): Promise<Dialogue>;
  deleteDialogue(dialogueId: string): Promise<Dialogue>
}