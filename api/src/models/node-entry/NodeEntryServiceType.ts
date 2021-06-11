import { FormNodeEntry, FormNodeFieldEntryData, FormNodeField, NodeEntry, ChoiceNodeEntry, LinkNodeEntry, RegistrationNodeEntry, SliderNodeEntry, TextboxNodeEntry } from "@prisma/client";
import { NexusGenInputs } from "../../generated/nexus";

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
    }>;
    getAmountOfPaths(sessionId: string): Promise<number>;
    getNodeEntriesBySessionId(sessionId: string): Promise<(NodeEntry & {
        choiceNodeEntry: ChoiceNodeEntry | null;
        linkNodeEntry: LinkNodeEntry | null;
        registrationNodeEntry: RegistrationNodeEntry | null;
        sliderNodeEntry: SliderNodeEntry | null;
        textboxNodeEntry: TextboxNodeEntry | null;
    })[]>;
    createNodeEntry(sessionId: string, nodeEntryInput: NexusGenInputs['NodeEntryInput']): Promise<NodeEntry>;
}