import { Dialogue, DialogueUpdateInput, QuestionNode, Edge, QuestionCondition, DialogueCreateInput, Subset, DialogueCreateArgs, Link, SliderNode, SliderNodeMarker, SliderNodeRange, FormNode, FormNodeField, DialogueInclude, VideoEmbeddedNode, Tag } from "@prisma/client";
import { AnyKindOfDictionary } from "lodash";
export interface DialoguePrismaAdapterType {
  getTemplateDialogue(dialogueId: string): Promise<(Dialogue & {
    edges: (Edge & {
      conditions: QuestionCondition[];
      childNode: {
        id: string;
      };
      parentNode: {
        id: string;
      };
    })[];
    questions: (QuestionNode & {
      links: Link[];
      videoEmbeddedNode: VideoEmbeddedNode | null;
      sliderNode: (SliderNode & { markers: (SliderNodeMarker & { range: SliderNodeRange; })[]; }) | null;
      form: (FormNode & { fields: FormNodeField[]; }) | null;
      options: any;
      overrideLeaf: any;
      isOverrideLeafOf: Array<{ id: string }>;
    })[];
  }) | null>
  getDialogueWithNodesAndEdges(dialogueId: string): Promise<(Dialogue & {
    questions: QuestionNode[];
    edges: (Edge & {
      conditions: QuestionCondition[];
      childNode: QuestionNode;
    })[];
  }) | null>;
  findDialogueIdsOfCustomer(customerId: string): Promise<Array<{ id: string }>>;
  findDialoguesByCustomerId(customerId: string): Promise<(Dialogue & {
    tags: Tag[];
  })[]>;
  create(input: Subset<DialogueCreateArgs, DialogueCreateArgs>): Promise<Dialogue>;
  delete(dialogueId: string): Promise<Dialogue>;
  read(dialogueId: string): Promise<(Dialogue & { questions: { id: string; }[]; edges: { id: string; }[]; sessions: { id: string; }[]; }) | null>;
  update(dialogueId: string, updateArgs: DialogueUpdateInput, include?: DialogueInclude | null | undefined): Promise<Dialogue>;
}