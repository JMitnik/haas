import {
  NodeEntry, //NodeEntryCreateWithoutSessionInput, NodeEntryWhereInput
  PrismaClient,
  Prisma,
} from '@prisma/client';
import { isPresent } from 'ts-is-present';
import _ from 'lodash';

import { NexusGenInputs } from '../../generated/nexus';
import { OrderByProps } from '../../types/generic';
import { pickProperties } from '../../utils/pickProperties';
import NodeEntryPrismaAdapter from './NodeEntryPrismaAdapter';
import { NodeEntryWithTypes } from './NodeEntryServiceType';

class NodeEntryService {
  nodeEntryPrismaAdapter: NodeEntryPrismaAdapter;

  constructor(prismaClient: PrismaClient) {
    this.nodeEntryPrismaAdapter = new NodeEntryPrismaAdapter(prismaClient);
  };

  findDialogueStatisticsRootEntries = async (
    dialogueIds: string[],
    startDate: Date,
    endDate: Date,
  ) => {
    return this.nodeEntryPrismaAdapter.findDialogueStatisticsRootEntries(
      dialogueIds,
      startDate,
      endDate,
    )
  }

  /**
   * Create node-entries.
   * */
  createNodeEntry(sessionId: string, nodeEntryInput: NexusGenInputs['NodeEntryInput']): Promise<NodeEntry> {
    return this.nodeEntryPrismaAdapter.create({
      session: { connect: { id: sessionId } },
      ...NodeEntryService.constructCreateNodeEntryFragment(nodeEntryInput),
    });
  };

  /**
   * Fetch all node-entries by session id.
   * */
  getNodeEntriesBySessionId(sessionId: string): Promise<NodeEntry[]> {
    return this.nodeEntryPrismaAdapter.getNodeEntriesBySessionId(sessionId);
  };

  /**
   * Count node entries by session id.
   * */
  countNodeEntriesBySessionid(sessionId: string): Promise<number> {
    return this.nodeEntryPrismaAdapter.countNodeEntriesBySessionId(sessionId);
  };

  /**
   * Find node-entry values along with its sub-fields.
   * */
  async findNodeEntryValues(id: string) {
    const nodeEntry = await this.nodeEntryPrismaAdapter.findNodeEntryValuesById(id);

    return {
      choiceNodeEntry: nodeEntry?.choiceNodeEntry?.value,
      linkNodeEntry: nodeEntry?.linkNodeEntry?.value?.toString(),
      registrationNodeEntry: nodeEntry?.registrationNodeEntry?.value?.toString(),
      sliderNodeEntry: nodeEntry?.sliderNodeEntry?.value,
      textboxNodeEntry: nodeEntry?.textboxNodeEntry?.value,
      formNodeEntry: nodeEntry?.formNodeEntry,
      videoNodeEntry: nodeEntry?.videoNodeEntry?.value,
    };
  };

  /**
   * Construct create node entry fragment form Graphql input.
   *
   * TODO: move to prisma adapter?
   * */
  static constructCreateNodeEntryFragment = (nodeEntryInput: NexusGenInputs['NodeEntryInput']): Prisma.NodeEntryCreateWithoutSessionInput => ({
    relatedNode: (nodeEntryInput.nodeId && { connect: { id: nodeEntryInput.nodeId } }) || undefined,
    relatedEdge: (nodeEntryInput.edgeId && { connect: { id: nodeEntryInput.edgeId } }) || undefined,
    depth: nodeEntryInput?.depth,

    videoNodeEntry: nodeEntryInput?.data?.video?.value ? {
      create: { value: nodeEntryInput?.data?.video?.value },
    } : undefined,

    choiceNodeEntry: nodeEntryInput?.data?.choice?.value ? {
      create: { value: nodeEntryInput?.data?.choice?.value },
    } : undefined,

    registrationNodeEntry: nodeEntryInput?.data?.register?.value ? {
      create: { value: nodeEntryInput?.data?.register?.value },
    } : undefined,

    sliderNodeEntry: nodeEntryInput?.data?.slider?.value ? {
      create: { value: nodeEntryInput?.data?.slider?.value },
    } : undefined,

    textboxNodeEntry: nodeEntryInput?.data?.textbox?.value ? {
      create: { value: nodeEntryInput?.data?.textbox?.value },
    } : undefined,

    formNodeEntry: nodeEntryInput?.data?.form?.values ? {
      create: {
        values: {
          create: nodeEntryInput?.data?.form?.values?.map((val) => ({
            relatedField: { connect: { id: val?.relatedFieldId || '-1' } },
            ...pickProperties(
              val,
              ['email', 'phoneNumber', 'url', 'shortText', 'longText', 'number'],
            ),
          })),
        },
      },
    } : undefined,
  });

  /**
   * Check if node-entry contains search term.
   * */
  static isNodeEntryMatchText = (nodeEntry: NodeEntryWithTypes, searchTerm: string) => {
    const processedSearch = searchTerm.toLowerCase();

    if (nodeEntry.relatedNode?.type === 'CHOICE') {
      return nodeEntry.choiceNodeEntry?.value?.toLowerCase().includes(processedSearch);
    };

    return false;
  };

  static sortEntries = (entries: NodeEntryWithTypes[], orderBy: OrderByProps) => {
    let orderedNodeEntriesScore;

    if (orderBy.by === 'score') {
      orderedNodeEntriesScore = _.orderBy(
        entries, (entry) => entry.sliderNodeEntry?.value, orderBy.desc ? 'desc' : 'asc',
      );
    } else if (orderBy.by === 'id') {
      orderedNodeEntriesScore = _.orderBy(
        entries, (entry) => entry.id, orderBy.desc ? 'desc' : 'asc',
      );
    } else if (orderBy.by === 'createdAt') {
      orderedNodeEntriesScore = _.orderBy(
        entries, (entry) => entry.creationDate, orderBy.desc ? 'desc' : 'asc',
      );
    } else {
      orderedNodeEntriesScore = entries;
    }

    return orderedNodeEntriesScore;
  };

  /**
   * Return a textual-representation of a node-entry.
   * - Used for building up a mail.
   */
  static getNodeEntryValue = (nodeEntry: NodeEntryWithTypes): any => {
    if (nodeEntry.relatedNode?.type === 'GENERIC') {
      return null;
    };

    if (nodeEntry.relatedNode?.type === 'SLIDER') {
      try {
        return nodeEntry?.sliderNodeEntry?.value;
      } catch {
        throw new Error('sliderNodeEntry was not included on initial retrieval.');
      };
    };

    if (nodeEntry.relatedNode?.type === 'CHOICE') {
      try {
        return nodeEntry?.choiceNodeEntry?.value;
      } catch {
        throw new Error('ChoiceNodeEntry was not included on initial retrieval.');
      };
    };

    if (!nodeEntry.relatedNode) {
      return null;
    };

    throw new Error(`Unable to find node entry type ${nodeEntry.relatedNode?.type}.`);
  };

  /**
   * Searches for text-nodes.
   * Used generally in the fetching of relevant interactions/sessions.
   * @param text
   */
  static constructFindWhereTextNodeEntryFragment(text: string): Prisma.NodeEntryWhereInput {
    return {
      OR: [
        {
          textboxNodeEntry: {
            value: {
              contains: text,
              mode: 'insensitive',
            },
          },
        },
        {
          videoNodeEntry: {
            value: {
              contains: text,
              mode: 'insensitive',
            },
          },
        },
        {
          choiceNodeEntry: {
            value: {
              contains: text,
              mode: 'insensitive',
            },
          },
        },
        // DEPRECATED (but still included)
        {
          registrationNodeEntry: {
            value: {
              equals: text,
            },
          },
        },
        {
          formNodeEntry: {
            values: {
              some: {
                OR: [
                  {
                    phoneNumber: {
                      contains: text,
                      mode: 'insensitive',
                    },
                  },
                  {
                    shortText: {
                      contains: text,
                      mode: 'insensitive',
                    },
                  },
                  {
                    url: {
                      contains: text,
                      mode: 'insensitive',
                    },
                  },
                  {
                    email: {
                      contains: text,
                      mode: 'insensitive',
                    },
                  },
                  {
                    longText: {
                      contains: text,
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    };
  };

  static getTextValueFromEntry = (entry: NodeEntryWithTypes): (string | null) => {
    if (entry.relatedNode?.type === 'CHOICE') return entry.choiceNodeEntry?.value || null;

    return null;
  };

  // Slice node entries to match amount of nodes displayed in front-end
  // If offset + limit is greater than amount visible in front-end
  // => slice until end of the array
  static sliceNodeEntries = (
    entries: Array<NodeEntry>,
    offset: number,
    limit: number,
    pageIndex: number,
  ) => ((offset + limit) < entries.length
    ? entries.slice(offset, (pageIndex + 1) * limit)
    : entries.slice(offset, entries.length));
};

export default NodeEntryService;
