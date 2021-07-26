import { NodeEntry, QuestionNode, SliderNodeEntry, ChoiceNodeEntry, FormNodeEntryGetPayload, RegistrationNodeEntry, TextboxNodeEntry, LinkNodeEntry } from "@prisma/client";

export interface NodeEntryWithTypes extends NodeEntry {
    session?: {
        id: String;
        createdAt: Date;
    } | undefined | null;
    relatedNode?: QuestionNode | null;
    sliderNodeEntry?: SliderNodeEntry | undefined | null;
    choiceNodeEntry?: ChoiceNodeEntry | undefined | null;
    formNodeEntry?: FormNodeEntryGetPayload<{ include: { values: true } }> | undefined | null;
    registrationNodeEntry?: RegistrationNodeEntry | undefined | null;
    textboxNodeEntry?: TextboxNodeEntry | undefined | null;
    linkNodeEntry?: LinkNodeEntry | undefined | null;
}