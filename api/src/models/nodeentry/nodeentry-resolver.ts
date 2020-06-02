import { PrismaClient,
  Session, NodeEntry, NodeEntryWhereInput, NodeEntryCreateWithoutSessionInput } from '@prisma/client';

class NodeEntryResolver {
  static constructValuesWhereInput(searchTerm: string): NodeEntryWhereInput {
    const valuesCondition: NodeEntryWhereInput = {};
    valuesCondition.OR = [{
      values: {
        every: {
          numberValue: {
            not: null,
          },
        },
      },
    },
    ];

    if (searchTerm) {
      valuesCondition.OR.push({
        values: {
          some: {
            textValue: {
              contains: searchTerm,
            },
          },
        },
      });
    }
    return valuesCondition;
  }
}

export default NodeEntryResolver;
