import { inputObjectType } from "@nexus/schema";

import { ChoiceValueInput } from "./ChoiceValueInput";
import { SliderValueInput } from "./SliderValueInput";
import { SessionActionType } from "./SessionActionType";

export const SessionActionInput = inputObjectType({
  name: 'SessionActionInput',
  description: 'An action represents user input in response to a state',

  definition(t) {
    t.field('type', { type: SessionActionType, required: true });

    t.field('choice', { type: ChoiceValueInput });
    t.field('slider', { type: SliderValueInput });

    // How many seconds did the user spend to create this event?
    t.int('timeSpent', { required: false });
  }
});
