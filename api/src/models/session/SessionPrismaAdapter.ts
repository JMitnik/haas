import { Prisma, PrismaClient, SessionEventType } from "@prisma/client";
import { cloneDeep } from "lodash";
import { NexusGenInputs } from "../../generated/nexus";

import { Session, SessionQueryModel } from './SessionQueryModel';
import NodeEntryService from "../node-entry/NodeEntryService";
import { CreateSessionInput } from "./SessionPrismaAdapterType";

class SessionPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  };

  /**
   * Build a session prisma query based on the filter parameters.
   * @param dialogueId
   * @param filter
   */
  buildFindSessionsQuery = (dialogueId: string, filter?: NexusGenInputs['SessionConnectionFilterInput'] | null) => {
    // Required: filter by dialogueId
    let query: Prisma.SessionWhereInput = { dialogueId, delivery: undefined, };

    // Optional: Filter by campaigns or not
    if (filter?.deliveryType) {
      query.delivery = {
        is: filter?.deliveryType === 'noCampaigns' ? null : undefined,
        isNot: filter?.deliveryType === 'campaigns' ? null : undefined,
      }
    }

    // Optional: filter by score range.
    if (filter?.scoreRange?.min || filter?.scoreRange?.max) {
      query.nodeEntries = {
        some: {
          sliderNodeEntry: {
            value: {
              gte: filter?.scoreRange?.min || undefined,
              lte: filter?.scoreRange?.max || undefined,
            }
          }
        }
      }
    }

    // Optional: Filter by campaign-variant
    if (filter?.campaignVariantId) {
      query.delivery = {
        campaignVariantId: filter.campaignVariantId
      }
    }

    // Optional: filter by date
    if (filter?.startDate || filter?.endDate) {
      query.createdAt = {
        gte: filter?.startDate ? new Date(filter.startDate) : undefined,
        lte: filter?.endDate ? new Date(filter.endDate) : undefined,
      }
    }

    // Add search filter
    if (filter?.search) {
      const [potentialFirstName, potentialLastName] = filter.search.split(' ');

      const doFullSearch = () => {
        if (potentialLastName) {
          return {
            AND: potentialLastName ? [
              { deliveryRecipientFirstName: { contains: potentialFirstName, mode: 'insensitive' }, },
              { deliveryRecipientLastName: { contains: potentialLastName, mode: 'insensitive' }, },
            ] : undefined
          }
        }

        return
      };

      query = {
        ...cloneDeep(query),
        OR: [{
          nodeEntries: {
            some: {
              // Allow searching in choices and form entries
              OR: [
                {
                  choiceNodeEntry: { value: { contains: filter.search, mode: 'insensitive' } }
                },
                {
                  formNodeEntry: {
                    values: {
                      some: {
                        OR: [
                          { longText: { contains: filter.search, mode: 'insensitive' } },
                          { shortText: { contains: filter.search, mode: 'insensitive' } },
                        ]
                      }
                    }
                  }
                }
              ]
            }
          }
        },

        // Allow searching for delivery properties
        // TODO: Might be a tricky query, perhaps we should do per-field searching instead.
        {
          delivery: {
            OR: [
              { deliveryRecipientEmail: { equals: filter.search, mode: 'insensitive' }, },
              { deliveryRecipientPhone: { equals: filter.search, mode: 'insensitive' }, },
              {
                AND: potentialLastName ? [
                  { deliveryRecipientFirstName: { contains: potentialFirstName, mode: 'insensitive' }, },
                  { deliveryRecipientLastName: { contains: potentialLastName, mode: 'insensitive' }, },
                ] : undefined
              },
              {
                OR: !potentialLastName ? [
                  { deliveryRecipientFirstName: { contains: potentialFirstName, mode: 'insensitive' }, },
                  { deliveryRecipientLastName: { contains: potentialFirstName, mode: 'insensitive' }, },
                ] : undefined
              }
            ]
          }
        }]
      }
    }

    return query;
  }

  /**
   * Order interactions by a "created-at".
   * @param filter
   */
  buildOrderByQuery = (filter?: NexusGenInputs['SessionConnectionFilterInput'] | null) => {
    let orderByQuery: Prisma.SessionOrderByInput[] = [];

    if (filter?.orderBy?.by === 'createdAt') {
      orderByQuery.push({
        createdAt: filter.orderBy.desc ? 'desc' : 'asc',
      })
    }

    return orderByQuery;
  }

  findSessions = async (dialogueId: string, filter?: NexusGenInputs['SessionConnectionFilterInput'] | null) => {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const sessions = await this.prisma.session.findMany({
      where: this.buildFindSessionsQuery(dialogueId, filter),
      skip: offset,
      take: perPage,
      orderBy: this.buildOrderByQuery(filter),
      include: { delivery: { include: { campaignVariant: true, } } }
    });

    return sessions;
  }

  countSessions = async (dialogueId: string, filter?: NexusGenInputs['SessionConnectionFilterInput'] | null) => {
    return this.prisma.session.count({
      where: this.buildFindSessionsQuery(dialogueId, filter),
    });
  }

  updateDelivery(sessionId: string, deliveryId: string) {
    return this.prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        delivery: { connect: { id: deliveryId } }
      },
    });
  };

  /**
   * Creates an empty session
   */
  createEmptyDialogueSession(dialogueId: string) {
    return this.prisma.session.create({ data: { dialogueId } });
  }

  /**
   * Creates a session in the database.
   * */
  createSession(input: CreateSessionInput) {
    return this.prisma.session.create({
      data: {
        originUrl: input.originUrl,
        device: input.device,
        totalTimeInSec: input.totalTimeInSec,
        nodeEntries: {
          create: input.entries.map((entry) => NodeEntryService.constructCreateNodeEntryFragment(entry))
        },
        dialogue: {
          connect: {
            id: input.dialogueId,
          },
        },
      },
      include: SessionQueryModel.queryFull.include,
    });
  };

  /**
   * Fetches single session from database.
   *
   * Notes:
   * - Includes node-entries
  */
  findSessionById(sessionId: string): Promise<Session | null> {
    return this.prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      include: SessionQueryModel.queryFull.include,
    });
  };

  async deleteMany(sessionIds: string[]) {
    return this.prisma.session.deleteMany({
      where: {
        id: {
          in: sessionIds,
        },
      },
    });
  };

  createFakeSession(data: (
    {
      createdAt: Date,
      dialogueId: string,
      rootNodeId: string,
      simulatedRootVote: number,
      simulatedChoiceNodeId: string,
      simulatedChoiceEdgeId?: string,
      simulatedChoice: string,
    })) {

    return this.prisma.session.create({
      data: {
        nodeEntries: {
          create: [{
            depth: 0,
            creationDate: data.createdAt,
            relatedNode: {
              connect: { id: data.rootNodeId },
            },
            sliderNodeEntry: {
              create: { value: data.simulatedRootVote },
            },
            inputSource: 'INIT_GENERATED',
          },
          {
            depth: 1,
            creationDate: data.createdAt,
            relatedNode: { connect: { id: data.simulatedChoiceNodeId } },
            relatedEdge: { connect: { id: data.simulatedChoiceEdgeId } },
            choiceNodeEntry: {
              create: { value: data.simulatedChoice },
            },
          },
          ],
        },
        dialogue: {
          connect: { id: data.dialogueId },
        },
      },
    });
  };

  /**
   * Create a Prisma "create" for choice value creation.
   * @param sessionEventInput General event input
   * @param sessionChoiceInput Choice event input
   * @returns A Prisma create object for creating choice value.
   */
  constructCreateSessionEventChoiceValue(
    sessionEventInput: NexusGenInputs['SessionEventInput'],
    choiceValueInput: NexusGenInputs['SessionEventChoiceValueInput'] | undefined
  ): Prisma.SessionEventChoiceValueCreateNestedOneWithoutSessionEventInput | undefined {
    if (sessionEventInput.eventType !== SessionEventType.CHOICE_ACTION) return undefined;
    if (choiceValueInput === undefined) return undefined;

    return {
      create: {
        value: choiceValueInput.value,
        timeSpentInSec: choiceValueInput.timeSpent || 0,
        node: { connect: { id: choiceValueInput.relatedNodeId } },
      }
    }
  }

  /**
   * Create a Prisma "create" for slider value creation.
   * @param sessionEventInput General event input
   * @param sessionSliderInput Slider event input
   * @returns A Prisma create object for creating choice value.
   */
  constructCreateSessionEventSliderValue(
    sessionEventInput: NexusGenInputs['SessionEventInput'],
    sliderValueInput: NexusGenInputs['SessionEventSliderValueInput'] | undefined
  ): Prisma.SessionEventSliderValueCreateNestedOneWithoutSessionEventInput | undefined {
    if (sessionEventInput.eventType !== SessionEventType.FORM_ACTION) return undefined;
    if (sliderValueInput === undefined) return undefined;

    return {
      create: {
        value: sliderValueInput.value,
        timeSpentInSec: sliderValueInput.timeSpent || 0,
        node: { connect: { id: sliderValueInput.relatedNodeId } },
      }
    }
  }
  /**
   * Create a Prisma "create" for form value creation.
   * @param sessionEventInput General event input
   * @param sessionSliderInput Slider event input
   * @returns A Prisma create object for creating choice value.
   */
  constructCreateSessionEventFormValue(
    sessionEventInput: NexusGenInputs['SessionEventInput'],
    formValueInput: NexusGenInputs['SessionEventFormValueInput'] | undefined
  ): Prisma.SessionEventFormValuesCreateNestedOneWithoutSessionEventInput | undefined {
    if (sessionEventInput.eventType !== SessionEventType.FORM_ACTION) return undefined;
    if (formValueInput === undefined) return undefined;

    return {
      create: {
        node: { connect: { id: formValueInput.relatedNodeId } },
        values: {
          createMany: {
            data: formValueInput?.values?.map((value) => ({
              relatedFieldId: value.relatedFieldId || '',
              email: value.email,
              longText: value.longText,
              number: value.number,
              shortText: value.shortText,
              phoneNumber: value.phoneNumber,
              url: value.url,
            })) || [],
          }
        },
        timeSpentInSec: formValueInput.timeSpent || 0,
      }
    }
  }

  /**
   * Create a session-event
   * @param sessionEventInput Session-event input specified by GraphQL model.
   * @returns a Promise that resolves to the created session-event.
   */
  createSessionEvent(sessionEventInput: NexusGenInputs['SessionEventInput']) {
    console.log(sessionEventInput.timestamp);
    return this.prisma.sessionEvent.create({
      data: {
        session: { connect: { id: sessionEventInput.sessionId } },
        timestamp: sessionEventInput.timestamp,
        eventType: sessionEventInput.eventType,
        toNode: sessionEventInput.toNodeId || '',
        sliderValue: this.constructCreateSessionEventSliderValue(
          sessionEventInput,
          sessionEventInput.sliderValue || undefined
        ),
        choiceValue: this.constructCreateSessionEventChoiceValue(
          sessionEventInput,
          sessionEventInput.choiceValue || undefined
        ),
        formValue: this.constructCreateSessionEventFormValue(
          sessionEventInput,
          sessionEventInput.formValue || undefined
        ),
      }
    });
  }

  /**
   * Create a list of session-events (belonging to a particular existing Session).
   * @param sessionEventInputs
   * @returns
   */
  createSessionEvents(sessionEventInputs: NexusGenInputs['SessionEventInput'][]) {
    const creates = sessionEventInputs.map((sessionEventInput) => (
      this.createSessionEvent(sessionEventInput)
    ));

    return Promise.all(creates);
  }
};

export default SessionPrismaAdapter;
