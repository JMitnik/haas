import { inputObjectType } from "@nexus/schema";

export const SessionStateInput = inputObjectType({
  name: 'SessionStateInput',
  description: 'Input of states',

  definition(t) {
    t.string('nodeId');
  }
});
