import { enumType } from "@nexus/schema";

export const QuestionAspectType = enumType({
  name: 'QuestionAspectType',
  members: [
    'NODE_VALUE',
    'ANSWER_SPEED',
  ],
});