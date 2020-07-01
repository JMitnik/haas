import { NodeEntry, NodeEntryValue, NodeEntryWhereInput, PrismaClient, SessionWhereInput } from '@prisma/client';
import _ from 'lodash';

interface EnhancedNodeEntryProps {
  session: {
    id: string;
    createdAt: Date;
  } | null;
  values: NodeEntryValue[];
}

interface SessionWhereProps {
  where: {
    dialogueId: string, dateRange: SessionWhereInput[] | [],
  }
}

const prisma = new PrismaClient();

class NodeEntryService {
  static matchText = (
    entry: NodeEntry & EnhancedNodeEntryProps,
    searchTerm: string,
  ) => entry.values[0].textValue?.toLowerCase().includes(searchTerm.toLowerCase());

  static orderEntriesBy = (
    entries: Array<NodeEntry & EnhancedNodeEntryProps>,
    orderBy: { id: string, desc: boolean },
  ) => {
    let orderedNodeEntriesScore;
    if (orderBy.id === 'score') {
      orderedNodeEntriesScore = _.orderBy(
        entries, (entry) => entry.values[0].numberValue, orderBy.desc ? 'desc' : 'asc',
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

  static findInteractionEntries = async (whereInput: NodeEntryWhereInput) => prisma.nodeEntry.findMany(
    {
      where: whereInput,
      include: {
        session: {
          select: {
            id: true,
            createdAt: true,
          },
        },
        values: true,
      },
    },
  );

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

  static getCurrentInteractionSessions = async (
    dialogueId: string,
    offset: number,
    limit: number,
    pageIndex: number,
    orderBy: any,
    dateRange: SessionWhereInput[] | [],
    searchTerm: string,
  ) => {
    let needPageReset = false;
    let flatSearchTermFilteredEntries;

    // Find all node entries within specified date range
    const nodeEntries = await NodeEntryService.findInteractionEntries({
      session: {
        dialogueId,
        AND: dateRange,
      },
    });

    const groupedNodeEntries = _.groupBy(nodeEntries, (entry) => entry.sessionId);
    let totalPages = Math.ceil(Object.keys(groupedNodeEntries).length / limit);

    // If search term, filter out grouped representations which don't have
    // at least one entry which fits criteria and calculate new # of pages
    if (searchTerm) {
      // Filter every grouped representation by trying to finding at least one node entry which matches search term
      const searchTermFilteredEntries = _.filter(
        groupedNodeEntries, (entries) => entries.filter(
          (entry) => NodeEntryService.matchText(entry, searchTerm),
        ).length > 0,
      );
      totalPages = Math.ceil(searchTermFilteredEntries.length / limit);

      // If due to filters option current queried page doesn't exist (e.g. page 3/2),
      // query first subset (offset = 0 -> limit) and set pageIndex to 0
      if (pageIndex + 1 > totalPages) {
        offset = 0;
        needPageReset = true;
      }
      flatSearchTermFilteredEntries = _.flatten(searchTermFilteredEntries);
    }
    const finalNodeEntryScore = flatSearchTermFilteredEntries || nodeEntries;
    const filteredNodeEntriesScore = _.filter(
      finalNodeEntryScore, (nodeEntryScore) => nodeEntryScore.depth === 0,
    );
    const orderedNodeEntriesScore = NodeEntryService.orderEntriesBy(
      filteredNodeEntriesScore, orderBy,
    );
    const pageNodeEntries = NodeEntryService.sliceNodeEntries(
      orderedNodeEntriesScore, offset, limit, pageIndex,
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
      const score = entries.find((entry) => entry.depth === 0)?.values[0].numberValue;
      return {
        id: sessionId, paths, score, createdAt: session?.createdAt, nodeEntries: sortedEntries,
      };
    });

    return { pageSessions, totalPages, resetPages: needPageReset };
  };
}

export default NodeEntryService;
