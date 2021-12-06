import { objectType } from "@nexus/schema";
import { ConditionPropertyAggregate } from "./ConditionPropertyAggregate";
import { QuestionAspectType } from './QuestionAspectType';

export const QuestionConditionScope = objectType({
  name: 'QuestionConditionScope',
  definition(t) {
    t.id('id');
    t.string('createdAt');

    t.field('aspect', {
      type: QuestionAspectType,
    });

    t.field('aggregate', {
      type: ConditionPropertyAggregate,
      nullable: true,
      resolve(root, args, ctx) {
        return root.aggregateId ? ctx.prisma.conditionPropertyAggregate.findUnique({
          where: {
            id: root.aggregateId,
          },
        }) : null as any
      }
    });

  },
});