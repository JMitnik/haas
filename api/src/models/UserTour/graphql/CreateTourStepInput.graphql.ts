import { inputObjectType } from "nexus";

export const CreateTourStepInput = inputObjectType({
  name: 'CreateTourStepInput',
  definition(t) {
    t.nonNull.string('titleKey');
    t.nonNull.string('helperKey');
    t.string('imageUrlKey');
    t.string('userTourId');
  },
})