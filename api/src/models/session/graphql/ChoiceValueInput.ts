import { inputObjectType } from "@nexus/schema";

export const ChoiceValueInput = inputObjectType({
  name: 'ChoiceValueInput',
  description: 'Input type of a SessionEvent for Choices.',

  definition(t) {
    // What is the raw value of the choice?
    t.string('value', { required: true });

    // Require that the option (=choice) connected to the choice is specificed.
    t.string('choiceId');
  },
});
