import { Dialogue, DialogueUpdateInput } from "@prisma/client";
export interface DialoguePrismaAdapterType {
  findDialogueIdsOfCustomer(customerId: string): Promise<Array<{id: string}>>
  delete(dialogueId: string): Promise<Dialogue>;
  read(dialogueId: string): Promise<(Dialogue & { questions: { id: string; }[]; edges: { id: string; }[]; sessions: { id: string; }[]; }) | null>;
  update(dialogueId: string, updateArgs: DialogueUpdateInput): Promise<Dialogue>;
}