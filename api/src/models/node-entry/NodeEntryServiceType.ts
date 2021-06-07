import { FormNodeEntry, FormNodeFieldEntryData, FormNodeField } from "@prisma/client";

export interface NodeEntryServiceType {
  getNodeEntryValues(nodeEntryId: string): Promise<{
    choiceNodeEntry: string | null | undefined;
    linkNodeEntry: string | undefined;
    textboxNodeEntry: string | null | undefined;
    registrationNodeEntry: string | undefined;
    sliderNodeEntry: number | null | undefined;
    formNodeEntry: (FormNodeEntry & {
        values: (FormNodeFieldEntryData & {
            relatedField: FormNodeField;
        })[];
    }) | null | undefined;
}>
}