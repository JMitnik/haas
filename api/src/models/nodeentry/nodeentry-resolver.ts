import { PrismaClient, NodeEntryWhereInput, SessionWhereInput } from '@prisma/client';
import _ from 'lodash';

const prisma = new PrismaClient();
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

  static getCurrentSessionIdsByScore = async (dialogueId: string, offset: number, limit: number, pageIndex: number, orderBy: any, dateRange: SessionWhereInput[] | [], valuesCondition: NodeEntryWhereInput, searchTerm: string) => {
    let needPageReset = false;
    let pageNodeEntries;
    let flatMerged;
    const nodeEntriesScore = await prisma.nodeEntry.findMany(
      {
        where: {
          session: {
            dialogueId,
            AND: dateRange,
          },
        },
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

    const groupedScoreSessions = _.groupBy(nodeEntriesScore, (entry) => entry.sessionId);
    let totalPages = Math.ceil(Object.keys(groupedScoreSessions).length / limit);

    if (searchTerm) {
      const merged = _.filter(groupedScoreSessions, (session) => session.filter((entry) => entry.values[0].textValue?.toLowerCase().includes(searchTerm.toLowerCase())).length > 0);
      totalPages = Math.ceil(merged.length / limit);
      if (pageIndex + 1 > totalPages) {
        offset = 0;
        needPageReset = true;
      }
      flatMerged = _.flatten(merged);
    }
    const finalNodeEntryScore = flatMerged || nodeEntriesScore;
    const filteredNodeEntresScore = _.filter(finalNodeEntryScore, (nodeEntryScore) => nodeEntryScore.depth === 0);

    let orderedNodeEntriesScore;
    if (orderBy.id === 'score') {
      orderedNodeEntriesScore = _.orderBy(filteredNodeEntresScore, (entry) => entry.values[0].numberValue, orderBy.desc ? 'desc' : 'asc');
    } else if (orderBy.id === 'id') {
      orderedNodeEntriesScore = _.orderBy(filteredNodeEntresScore, (entry) => entry.id, orderBy.desc ? 'desc' : 'asc');
    } else if (orderBy.id === 'createdAt') {
      orderedNodeEntriesScore = _.orderBy(filteredNodeEntresScore, (entry) => entry.creationDate, orderBy.desc ? 'desc' : 'asc');
    } else { // Dont perform and ordering/ Perform default ordering (=== id column?)
      orderedNodeEntriesScore = filteredNodeEntresScore;
    }

    if ((offset + limit) < orderedNodeEntriesScore.length) {
      pageNodeEntries = orderedNodeEntriesScore.slice(offset, (pageIndex + 1) * limit);
    } else {
      pageNodeEntries = orderedNodeEntriesScore.slice(offset, orderedNodeEntriesScore.length);
    }

    const pageSessionIds = pageNodeEntries.map((entry) => entry.sessionId);
    const pageSessions = pageSessionIds.map((sessionId) => sessionId !== null && groupedScoreSessions[sessionId]);
    const mappedPageSessions = pageSessions.map((entries) => {
      if (entries) {
        const { sessionId, session } = entries[0];
        const paths = entries.length;
        const score = entries.find((entry) => entry.depth === 0)?.values[0].numberValue;
        return {
          id: sessionId, paths, score, createdAt: session?.createdAt, nodeEntries: entries,
        };
      }
    });
    return { pageSessions: mappedPageSessions, totalPages, resetPages: needPageReset };
  };

  static getCurrentSessionIdsByScore2 = async (dialogueId: string, offset: number, limit: number, pageIndex: number, orderBy: any, dateRange: SessionWhereInput[] | [], valuesCondition: NodeEntryWhereInput, searchTerm: string) => {
    const nodeEntriesScore = await prisma.nodeEntry.findMany(
      {
        where: {
          session: {
            dialogueId,
            AND: dateRange,
          },
          OR: valuesCondition,
        },
        include: {
          session: {
            select: {
              createdAt: true,
            },
          },
          values: true,
        },
      },
    );
    console.log('pages nodeEntries: ', Math.ceil(nodeEntriesScore.length / limit));
    let flatMerged;
    if (searchTerm) {
      const groupedScoreSessions = _.groupBy(nodeEntriesScore, (entry) => entry.sessionId);
      const merged = _.filter(groupedScoreSessions, (session) => session.length > 1);
      flatMerged = _.flatten(merged);
    }
    const finalNodeEntryScore = flatMerged || nodeEntriesScore;
    const filteredNodeEntresScore = _.filter(finalNodeEntryScore, (nodeEntryScore) => nodeEntryScore.depth === 0);
    const orderedNodeEntriesScore = _.orderBy(filteredNodeEntresScore, (entry) => entry.values[0].numberValue, orderBy.desc ? 'desc' : 'asc');
    const pageNodeEntries = (offset + limit) < orderedNodeEntriesScore.length
      ? orderedNodeEntriesScore.slice(offset, (pageIndex + 1) * limit)
      : orderedNodeEntriesScore.slice(offset, orderedNodeEntriesScore.length);
    const pageSessionIds = pageNodeEntries.map((entry) => entry.sessionId);
    return pageSessionIds;
  };
}

export default NodeEntryResolver;
