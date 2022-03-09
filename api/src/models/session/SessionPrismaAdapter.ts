import { Prisma, PrismaClient } from '@prisma/client';
import { cloneDeep } from 'lodash';

import { NexusGenInputs } from '../../generated/nexus';
import { Session, SessionQueryModel } from './SessionQueryModel';
import NodeEntryService from '../node-entry/NodeEntryService';
import { CreateSessionInput } from './SessionPrismaAdapterType';

class SessionPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  /**
   * Create a list of session-events (belonging to a particular existing Session).
   * @param sessionEventInputs
   * @returns
   */
  createSessionEvents(sessionId: string, events: NexusGenInputs['SessionEventInput'][]) {
    const creates = events.map((event) => (
      this.createSessionEvent(sessionId, event)
    ));

    return Promise.all(creates);
  }

  /**
   * Order interactions by a "created-at".
   * @param filter
   */
  buildOrderByQuery(filter?: NexusGenInputs['SessionConnectionFilterInput'] | null) {
    const orderByQuery: Prisma.SessionOrderByInput[] = [];

    if (filter?.orderBy?.by === 'createdAt') {
      orderByQuery.push({
        createdAt: filter.orderBy.desc ? 'desc' : 'asc',
      })
    }

    return orderByQuery;
  }

  async findSessions(dialogueId: string, filter?: NexusGenInputs['SessionConnectionFilterInput'] | null) {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const sessions = await this.prisma.session.findMany({
      where: this.buildFindSessions(dialogueId, filter),
      skip: offset,
      take: perPage,
      orderBy: this.buildOrderByQuery(filter),
      include: { delivery: { include: { campaignVariant: true } } },
    });

    return sessions;
  }

  async countSessions(dialogueId: string, filter?: NexusGenInputs['SessionConnectionFilterInput'] | null) {
    return this.prisma.session.count({
      where: this.buildFindSessions(dialogueId, filter),
    });
  }

  updateDelivery(sessionId: string, deliveryId: string) {
    return this.prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        delivery: { connect: { id: deliveryId } },
      },
    });
  }

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
          create: input.entries.map((entry) => NodeEntryService.constructCreateNodeEntryFragment(entry)),
        },
        dialogue: {
          connect: {
            id: input.dialogueId,
          },
        },
      },
      include: SessionQueryModel.queryFull.include,
    });
  }

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
  }

  async deleteMany(sessionIds: string[]) {
    return this.prisma.session.deleteMany({
      where: {
        id: {
          in: sessionIds,
        },
      },
    });
  }


  /**
   * Create a session-event
   * @param sessionEventInput Session-event input specified by GraphQL model.
   * @returns a Promise that resolves to the created session-event.
   */
  createSessionEvent(sessionId: string, sessionEventInput: NexusGenInputs['SessionEventInput']) {
    const data: Prisma.NodeEntryCreateInput = {
      depth: -1,
      creationDate: sessionEventInput.timestamp,
      inputSource: 'CLIENT',
      relatedNode: { connect: sessionEventInput.state?.nodeId ? { id: sessionEventInput.state.nodeId } : undefined },
      session: { connect: { id: sessionId } },
    };

    switch (sessionEventInput?.action?.type) {
      case 'CHOICE_ACTION': {
        data.choiceNodeEntry = { create: { value: sessionEventInput.action?.choice?.value } };
        break;
      }

      case 'SLIDER_ACTION': {
        data.sliderNodeEntry = { create: { value: sessionEventInput.action?.slider?.value } };
        break;
      }

      case 'FORM_ACTION': {
        data.formNodeEntry = {
          create: {
            values: sessionEventInput.action?.form ? {
              createMany: {
                data: this.buildCreateFormValues(sessionEventInput.action.form),
              },
            } : undefined,
          },
        }
        break;
      }

      default: {
        return undefined;
      }
    }

    return this.prisma.nodeEntry.create({ data });
  }

  createFakeSession(data: (
    {
      createdAt: Date;
      dialogueId: string;
      rootNodeId: string;
      simulatedRootVote: number;
      simulatedChoiceNodeId: string;
      simulatedChoiceEdgeId?: string;
      simulatedChoice: string;
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
  }

  /**
   * Create a Prisma "create" for form value creation.
   * @param sessionEventInput General event input
   * @param sessionSliderInput Slider event input
   * @returns A Prisma create object for creating choice value.
   */
  private buildCreateFormValues(
    formValueInput: NexusGenInputs['FormValueInput']
  ): Prisma.FormNodeFieldEntryDataCreateManyFormNodeEntryInput[] {
    return formValueInput.values?.map(formValue => ({
      relatedFieldId: formValue.relatedFieldId || '',
      email: formValue.email,
      longText: formValue.longText,
      number: formValue.number,
      phoneNumber: formValue.phoneNumber,
      shortText: formValue.shortText,
      url: formValue.url,
    })) || [];
  }

  /**
   * Build a session prisma query based on the filter parameters.
   * @param dialogueId
   * @param filter
   */
  private buildFindSessions(dialogueId: string, filter?: NexusGenInputs['SessionConnectionFilterInput'] | null) {
    // Required: filter by dialogueId
    let query: Prisma.SessionWhereInput = { dialogueId, delivery: undefined };

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
            },
          },
        },
      }
    }

    // Optional: Filter by campaign-variant
    if (filter?.campaignVariantId) {
      query.delivery = {
        campaignVariantId: filter.campaignVariantId,
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

      query = {
        ...cloneDeep(query),
        OR: [{
          nodeEntries: {
            some: {
              // Allow searching in choices and form entries
              OR: [
                {
                  choiceNodeEntry: { value: { contains: filter.search, mode: 'insensitive' } },
                },
                {
                  formNodeEntry: {
                    values: {
                      some: {
                        OR: [
                          { longText: { contains: filter.search, mode: 'insensitive' } },
                          { shortText: { contains: filter.search, mode: 'insensitive' } },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
        },

        // Allow searching for delivery properties
        // TODO: Might be a tricky query, perhaps we should do per-field searching instead.
        {
          delivery: {
            OR: [
              { deliveryRecipientEmail: { equals: filter.search, mode: 'insensitive' } },
              { deliveryRecipientPhone: { equals: filter.search, mode: 'insensitive' } },
              {
                AND: potentialLastName ? [
                  { deliveryRecipientFirstName: { contains: potentialFirstName, mode: 'insensitive' } },
                  { deliveryRecipientLastName: { contains: potentialLastName, mode: 'insensitive' } },
                ] : undefined,
              },
              {
                OR: !potentialLastName ? [
                  { deliveryRecipientFirstName: { contains: potentialFirstName, mode: 'insensitive' } },
                  { deliveryRecipientLastName: { contains: potentialFirstName, mode: 'insensitive' } },
                ] : undefined,
              },
            ],
          },
        }],
      }
    }

    return query;
  }
}

export default SessionPrismaAdapter;
