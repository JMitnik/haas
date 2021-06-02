import { Dialogue, DialogueUpdateInput, QuestionNode, Edge, QuestionCondition } from "@prisma/client";
export interface DialoguePrismaAdapterType {
  getDialogueWithNodesAndEdges(dialogueId: string): Promise<(Dialogue & {
    questions: QuestionNode[];
    edges: (Edge & {
        conditions: QuestionCondition[];
        childNode: QuestionNode;
    })[];
}) | null>;
  findDialogueIdsOfCustomer(customerId: string): Promise<Array<{id: string}>>
  delete(dialogueId: string): Promise<Dialogue>;
  read(dialogueId: string): Promise<(Dialogue & { questions: { id: string; }[]; edges: { id: string; }[]; sessions: { id: string; }[]; }) | null>;
  update(dialogueId: string, updateArgs: DialogueUpdateInput): Promise<Dialogue>;
}