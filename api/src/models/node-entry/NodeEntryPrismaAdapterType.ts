import { NodeEntry, SliderNodeEntry, BatchPayload, ChoiceNodeEntry, LinkNodeEntry, RegistrationNodeEntry, TextboxNodeEntry, FormNodeEntry, FormNodeFieldEntryData, FormNodeField } from "@prisma/client";

export interface NodeEntryPrismaAdapterType {
  getNodeEntriesBySessionIds(sessionIds: string[]): Promise<NodeEntry[]>;
  deleteManySliderNodeEntries(sliderNodeEntryIds: string[]): Promise<BatchPayload>;
  deleteManyTextBoxNodeEntries(textBoxNodeEntryIds: string[]): Promise<BatchPayload>;
  deleteManyRegistrationNodeEntries(registrationNodeEntryIds: string[]): Promise<BatchPayload>;
  deleteManyLinkNodeEntries(nodeEntryIds: string[]): Promise<BatchPayload>;
  deleteManyChoiceNodeEntries(nodeEntryIds: string[]): Promise<BatchPayload>;
  deleteManyNodeEntries(sessionIds: string[]): Promise<BatchPayload>;
  getChildNodeEntriesById(nodeId: string): Promise<(NodeEntry & {
    choiceNodeEntry: ChoiceNodeEntry | null;
    linkNodeEntry: LinkNodeEntry | null;
    registrationNodeEntry: RegistrationNodeEntry | null;
    sliderNodeEntry: SliderNodeEntry | null;
    textboxNodeEntry: TextboxNodeEntry | null;
    formNodeEntry: (FormNodeEntry & {
        values: (FormNodeFieldEntryData & {
            relatedField: FormNodeField;
        })[];
    }) | null;
}) | null>
}