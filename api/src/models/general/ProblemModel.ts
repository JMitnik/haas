import { objectType } from "@nexus/schema";

export const ProblemFieldType = objectType({
    name: 'ProblemFieldType',

    definition(t) {
      t.string('field');
      t.string('problem');
    }
})