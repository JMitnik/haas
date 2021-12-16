import { Prisma } from "@prisma/client";

export const SessionQueryModel = {
  // Query all events, node-entries and dialogue
  queryFull: Prisma.validator<Prisma.SessionArgs>()({
    include: {
      dialogue: true,
      events: {
        orderBy: {
          clientEventAt: 'asc',
        },
        include: {
          choiceValue: true,
          sliderValue: true,
        }
      },
      nodeEntries: {
        orderBy: { depth: 'asc' },
        include: {
          choiceNodeEntry: true,
          linkNodeEntry: true,
          registrationNodeEntry: true,
          textboxNodeEntry: true,
          relatedNode: true,
          formNodeEntry: { include: { values: true } },
          videoNodeEntry: true,
          sliderNodeEntry: true,
        },
      }
    }
  }),
};

export type Session = Prisma.SessionGetPayload<typeof SessionQueryModel.queryFull>;
