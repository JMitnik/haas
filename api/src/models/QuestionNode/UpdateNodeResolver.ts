import { inputObjectType, mutationField } from "nexus";
import { NodeType } from "@prisma/client";
import { UserInputError } from "apollo-server";
import { NexusGenInputs } from "../../generated/nexus";

import { EdgeConditionInputType, OptionsInputType, QuestionNodeType, SliderNodeInputType } from "./QuestionNode";

export const UpdateQuestionNodeInputType = inputObjectType({
  name: 'UpdateQuestionNodeInputType',

  definition(t) {
    t.id('id', { required: true });
    t.id('customerId');
    t.id('overrideLeafId');
    t.id('edgeId');

    t.string('title');
    t.string('type');
    t.string('extraContent');
    t.string('unhappyText');
    t.string('happyText');

    t.field('sliderNode', { type: SliderNodeInputType });

    t.field('optionEntries', { type: OptionsInputType });
    t.field('edgeCondition', { type: EdgeConditionInputType });
  },
});

export const validateUpdateQuestion = (input: NexusGenInputs['UpdateQuestionNodeInputType'] | undefined | null) => {
  if (!input?.id) throw new UserInputError('No ID provided');
  if (!input?.title) throw new UserInputError('No title provided');
  if (!input?.type) throw new UserInputError('Type is invalid or not given');
};

export const UpdateQuestionNode = mutationField('updateQuestion', {
  type: QuestionNodeType,
  args: { input: UpdateQuestionNodeInputType },

  resolve(parent, args, ctx) {
    if (!args?.input) throw new UserInputError('No input provided');
    validateUpdateQuestion(args.input);

    return ctx.services.nodeService.updateQuestionFromBuilder(
      args.input.id as string,
      args.input.title as string,
      args.input.type as NodeType,
      args.input.overrideLeafId || null,
      args.input.edgeId || undefined,
      args.input.optionEntries?.options as any,
      args.input.edgeCondition as any,
      args.input.sliderNode as any,
      args.input.extraContent,
      args.input.happyText,
      args.input.unhappyText,
    );
  },
});
