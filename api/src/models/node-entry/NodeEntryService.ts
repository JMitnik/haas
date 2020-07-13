import { ChoiceNodeEntry,
  LinkNodeEntry, NodeEntry, NodeEntryCreateWithoutSessionInput, NodeEntryGetPayload, NodeEntryWhereInput,
  PrismaClient, RegistrationNodeEntry, SessionWhereInput, SliderNodeEntry, TextboxNodeEntry } from '@prisma/client';
import _ from 'lodash';

import { OrderByProps } from '../../types/generic';

const prisma = new PrismaClient({
  log: ['query'],
});

export interface NodeEntryWithTypes extends NodeEntry {
  session?: {
    id: String;
    createdAt: Date;
  } | undefined | null;
  slideNodeEntry?: SliderNodeEntry | undefined | null;
  choiceNodeEntry?: ChoiceNodeEntry | undefined | null;
  registrationNodeEntry?: RegistrationNodeEntry | undefined | null;
  textboxNodeEntry?: TextboxNodeEntry | undefined | null;
  linkNodeEntry?: LinkNodeEntry | undefined | null;
}

class NodeEntryService {
  static constructCreateNodeEntryFragment = (nodeEntryInput: any): NodeEntryCreateWithoutSessionInput => ({
    relatedNode: nodeEntryInput.nodeId && { connect: { id: nodeEntryInput.nodeId } },
    relatedEdge: nodeEntryInput.edgeId && { connect: { id: nodeEntryInput.edgeId } },
    depth: nodeEntryInput?.depth,

    choiceNodeEntry: nodeEntryInput?.choice?.value && {
      create: { value: nodeEntryInput?.choice?.value },
    },

    registrationNodeEntry: nodeEntryInput?.register?.value && {
      create: { value: nodeEntryInput?.register?.value },
    },

    sliderNodeEntry: nodeEntryInput?.slider?.value && {
      create: { value: nodeEntryInput?.slider?.value },
    },

    textboxNodeEntry: nodeEntryInput?.textbox?.value && {
      create: { value: nodeEntryInput?.textbox?.value },
    },
  });

  // TODO: Test
  static isNodeEntryMatchText = (nodeEntry: NodeEntryWithTypes, searchTerm: string) => {
    const processedSearch = searchTerm.toLowerCase();

    if (nodeEntry.type === 'CHOICE') {
      return nodeEntry.choiceNodeEntry?.value?.toLowerCase().includes(processedSearch);
    }

    if (nodeEntry.type === 'REGISTRATION') {
      return nodeEntry.registrationNodeEntry?.value?.toString().includes(processedSearch);
    }

    if (nodeEntry.type === 'TEXTBOX') {
      return nodeEntry.textboxNodeEntry?.value?.toString().includes(processedSearch);
    }

    return false;
  };

  static sortEntries = (entries: NodeEntryWithTypes[], orderBy: OrderByProps) => {
    let orderedNodeEntriesScore;

    if (orderBy.id === 'score') {
      orderedNodeEntriesScore = _.orderBy(
        entries, (entry) => entry.slideNodeEntry?.value, orderBy.desc ? 'desc' : 'asc',
      );
    } else if (orderBy.id === 'id') {
      orderedNodeEntriesScore = _.orderBy(
        entries, (entry) => entry.id, orderBy.desc ? 'desc' : 'asc',
      );
    } else if (orderBy.id === 'createdAt') {
      orderedNodeEntriesScore = _.orderBy(
        entries, (entry) => entry.creationDate, orderBy.desc ? 'desc' : 'asc',
      );
    } else {
      orderedNodeEntriesScore = entries;
    }

    return orderedNodeEntriesScore;
  };

  static getEntries = async (whereInput: NodeEntryWhereInput): Promise<NodeEntryWithTypes[]> => {
    const entries = prisma.nodeEntry.findMany({
      where: whereInput,
      include: {
        session: {
          select: {
            id: true,
            createdAt: true,
          },
        },
        choiceNodeEntry: true,
        registrationNodeEntry: true,
        textboxNodeEntry: true,
        linkNodeEntry: true,
        sliderNodeEntry: true,
      },
    });

    return entries;
  };

  static getNodeEntryValue = async (nodeEntry: NodeEntryWithTypes): Promise<any> => {
    if (nodeEntry.type === 'GENERIC') {
      return null;
    }

    if (nodeEntry.type === 'SLIDER') {
      try {
        return nodeEntry?.slideNodeEntry?.value;
      } catch {
        throw new Error('SlideNodeEntry was not included on initial retrieval.');
      }
    }

    if (nodeEntry.type === 'CHOICE') {
      try {
        return nodeEntry?.choiceNodeEntry?.value;
      } catch {
        throw new Error('ChoiceNodeEntry was not included on initial retrieval.');
      }
    }

    if (nodeEntry.type === 'LINK') {
      try {
        return nodeEntry?.linkNodeEntry?.value;
      } catch {
        throw new Error('LinkNodeEntry was not included on initial retrieval.');
      }
    }

    if (nodeEntry.type === 'REGISTRATION') {
      try {
        return nodeEntry?.registrationNodeEntry?.value;
      } catch {
        throw new Error('RegistrationNodeEntry was not included on initial retrieval.');
      }
    }

    throw new Error(`Unable to find node entry type ${nodeEntry.type}.`);
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

  // TODO: Move to SessionService
  static getCurrentInteractionSessions = async (
    dialogueId: string,
    offset?: number,
    limit?: number,
    pageIndex?: number,
    orderBy?: any,
    dateRange?: SessionWhereInput[] | [],
    searchTerm?: string,
  ) => {
    let needPageReset = false;
    let flatSearchTermFilteredEntries;

    // Find all node entries within specified date range
    const nodeEntries = await NodeEntryService.getEntries({
      session: {
        dialogueId,
        AND: dateRange,
      },
    });

    const groupedNodeEntries = _.groupBy(nodeEntries, (entry) => entry.sessionId);
    let totalPages = Math.ceil(Object.keys(groupedNodeEntries).length / (limit || 1));

    // If search term, filter out grouped representations which don't have
    // at least one entry which fits criteria and calculate new # of pages
    if (searchTerm) {
      // Filter every grouped representation by trying to finding at least one node entry which matches search term
      const searchTermFilteredEntries = _.filter(
        groupedNodeEntries, (entries) => entries.filter(
          (entry) => NodeEntryService.isNodeEntryMatchText(entry, searchTerm),
        ).length > 0,
      );
      totalPages = Math.ceil(searchTermFilteredEntries.length / (limit || 1));

      // If due to filters option current queried page doesn't exist (e.g. page 3/2),
      // query first subset (offset = 0 -> limit) and set pageIndex to 0
      if (pageIndex && pageIndex + 1 > totalPages) {
        offset = 0;
        needPageReset = true;
      }
      flatSearchTermFilteredEntries = _.flatten(searchTermFilteredEntries);
    }
    const finalNodeEntryScore = flatSearchTermFilteredEntries || nodeEntries;
    const filteredNodeEntriesScore = _.filter(
      finalNodeEntryScore, (nodeEntryScore) => nodeEntryScore.depth === 0,
    );
    const orderedNodeEntriesScore = NodeEntryService.sortEntries(
      filteredNodeEntriesScore, orderBy,
    );
    const pageNodeEntries = NodeEntryService.sliceNodeEntries(
      orderedNodeEntriesScore, (offset || 0), (limit || 0), (pageIndex || 0),
    );

    const pageSessions = pageNodeEntries.map((scoreEntry) => {
      if (!scoreEntry.sessionId) {
        return {
          id: 'N/A', paths: 0, score: 0, createdAt: 'N/A', nodeEntries: [],
        };
      }
      // Use the grouped representation with matching session id to map data
      const entries = groupedNodeEntries[scoreEntry.sessionId];
      const sortedEntries = _.orderBy(entries, (entry) => entry.depth, 'asc');
      const { sessionId, session } = entries[0];
      const paths = entries.length;
      const score = entries.find((entry) => entry.type === 'SLIDER')?.slideNodeEntry?.value;

      return {
        id: sessionId, paths, score, createdAt: session?.createdAt, nodeEntries: sortedEntries,
      };
    });

    return { pageSessions, totalPages, resetPages: needPageReset };
  };
}

export default NodeEntryService;
